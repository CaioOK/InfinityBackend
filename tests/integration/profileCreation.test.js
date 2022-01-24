const chai = require('chai');
const chaiHttp = require('chai-http');
const { stub } = require('sinon');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const shell = require('shelljs');

require('dotenv').config();

const { JWT_SECRET } = process.env;

chai.use(chaiHttp);

const { expect } = chai;

const newProfile = {
	userName: 'Xablau',
	password: '123456'
};

const consoleLogStub = stub(console, 'log');
before(()=> consoleLogStub.returns(true));
after(()=> consoleLogStub.restore());

describe('Enpoint POST /profile/new', () => {
  describe('quando os dados são válidos e o perfil não existe', () => {
    let postNewProfile;

    before(async () => {
      shell.exec('NODE_ENV=test npx sequelize db:seed:undo --seed 20220123013734-insert-profiles.js');

      try {
        postNewProfile = await chai.request(app)
          .post('/profile/new')
          .send(newProfile);

      } catch (err) {
        console.error(err.message);
      }
    });

    it('retorna status 201 - Created', async () => {
      const { status } = postNewProfile;

      expect(status).to.be.equals(201);
    });

    it('retorna o userName que foi cadastrado e a role como \"user\"', async () => {
      const { body: { userName, role } } = postNewProfile;

      expect(userName).to.be.equals(newProfile.userName);
      expect(role).to.be.equals('user');
    });

    it('também retorna um token jwt válido com o userName e role', async () => {
      const { body: { token } } = postNewProfile;

      const { userName, role } = jwt.verify(token, JWT_SECRET);

      expect(userName).to.be.equals(newProfile.userName);
      expect(role).to.be.equals('user');
    });
  });

  describe('quando os dados são válidos e o perfil já existe', () => {
    let postNewProfile;

    before(async () => {
      try {
        postNewProfile = await chai.request(app)
          .post('/profile/new')
          .send(newProfile);

      } catch (err) {
        console.error(err.message);
      }
    });

    it('retorna status 409 - Conflict', async () => {
      const { status } = postNewProfile;

      expect(status).to.be.equals(409);
    });

    it('retorna a mensagem \"User already registered\"', async () => {
      const { body: { message } } = postNewProfile;

      expect(message).to.be.equals('User already registered');
    });
  });

  describe('quando os dados são inválidos retorna:', () => {
    let postNewProfileIncorrectUsernameType;
    let postNewProfileIncorrectPasswordType;
    let postNewProfileWithoutUsername;
    let postNewProfileWithoutPassword;
    let postNewProfileEmptyUsername;
    let postNewProfileEmptyPassword;
    let postNewProfileUsernameLessThan3Chars;
    let postNewProfilePasswordLessThan6Chars;

    before(async () => {
      try {
        postNewProfileIncorrectUsernameType = await chai.request(app)
          .post('/profile/new')
          .send({ userName: 123421, password: '123456' });
        
        postNewProfileIncorrectPasswordType = await chai.request(app)
          .post('/profile/new')
          .send({ userName: 'xablau', password: 1234567 });

        postNewProfileWithoutUsername = await chai.request(app)
          .post('/profile/new')
          .send({ password: '123456' });

        postNewProfileWithoutPassword = await chai.request(app)
          .post('/profile/new')
          .send({ userName: 'xablau' });
        
        postNewProfileEmptyUsername = await chai.request(app)
          .post('/profile/new')
          .send({ userName: '', password: '123456' });

        postNewProfileEmptyPassword = await chai.request(app)
          .post('/profile/new')
          .send({ userName: 'xablau', password: '' });

        postNewProfileUsernameLessThan3Chars = await chai.request(app)
          .post('/profile/new')
          .send({ userName: 'oi', password: '123456' });

        postNewProfilePasswordLessThan6Chars = await chai.request(app)
          .post('/profile/new')
          .send({ userName: 'xablau', password: '12345' });
      
      } catch (err) {
        console.error(err.message);
      }
    });

    it('status 400 - Bad Request', async () => {
      const { status } = postNewProfileIncorrectUsernameType;

      expect(status).to.be.equals(400);
    });

    it('\"\"userName\" must be a string\" se o tipo do username for incorreto',
      async () => {
        const { body: { message } } = postNewProfileIncorrectUsernameType;

        expect(message).to.be.equals('\"userName\" must be a string');
      }
    );
    
    it('\"\"password\" must be a string\" se o tipo do password for incorreto',
      async () => {
        const { body: { message } } = postNewProfileIncorrectPasswordType;

        expect(message).to.be.equals('\"password\" must be a string');
      }
    );

    it('\"\"userName\" is required\" se o userName não foi informado',
      async () => {
        const { body: { message } } = postNewProfileWithoutUsername;

        expect(message).to.be.equals('\"userName\" is required');
      }
    );

    it('\"\"password\" is required\" se o password não foi informado',
      async () => {
        const { body: { message } } = postNewProfileWithoutPassword;

        expect(message).to.be.equals('\"password\" is required');
      }
    );

    it('\"\"userName\" is not allowed to be empty\" se o userName for uma string vazia',
      async () => {
        const { body: { message } } = postNewProfileEmptyUsername;

        expect(message).to.be.equals('\"userName\" is not allowed to be empty');
      }
    );

    it('\"\"password\" is not allowed to be empty\" se o password for uma string vazia',
      async () => {
        const { body: { message } } = postNewProfileEmptyPassword;

        expect(message).to.be.equals('\"password\" is not allowed to be empty');
      }
    );

    it('\"\"userName\" length must be at least 3 characters long\" se o username possuir menos que 3 caracteres',
      async () => {
        const { body: { message } } = postNewProfileUsernameLessThan3Chars;

        expect(message).to.be.equals('\"userName\" length must be at least 3 characters long');
      }
    );

    it('\"\"password\" length must be at least 6 characters long\" se o password possuir menos que 6 caracteres',
      async () => {
        const { body: { message } } = postNewProfilePasswordLessThan6Chars;

        expect(message).to.be.equals('\"password\" length must be at least 6 characters long');
      }
    );
    
  });
});
