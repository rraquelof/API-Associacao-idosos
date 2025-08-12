import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

async function conectar(){
    await mongoose.connect(process.env.ATLAS_URL!);
    console.log('Conectado ao MongoDB!');
}

export { conectar} ;