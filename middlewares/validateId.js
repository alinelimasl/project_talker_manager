const fs = require('fs').promises;

const path = require('path');

const pathTalkers = path.resolve(__dirname, '../src/talker.json');

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const data = await fs.readFile(pathTalkers, 'utf-8');
  const talkers = JSON.parse(data);

  const findTalkers = talkers.find((talk) => talk.id === Number(id));

  if (!findTalkers) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  next();
};
