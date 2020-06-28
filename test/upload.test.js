const sinon = require('sinon');
const uploadController = require('../controllers/upload');
describe('upload', () => {
  let req1 = { 
    files: [
      {
        size: 61000
      },
    ],
  }, req2 = {

  }, res;
  describe('upload', () => {
    beforeEach(function () {
      res = {
          render: function() {},
          send: function() {},
      };
    });
    it('should render file size limit exceeded', (done) => {
      let resMock = sinon.mock(res);
      resMock.expects('render').once().withArgs('error', { message: 'File size limit exceeded, Please use files less than 60kb', status: 'Bad Request' });
      uploadController.uploadFiles(req1, res);
      resMock.verify();
      done();
    });
    it('should render select atleast a file', (done) => {
      let resMock = sinon.mock(res);
      resMock.expects('send').once().withExactArgs('You must select a file.');
      uploadController.uploadFiles(req2, res);
      resMock.verify();
      done();
    });
  });
})