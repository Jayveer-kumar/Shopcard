const { required } = require('joi');
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true // "Name" field is mandatory
  },
  gender:{
    type: String,
    enum: ['Male','Femail','Other'],
    required: false,
    default : 'other'
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/ //  10-digit Indian mobile numbers
  },
  alternatePhone: {
    type: String,
    required: false // optional
  },
  pincode: {
    type: String,
    required: true,
    match: /^\d{6}$/ //  6-digit Indian pincode
  },
  locality: {
    type: String,
    required: true // like "Near R P M inter college, Risouli"
  },
  addressLine: {
    type: String,
    required: true // like "207" 
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  landmark: { 
    type: String,
    required: false // optional
  },
  addressType: {
    type: String,
    enum: ['Home', 'Work','Office'], // only  three options
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = addressSchema; 