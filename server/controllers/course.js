/**
 * Created by new on 2016/8/12.
 */
import Course from '../models/course';

function create(req, res, next) {
  const course = new Course({
    title: req.body.title
  });

  course.saveAsync()
    .then((savedCourse) => res.json(savedCourse))
    .error((e) => next(e));
}
function list(req, res, next) {
  const {limit = 50, skip = 0} = req.query;
  Course.list({limit, skip}).then((courses) => res.json(courses))
    .error((e) => next(e));
}
export default {create, list};
