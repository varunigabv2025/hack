/**
 * MongoDB Atlas Connection Diagnostic Tool
 * Tests connection and identifies root cause of failures
 */

require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns').promises;
const { MongoClient } = require('mongodb');

console.log('🔍 MongoDB Atlas Connection Diagnostics\n');
console.log('═══════════════════════════════════════════════════════\n');

// Step 1: Verify MONGODB_URI is loaded
console.log('Step 1: Environment Variable Check');
console.log('─────────────────────────────────────────────────────');
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('   Check that .env file exists and is readable\n');
  process.exit(1);
}

console.log('✅ MONGODB_URI is loaded from .env');

// Step 2: Parse and validate URI format (without exposing password)
console.log('\nStep 2: URI Format Validation');
console.log('─────────────────────────────────────────────────────');

const uri = process.env.MONGODB_URI;
let parsedUri;

try {
  // Extract connection details without exposing password
  const uriMatch = uri.match(/^mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@([^/]+)/);
  
  if (!uriMatch) {
    throw new Error('Invalid MongoDB URI format');
  }

  const [, username, password, hosts] = uriMatch;
  
  console.log('✅ URI format is valid');
  console.log(`   Protocol: ${uri.startsWith('mongodb+srv') ? 'mongodb+srv (SRV)' : 'mongodb (standard)'}`);
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${'*'.repeat(password.length)} (hidden)`);
  console.log(`   Hosts: ${hosts}`);
  
  parsedUri = { username, hosts, isSRV: uri.startsWith('mongodb+srv') };
} catch (error) {
  console.error('❌ URI parsing failed:', error.message);
  process.exit(1);
}

// Step 3: Extract cluster details
console.log('\nStep 3: Cluster Information');
console.log('─────────────────────────────────────────────────────');

const hostParts = parsedUri.hosts.split(',')[0].split('.');
console.log(`   Cluster hosts: ${parsedUri.hosts}`);

if (parsedUri.isSRV) {
  console.log('   Connection type: SRV (DNS-based discovery)');
  console.log('   Note: SRV requires DNS resolution');
} else {
  console.log('   Connection type: Standard (direct hosts)');
  console.log('   Replica set members listed in URI');
}

// Step 4: DNS Resolution Test
console.log('\nStep 4: DNS Resolution Test');
console.log('─────────────────────────────────────────────────────');

async function testDNS() {
  const primaryHost = parsedUri.hosts.split(',')[0].split(':')[0];
  
  try {
    console.log(`   Testing DNS for: ${primaryHost}`);
    const addresses = await dns.resolve(primaryHost);
    console.log(`✅ DNS resolution successful`);
    console.log(`   Resolved to ${addresses.length} address(es):`);
    addresses.slice(0, 3).forEach(addr => console.log(`   - ${addr}`));
    return true;
  } catch (error) {
    console.error('❌ DNS resolution failed:', error.code);
    console.error(`   Host: ${primaryHost}`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

// Step 5: Network Connectivity Test
console.log('\nStep 5: Network Connectivity Test');
console.log('─────────────────────────────────────────────────────');

async function testConnectivity() {
  const net = require('net');
  const primaryHost = parsedUri.hosts.split(',')[0];
  const [host, port] = primaryHost.includes(':') 
    ? primaryHost.split(':') 
    : [primaryHost, '27017'];
  
  return new Promise((resolve) => {
    console.log(`   Testing TCP connection to ${host}:${port}...`);
    const socket = net.createConnection({
      host: host,
      port: parseInt(port),
      timeout: 5000
    });

    socket.on('connect', () => {
      console.log('✅ TCP connection successful');
      console.log(`   Can reach ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      console.error('❌ Connection timeout');
      console.error('   Possible causes: Firewall, VPN, network restrictions');
      socket.destroy();
      resolve(false);
    });

    socket.on('error', (error) => {
      console.error('❌ Network connection failed');
      console.error(`   Error: ${error.code} - ${error.message}`);
      console.error('   Possible causes:');
      console.error('   - Firewall blocking outbound connections');
      console.error('   - VPN interfering with MongoDB traffic');
      console.error('   - Corporate proxy/network restrictions');
      console.error('   - Internet connectivity issues');
      resolve(false);
    });
  });
}

// Step 6: MongoDB Driver Connection Test
console.log('\nStep 6: MongoDB Driver Connection Test');
console.log('─────────────────────────────────────────────────────');

