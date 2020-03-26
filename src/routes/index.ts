import express from 'express';
import blog from '../controllers/blog';
import index from '../controllers/index';
import project from '../controllers/project';
import projects from '../controllers/projects';
import service from '../controllers/service';

const router = express.Router();

router.get('/', index);
router.get('/blog', blog);
router.get('/project', projects);
router.get('/project/:projectName', project);
router.get('/service', service);

export default router;
