const Contato = require('../models/contatoModel')

exports.Index = async (req, res) => {
  const contatos = await Contato.buscaContatos();
  res.render('index', { contatos });
  return;
};