const dns = require('dns').promises;

const hostsToTest = [
  'ac-c2hcxt5.yxjzdhf.mongodb.net',
  'c2hcxt5.yxjzdhf.mongodb.net',
  'ac-c2hcxt5-shard-00-00.yxjzdhf.mongodb.net',
  'cluster0.yxjzdhf.mongodb.net',
];

async function testDNS() {
  console.log('Testing DNS resolution for possible MongoDB hostnames:\n');
  
  for (const host of hostsToTest) {
    try {
      console.log(`Testing: ${host}`);
      const addresses = await dns.resolve(host);
      console.log(`✅ SUCCESS - Resolves to: ${addresses.join(', ')}\n`);
    } catch (error) {
      console.log(`❌ FAILED - ${error.code}: ${error.message}\n`);
    }
  }
  
  console.log('\nTesting SRV records for mongodb+srv:');
  for (const host of hostsToTest.filter(h => !h.includes('shard'))) {
    try {
      const srvHost = `_mongodb._tcp.${host}`;
      console.log(`Testing SRV: ${srvHost}`);
      const records = await dns.resolveSrv(srvHost);
      console.log(`✅ SRV SUCCESS - Found ${records.length} records`);
      records.forEach(r => console.log(`   ${r.name}:${r.port}`));
      console.log('');
    } catch (error) {
      console.log(`❌ SRV FAILED - ${error.code}\n`);
    }
  }
}

testDNS();
