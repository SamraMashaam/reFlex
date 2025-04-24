const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  campus: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Graduated', 'Suspended'],
    default: 'Active'
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  dob: Date,
  cnic: {
    type: String,
    required: true,
    unique: true
  },
  mobileNo: String,
  nationality: String,
  currentCGPA: {
    type: Number,
    min: 0,
    max: 4
  },
  sgpaPerSemester: [{
    semester: String,
    sgpa: Number
  }],
  // Sample Notification Schema (optional)
  notifications: [{
    message: String,
    date: Date
  }],
  currentSemester: String,
  contactInfo: {
    permanent: {
      address: String,
      city: String,
      country: String,
      postalCode: String,
      phone: String
    },
    current: {
      address: String,
      city: String,
      country: String,
      postalCode: String,
      phone: String
    }
  },
  familyInfo: [{
    relation: {
      type: String,
      enum: ['Father', 'Mother', 'Guardian', 'Sibling', 'Spouse']
    },
    name: String,
    cnic: String,
    phone: String
  }],
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);