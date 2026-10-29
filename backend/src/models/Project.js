import mongoose from 'mongoose';

const privateFileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'File title is required'],
      trim: true,
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: {
        values: [
          'circuit_schematic',
          'pcb_layout',
          'gerber_archive',
          'firmware_source',
          'full_technical_report',
          'bill_of_materials',
          'other',
        ],
        message: '{VALUE} is not a valid file type',
      },
    },
    storageKey: {
      type: String,
      required: [true, 'S3 storage key is required'],
      trim: true,
    },
    originalFileName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },
    fileSizeBytes: {
      type: Number,
      required: [true, 'File size is required'],
      max: [52428800, 'File size cannot exceed 52,428,800 bytes (50 MB)'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const teamMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Team member roll number is required'],
      trim: true,
    },
    contribution: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: true }
);

const facultyGuideSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Faculty guide name is required'],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
      default: null,
    },
    department: {
      type: String,
      trim: true,
      default: 'Electronics & Communication Engineering',
    },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    // --- Project Identity & Academic Context ---
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required (e.g., 2025-2026)'],
      trim: true,
      match: [/^\d{4}-\d{4}$/, 'Academic year must follow YYYY-YYYY format'],
      index: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be at least 1'],
      max: [8, 'Semester cannot exceed 8'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      default: 'Electronics & Communication Engineering',
      index: true,
    },
    laboratory: {
      type: String,
      required: [true, 'Laboratory name is required'],
      trim: true,
    },

    // --- Physical Hardware Verification (QR / NFC) ---
    qrCodeIdentifier: {
      type: String,
      required: [true, 'QR code identifier is required'],
      unique: true,
      trim: true,
      index: true,
    },
    nfcTagUrl: {
      type: String,
      trim: true,
      default: null,
    },
    qrCodeAssetUrl: {
      type: String,
      trim: true,
      default: null,
    },

    // --- Public Project Metadata ---
    summary: {
      type: String,
      required: [true, 'Project summary is required'],
      maxlength: [1000, 'Summary cannot exceed 1000 characters'],
      trim: true,
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: {
        values: [
          'Embedded Systems',
          'IoT & Smart Systems',
          'VLSI & Microelectronics',
          'Robotics & Automation',
          'Communication & Signal Processing',
          'Edge AI & Computer Vision',
          'Power Electronics & Renewable Energy',
          'Other',
        ],
        message: '{VALUE} is not an approved category',
      },
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    publicDemoVideoUrl: {
      type: String,
      trim: true,
      default: null,
    },
    flowchartImageUrl: {
      type: String,
      trim: true,
      default: null,
    },

    // --- Private Intellectual Property (Embedded S3 References) ---
    privateFiles: [privateFileSchema],

    sourceCodeRepository: {
      url: {
        type: String,
        trim: true,
        default: null,
      },
      isPrivate: {
        type: Boolean,
        default: true,
      },
      accessNotes: {
        type: String,
        trim: true,
        default: null,
      },
    },

    // --- Attribution & People ---
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitting user reference is required'],
      index: true,
    },
    teamMembers: [teamMemberSchema],
    facultyGuides: [facultyGuideSchema],

    // --- Approval Workflow & Review Lifecycle ---
    status: {
      type: String,
      enum: {
        values: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
        message: '{VALUE} is not a valid project status',
      },
      default: 'draft',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewFeedback: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound and search indexes
projectSchema.index({ status: 1, department: 1, academicYear: 1 });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ title: 'text', summary: 'text', tags: 'text' });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
