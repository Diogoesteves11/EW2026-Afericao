var express = require('express');
var router = express.Router();
var axios = require('axios');

const envUrl = process.env.API_URL || 'http://localhost:16025';

router.get('/', async function(req, res, next) {
  try {
    const resposta = await axios.get(envUrl + '/repairs');
    res.render('index', { 
      reparacoes: resposta.data, 
      data_atual: new Date().toISOString().substring(0, 10) 
    });
  } catch (erro) {
    next(erro);
  }
});

router.get('/:id([0-9a-fA-F]{24})', async function(req, res, next) {
  try {
    const id = req.params.id;
    const resposta = await axios.get(envUrl + '/repairs/' + id);
    res.render('reparacao', { reparacao: resposta.data });
  } catch (erro) {
    next(erro);
  }
});

router.get('/:marca', async function(req, res, next) {
  try {
    const marca = req.params.marca;
    
    const resposta = await axios.get(`${envUrl}/repairs?marca=${marca}`);
    const reparacoesDaMarca = resposta.data;
    
    const modelosUnicos = [...new Set(reparacoesDaMarca.map(r => r.viatura.modelo))].sort();
    
    res.render('brand', { 
      marca: marca, 
      modelos: modelosUnicos, 
      reparacoes: reparacoesDaMarca 
    });
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;