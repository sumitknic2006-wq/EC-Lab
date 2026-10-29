import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import ProjectAccess from '../models/ProjectAccess.js';
import { ACCESS_LEVELS } from './projectAccessService.js';

export { ACCESS_LEVELS };

/**
 * Helper to resolve and verify reviewer authority against the approved reviewer policy:
 * - Active Admin (role === 'admin') has global authority across all projects.
 * - Active Faculty Guide linked to the project has authority for that project only.
 * - Student project owners CANNOT review access requests.
 * - General faculty CANNOT review access requests for projects they do not supervise.
 * - Self-review (reviewer === requester) is strictly forbidden.
 *
 * @param {Object|string|mongoose.Types.ObjectId} reviewerInput - Reviewer document or ID
 * @param {Object} project - Target Project document or object
 * @param {string|mongoose.Types.ObjectId} requesterId - Target request's user ID
 * @returns {Promise<{ isAuthorized: boolean, reason?: string, reviewerId?: string, role?: string }>}
 */
async function verifyReviewerAuthority(reviewerInput, project, requesterId) {
  if (!reviewerInput) {
    return { isAuthorized: false, reason: 'missing_reviewer' };
  }

  let reviewer = reviewerInput;
  if (typeof reviewer === 'string' || reviewer instanceof mongoose.Types.ObjectId) {
    if (!mongoose.isValidObjectId(reviewer)) {
      return { isAuthorized: false, reason: 'invalid_reviewer_id' };
    }
    reviewer = await User.findById(reviewer).lean();
    if (!reviewer) {
      return { isAuthorized: false, reason: 'reviewer_not_found' };
    }
  }

  if (reviewer.isActive === false) {
    return { isAuthorized: false, reason: 'reviewer_inactive' };
  }

  const reviewerId = String(reviewer._id || reviewer.id || '');
  if (!reviewerId || !mongoose.isValidObjectId(reviewerId)) {
    return { isAuthorized: false, reason: 'invalid_reviewer_id' };
  }

  // Self-approval / self-review prohibition
  if (requesterId && String(requesterId) === reviewerId) {
    return { isAuthorized: false, reason: 'self_review_forbidden' };
  }

  // Active Admin has global oversight
  if (reviewer.role === 'admin') {
    return { isAuthorized: true, reviewerId, role: 'admin' };
  }

  // Student project owners cannot approve/reject/revoke third-party requests
  const ownerId = String(project.submittedBy?._id || project.submittedBy || '');
  if (ownerId && ownerId === reviewerId) {
    return { isAuthorized: false, reason: 'owner_cannot_review' };
  }

  // Active Faculty Guide linked to this specific project
  if (reviewer.role === 'faculty' && Array.isArray(project.facultyGuides)) {
    const isLinkedGuide = project.facultyGuides.some((guide) => {
      const guideId = String(guide.faculty?._id || guide.faculty || '');
      return guideId && guideId === reviewerId;
    });

    if (isLinkedGuide) {
      return { isAuthorized: true, reviewerId, role: 'faculty_guide' };
    }
  }

  // General faculty or students without linked authority
  return { isAuthorized: false, reason: 'unauthorized_reviewer' };
}

/**
 * Submits a new private-resource access request for an authenticated user.
 *
 * @param {Object|string|mongoose.Types.ObjectId} projectInput - Target Project document or ID
 * @param {Object|string|mongoose.Types.ObjectId} requesterInput - Authenticated User document or ID
 * @param {Object} options
 * @param {string} [options.accessLevel=ACCESS_LEVELS.VIEW_PRIVATE] - Requested access level
 * @param {string} options.purpose - Justification for requesting access
 * @returns {Promise<{ success: boolean, reason?: string, request?: Object }>}
 */
