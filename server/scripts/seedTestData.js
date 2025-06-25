const mongoose = require('mongoose');
require('dotenv').config();
const { User, Payment } = require('../src/models/index.js');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pnb_sia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedTestData() {
  try {
    console.log('Starting to seed test data...');

    // Find existing users
    const users = await User.find().limit(3);
    
    if (users.length < 2) {
      console.log('Not enough users found. Please create some users first.');
      return;
    }

    console.log(`Found ${users.length} users to work with`);

    const user1 = users[0];
    const user2 = users[1];

    console.log(`User 1: ${user1.userId} (${user1.userIdSeq})`);
    console.log(`User 2: ${user2.userId} (${user2.userIdSeq})`);

    // Create test payments/transactions
    const testPayments = [
      // Deposit for user 1
      {
        fromUser: 0, // System deposit
        toUser: user1.userIdSeq,
        amount: 50000,
        details: 'Initial Account Deposit',
        balanceAfterPayment: 50000
      },
      // Transfer from user 1 to user 2
      {
        fromUser: user1.userIdSeq,
        toUser: user2.userIdSeq,
        amount: 15000,
        details: 'Money transfer to friend',
        balanceAfterPayment: 35000
      },
      // Withdrawal for user 1
      {
        fromUser: user1.userIdSeq,
        toUser: user1.userIdSeq,
        amount: 5000,
        details: 'ATM Withdrawal - SM Mall',
        balanceAfterPayment: 30000
      },
      // Deposit for user 2
      {
        fromUser: 0, // System deposit
        toUser: user2.userIdSeq,
        amount: 25000,
        details: 'Salary Deposit',
        balanceAfterPayment: 40000
      },
      // Transfer from user 2 to user 1
      {
        fromUser: user2.userIdSeq,
        toUser: user1.userIdSeq,
        amount: 8000,
        details: 'Payment for services',
        balanceAfterPayment: 32000
      },
      // Another withdrawal for user 1
      {
        fromUser: user1.userIdSeq,
        toUser: user1.userIdSeq,
        amount: 3000,
        details: 'ATM Withdrawal - Grocery',
        balanceAfterPayment: 35000
      }
    ];

    // Insert test payments with different dates
    for (let i = 0; i < testPayments.length; i++) {
      const payment = new Payment({
        ...testPayments[i],
        createdAt: new Date(Date.now() - (i * 86400000)) // Each payment 1 day apart
      });
      
      await payment.save();
      console.log(`Created payment ${i + 1}: ${payment.paymentStringId}`);
    }

    // Update user balances to match the final balances
    await User.findOneAndUpdate(
      { userIdSeq: user1.userIdSeq },
      { balance: 35000 }
    );

    await User.findOneAndUpdate(
      { userIdSeq: user2.userIdSeq },
      { balance: 32000 }
    );

    console.log('Test data seeded successfully!');
    console.log(`User 1 (${user1.userId}) final balance: 35,000`);
    console.log(`User 2 (${user2.userId}) final balance: 32,000`);

  } catch (error) {
    console.error('Error seeding test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedTestData();
