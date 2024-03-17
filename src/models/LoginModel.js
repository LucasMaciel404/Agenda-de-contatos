const validator = require('validator');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  descricao: String
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.validar();
    if (this.errors.length > 0) return;
    
    this.user = await LoginModel.findOne({ email: this.body.email });
    if(!this.user){
      this.errors.push('Usuario não existe')
      return
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)){
      this.errors.push('usuario/senha invalida');
      this.user = null;
      return
    }
  }

  async register() {
    this.validar();
    if (this.body.errors) return;
    
    await this.userExists()
    
    if (this.body.errors) return;
    
    const salt = bcryptjs.genSaltSync()
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    this.user = await LoginModel.create(this.body)

  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push('Este usuario já existe.');
  }

  validar() {
    this.cleanUp();
    // validação
    // o email precisa ser valido
    if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

    // senha precisa ter entre 3 e 50
    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = ''
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    }
  }
}

module.exports = Login;
