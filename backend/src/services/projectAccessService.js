import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import ProjectAccess from '../models/ProjectAccess.js';

/**
 * Valid access level constants matching the ProjectAccess schema
 */
export const ACCESS_LEVELS = {
  VIEW_PRIVATE: 'view_private_docs',
  DOWNLOAD_ALL: 'download_schematics_and_code',
};

/**
 * Evaluates whether an authenticated user is authorized to access a project's private resources.
 *
 * Authorization Hierarchy:
 * 1. Fail closed on missing/inactive inputs or malformed identifiers.
 * 2. Active System Admin (`user.role === 'admin'`).
 * 3. Project Owner (`project.submittedBy`).
 * 4. Linked Team Member (`project.teamMembers[].user`).
 * 5. Linked Faculty Guide (`project.facultyGuides[].faculty`).
 * 6. Explicit Approved Grant (`ProjectAccess` record with `status: 'approved'`).
 *    - `expiresAt` is checked strictly; past timestamps deny access and transition status to 'expired'.
 *    - `download_schematics_and_code` satisfies `view_private_docs`, but not vice versa.
 *
 * @param {Object|string|mongoose.Types.ObjectId} projectInput - Project document, object, or ID
 * @param {Object|string|mongoose.Types.ObjectId} userInput - Authenticated User document, object, or ID
 * @param {string} [requiredAccessLevel=ACCESS_LEVELS.VIEW_PRIVATE] - Desired permission level
 * @returns {Promise<{ isAuthorized: boolean, reason: string, accessLevel?: string, recordId?: any }>}
 */
export async function checkProjectAccess(
  projectInput,
  userInput,
  requiredAccessLevel = ACCESS_LEVELS.VIEW_PRIVATE
) {
  // 1. Fail closed on missing inputs
  if (!projectInput || !userInput) {
    return { isAuthorized: false, reason: 'missing_parameters' };
  }

  // Resolve user document/object
  let user = userInput;
  if (typeof user === 'string' || user instanceof mongoose.Types.ObjectId) {
    if (!mongoose.isValidObjectId(user)) {
      return { isAuthorized: false, reason: 'invalid_user_id' };
    }
    user = await User.findById(user).lean();
    if (!user) {
      return { isAuthorized: false, reason: 'user_not_found' };
    }
  }

  // Deny inactive users immediately
  if (user.isActive === false) {
    return { isAuthorized: false, reason: 'user_inactive' };
  }

  const userId = String(user._id || user.id || '');
  if (!userId || !mongoose.isValidObjectId(userId)) {
    return { isAuthorized: false, reason: 'invalid_user_id' };
  }

  // 2. Active System Admin has full laboratory oversight
  if (user.role === 'admin') {
    return {
      isAuthorized: true,
      reason: 'admin',
      accessLevel: ACCESS_LEVELS.DOWNLOAD_ALL,
    };
  }

  // Resolve project document/object
  let project = projectInput;
  if (typeof project === 'string' || project instanceof mongoose.Types.ObjectId) {
    if (!mongoose.isValidObjectId(project)) {
      return { isAuthorized: false, reason: 'invalid_project_id' };
    }
    project = await Project.findById(project).lean();
    if (!project) {
      return { isAuthorized: false, reason: 'project_not_found' };
    }
  }

  const projectId = String(project._id || project.id || '');
  if (!projectId || !mongoose.isValidObjectId(projectId)) {
    return { isAuthorized: false, reason: 'invalid_project_id' };
  }

  // 3. Project Owner (submitting student)
  const ownerId = String(project.submittedBy?._id || project.submittedBy || '');
  if (ownerId && ownerId === userId) {
    return {
      isAuthorized: true,
      reason: 'owner',
      accessLevel: ACCESS_LEVELS.DOWNLOAD_ALL,
    };
  }

  // 4. Linked Team Member
  if (Array.isArray(project.teamMembers)) {
    const isTeamMember = project.teamMembers.some((member) => {
      const memberUserId = String(member.user?._id || member.user || '');
      return memberUserId && memberUserId === userId;
    });

    if (isTeamMember) {
      return {
        isAuthorized: true,
        reason: 'team_member',
        accessLevel: ACCESS_LEVELS.DOWNLOAD_ALL,
      };
    }
  }

  // 5. Linked Faculty Guide
  if (Array.isArray(project.facultyGuides)) {
    const isFacultyGuide = project.facultyGuides.some((guide) => {
      const guideUserId = String(guide.faculty?._id || guide.faculty || '');
      return guideUserId && guideUserId === userId;
    });

    if (isFacultyGuide) {
      return {
        isAuthorized: true,
        reason: 'faculty_guide',
        accessLevel: ACCESS_LEVELS.DOWNLOAD_ALL,
      };
    }
  }

  // 6. External User Gateway (requires published project and explicit approved grant)
  // Non-creators cannot view private documentation of unapproved projects
  if (project.status !== 'approved') {
    return { isAuthorized: false, reason: 'project_not_approved' };
  }

  // Query the latest access request/grant for this user and project
  const accessRecord = await ProjectAccess.findOne({
    project: projectId,
    user: userId,
  }).sort({ createdAt: -1 });

  if (!accessRecord) {
    return { isAuthorized: false, reason: 'no_access_record' };
  }

  // Check expiry independently of stored status
  const now = new Date();
  if (accessRecord.expiresAt && new Date(accessRecord.expiresAt) <= now) {
    // Atomically transition approved status to 'expired' if past timestamp
    if (accessRecord.status === 'approved') {
      await ProjectAccess.updateOne(
        { _id: accessRecord._id, status: 'approved' },
        { $set: { status: 'expired' } }
      );
    }

    return {
      isAuthorized: false,
      reason: 'permission_expired',
      recordId: accessRecord._id,
    };
  }

  // Verify approved status
  if (accessRecord.status !== 'approved') {
    return {
      isAuthorized: false,
      reason: `access_${accessRecord.status}`,
      recordId: accessRecord._id,
    };
  }

  // Verify access level hierarchy
  const targetLevel =
    requiredAccessLevel === ACCESS_LEVELS.DOWNLOAD_ALL
      ? ACCESS_LEVELS.DOWNLOAD_ALL
      : ACCESS_LEVELS.VIEW_PRIVATE;

  if (
    targetLevel === ACCESS_LEVELS.DOWNLOAD_ALL &&
    accessRecord.accessLevel !== ACCESS_LEVELS.DOWNLOAD_ALL
  ) {
    return {
      isAuthorized: false,
      reason: 'insufficient_access_level',
      grantedLevel: accessRecord.accessLevel,
      requiredLevel: targetLevel,
      recordId: accessRecord._id,
    };
  }

  return {
    isAuthorized: true,
    reason: 'approved_grant',
    accessLevel: accessRecord.accessLevel,
    recordId: accessRecord._id,
  };
}

export default {
  checkProjectAccess,
  ACCESS_LEVELS,
};
