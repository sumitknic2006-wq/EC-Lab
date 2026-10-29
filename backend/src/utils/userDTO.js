/**
 * EC LAB - Public User DTO Utility
 * Transforms internal User documents into safe public representations.
 * Explicitly excludes passwordHash, internal fields, and sensitive metadata.
 */

/**
 * Transforms a User document or object into a safe public DTO.
 * @param {Object} user - Mongoose document or plain object
 * @returns {Object|null}
 */
export function toPublicUserDTO(user) {
  if (!user) {
    return null;
  }

  const doc = typeof user.toObject === 'function' ? user.toObject() : user;

  return {
    id: String(doc._id || doc.id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    department: doc.department,
    rollNumber: doc.rollNumber || null,
    facultyId: doc.facultyId || null,
    isEmailVerified: Boolean(doc.isEmailVerified),
    createdAt: doc.createdAt,
  };
}

export default {
  toPublicUserDTO,
};
