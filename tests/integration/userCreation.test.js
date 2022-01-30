const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const shell = require('shelljs');
const { tokenValidator } = require('../../src/helpers/tokenHandler');

require('dotenv').config();

const { JWT_SECRET } = process.env;

chai.use(chaiHttp);

const { expect } = chai;

const newProfile = {
	email: 'xablau@email.com',
	password: '123456',
};

const invalidToken = 'ashudashiduhioaushiudhasahsui';

const newUser = {
  name: 'Xablau da Silva',
  phone: '(34)9999-9999',
  email: 'xablau@email.com',
  cpf: '431.147.956-53',
}

describe('Endpoint POST /users/new', () => {
  describe('o servidor requere o token no header da requisição', () => {
    let postNewUserWithoutToken;
    let postNewUserWithInvalidToken;

    before(async () => {
      try {
        postNewUserWithoutToken = await chai.request(app)
          .post('/users/new')
          .send(newUser);
        
          postNewUserWithInvalidToken = await chai.request(app)
            .post('/users/new')
            .set('Authorization', invalidToken)
            .send(newUser)
      } catch (err) {
        console.error(err.message);
      }
    });

    it('se não houver retorna status 401 - Unauthorized e a mensagen "token not found" ', async () => {
      const { status, body: { message } } = await postNewUserWithoutToken;

      expect(status).to.be.equals(401);
      expect(message).to.be.equals('Token not found');
    });

    it('se for inválido retorna status 401 - Unauthorized e a mensagem "Expired or invalid token" ', async () => {
      const { status, body: { message } } = await postNewUserWithInvalidToken;

      expect(status).to.be.equals(401);
      expect(message).to.be.equals('Expired or invalid token');
    });
  });

  describe('quando é enviado um token válido', () => {
    let postNewProfile;
    let postNewUser;
    let postRegisteredUser;

    before(async () => {
      shell.exec('NODE_ENV=test npx sequelize db:seed:undo --seed 20220123013734-insert-profiles.js');
      shell.exec('NODE_ENV=test npx sequelize db:seed:undo --seed 20220123020845-insert-users.js');

      try {
        postNewProfile = await chai.request(app)
          .post('/profile/new')
          .send(newProfile);

        const { body: { token } } = await postNewProfile;

        postNewUser = await chai.request(app)
          .post('/users/new')
          .set('Authorization', token)
          .send(newUser);

        postRegisteredUser = await chai.request(app)
          .post('/users/new')
          .set('Authorization', token)
          .send(newUser);

      } catch (err) {
        console.error(err.message);
      }
    });

    describe('e os dados estão corretos', () => {
      it('Se o usuário já existir retorna status 409 - Conflict e a mensagem "User already registered" ', async () => {
        const { status, body: { message } } = await postRegisteredUser;

        expect(status).to.be.equals(409);
        expect(message).to.be.equals('User already registered');
      });

      it('Se não retorna status 201 - Created, os dados cadastrados e o profileId', async () => {
        const { status, body: { name, email, cpf, phone, profileId } } = await postNewUser;
        const { body: { id } } = await postNewProfile;

        expect(id).greaterThanOrEqual(profileId);
        expect(status).to.be.equals(201);
        expect(name).to.be.equals(newUser.name);
        expect(email).to.be.equals(newUser.email);
        expect(cpf).to.be.equals(newUser.cpf);
        expect(phone).to.be.equals(newUser.phone);
      });
    });

    describe('e os dados estão incorretos', () => {
      let postNewUserNotTheSameEmailAsTheProfile;
      let postNewUserEmptyEmail;
      let postNewUserWithoutEmail;
      let postNewUserIncorrectEmailFormat;
      let postNewUserIncorrectNameType;
      let postNewUserEmptyName;
      let postNewUserWithoutName;
      let postNewUserIncorrectPhoneFormat;
      let postNewUserIncorrectCpfFormat;

     before(async () => {
      shell.exec('NODE_ENV=test npx sequelize db:seed:undo --seed 20220123013734-insert-profiles.js');
      shell.exec('NODE_ENV=test npx sequelize db:seed:undo --seed 20220123020845-insert-users.js');

        try {
          const { body: { token } } = await chai.request(app)
          .post('/profile/new')
          .send(newProfile);

          postNewUserNotTheSameEmailAsTheProfile = await chai.request(app)
            .post('/users/new')
            .set('Authorization', token)
            .send({
              name: newUser.name,
              phone: newUser.phone,
              email: 'notaxablau@email.com',
              cpf: newUser.cpf,
            });

          postNewUserIncorrectEmailFormat = await chai.request(app)
            .post('/users/new')
            .set('Authorization', token)
            .send({
              name: newUser.name,
              phone: newUser.phone,
              email: 'xablauemail.com',
              cpf: newUser.cpf,
            });

          postNewUserEmptyEmail = await chai.request(app)
            .post('/users/new')
            .set('Authorization', token)
            .send({
              name: newUser.name,
              phone: newUser.phone,
              email: '',
              cpf: newUser.cpf,
            });

          postNewUserWithoutEmail = await chai.request(app)
            .post('/users/new')
            .set('Authorization', token)
            .send({
              name: newUser.name,
              phone: newUser.phone,
              cpf: newUser.cpf,
            });
          
          postNewUserIncorrectNameType = await chai.request(app)
            .post('/users/new')
            .set('Authorization', token)
            .send({
              name: 1423412,
              phone: newUser.phone,
              email: newUser.email,
              cpf: newUser.cpf,
            });

          postNewUserWithoutName = await chai.request(app)
            .post('/users/new')
            .set('Authorization', token)
            .send({
              phone: newUser.phone,
              email: newUser.email,
              cpf: newUser.cpf,
            });

          postNewUserEmptyName = await chai.request(app)
            .post('/users/new')
            .set('Authorization', token)
            .send({
              name: '',
              phone: newUser.phone,
              email: newUser.email,
              cpf: newUser.cpf,
            });

          postNewUserIncorrectPhoneFormat = await chai.request(app)
            .post('/users/new')
            .set('Authorization', token)
            .send({
              name: newUser.name,
              phone: '0099999999',
              email: newUser.email,
              cpf: newUser.cpf,
            });

          postNewUserIncorrectCpfFormat = await chai.request(app)
            .post('/users/new')
            .set('Authorization', token)
            .send({
              name: newUser.name,
              phone: newUser.phone,
              email: newUser.email,
              cpf: '43114795653',
            });
        } catch (err) {
          console.error(err.message);
        }
      });

      it('status 400 - Bad Request', async () => {
        const { status } = postNewUserNotTheSameEmailAsTheProfile;

        expect(status).to.be.equals(400);
      });

      it('"Email must be the same as the profile" se o tipo do email for incorreto',
        async () => {
          const { body: { message } } = postNewUserNotTheSameEmailAsTheProfile;

          expect(message).to.be.equals('Email must be the same as the profile');
        }
      );

      it('\"email\" is not allowed to be empty se o email for uma string vazia',
        async () => {
          const { body: { message } } = postNewUserEmptyEmail;

          expect(message).to.be.equals('\"email\" is not allowed to be empty');
        }
      );

      it('\"email\" is required se o email não foi informado',
        async () => {
          const { body: { message } } = postNewUserWithoutEmail;

          expect(message).to.be.equals('\"email\" is required');
        }
      );

      it('\"email\" must be a valid email se o email fornecido não obedecer o formato correto',
        async () => {
          const { body: { message } } = postNewUserIncorrectEmailFormat;

          expect(message).to.be.equals('\"email\" must be a valid email');
        }
      );
      
      it('\"\"name\" must be a string\" se o tipo do name for incorreto',
        async () => {
          const { body: { message } } = postNewUserIncorrectNameType;

          expect(message).to.be.equals('\"name\" must be a string');
        }
      );

      it('\"\"name\" is not allowed to be empty\" se o nome for uma string vazia',
      async () => {
        const { body: { message } } = postNewUserEmptyName;

        expect(message).to.be.equals('\"name\" is not allowed to be empty');
      }
    );

      it('\"\"name\" is required\" se o name não foi informado',
        async () => {
          const { body: { message } } = postNewUserWithoutName;

          expect(message).to.be.equals('\"name\" is required');
        }
      );

      it('Incorrect phone format, se o telefone não estiver num formato correto',
        async () => {
          const { body: { message } } = postNewUserIncorrectPhoneFormat;

          expect(message).to.be.equals('Incorrect phone format');
        }
      );

      it('The CPF must be in the format XXX.XXX.XXX-XX, se o cpf não estiver no formato correto',
        async () => {
          const { body: { message } } = postNewUserIncorrectCpfFormat;

          expect(message).to.be.equals('The CPF must be in the format XXX.XXX.XXX-XX');
        }
      );
    });
  });
});