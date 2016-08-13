/**
 * Created by new on 2016/8/12.
 */
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import {expect} from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('## Course API', ()=> {
  const title = new Date().getTime().toString();
  describe('# POST /api/courses', ()=> {
    it('should create a course', (done)=> {
      request(app)
        .post('/api/courses')
        .send({title})
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.title).to.equal(title);
          done();
        });
    });
  });

  describe('# GET /api/courses', ()=> {
    it('should get course list', (done)=> {
      request(app)
        .get('/api/courses')
        .expect(httpStatus.OK)
        .then(res=> {
          const courses = res.body;
          expect(courses[courses.length - 1].title).to.equal(title);
          done();
        });
    });
  });
});
