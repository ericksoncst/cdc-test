import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClients } from "../contexts/ClientContext";
import { transferSchema } from "../screens/Transfer/transferSchema";
import { z } from "zod";
import { formatCurrency } from "../utils";

export type TransferFormData = z.infer<typeof transferSchema>;

export function useTransferViewModel(navigation: any) {
  const { clients, transfer, isLoading, refreshClients } = useClients();

  const { control, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<TransferFormData>({
      resolver: zodResolver(transferSchema),
      defaultValues: {
        fromClient: undefined as any,
        toClient: undefined as any,
        amount: ""
      }
    });

  const fromClient = watch("fromClient");
  const toClient = watch("toClient");
  const amount = watch("amount");

  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);

  useEffect(() => {
    refreshClients();
  }, []);

  const onSubmit = (data: TransferFormData) => {
    const transferAmount = parseFloat(data.amount.replace(",", "."));

    if (data.fromClient.id === data.toClient.id) {
      Alert.alert("Erro", "Cliente de origem e destino devem ser diferentes");
      return;
    }

    if (transferAmount > data.fromClient.balance) {
      Alert.alert("Erro", "Saldo insuficiente");
      return;
    }

    Alert.alert(
      "Confirmar Transferência",
      `Transferir ${formatCurrency(transferAmount)} de ${data.fromClient.name} para ${data.toClient.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await transfer(Number(data.fromClient.id), Number(data.toClient.id), transferAmount);
              Alert.alert("Sucesso", "Transferência realizada com sucesso!", [
                {
                  text: "OK",
                  onPress: () => navigation.goBack()
                }
              ]);
            } catch (error) {
              Alert.alert("Erro", error instanceof Error ? error.message : "Erro ao realizar transferência");
            }
          }
        }
      ]
    );
  };

  return {
    clients,
    fromClient,
    toClient,
    amount,
    showFromModal,
    showToModal,
    setShowFromModal,
    setShowToModal,
    control,
    setValue,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    isLoading
  };
}