export async function submitAccessRequest(
  projectInput,
  requesterInput,
  { accessLevel = ACCESS_LEVELS.VIEW_PRIVATE, purpose } = {}
) {
  // 1. Fail closed on missing parameters
  if (!projectInput || !requesterInput) {
    return { success: false, reason: 'missing_parameters' };
  }

  // 2. Validate purpose
  if (!purpose || typeof purpose !== 'string' || !purpose.trim()) {
    return { success: false, reason: 'purpose_required' };
  }
  const cleanPurpose = purpose.trim();
  if (cleanPurpose.length > 500) {
    return { success: false, reason: 'purpose_exceeds_max_length' };
  }

  // 3. Validate access level
  const validLevels = [ACCESS_LEVELS.VIEW_PRIVATE, ACCESS_LEVELS.DOWNLOAD_ALL];
  if (!validLevels.includes(accessLevel)) {
    return { success: false, reason: 'invalid_access_level' };
  }

  // 4. Resolve and validate requester
  let requester = requesterInput;
  if (typeof requester === 'string' || requester instanceof mongoose.Types.ObjectId) {
    if (!mongoose.isValidObjectId(requester)) {
      return { success: false, reason: 'invalid_user_id' };
    }
    requester = await User.findById(requester).lean();
    if (!requester) {
      return { success: false, reason: 'user_not_found' };
    }
  }

  if (requester.isActive === false) {
    return { success: false, reason: 'user_inactive' };
  }

  const requesterId = String(requester._id || requester.id || '');
  if (!requesterId || !mongoose.isValidObjectId(requesterId)) {
    return { success: false, reason: 'invalid_user_id' };
  }

  // 5. Resolve and validate project
  let project = projectInput;
  if (typeof project === 'string' || project instanceof mongoose.Types.ObjectId) {
    if (!mongoose.isValidObjectId(project)) {
      return { success: false, reason: 'invalid_project_id' };
    }
    project = await Project.findById(project).lean();
    if (!project) {
      return { success: false, reason: 'project_not_found' };
    }
  }

  const projectId = String(project._id || project.id || '');
  if (!projectId || !mongoose.isValidObjectId(projectId)) {
    return { success: false, reason: 'invalid_project_id' };
  }

  // Only approved projects can accept access requests for private resources
  if (project.status !== 'approved') {
    return { success: false, reason: 'project_not_approved' };
  }

  // 6. Check for inherent access (Admin, Owner, Team Member, Faculty Guide)
  if (requester.role === 'admin') {
    return { success: false, reason: 'requester_is_admin' };
  }

  const ownerId = String(project.submittedBy?._id || project.submittedBy || '');
  if (ownerId && ownerId === requesterId) {
    return { success: false, reason: 'requester_is_owner' };
  }

  if (Array.isArray(project.teamMembers)) {
    const isTeamMember = project.teamMembers.some((member) => {
      const memberId = String(member.user?._id || member.user || '');
      return memberId && memberId === requesterId;
    });
    if (isTeamMember) {
      return { success: false, reason: 'requester_is_team_member' };
    }
  }

  if (Array.isArray(project.facultyGuides)) {
    const isFacultyGuide = project.facultyGuides.some((guide) => {
      const guideId = String(guide.faculty?._id || guide.faculty || '');
      return guideId && guideId === requesterId;
    });
    if (isFacultyGuide) {
      return { success: false, reason: 'requester_is_faculty_guide' };
    }
  }

  // 7. Check existing active access requests or grants
  const activeRecord = await ProjectAccess.findOne({
    project: projectId,
    user: requesterId,
    status: { $in: ['pending', 'approved'] },
  });

  if (activeRecord) {
    // If approved grant has expired, transition it to 'expired' and allow re-application
    if (activeRecord.status === 'approved') {
      const now = new Date();
      if (activeRecord.expiresAt && new Date(activeRecord.expiresAt) <= now) {
        await ProjectAccess.updateOne(
          { _id: activeRecord._id, status: 'approved' },
          { $set: { status: 'expired' } }
        );
      } else {
        return {
          success: false,
          reason: 'active_grant_already_exists',
          recordId: activeRecord._id,
        };
      }
    } else {
      // Pending request already in review
      return {
        success: false,
        reason: 'pending_request_already_exists',
        recordId: activeRecord._id,
      };
    }
  }

  // 8. Create the new pending access request with concurrency protection
  try {
    const newRequest = await ProjectAccess.create({
      project: projectId,
      user: requesterId,
      accessLevel,
      purpose: cleanPurpose,
      status: 'pending',
    });

    return {
      success: true,
      request: newRequest,
    };
  } catch (error) {
    // Graceful handling of MongoDB E11000 duplicate key error in concurrent races
    if (error.code === 11000) {
      return {
        success: false,
        reason: 'duplicate_active_request',
      };
    }
    throw error;
  }
}

