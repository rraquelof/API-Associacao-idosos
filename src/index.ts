import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import idosoRoutes from './routes/idosoRoutes'
import eventoRoutes from './routes/eventoRoutes';
import { conectar } from './database/mongo';
import { errorHandler } from './middlewares/error';
import acompanhamentoRoutes from './routes/acompanhamentoRoutes';
import saudeRoutes from './routes/saudeRoutes'
import visitaRoutes from './routes/visitaRoutes';
const swaggerDocs = require("../swagger.json");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use('/api', userRoutes, idosoRoutes, eventoRoutes, acompanhamentoRoutes, saudeRoutes, visitaRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(errorHandler);

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
