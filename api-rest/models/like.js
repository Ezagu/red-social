const {Schema, model} = require('mongoose');

const LikeSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: Schema.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Comment', 'Publication']
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});

LikeSchema.index({
  user: 1,
  targetId: 1,
  targetType: 1
}, {
  unique: true
});

module.exports = model('Like', LikeSchema);