/**
 * Approves a pending private-resource access request.
 *
 * Rules:
 * - Request must exist and be in 'pending' status.
 * - Reviewer must be an active Admin or linked Faculty Guide.
 * - Self-approval is strictly forbidden.
 * - Optional future expiresAt date.
 * - Approval strictly preserves the user's requested access level (never escalates).
 * - Atomic conditional update ({ _id, status: 'pending' }) ensures concurrency safety.
 *
 * @param {string|mongoose.Types.ObjectId} requestId
 * @param {Object|string|mongoose.Types.ObjectId} reviewerInput
 * @param {Object} [options]
 * @param {Date|string} [options.expiresAt]
 * @returns {Promise<{ success: boolean, reason?: string, grant?: Object }>}
 */
export async function approveAccessRequest(
  requestId,
  reviewerInput,
  { expiresAt = null } = {}
) {
  if (!requestId || !mongoose.isValidObjectId(requestId)) {
    return { success: false, reason: 'invalid_request_id' };
  }

  const request = await ProjectAccess.findById(requestId);
  if (!request) {
    return { success: false, reason: 'request_not_found' };
  }

  if (request.status !== 'pending') {
    return {
      success: false,
      reason: `invalid_state_transition_from_${request.status}`,
    };
  }

  const project = await Project.findById(request.project).lean();
  if (!project) {
    return { success: false, reason: 'project_not_found' };
  }

  const auth = await verifyReviewerAuthority(reviewerInput, project, request.user);
  if (!auth.isAuthorized) {
    return { success: false, reason: auth.reason };
  }

  let validExpiresAt = null;
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
      return { success: false, reason: 'expires_at_must_be_future_date' };
    }
    validExpiresAt = expiryDate;
  }

  const now = new Date();
  const updateFields = {
    status: 'approved',
    decidedBy: auth.reviewerId,
    decidedAt: now,
    expiresAt: validExpiresAt,
  };

  const updatedDoc = await ProjectAccess.findOneAndUpdate(
    { _id: requestId, status: 'pending' },
    { $set: updateFields },
    { returnDocument: 'after' }
  );

  if (!updatedDoc) {
    return { success: false, reason: 'concurrent_update_conflict' };
  }

  return { success: true, grant: updatedDoc };
}

/**
 * Rejects a pending access request with a mandatory reason.
 *
 * Rules:
 * - Request must exist and be in 'pending' status.
 * - Rejection reason is required, trimmed, and recorded.
 * - Reviewer must be an active Admin or linked Faculty Guide.
 * - Self-rejection is strictly forbidden.
 * - Atomic conditional update ({ _id, status: 'pending' }) ensures concurrency safety.
 *
 * @param {string|mongoose.Types.ObjectId} requestId
 * @param {Object|string|mongoose.Types.ObjectId} reviewerInput
 * @param {Object} options
 * @param {string} options.reason - Mandatory explanation for rejection
 * @returns {Promise<{ success: boolean, reason?: string, record?: Object }>}
 */
export async function rejectAccessRequest(
  requestId,
  reviewerInput,
  { reason } = {}
) {
  if (!requestId || !mongoose.isValidObjectId(requestId)) {
    return { success: false, reason: 'invalid_request_id' };
  }

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return { success: false, reason: 'rejection_reason_required' };
  }
  const cleanReason = reason.trim();
  if (cleanReason.length > 500) {
    return { success: false, reason: 'reason_exceeds_max_length' };
  }

  const request = await ProjectAccess.findById(requestId);
  if (!request) {
    return { success: false, reason: 'request_not_found' };
  }

  if (request.status !== 'pending') {
    return {
      success: false,
      reason: `invalid_state_transition_from_${request.status}`,
    };
  }

  const project = await Project.findById(request.project).lean();
  if (!project) {
    return { success: false, reason: 'project_not_found' };
  }

  const auth = await verifyReviewerAuthority(reviewerInput, project, request.user);
  if (!auth.isAuthorized) {
    return { success: false, reason: auth.reason };
  }

  const now = new Date();
  const updatedDoc = await ProjectAccess.findOneAndUpdate(
    { _id: requestId, status: 'pending' },
    {
      $set: {
        status: 'rejected',
        decidedBy: auth.reviewerId,
        decidedAt: now,
        rejectionReason: cleanReason,
      },
    },
    { returnDocument: 'after' }
  );

  if (!updatedDoc) {
    return { success: false, reason: 'concurrent_update_conflict' };
  }

  return { success: true, record: updatedDoc };
}

