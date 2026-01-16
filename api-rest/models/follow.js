const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const FollowSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  followed: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, {timestamps: {
  createdAt: true,
  updatedAt: false
}});

FollowSchema.index({user: 1, followed: 1}, {unique: true});

FollowSchema.plugin(mongoosePaginate);

module.exports = model('Follow', FollowSchema, 'follows');