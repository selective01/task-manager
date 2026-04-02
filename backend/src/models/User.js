const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Don't return password in queries by default
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function() {
  // Only hash if password is modified
  if (!this.isModified('password')) return;
  
  // Hash with salt rounds of 10
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);