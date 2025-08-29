import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClients } from "../contexts/ClientContext";
import { Client } from "../types";
import { cleanDocument } from "../utils/validations";

export const useEditClientViewModel = (client: Client, onSuccess: () => void) => {
  const { updateClient, isLoading } = useClients();

  const isPersonalDocument = cleanDocument(client.document);

  const schema = z.object({
    name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .nonempty("Nome é obrigatório"),
    age: isPersonalDocument
      ? z
          .string()
          .nonempty("Idade é obrigatória")
          .refine(
            (val) => {
              const num = parseInt(val, 10);
              return !isNaN(num) && num >= 18 && num <= 120;
            },
            { message: "Idade deve estar entre 18 e 120 anos" }
          )
      : z.string().optional(),
    foundationDate: !isPersonalDocument
      ? z
          .string()
          .nonempty("Data de fundação é obrigatória")
          .refine(
            (val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val),
            { message: "Data deve estar no formato DD/MM/AAAA" }
          )
          .refine(
            (val) => {
              const [day, month, year] = val.split("/").map(Number);
              const date = new Date(year, month - 1, day);
              const now = new Date();
              return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day &&
                date <= now
              );
            },
            { message: "Data inválida ou futura" }
          )
      : z.string().optional(),
    monthlyIncome: z
      .string()
      .nonempty("Renda mensal é obrigatória")
      .refine((val) => parseFloat(val) > 0, {
        message: "Renda mensal deve ser maior que zero",
      }),
  });

  type FormData = z.infer<typeof schema>;

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: client.name,
      age: client.age?.toString() || "",
      foundationDate: client.foundationDate || "",
      monthlyIncome: client.monthlyIncome.toString(),
    },
  });

  useEffect(() => {
    reset({
      name: client.name,
      age: client.age?.toString() || "",
      foundationDate: client.foundationDate || "",
      monthlyIncome: client.monthlyIncome.toString(),
    });
  }, [client, reset]);

  const onSubmit = async (data: FormData) => {
    const updateData: Partial<Client> = {
      name: data.name.trim(),
      monthlyIncome: parseFloat(data.monthlyIncome),
    };

    if (isPersonalDocument) {
      updateData.age = parseInt(data.age ?? "0", 10);
    } else {
      updateData.foundationDate = data.foundationDate;
    }

    const success = await updateClient(client.id, updateData);
    if (success) {
      onSuccess();
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isLoading,
    isPersonalDocument,
  };
};
