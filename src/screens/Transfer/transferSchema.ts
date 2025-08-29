import { z } from "zod";

export const transferSchema = z.object({
  fromClient: z.object({
    id: z.string(),
    name: z.string(),
    balance: z.number(),
    document: z.string()
  }, { message: "Cliente de origem é obrigatório" }),

  toClient: z.object({
    id: z.string(),
    name: z.string(),
    balance: z.number(),
    document: z.string()
  }, { message: "Cliente de destino é obrigatório" }),

  amount: z
    .string()
    .nonempty("Valor é obrigatório")
    .refine(val => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Valor deve ser maior que zero")
});
