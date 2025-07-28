import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  // Production optimizations
  collection: 'users',
  // Index optimization
  autoIndex: false, // Disable auto-indexing in production
})
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
    maxlength: 50,
    match: /^[a-zA-Z0-9_]+$/, // Alphanumeric and underscore only
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
  })
  email: string;

  @Prop({
    required: true,
    minlength: 8,
    select: false, // Don't include password in queries by default
  })
  password: string;

  @Prop({
    default: 'user',
    index: true,
    enum: ['user', 'admin', 'moderator'], // Restrict roles
  })
  role: string;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({
    default: '',
    maxlength: 500,
  })
  avatar: string;

  // Additional security fields
  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop()
  lockUntil: Date;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ default: [] })
  refreshTokens: string[];

  // Profile fields
  @Prop({ maxlength: 100 })
  fullName: string;

  @Prop({ maxlength: 20 })
  phone: string;

  @Prop({ default: 'vi' })
  language: string;

  @Prop({ default: 'Asia/Ho_Chi_Minh' })
  timezone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Compound indexes for better query performance
UserSchema.index({ email: 1, isActive: 1, isDeleted: 1 });
UserSchema.index({ username: 1, isActive: 1, isDeleted: 1 });
UserSchema.index({ role: 1, isActive: 1 });

// Text search index
UserSchema.index(
  {
    username: 'text',
    email: 'text',
    fullName: 'text',
  },
  {
    weights: {
      username: 10,
      email: 5,
      fullName: 3,
    },
    name: 'user_text_search',
  },
);

// TTL index for cleanup (optional)
// UserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
});

// Pre-save middleware for password hashing
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Password will be hashed in service layer
    next();
  } else {
    next();
  }
});

// Method to increment login attempts
UserSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates: any = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  return this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
  });
};
