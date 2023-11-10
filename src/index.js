const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const generateToken = require('../utils/generateToken');
const validateEmail = require('../middlewares/validateEmail');
const validatePassword = require('../middlewares/validatePassword');
const auth = require('../middlewares/auth');
const validateName = require('../middlewares/validateName');
const validateAge = require('../middlewares/validateAge');
const validateTalk = require('../middlewares/validateTalk');
const validateWatchAt = require('../middlewares/validateWatchAt');
const validateRate = require('../middlewares/validateRate');

const pathTalkers = path.resolve(__dirname, './talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  try { 
    const talkers = await fs.readFile(pathTalkers, 'utf-8');
    res.status(200).send(JSON.parse(talkers));
  } catch (err) {
    res.status(200).send([]);
  }
});

app.get('/talker/:id', async (req, res) => {
  const id = Number(req.params.id);
  const talkers = await fs.readFile(pathTalkers, 'utf-8');
  const talkerId = JSON.parse(talkers).find((talker) => talker.id === id);

  if (!talkerId) {
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }

  res.status(200).send(talkerId);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = generateToken();
  const { email, password } = req.body;

  if (email && password) {
    return res.status(200).json({ token });
  }
});

app.post(
  '/talker',
  auth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchAt,
  validateRate,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const talkersString = await fs.readFile(pathTalkers, 'utf-8');
    const talkers = JSON.parse(talkersString);
    let newId = talkers.length + 1;
    const newTalker = {
      id: newId,
      name,
      age,
      talk,
    };
    talkers.push(newTalker);
    newId += 1;
    await fs.writeFile(pathTalkers, JSON.stringify(talkers));
    return res.status(201).json(newTalker);
  },
);

app.listen(PORT, () => {
  console.log('Online');
}); 

module.exports = app;