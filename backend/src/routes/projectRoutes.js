import { Router } from 'express';
import {
  getPublicProjects,
  getPublicProjectBySlug,
} from '../controllers/projectController.js';

const router = Router();

/**
 * Public Project Repository Routes
 * Read-only access to approved academic projects.
 */
router.get('/', getPublicProjects);
router.get('/:slug', getPublicProjectBySlug);

export default router;
