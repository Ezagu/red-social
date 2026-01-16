const {Schema, model} = require('mongoose');

const NotificationSchema = Schema({
  user: {
    required: true,
    type: Schema.ObjectId,
    ref: 'User'
  }, 
  fromUser: {
    required: true,
    type: Schema.ObjectId,
    ref: 'User'
  },
  targetId: {
    type: Schema.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Comment', 'Follow', 'Like']
  },
  read: {
    type: Boolean,
    default: false
  }
}, {timestamps: {
  createdAt: true,
  updatedAt: false
}});

NotificationSchema.index({user: 1, fromUser: 1, targetId: 1, targetType:1}, {unique: true});

module.exports = model('Notification', NotificationSchema);