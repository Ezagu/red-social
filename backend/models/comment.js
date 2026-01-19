const {Schema, model, default: mongoose} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CommentSchema = Schema({
  text: {
    type: String,
    required: true
  }, 
  user: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  }, 
  publication: {
    type: Schema.ObjectId,
    require: true,
    ref: 'Publication'
  },
  parentComment: {
    type: Schema.ObjectId,
    ref: 'Comment',
    default: null
  },
  repliesCount: {
    type: Number,
    default: 0
  }, 
  likesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});

CommentSchema.plugin(mongoosePaginate);

module.exports = model('Comment', CommentSchema);