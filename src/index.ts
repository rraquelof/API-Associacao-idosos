import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { conectar } from './database/mongo'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3333;

conectar()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
    })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