async function testMongoConnection() {
  try {
    console.log('   Attempting connection with MongoDB driver...');
    console.log('   (This may take 10-30 seconds)...');
    
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });

    await client.connect();
    console.log('✅ MongoDB driver connection successful!');
    
    const adminDb = client.db().admin();
    const serverInfo = await adminDb.serverStatus();
    console.log(`   Server version: ${serverInfo.version}`);
    console.log(`   Connection ID: ${client.topology.s.id}`);
    
    await client.close();
    return { success: true };
  } catch (error) {
    console.error('❌ MongoDB driver connection failed');
    console.error(`   Error name: ${error.name}`);
    console.error(`   Error code: ${error.code || 'N/A'}`);
    console.error(`   Error message: ${error.message}`);
    
    // Detailed error analysis
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n   ROOT CAUSE: DNS resolution failure');
      console.error('   - MongoDB host cannot be resolved');
      console.error('   - Check your internet connection');
      console.error('   - Try flushing DNS cache: ipconfig /flushdns');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
      console.error('\n   ROOT CAUSE: Network connectivity issue');
      console.error('   - Cannot reach MongoDB Atlas servers');
      console.error('   - Check firewall/VPN/proxy settings');
      console.error('   - Verify port 27017 is not blocked');
    } else if (error.message.includes('Authentication failed')) {
      console.error('\n   ROOT CAUSE: Invalid credentials');
      console.error('   - Username or password incorrect');
      console.error('   - Check .env file credentials');
    } else if (error.message.includes('Could not connect to any servers')) {
      console.error('\n   ROOT CAUSE: Server selection timeout');
      console.error('   - MongoDB Atlas cluster may be paused');
      console.error('   - Network cannot reach any replica set members');
      console.error('   - DNS/network configuration issue');
    }
    
    return { success: false, error };
  }
}

// Step 7: Mongoose Connection Test
console.log('\nStep 7: Mongoose Connection Test');
console.log('─────────────────────────────────────────────────────');

async function testMongooseConnection() {
  try {
    console.log('   Attempting connection with Mongoose...');
    console.log('   (This may take 10-30 seconds)...');
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });

    console.log('✅ Mongoose connection successful!');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Ready state: ${mongoose.connection.readyState}`);
    
    await mongoose.disconnect();
    return { success: true };
  } catch (error) {
    console.error('❌ Mongoose connection failed');
    console.error(`   Error: ${error.message}`);
    return { success: false, error };
  }
}

// Run all diagnostics
async function runDiagnostics() {
  try {
    const dnsOk = await testDNS();
    
    if (!dnsOk) {
      console.log('\n⚠️  DNS resolution failed - skipping connectivity tests');
      console.log('\n╔════════════════════════════════════════════════════╗');
      console.log('║  ROOT CAUSE: DNS Resolution Failure                ║');
      console.log('║                                                    ║');
      console.log('║  Your system cannot resolve MongoDB Atlas hostnames║');
      console.log('║                                                    ║');
      console.log('║  FIXES:                                            ║');
      console.log('║  1. Check internet connection                      ║');
      console.log('║  2. Try: ipconfig /flushdns                        ║');
      console.log('║  3. Change DNS to 8.8.8.8 (Google DNS)             ║');
      console.log('║  4. Disable VPN temporarily                        ║');
      console.log('║  5. Check corporate network restrictions           ║');
      console.log('╚════════════════════════════════════════════════════╝');
      process.exit(1);
    }
    
    const netOk = await testConnectivity();
    
    if (!netOk) {
      console.log('\n╔════════════════════════════════════════════════════╗');
      console.log('║  ROOT CAUSE: Network Connectivity Blocked          ║');
      console.log('║                                                    ║');
      console.log('║  DNS works but TCP connection fails                ║');
      console.log('║                                                    ║');
      console.log('║  FIXES:                                            ║');
      console.log('║  1. Check Windows Firewall settings                ║');
      console.log('║  2. Disable VPN/proxy temporarily                  ║');
      console.log('║  3. Check antivirus blocking port 27017            ║');
      console.log('║  4. Try from different network (mobile hotspot)    ║');
      console.log('╚════════════════════════════════════════════════════╝');
      process.exit(1);
    }
    
    const mongoResult = await testMongoConnection();
    
    if (!mongoResult.success) {
      console.log('\n╔════════════════════════════════════════════════════╗');
      console.log('║  ROOT CAUSE: MongoDB Connection Failed             ║');
      console.log('║                                                    ║');
      console.log('║  Network is OK but MongoDB driver cannot connect   ║');
      console.log('║                                                    ║');
      console.log('║  POSSIBLE CAUSES:                                  ║');
      console.log('║  1. MongoDB Atlas cluster is PAUSED                ║');
      console.log('║     → Resume cluster in Atlas dashboard            ║');
      console.log('║  2. Incorrect credentials in .env                  ║');
      console.log('║     → Verify username/password in Atlas            ║');
      console.log('║  3. TLS/SSL handshake failure                      ║');
      console.log('║     → Check Node.js version (needs 14+)            ║');
      console.log('║  4. Cluster hostname changed                       ║');
      console.log('║     → Get fresh connection string from Atlas       ║');
      console.log('╚════════════════════════════════════════════════════╝');
      process.exit(1);
    }
    
    const mongooseResult = await testMongooseConnection();
    
    if (!mongooseResult.success) {
      console.log('\n⚠️  MongoDB driver works but Mongoose fails');
      console.log('   Check Mongoose version compatibility');
      process.exit(1);
    }
    
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║           ✅ ALL DIAGNOSTICS PASSED ✅              ║');
    console.log('║                                                    ║');
    console.log('║  MongoDB Atlas connection is working correctly!    ║');
    console.log('║  You can now start your backend server.            ║');
    console.log('║                                                    ║');
    console.log('║  Run: cd backend && npm run dev                    ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Unexpected error during diagnostics:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Execute diagnostics
runDiagnostics();
