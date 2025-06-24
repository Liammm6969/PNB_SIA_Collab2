const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/PNB_SIA', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import the Staff model
const Staff = require('./src/models/staff.model.js');

async function createTestStaff() {
  try {
    // Check if staff already exists
    const existingStaff = await Staff.findOne({ email: 'admin@pnb.com' });
    if (existingStaff) {
      console.log('Test staff already exists:', existingStaff);
      return;
    }

    // Create test staff members
    const testStaff = [
      {
        firstName: 'John',
        lastName: 'Admin',
        email: 'admin@pnb.com',
        password: 'admin123',
        department: 'Admin'
      },
      {
        firstName: 'Jane',
        lastName: 'Finance',
        email: 'finance@pnb.com',
        password: 'finance123',
        department: 'Finance'
      },
      {
        firstName: 'Bob',
        lastName: 'Loan',
        email: 'loan@pnb.com',
        password: 'loan123',
        department: 'Loan'
      }
    ];

    for (const staffData of testStaff) {
      const staff = new Staff(staffData);
      await staff.save();
      console.log(`Created staff: ${staff.staffStringId} - ${staff.firstName} ${staff.lastName} (${staff.department})`);
    }

    console.log('Test staff created successfully!');
    
    // Display all staff for verification
    const allStaff = await Staff.find();
    console.log('\nAll staff in database:');
    allStaff.forEach(staff => {
      console.log(`- ${staff.staffStringId}: ${staff.firstName} ${staff.lastName} (${staff.email}) - ${staff.department}`);
    });
    
  } catch (error) {
    console.error('Error creating test staff:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestStaff();
