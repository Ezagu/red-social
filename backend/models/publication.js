const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PublicationSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  file: String,
  commentsCount: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  }
}, {timestamps: {
  createdAt: true,
  updatedAt: false
}});

PublicationSchema.plugin(mongoosePaginate);

module.exports = model('Publication', PublicationSchema, 'publications');