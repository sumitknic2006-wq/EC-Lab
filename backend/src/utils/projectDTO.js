/**
 * EC LAB - Public Project DTO Utility
 * Transforms internal Project documents into public-safe responses using an explicit allowlist.
 * Ensures zero exposure of private files, storage keys, source code URLs, student roll numbers,
 * nfcTagUrl, or internal review and user identifiers.
 */

/**
 * Transforms an approved Project document into a public-safe detail DTO.
 * Includes the full abstract for individual project overview pages.
 *
 * @param {Object} project - Mongoose document or plain JavaScript object
 * @returns {Object|null} Public project DTO, or null if the project is missing or not approved
 */
export function toPublicProjectDTO(project) {
  if (!project) {
    return null;
  }

  // Support both Mongoose document instances and plain objects
  const doc = typeof project.toObject === 'function' ? project.toObject() : project;

  // Security gate: Only approved projects may appear publicly
  if (doc.status !== 'approved') {
    return null;
  }

  return {
    id: String(doc._id || doc.id),
    title: doc.title,
    slug: doc.slug,
    academicYear: doc.academicYear,
    semester: doc.semester,
    department: doc.department,
    laboratory: doc.laboratory,
    summary: doc.summary,
    abstract: doc.abstract,
    category: doc.category,
    tags: Array.isArray(doc.tags) ? doc.tags.map((tag) => String(tag)) : [],
    publicDemoVideoUrl: doc.publicDemoVideoUrl || null,
    flowchartImageUrl: doc.flowchartImageUrl || null,
    teamMembers: Array.isArray(doc.teamMembers)
      ? doc.teamMembers.map((member) => ({
          name: member.name,
          contribution: member.contribution ?? null,
        }))
      : [],
    facultyGuides: Array.isArray(doc.facultyGuides)
      ? doc.facultyGuides.map((guide) => ({
          name: guide.name,
          designation: guide.designation ?? null,
          department: guide.department ?? null,
        }))
      : [],
    qrCodeIdentifier: doc.qrCodeIdentifier,
    qrCodeAssetUrl: doc.qrCodeAssetUrl || null,
    isApproved: true,
    createdAt: doc.createdAt,
  };
}

/**
 * Transforms an approved Project document into a public-safe list item DTO.
 * Omits the full abstract to optimize mobile/catalogue payload size,
 * while preserving summary and other public metadata.
 *
 * @param {Object} project - Mongoose document or plain JavaScript object
 * @returns {Object|null} Public project list item DTO, or null if not approved
 */
export function toPublicProjectListItemDTO(project) {
  const detailDTO = toPublicProjectDTO(project);
  if (!detailDTO) {
    return null;
  }

  // Explicitly omit full abstract from list items for payload optimization
  const { abstract, ...listItemDTO } = detailDTO;
  return listItemDTO;
}

/**
 * Transforms an array of Project documents into an array of public-safe list DTOs,
 * filtering out any projects that are not approved and omitting the full abstract.
 *
 * @param {Array} projects - Array of Project documents
 * @returns {Array} Array of public project list item DTOs
 */
export function toPublicProjectListDTO(projects) {
  if (!Array.isArray(projects)) {
    return [];
  }
  return projects.map(toPublicProjectListItemDTO).filter(Boolean);
}

export default {
  toPublicProjectDTO,
  toPublicProjectListItemDTO,
  toPublicProjectListDTO,
};
