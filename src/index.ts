import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3333;

app.get('/', (req, res) => {
  res.send('API de idosos rodando');
});

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
    })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
