import Project from '../models/Project.js';
import { toPublicProjectDTO, toPublicProjectListDTO } from '../utils/projectDTO.js';

/**
 * Controller for retrieving public, approved academic projects.
 * Enforces strict security boundaries:
 * 1. Only documents with status === 'approved' are accessible.
 * 2. All responses are filtered through toPublicProjectDTO allowlist.
 * 3. Never serializes raw Mongoose documents.
 */

/**
 * GET /api/v1/projects
 * Retrieves a paginated list of approved public projects with optional filtering.
 */
export const getPublicProjects = async (req, res, next) => {
  try {
    const rawPage = parseInt(req.query.page, 10);
    const rawLimit = parseInt(req.query.limit, 10);

    // Validate and sanitize pagination parameters
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 10;
    const skip = (page - 1) * limit;

    // Security Gate: strictly query approved projects only
    const query = { status: 'approved' };

    // Optional category filter
    if (req.query.category && typeof req.query.category === 'string') {
      query.category = req.query.category.trim();
    }

    // Optional department filter
    if (req.query.department && typeof req.query.department === 'string') {
      query.department = req.query.department.trim();
    }

    // Optional academic year filter
    if (req.query.academicYear && typeof req.query.academicYear === 'string') {
      query.academicYear = req.query.academicYear.trim();
    }

    // Optional text search across title, summary, and tags (max 100 chars)
    if (req.query.search && typeof req.query.search === 'string') {
      const searchTerm = req.query.search.trim().slice(0, 100);
      if (searchTerm) {
        const searchRegex = new RegExp(
          searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i'
        );
        query.$or = [
          { title: searchRegex },
          { summary: searchRegex },
          { tags: searchRegex },
        ];
      }
    }

    const [total, projects] = await Promise.all([
      Project.countDocuments(query),
      Project.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;
    const publicProjects = toPublicProjectListDTO(projects);

    return res.status(200).json({
      status: 'success',
      data: {
        projects: publicProjects,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/projects/:slug
 * Retrieves a single approved public project by its unique slug.
 * Returns 404 if the project is missing, not approved, or invalid.
 */
export const getPublicProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        status: 'fail',
        message: 'Project slug is required',
      });
    }

    const normalizedSlug = slug.toLowerCase().trim();

    // Security Gate: strictly query approved projects only
    const project = await Project.findOne({
      slug: normalizedSlug,
      status: 'approved',
    }).lean();

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found',
      });
    }

    const publicProject = toPublicProjectDTO(project);

    if (!publicProject) {
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        project: publicProject,
      },
    });
  } catch (error) {
    next(error);
  }
};
