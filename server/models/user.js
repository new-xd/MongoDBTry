import Promise from 'bluebird';
import mongoose, {Schema} from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const StatusSchema = new mongoose.Schema({
  updateTime: {
    type: Date,
    default: Date.now
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  status: {
    a: String,
    b: Number,
    c: Boolean
  }
});

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  courseStatus: [StatusSchema]
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
  whoAmI: function () {
    console.log(this);
  }
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({skip = 0, limit = 50} = {}) {
    return this.find()
      .sort({createdAt: -1})
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .execAsync();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);