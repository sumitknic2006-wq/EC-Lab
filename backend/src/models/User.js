import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Academic email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid academic email address',
      ],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Excluded from default queries to protect password hash
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'faculty', 'admin'],
        message: '{VALUE} is not an authorized role',
      },
      default: 'student',
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      default: 'Electronics & Communication Engineering',
    },
    rollNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: undefined,
    },
    facultyId: {
      type: String,
      trim: true,
      uppercase: true,
      default: undefined,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Partial unique indexes for optional institutional identifiers
userSchema.index(
  { rollNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { rollNumber: { $type: 'string' } },
  }
);

userSchema.index(
  { facultyId: 1 },
  {
    unique: true,
    partialFilterExpression: { facultyId: { $type: 'string' } },
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
