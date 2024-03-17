const Login = require('../models/LoginModel');

exports.index = (req, resp) => {
    console.log(req.session.user);
    if(req.session.user) return resp.render('login-logado');
    resp.render('login');
}

exports.register = async function (req, resp) {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return resp.redirect('index');
            })
            return
        }
        req.flash('success', 'SEU USUARIO FOI CRIADO COM SUCESSO!');
        req.session.save(function () {
            return resp.redirect('index');
        })
    } catch (e) {
        resp.render('404')
    }
}
exports.login = async function (req, resp) {
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return resp.redirect('index');
            })
            return
        }
        req.flash('success', 'Seja bem vindo!');
        req.session.user = login.user;
        req.session.save(function () {
            return resp.redirect('index');
        })
    } catch (e) {
        resp.render('404')
    }
}
exports.logout = function (req, resp) {
    req.session.destroy();
    resp.redirect('/');
    return;
}