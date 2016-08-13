import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },

  // POST /api/courses
  createCourse: {
    body: {
      title: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },
  // UPDATE /api/users/:userId/Courses/:courseId
  updateUserCourse: {
    params: {
      userId: Joi.string().hex().required(),
      courseId: Joi.string().hex().required()
    },
    body: {
      a: Joi.string().required(),
      b: Joi.number().required(),
      c: Joi.boolean().required()
    }
  }
};
