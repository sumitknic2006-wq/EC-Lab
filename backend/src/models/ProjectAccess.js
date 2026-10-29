import mongoose from 'mongoose';

const projectAccessSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    accessLevel: {
      type: String,
      enum: {
        values: ['view_private_docs', 'download_schematics_and_code'],
        message: '{VALUE} is not a valid access level',
      },
      default: 'view_private_docs',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'revoked', 'expired'],
        message: '{VALUE} is not a valid access request status',
      },
      default: 'pending',
      index: true,
    },
    purpose: {
      type: String,
      required: [true, 'Access request purpose is required'],
      maxlength: [500, 'Purpose cannot exceed 500 characters'],
      trim: true,
    },
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    decidedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
      default: null,
    },
    revocationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Revocation reason cannot exceed 500 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique active access requests/grants per user per project
// If status is 'rejected', 'revoked', or 'expired', this partial index does not apply,
// allowing a user to re-request access while preserving full audit history.
projectAccessSchema.index(
  { project: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'approved'] } },
  }
);

// Fast query lookup indexes
projectAccessSchema.index({ user: 1, status: 1 });
projectAccessSchema.index({ project: 1, status: 1 });

const ProjectAccess =
  mongoose.models.ProjectAccess ||
  mongoose.model('ProjectAccess', projectAccessSchema);

export default ProjectAccess;
