import User from '../models/user';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import {Types} from 'mongoose';
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id).then((user) => {
    req.user = user;		// eslint-disable-line no-param-reassign
    user.whoAmI();
    return next();
  }).error((e) => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    mobileNumber: req.body.mobileNumber
  });

  user.saveAsync()
    .then((savedUser) => res.json(savedUser))
    .error((e) => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user.saveAsync()
    .then((savedUser) => res.json(savedUser))
    .error((e) => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const {limit = 50, skip = 0} = req.query;
  User.list({limit, skip}).then((users) => res.json(users))
    .error((e) => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.removeAsync()
    .then((deletedUser) => res.json(deletedUser))
    .error((e) => next(e));
}

function getUserCourse(req, res, next) {
  const user = req.user;
  res.json(user.courseStatus);
}

// function getCourseStatus(req, res, next) {
//   const user = req.user;
//   const courseId = Types.ObjectId(req.params.courseId);
//   for (let i=0; i < user.courseStatus.length; i++) {
//     if (user.courseStatus[i].course.equals(courseId)) {
//       return res.json(user.courseStatus[i]);
//     }
//   }
//   next(new APIError('user has no such course status', httpStatus.NOT_FOUND));
// }
function getCourseStatus(req, res, next) {
  const courseId = Types.ObjectId(req.params.courseId);
  const userId = Types.ObjectId(req.params.userId);
  User.findOne({_id : userId, courseStatus: {$elemMatch:{course:courseId}}}, {'courseStatus.$':1})
    .execAsync()
    .then((pUser)=>{
      if(!pUser){
        next(new APIError('user has no such course status', httpStatus.NOT_FOUND))
      }else {
        res.json(pUser.courseStatus[0]);
      }
    });
}

function updateUserCourse(req, res, next) {
  const user = req.user;
  const courseId = Types.ObjectId(req.params.courseId);
  const {a, b, c} = req.body;
  let found = false;
  let index = 0;
  for (let i=0; i < user.courseStatus.length; i++) {
    if (user.courseStatus[i].course.equals(courseId)) {
      user.courseStatus[i].status.a = a;
      user.courseStatus[i].status.b = b;
      user.courseStatus[i].status.c = c;
      index = i;
      found = true;
    }
  }
  if (found) {
    user.saveAsync()
      .then((updateUser)=> {
        return res.json(updateUser.courseStatus[index]);
      });
  } else {
    const cstatus = {};
    cstatus.status = {a, b, c};
    cstatus.course = courseId;
    user.courseStatus.push(cstatus);
    user.saveAsync()
      .then((updateUser)=> {
        return res.json(updateUser.courseStatus[index]);
      });
  }
}

function removeUserCourse(req, res, next) {
  const user = req.user;
  const courseId = Types.ObjectId(req.params.courseId);
  const {a, b, c} = req.body;
  let found = false;
  let index = 0;
  for (let i=0; i < user.courseStatus.length; i++) {
    if (user.courseStatus[i].course.equals(courseId)) {
      user.courseStatus[i].status.a = a;
      user.courseStatus[i].status.b = b;
      user.courseStatus[i].status.c = c;
      index = i;
      found = true;
      break;
    }
  }
  if (found) {
    user.courseStatus.splice(index, 1);
    user.saveAsync()
      .then((updateUser)=> {
        return res.json(updateUser.courseStatus);
      });
  } else {
    res.json(user.courseStatus);
  }
}

// function getCourseDetails(req, res, next){
//   const user = req.user;
//   const courseId = Types.ObjectId(req.params.courseId);
//   user.populate({
//     path:"courseStatus.course",
//     match: {_id: courseId}
//   }, (err, pUser)=>{
//     if(err || !pUser){
//       next(new APIError('user has no such course status', httpStatus.NOT_FOUND))
//     }else {
//       res.json(pUser);
//     }
//   });
// }

function getCourseDetails(req, res, next){
  const user = req.user;
  const courseId = Types.ObjectId(req.params.courseId);
  const userId = Types.ObjectId(req.params.userId);
  User.findOne({_id : userId, courseStatus: {$elemMatch:{course:courseId}}}, {'courseStatus.$':1})
    .populate('courseStatus.course')
    .execAsync()
    .then((pUser)=>{
      if(!pUser){
        next(new APIError('user has no such course status', httpStatus.NOT_FOUND))
      }else {
        res.json(pUser.courseStatus[0]);
      }
    });
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
  getUserCourse,
  getCourseStatus,
  updateUserCourse,
  removeUserCourse,
  getCourseDetails
};
