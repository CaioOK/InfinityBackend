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
	email: 'xablau@email.com',
	password: '123456',
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

    it('retorna o email que foi cadastrado e a role como \"user\"', async () => {
      const { body: { email, role } } = postNewProfile;

      expect(email).to.be.equals(newProfile.email);
      expect(role).to.be.equals('user');
    });

    it('também retorna um token jwt válido com o email e role', async () => {
      const { body: { token } } = postNewProfile;

      const { email, role } = jwt.verify(token, JWT_SECRET);

      expect(email).to.be.equals(newProfile.email);
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
    let postNewProfileIncorrectEmailType;
    let postNewProfileIncorrectPasswordType;
    let postNewProfileWithoutEmail;
    let postNewProfileWithoutPassword;
    let postNewProfileEmptyEmail;
    let postNewProfileEmptyPassword;
    let postNewProfileIncorrectEmailFormat;
    let postNewProfilePasswordLessThan6Chars;

    before(async () => {
      try {
        postNewProfileIncorrectEmailType = await chai.request(app)
          .post('/profile/new')
          .send({ email: 123421, password: newProfile.password });
        
        postNewProfileIncorrectPasswordType = await chai.request(app)
          .post('/profile/new')
          .send({ email: newProfile.email, password: 1234567 });

        postNewProfileWithoutEmail = await chai.request(app)
          .post('/profile/new')
          .send({ password: newProfile.password });

        postNewProfileWithoutPassword = await chai.request(app)
          .post('/profile/new')
          .send({ email: newProfile.email });
        
        postNewProfileEmptyEmail = await chai.request(app)
          .post('/profile/new')
          .send({ email: '', password: newProfile.password });

        postNewProfileEmptyPassword = await chai.request(app)
          .post('/profile/new')
          .send({ email: newProfile.email, password: '' });

        postNewProfileIncorrectEmailFormat = await chai.request(app)
          .post('/profile/new')
          .send({ email: 'xablauemail.com', password: newProfile.password });

        postNewProfilePasswordLessThan6Chars = await chai.request(app)
          .post('/profile/new')
          .send({ email: newProfile.email, password: '12345' });
      
      } catch (err) {
        console.error(err.message);
      }
    });

    it('status 400 - Bad Request', async () => {
      const { status } = postNewProfileIncorrectEmailType;

      expect(status).to.be.equals(400);
    });

    it('\"email\" must be a string se o tipo do email for incorreto',
      async () => {
        const { body: { message } } = postNewProfileIncorrectEmailType;

        expect(message).to.be.equals('\"email\" must be a string');
      }
    );
    
    it('\"\"password\" must be a string\" se o tipo do password for incorreto',
      async () => {
        const { body: { message } } = postNewProfileIncorrectPasswordType;

        expect(message).to.be.equals('\"password\" must be a string');
      }
    );

    it('\"email\" is required se o email não foi informado',
      async () => {
        const { body: { message } } = postNewProfileWithoutEmail;

        expect(message).to.be.equals('\"email\" is required');
      }
    );

    it('\"\"password\" is required\" se o password não foi informado',
      async () => {
        const { body: { message } } = postNewProfileWithoutPassword;

        expect(message).to.be.equals('\"password\" is required');
      }
    );

    it('\"email\" is not allowed to be empty se o email for uma string vazia',
      async () => {
        const { body: { message } } = postNewProfileEmptyEmail;

        expect(message).to.be.equals('\"email\" is not allowed to be empty');
      }
    );

    it('\"\"password\" is not allowed to be empty\" se o password for uma string vazia',
      async () => {
        const { body: { message } } = postNewProfileEmptyPassword;

        expect(message).to.be.equals('\"password\" is not allowed to be empty');
      }
    );

    it('\"email\" must be a valid email se o username possuir menos que 3 caracteres',
      async () => {
        const { body: { message } } = postNewProfileIncorrectEmailFormat;

        expect(message).to.be.equals('\"email\" must be a valid email');
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
