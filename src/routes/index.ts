import express, { RequestHandler } from 'express'; // eslint-disable-line
import blog from '../controllers/blog';
import index from '../controllers/index';
import project from '../controllers/project';
import projects from '../controllers/projects';
import service from '../controllers/service';
import contact from '../controllers/contact';
import handleContactSubmit from '../controllers/handleContactSubmit';
import contactSchema from '../schemas/contact';


const router = express.Router();
const urlencodedParser = express.urlencoded({ extended: false });
const prependZeroToPhoneNumber: RequestHandler = (request, response, next) => {
	if (!request.body.phoneNumber) return next();

	request.body.phoneNumber = `0${request.body.phoneNumber}`;
	return next();
};

router.get('/', index);
router.get('/blog', blog);
router.get('/project', projects);
router.get('/project/:projectName', project);
router.get('/service', service);
router.get('/contact', contact);
router.post('/contact', urlencodedParser, prependZeroToPhoneNumber, contactSchema, handleContactSubmit);

export default router;
