const { Schema, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Name should consist of more than two characters'],
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    }
  },
  { versionKey: false, timestamps: true },
);
contactSchema.plugin(mongoosePaginate)
module.exports = contactSchema;