/**
 * Revokes an existing approved grant with a mandatory reason.
 *
 * Rules:
 * - Record must exist and be in 'approved' status.
 * - If the grant has already reached its expiration timestamp, it is transitioned to 'expired'
 *   and cannot be revoked.
 * - Revocation reason is required, trimmed, and recorded in the audit schema.
 * - Reviewer must be an active Admin or linked Faculty Guide.
 * - Self-revocation is strictly forbidden.
 * - Atomic conditional update ({ _id, status: 'approved' }) ensures concurrency safety.
 *
 * @param {string|mongoose.Types.ObjectId} requestId
 * @param {Object|string|mongoose.Types.ObjectId} reviewerInput
 * @param {Object} options
 * @param {string} options.reason - Mandatory explanation for revocation
 * @returns {Promise<{ success: boolean, reason?: string, record?: Object }>}
 */
export async function revokeAccessGrant(
  requestId,
  reviewerInput,
  { reason } = {}
) {
  if (!requestId || !mongoose.isValidObjectId(requestId)) {
    return { success: false, reason: 'invalid_request_id' };
  }

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return { success: false, reason: 'revocation_reason_required' };
  }
  const cleanReason = reason.trim();
  if (cleanReason.length > 500) {
    return { success: false, reason: 'reason_exceeds_max_length' };
  }

  const record = await ProjectAccess.findById(requestId);
  if (!record) {
    return { success: false, reason: 'grant_not_found' };
  }

  // Handle expired grants
  if (record.status === 'expired') {
    return { success: false, reason: 'cannot_revoke_expired_grant' };
  }

  if (record.status !== 'approved') {
    return {
      success: false,
      reason: `invalid_state_transition_from_${record.status}`,
    };
  }

  // Check if unexpired in status but expired in time
  const now = new Date();
  if (record.expiresAt && new Date(record.expiresAt) <= now) {
    await ProjectAccess.updateOne(
      { _id: requestId, status: 'approved' },
      { $set: { status: 'expired' } }
    );
    return { success: false, reason: 'cannot_revoke_expired_grant' };
  }

  const project = await Project.findById(record.project).lean();
  if (!project) {
    return { success: false, reason: 'project_not_found' };
  }

  const auth = await verifyReviewerAuthority(reviewerInput, project, record.user);
  if (!auth.isAuthorized) {
    return { success: false, reason: auth.reason };
  }

  const updatedDoc = await ProjectAccess.findOneAndUpdate(
    { _id: requestId, status: 'approved' },
    {
      $set: {
        status: 'revoked',
        decidedBy: auth.reviewerId,
        decidedAt: now,
        revocationReason: cleanReason,
      },
    },
    { returnDocument: 'after' }
  );

  if (!updatedDoc) {
    return { success: false, reason: 'concurrent_update_conflict' };
  }

  return { success: true, record: updatedDoc };
}

/**
 * Retrieves the full access request history for a given user and project.
 * Preserves audit history without data deletion.
 *
 * @param {string|mongoose.Types.ObjectId} projectId
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Array>}
 */
export async function getAccessRequestHistory(projectId, userId) {
  if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) {
    return [];
  }

  return ProjectAccess.find({
    project: projectId,
    user: userId,
  })
    .sort({ createdAt: -1 })
    .lean();
}

export default {
  submitAccessRequest,
  approveAccessRequest,
  rejectAccessRequest,
  revokeAccessGrant,
  getAccessRequestHistory,
  ACCESS_LEVELS,
};
