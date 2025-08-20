import { Request, Response } from "express";
import Idoso from "../models/idoso";
import { createIdosoSchema, cpfParamSchema } from "../validations/idosoValidations";


export const createIdoso = async (req: Request, res: Response) => {
  const data = createIdosoSchema.parse(req.body);

  const cpfExists = await Idoso.findOne({ cpf: data.cpf });
  if (cpfExists) return res.status(400).json({ message: "CPF já está cadastrado" });

  const rgExists = await Idoso.findOne({ rg: data.rg });
  if (rgExists) return res.status(400).json({ message: "RG já está cadastrado" });

  const susExists = await Idoso.findOne({ sus: data.sus });
  if (susExists) return res.status(400).json({ message: "SUS já está cadastrado" });

  const newIdoso = await Idoso.create(data);

  res.status(201).json({ message: "Idoso cadastrado com sucesso", newIdoso });
};

export const getIdosos = async (req: Request, res: Response) => {
  const idosos = await Idoso.find();

    if (!idosos) {
    return res.status(404).json({ message: "Nenhum idoso encontrado" });
  };

  res.status(200).json(idosos);
};

export const getIdosoByCpf = async (req: Request, res: Response) => {
  const { cpf } = cpfParamSchema.parse(req.params);

  const idoso = await Idoso.findOne({ cpf: cpf });

  if (!idoso) {
    return res.status(404).json({ message: "Idoso não encontrado" });
  };

  res.status(200).json(idoso);
};

export const updateIdoso = async (req: Request, res: Response) => {
  const { cpf } = cpfParamSchema.parse(req.params);
  const data = createIdosoSchema.parse(req.body);

  const idosoUpdate = await Idoso.findOneAndUpdate(
    { cpf: cpf },
    data, { new: true });

  if (!idosoUpdate) {
    return res.status(404).json({ message: "Idoso não encontrado" });
  }

  res.status(200).json({
    message: "Idoso atualizado com sucesso", idosoUpdate
  });
};

export const deleteIdoso = async (req: Request, res: Response) => {
  const { cpf } = cpfParamSchema.parse(req.params);

  const idosoDeleted = await Idoso.findOneAndDelete({ cpf: cpf });

  if (!idosoDeleted) {
    return res.status(404).json({ message: "Idoso não encontrado" });
  };

  res.status(200).json({ message: "Idoso deletado com sucesso" });
};
