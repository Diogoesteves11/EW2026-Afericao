const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); 

const PORT = 16025;
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/autoRepair';

// 69c3abe90313179ec727fe05

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado com sucesso ao MongoDB (autoRepair)'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const intervencaoSchema = new mongoose.Schema({
  codigo: String,
  nome: String,
  descricao: String
}, { _id: false }); 

const repairSchema = new mongoose.Schema({
  nome: String,
  nif: Number,
  data: String,
  viatura: {
    marca: String,
    modelo: String,
    matricula: String
  },
  nr_intervencoes: Number,
  intervencoes: [intervencaoSchema]
}, { collection: 'repairs', versionKey: false });

const Repair = mongoose.model('Repair', repairSchema);

app.get('/repairs/matriculas', async (req, res) => {
  try {
    const matriculas = await Repair.distinct("viatura.matricula");
    res.json(matriculas.sort());
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/repairs/interv', async (req, res) => {
  try {
    const intervencoes = await Repair.aggregate([
      { $unwind: "$intervencoes" },
      { $group: {
          _id: "$intervencoes.codigo",
          codigo: { $first: "$intervencoes.codigo" },
          nome: { $first: "$intervencoes.nome" },
          descricao: { $first: "$intervencoes.descricao" }
      }},
      { $sort: { codigo: 1 } },
      { $project: { _id: 0 } }
    ]);
    res.json(intervencoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
app.get('/repairs', async (req, res) => {
  try {
    const filter = {};
    
    if (req.query.ano) {
      filter.data = { $regex: `^${req.query.ano}` };
    }
    
    if (req.query.marca) {
      filter["viatura.marca"] = req.query.marca;
    }

    const repairs = await Repair.find(filter).sort({ nome: 1 });
    
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/repairs/:id', async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id);
    if (!repair) {
      return res.status(404).json({ erro: `Não encontrado na BD- ${req.params.id}`});
    }
    res.json(repair);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/repairs', async (req, res) => {
  try {
    const novoRegisto = new Repair(req.body);
    const resultado = await novoRegisto.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/repairs/:id', async (req, res) => {
  try {
    const eliminado = await Repair.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ erro: "Registo não encontrado para eliminar" });
    res.json({ mensagem: "Registo eliminado com sucesso", id: req.params.id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`API de dados à escuta na porta ${PORT}...`);
});