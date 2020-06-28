const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();


chai.use(chaiHttp);

describe('index', () => {
    describe('/GET index', () => {
        it('should render the index page', (done) => {
            chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });
    describe('/GET other uri', () => {
        it('should send status 404', (done) => {
            chai.request(app)
            .get('/test')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
});