const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;
const { CallingPlan } = require('../../helpers/constants');

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        // const re = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: [CallingPlan.STARTER, CallingPlan.PRO, CallingPlan.BUSINESS],
      default: CallingPlan.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
  },

  { versionKey: false, timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hashSync(
      this.password,
      bcrypt.genSaltSync(SALT_FACTOR),
    );
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = userSchema;
