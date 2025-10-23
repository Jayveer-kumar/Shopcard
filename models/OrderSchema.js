const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "User"
  }, // who placed order
  items: [
    {
        product : {
            type : mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        quantity : Number,
        Price : Number 
    }
  ],
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    pincode: String,
    street: String,
    city: String,
    state: String,
    country: String
  },
  totalAmount: Number,
  paymentMethod: {
    type: String,
    enum: ['COD', 'Razorpay', 'Stripe'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  trackingInfo: {
    courierName: String,
    trackingId: String,
    estimatedDelivery: Date
  },
  placedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
