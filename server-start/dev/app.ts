import express from 'express';
import { connect } from 'mongoose';
import { MONGO, PORT } from './config';

const app = express();

connect(MONGO)
  .then(() => {
    console.log('Вы подключились к БД')
  })
  .catch(err => {
    throw err;
  })

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Ok')
})

app.listen(PORT, () => console.log('Сервер запущен'))