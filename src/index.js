const express = require('express');
const path = require('path');
const fs = require('fs').promises;

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

app.listen(PORT, () => {
  console.log('Online');
}); 
