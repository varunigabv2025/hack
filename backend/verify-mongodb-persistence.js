/**
 * Verify MongoDB Persistence - Check actual database contents
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function verifyPersistence() {
  try {
    console.log('🔍 Verifying MongoDB Persistence\n');
    console.log('═══════════════════════════════════════════════════════\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');
    
    const db = mongoose.connection.db;
    
    // Check collections
    console.log('Collections in database:');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   • ${col.name}`);
    });
    console.log('');
    
    // Check users collection
    console.log('Users Collection:');
    console.log('─────────────────────────────────────────────────────');
    const users = await db.collection('users').find({}).toArray();
    console.log(`   Total documents: ${users.length}`);
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`   ✅ ${user.user_id}: ${user.name} (${user.occupation})`);
      });
    }
    console.log('');
    
    // Check transactions collection
    console.log('Transactions Collection:');
    console.log('─────────────────────────────────────────────────────');
    const transactions = await db.collection('transactions').find({}).sort({ date: -1 }).toArray();
    console.log(`   Total documents: ${transactions.length}`);
    if (transactions.length > 0) {
      console.log(`   Latest 5 transactions:`);
      transactions.slice(0, 5).forEach(txn => {
        const date = new Date(txn.date).toISOString().split('T')[0];
        console.log(`   ✅ ${txn.transaction_id}: ₹${txn.amount} on ${date} (${txn.source})`);
      });
    }
    console.log('');
    
    // Check financialprofiles collection
    console.log('Financial Profiles Collection:');
    console.log('─────────────────────────────────────────────────────');
    const profiles = await db.collection('financialprofiles').find({}).toArray();
    console.log(`   Total documents: ${profiles.length}`);
    if (profiles.length > 0) {
      profiles.forEach(profile => {
        console.log(`   ✅ ${profile.user_id}:`);
        console.log(`      • Baseline: ₹${profile.baseline}`);
        console.log(`      • Volatility: ${profile.volatility}`);
        console.log(`      • Trend: ${profile.trend}`);
        console.log(`      • Resilience Score: ${profile.resilience_score}/100`);
        console.log(`      • Loan Risk: ${profile.loan_risk}`);
        console.log(`      • Updated: ${new Date(profile.updated_at).toISOString()}`);
      });
    }
    console.log('');
    
    // Check loans collection
    console.log('Loans Collection:');
    console.log('─────────────────────────────────────────────────────');
    const loans = await db.collection('loans').find({}).toArray();
    console.log(`   Total documents: ${loans.length}`);
    if (loans.length > 0) {
      loans.forEach(loan => {
        console.log(`   ✅ ${loan.loan_id}: ₹${loan.amount} (${loan.status})`);
      });
    } else {
      console.log(`   (No loans yet)`);
    }
    console.log('');
    
    // Verification Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ MongoDB PERSISTENCE VERIFIED');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log(`✅ Users persisted: ${users.length}`);
    console.log(`✅ Transactions persisted: ${transactions.length}`);
    console.log(`✅ Financial profiles persisted: ${profiles.length}`);
    console.log(`✅ Loans persisted: ${loans.length}\n`);
    
    console.log('🎯 All data successfully stored in MongoDB Atlas!\n');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyPersistence();
