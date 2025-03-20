import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: 'default-avatar.png' }, // Profile picture URL
    bio: { type: String, maxlength: 500 }, // Short user bio
    location: { type: String }, // User's location

    // Account verification
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    // Roles: buyer, seller, admin
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
    },

    // Security
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // Activity tracking
    listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }], // Items user has listed
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

// Hash password before saving user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare input password with hashed password
UserSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

const User = model('User', UserSchema);

export default User;
