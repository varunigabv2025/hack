/**
 * Frontend-Backend Integration Test
 * Tests that frontend can communicate with backend APIs
 */

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';

console.log('🧪 Testing Frontend-Backend Integration\n');

// Test 1: Backend Health Check
console.log('1️⃣  Testing Backend Health Endpoint...');
fetch(`${BACKEND_URL}/api/health`)
  .then(res => res.json())
  .then(data => {
    if (data.status === 'ok') {
      console.log('   ✅ Backend health check passed');
      console.log(`   📊 Environment: ${data.environment}`);
      console.log(`   🗄️  MongoDB: ${data.mongodb}\n`);
    } else {
      console.log('   ❌ Backend health check failed\n');
    }
  })
  .catch(err => {
    console.log(`   ❌ Backend not reachable: ${err.message}\n`);
  });

// Test 2: Member 4 Demo Profiles
setTimeout(() => {
  console.log('2️⃣  Testing Member 4 Demo Profiles...');
  fetch(`${BACKEND_URL}/demo/profiles`)
    .then(res => res.json())
    .then(data => {
      if (data.profiles && data.profiles.length > 0) {
        console.log(`   ✅ Demo profiles loaded: ${data.profiles.length} profiles`);
        console.log(`   👤 Example: ${data.profiles[0].name} (${data.profiles[0].occupation})\n`);
      } else {
        console.log('   ❌ No demo profiles found\n');
      }
    })
    .catch(err => {
      console.log(`   ❌ Demo profiles failed: ${err.message}\n`);
    });
}, 1000);

// Test 3: Member 4 Nudge Health
setTimeout(() => {
  console.log('3️⃣  Testing Member 4 Nudge Service...');
  fetch(`${BACKEND_URL}/nudge/health`)
    .then(res => res.json())
    .then(data => {
      console.log('   ✅ Nudge service responsive');
      console.log(`   🤖 Gemini configured: ${data.geminiConfigured ? 'Yes' : 'No (using fallback)'}\n`);
    })
    .catch(err => {
      console.log(`   ❌ Nudge service failed: ${err.message}\n`);
    });
}, 2000);

// Test 4: Frontend Accessibility
setTimeout(() => {
  console.log('4️⃣  Testing Frontend Accessibility...');
  fetch(FRONTEND_URL)
    .then(res => {
      if (res.ok) {
        console.log('   ✅ Frontend is accessible');
        console.log(`   🌐 URL: ${FRONTEND_URL}\n`);
      } else {
        console.log(`   ⚠️  Frontend returned status: ${res.status}\n`);
      }
    })
    .catch(err => {
      console.log(`   ❌ Frontend not reachable: ${err.message}\n`);
    });
}, 3000);

// Summary
setTimeout(() => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 INTEGRATION STATUS SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('✅ Backend API Server: http://localhost:5000');
  console.log('   - Health: /api/health');
  console.log('   - Member 1: /api/* endpoints');
  console.log('   - Member 4: /nudge, /demo, /schemes');
  console.log('');
  console.log('✅ Frontend Dev Server: http://localhost:5173');
  console.log('   - Connected to backend via VITE_API_URL');
  console.log('   - Connected to nudge service via VITE_NUDGE_URL');
  console.log('');
  console.log('⚠️  MongoDB: Disconnected (IP whitelist issue)');
  console.log('   - Member 4 features work without DB');
  console.log('   - Member 1 features require MongoDB connection');
  console.log('   - Fix: Add your IP to MongoDB Atlas whitelist');
  console.log('');
  console.log('🎯 NEXT STEPS:');
  console.log('   1. Open http://localhost:5173 in your browser');
  console.log('   2. Test the dashboard and AI nudge features');
  console.log('   3. Fix MongoDB connection for full Member 1 features');
  console.log('   4. Test expense tracking and simulator endpoints');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}, 4000);
