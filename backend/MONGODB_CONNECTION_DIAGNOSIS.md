# MongoDB Atlas Connection Diagnosis Report

## 🔍 ROOT CAUSE IDENTIFIED

**Your network/firewall is blocking outbound TCP connections to port 27017**

## 📊 Diagnostic Results

### ✅ What Works:
- MONGODB_URI environment variable loads correctly
- DNS resolution works (can resolve hostnames)
- SRV records exist and are correct
- MongoDB Atlas cluster is running (not paused)
- IP whitelist is configured correctly (0.0.0.0/0)

### ❌ What Doesn't Work:
- TCP connection to port 27017 **TIMES OUT**
- Both standard (`mongodb://`) and SRV (`mongodb+srv://`) formats fail
- Connection blocked at network layer, NOT application layer

## 🎯 Exact Root Cause

```
DNS Resolution: ✅ ac-c2hcxt5-shard-00-00.yxjzdhf.mongodb.net → 159.41.182.247
TCP Connection:  ❌ 159.41.182.247:27017 → CONNECTION TIMEOUT
```

**Port 27017 is blocked by one of:**
1. Windows Firewall
2. Corporate/Enterprise Firewall
3. ISP restrictions
4. VPN/Proxy interference
5. Antivirus software
6. Network security policy

## 🔧 SOLUTIONS (In Order of Likelihood)

### Solution 1: Check Windows Firewall ⭐ MOST LIKELY

```powershell
# Check if port 27017 is blocked
Test-NetConnection -ComputerName ac-c2hcxt5-shard-00-00.yxjzdhf.mongodb.net -Port 27017

# Create firewall rule to allow MongoDB (Run as Administrator)
New-NetFirewallRule -DisplayName "MongoDB Atlas" -Direction Outbound -Protocol TCP -RemotePort 27017 -Action Allow
```

### Solution 2: Disable VPN Temporarily

If you're using a VPN:
```
1. Disconnect VPN
2. Test connection: node backend/diagnose-mongodb.js
3. If it works, your VPN blocks MongoDB traffic
4. Solution: Configure VPN to allow port 27017 or use split tunneling
```

### Solution 3: Check Antivirus/Security Software

Common culprits:
- Norton
- McAfee
- Kaspersky  
- Windows Defender Firewall
- Corporate endpoint protection

Action: Temporarily disable and retest

### Solution 4: Use MongoDB Atlas Serverless (Port 443)

**Note:** Standard M0/M2/M5 clusters ALWAYS use port 27017. However:
- **Serverless instances** can use port 443 (HTTPS port, rarely blocked)
- **Dedicated clusters** with private endpoints can bypass this

To check if your cluster supports this, log into MongoDB Atlas and check cluster tier.

### Solution 5: Use Mobile Hotspot

Test if it's your network:
```
1. Connect laptop to mobile hotspot
2. Run: node backend/diagnose-mongodb.js
3. If it works → Your network is the problem
4. If it fails → Issue is elsewhere
```

### Solution 6: Use MongoDB Local Development

Install MongoDB locally for development:
```powershell
# Install MongoDB Community Edition
# Visit: https://www.mongodb.com/try/download/community

# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Update .env:
MONGODB_URI=mongodb://localhost:27017/resilience_engine
```

### Solution 7: Use MongoDB Atlas From Different Network

- Try from home network (if currently on corporate network)
- Try from coffee shop WiFi
- Try from different location

## 🧪 Testing Commands

### Test Current Connection:
```bash
cd backend
node diagnose-mongodb.js
```

### Test Port Connectivity:
```powershell
Test-NetConnection -ComputerName ac-c2hcxt5-shard-00-00.yxjzdhf.mongodb.net -Port 27017 -InformationLevel Detailed
```

### Test with Telnet (if installed):
```powershell
telnet ac-c2hcxt5-shard-00-00.yxjzdhf.mongodb.net 27017
```

### Flush DNS Cache:
```powershell
ipconfig /flushdns
```

## 📝 Current Configuration Files

### File: `backend/.env`
Status: **Updated to use mongodb+srv format**

The SRV format was tried but still fails because SRV records point to port 27017.

### File: `backend/src/config/db.js`
Status: **No changes needed** - Configuration is correct

## ✅ Recommended Immediate Actions

1. **Run firewall test (most likely fix):**
   ```powershell
   Test-NetConnection -ComputerName ac-c2hcxt5-shard-00-00.yxjzdhf.mongodb.net -Port 27017
   ```

2. **If connection fails, add firewall rule (Run PowerShell as Administrator):**
   ```powershell
   New-NetFirewallRule -DisplayName "MongoDB Atlas Outbound" -Direction Outbound -Protocol TCP -RemotePort 27017 -Action Allow
   ```

3. **Retest connection:**
   ```bash
   cd backend
   node diagnose-mongodb.js
   ```

4. **If still fails, try mobile hotspot test**

5. **If everything fails, use local MongoDB for development:**
   ```powershell
   # Install MongoDB or use Docker
   docker run -d -p 27017:27017 mongo:latest
   
   # Update .env
   MONGODB_URI=mongodb://localhost:27017/resilience_engine
   ```

## 🎯 Expected Outcome After Fix

Once port 27017 is accessible:

```
✅ DNS resolution successful
✅ TCP connection successful  
✅ MongoDB driver connection successful
✅ Mongoose connection successful
✅ Backend server starts successfully
✅ All API endpoints functional
```

## 📞 Next Steps

After applying a fix:
1. Run `node backend/diagnose-mongodb.js`
2. If successful, run `npm run dev`
3. Test POST /api/transactions endpoint
4. Verify MongoDB persistence

## 🔒 Security Note

The firewall rule above only allows **outbound** connections to port 27017.  
This does not open your computer to incoming connections (safe).

MongoDB Atlas uses TLS/SSL encryption, so traffic is secure even through firewalls.
