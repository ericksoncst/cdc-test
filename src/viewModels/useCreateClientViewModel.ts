import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClients } from "../contexts/ClientContext";
import { Alert } from "react-native";
import { isCPF, isValidDocument, parseCurrency } from "../utils";

const baseSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  document: z
    .string()
    .nonempty("CPF/CNPJ é obrigatório")
    .refine((doc) => isValidDocument(doc), "CPF/CNPJ inválido"),
  monthlyIncome: z
    .string()
    .nonempty("Renda mensal é obrigatória")
    .refine((val) => parseCurrency(val) > 0, "Renda mensal deve ser maior que zero"),
  age: z.string().optional(),
  foundationDate: z.string().optional(),
});

export const CreateClientSchema = baseSchema.refine(
  (data) => {
    if (isCPF(data.document)) {
      return !!data.age && !isNaN(Number(data.age)) && Number(data.age) >= 18 && Number(data.age) <= 120;
    }
    return true;
  },
  { message: "Idade deve estar entre 18 e 120 anos", path: ["age"] }
).refine(
  (data) => {
    if (!isCPF(data.document)) {
      if (!data.foundationDate) return false;
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(data.foundationDate)) return false;

      const [day, month, year] = data.foundationDate.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      const now = new Date();

      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day &&
        date <= now
      );
    }
    return true;
  },
  { message: "Data de fundação inválida", path: ["foundationDate"] }
);

export type CreateClientFormData = z.infer<typeof CreateClientSchema>;

export const useCreateClientViewModel = (navigation: any) => {
  const { createClient, isLoading } = useClients();

  const form = useForm<CreateClientFormData>({
    resolver: zodResolver(CreateClientSchema),
    defaultValues: {
      name: "",
      document: "",
      age: "",
      foundationDate: "",
      monthlyIncome: "",
    },
  });

  const handleSave = async (data: CreateClientFormData) => {
    try {
      const clientData = {
        name: data.name.trim(),
        document: data.document.replace(/\D/g, ""),
        monthlyIncome: parseCurrency(data.monthlyIncome),
        ...(isCPF(data.document)
          ? { age: parseInt(data.age ?? "0") }
          : { foundationDate: data.foundationDate }),
      };

      const success = await createClient(clientData);

      if (success) {
        Alert.alert("Sucesso", "Cliente criado com sucesso!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Erro", "Erro ao criar cliente. Tente novamente.");
      }
    } catch {
      Alert.alert("Erro", "Erro ao criar cliente. Tente novamente.");
    }
  };

  return { form, handleSave, isLoading };
};
