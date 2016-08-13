/**
 * Created by new on 2016/8/12.
 */
import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
CourseSchema.statics = {
  list({skip = 0, limit = 50} = {}) {
    return this.find()
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .execAsync();
  }
};

export default mongoose.model('Course', CourseSchema);
