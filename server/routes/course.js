/**
 * Created by new on 2016/8/12.
 */
import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import courseCtrl from '../controllers/course';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
/** GET /api/courses - Get list of courses */
  .get(courseCtrl.list)

  /** POST /api/courses - Create new course */
  .post(validate(paramValidation.createCourse), courseCtrl.create);

export default router;
