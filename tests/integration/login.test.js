const chai = require('chai');
const chaiHttp = require('chai-http');
const { stub } = require('sinon');
const app = require('../../index');
const shell = require('shelljs');
const { tokenValidator } = require('../../src/helpers/tokenHandler');

require('dotenv').config();

const { JWT_SECRET } = process.env;

chai.use(chaiHttp);

const { expect } = chai;

const notRegisteredProfile = {
	email: 'xablau@email.com',
	password: '123456',
};

const commonProfile = {
  email: 'yudihiphop@gmail.com',
  password: 'playstation2',
};

const adminProfile = {
  email: 'mrrobot@ecorp.us',
  password: 'angelas2',
};

const consoleLogStub = stub(console, 'log');
before(()=> consoleLogStub.returns(true));
after(()=> consoleLogStub.restore());

describe('Edpoint POST /login', () => {

  describe('quando os dados estão corretos e o perfil não existe retorna:', () => {
    let postLogin;
  
    before(async () => {
      shell.exec('NODE_ENV=test npx sequelize db:seed:undo --seed 20220123013734-insert-profiles.js');
      shell.exec('NODE_ENV=test npx sequelize db:seed --seed 20220123013734-insert-profiles.js');

      try {
        postLogin = await chai.request(app)
          .post('/login')
          .send(notRegisteredProfile);
      } catch (err) {
        console.error(err.message);
      }
    });
  
    it('status 400 - Bad Request', async () => {
      const { status } = await postLogin;

      expect(status).to.be.equals(400);
    });

    it('a mensagem "Email or password incorrect"', async () => {
      const { body: { message } } = await postLogin;

      expect(message).to.be.equals('Email or password incorrect');
    });
  });

  describe('quando os dados estão corretos e o perfil existe retorna:', () => {
    let postLogin;
    let postLoginAdm;

    before(async () => {
      try {
        postLogin= await chai.request(app)
          .post('/login')
          .send(commonProfile)
               
        postLoginAdm = await chai.request(app)
          .post('/login')
          .send(adminProfile);
      } catch(err) {
        console.log(err.message);
      }
    });

    it('status 200 - Ok', async () => {
      const { status } = await postLogin;

      expect(status).to.be.equals(200);
    });

    it('um token jwt válido com os dados correto do usuário', async () => {
      const { body: { token } } = await postLogin;
      const { body: { token: tokenAdm } } =  await postLoginAdm;

      const { email, role } = tokenValidator(token, JWT_SECRET);
      const { email: emailADM, role: roleAdm } = tokenValidator(tokenAdm, JWT_SECRET);

      expect(email).to.be.equals(commonProfile.email);
      expect(role).to.be.equals('user');
      expect(emailADM).to.be.equals(adminProfile.email);
      expect(roleAdm).to.be.equals('admin');
    });
  });

  describe('quando os dados são inválidos retorna:', () => {
    let postLoginIncorrectEmailType;
    let postLoginIncorrectPasswordType;
    let postLoginWithoutEmail;
    let postLoginWithoutPassword;
    let postLoginEmptyEmail;
    let postLoginEmptyPassword;
    let postLoginIncorrectEmailFormat;

    before(async () => {
      try {
        postLoginIncorrectEmailType = await chai.request(app)
          .post('/login')
          .send({ email: 123421, password: commonProfile.password });
        
        postLoginIncorrectPasswordType = await chai.request(app)
          .post('/login')
          .send({ email: commonProfile.email, password: 1234567 });

        postLoginWithoutEmail = await chai.request(app)
          .post('/login')
          .send({ password: commonProfile.password });

        postLoginWithoutPassword = await chai.request(app)
          .post('/login')
          .send({ email: commonProfile.email });
        
        postLoginEmptyEmail = await chai.request(app)
          .post('/login')
          .send({ email: '', password: commonProfile.password });

        postLoginEmptyPassword = await chai.request(app)
          .post('/login')
          .send({ email: commonProfile.email, password: '' });

        postLoginIncorrectEmailFormat = await chai.request(app)
          .post('/login')
          .send({ email: 'xablauemail.com', password: commonProfile.password });

        postLoginPasswordLessThan6Chars = await chai.request(app)
          .post('/login')
          .send({ email: commonProfile.email, password: '12345' });
      
      } catch (err) {
        console.error(err.message);
      }
    });

    it('status 400 - Bad Request', async () => {
      const { status } = await postLoginIncorrectEmailType;

      expect(status).to.be.equals(400);
    });

    it('\"email\" must be a string se o tipo do email for incorreto',
      async () => {
        const { body: { message } } = await postLoginIncorrectEmailType;

        expect(message).to.be.equals('\"email\" must be a string');
      }
    );
    
    it('\"\"password\" must be a string\" se o tipo do password for incorreto',
      async () => {
        const { body: { message } } = await postLoginIncorrectPasswordType;

        expect(message).to.be.equals('\"password\" must be a string');
      }
    );

    it('\"email\" is required se o email não foi informado',
      async () => {
        const { body: { message } } = await postLoginWithoutEmail;

        expect(message).to.be.equals('\"email\" is required');
      }
    );

    it('\"\"password\" is required\" se o password não foi informado',
      async () => {
        const { body: { message } } = await postLoginWithoutPassword;

        expect(message).to.be.equals('\"password\" is required');
      }
    );

    it('\"email\" is not allowed to be empty se o email for uma string vazia',
      async () => {
        const { body: { message } } = await postLoginEmptyEmail;

        expect(message).to.be.equals('\"email\" is not allowed to be empty');
      }
    );

    it('\"\"password\" is not allowed to be empty\" se o password for uma string vazia',
      async () => {
        const { body: { message } } = await postLoginEmptyPassword;

        expect(message).to.be.equals('\"password\" is not allowed to be empty');
      }
    );

    it('\"email\" must be a valid email se o email fornecido não obedecer o formato correto',
      async () => {
        const { body: { message } } = await postLoginIncorrectEmailFormat;

        expect(message).to.be.equals('\"email\" must be a valid email');
      }
    );
  });
});
