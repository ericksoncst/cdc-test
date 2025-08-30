import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Modal
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { Controller } from "react-hook-form";
import { useTransferViewModel } from "../../viewModels/useTransferViewModel";
import { formatCurrency, formatDocument } from "../../utils";
import Input from "../../components/input/Input";
import Button from "../../components/Button/Button";

function TransferScreen({ navigation }: any) {
  const vm = useTransferViewModel(navigation);

  const renderClientModal = (visible: boolean, onClose: () => void, onSelect: any, excludeClient?: any) => {
    const availableClients = excludeClient
      ? vm.clients.filter((c: any) => c.id !== excludeClient.id)
      : vm.clients;

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Cliente</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {availableClients.map((client: any) => (
              <TouchableOpacity
                key={client.id}
                style={styles.clientOption}
                onPress={() => { onSelect(client); onClose(); }}
              >
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.clientDocument}>{formatDocument(client.document)}</Text>
                  <Text style={styles.clientBalance}>{formatCurrency(client.balance)}</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} testID="back-button">
          <Icon name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transferência</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Cliente de Origem *</Text>
          <TouchableOpacity style={styles.clientSelector} onPress={() => vm.setShowFromModal(true)} testID="from-client-selector">
            <Text>
              {vm.fromClient ? vm.fromClient.name : "Selecionar cliente de origem"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Cliente de Destino *</Text>
          <TouchableOpacity style={styles.clientSelector} onPress={() => vm.setShowToModal(true)} testID="to-client-selector">
            <Text>
              {vm.toClient ? vm.toClient.name : "Selecionar cliente de destino"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Valor da Transferência *</Text>
          <Controller
            control={vm.control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="0,00" value={value} onChangeText={onChange} keyboardType="numeric" />
            )}
          />
          {vm.errors.amount && <Text style={styles.errorText}>{vm.errors.amount.message}</Text>}

          <Button
            title={vm.isLoading ? "Transferindo..." : "Realizar Transferência"}
            onPress={vm.handleSubmit}
            disabled={vm.isLoading || !vm.fromClient || !vm.toClient}
          />
        </View>
      </ScrollView>

      {renderClientModal(vm.showFromModal, () => vm.setShowFromModal(false), (client: any) => vm.setValue("fromClient", client), vm.toClient)}
      {renderClientModal(vm.showToModal, () => vm.setShowToModal(false), (client: any) => vm.setValue("toClient", client), vm.fromClient)}
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  backButton: {
    padding: 8,
    marginLeft: -8
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
  headerSpacer: {
    width: 40
  },
  content: {
    flex: 1
  },
  form: {
    padding: 20
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  clientSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    minHeight: 60
  },
  selectedClient: {
    flex: 1
  },
  clientInfo: {
    flex: 1
  },
  selectedClientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  selectedClientDocument: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  selectedClientBalance: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500'
  },
  selectorPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999'
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 10
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333'
  },
  modalContent: {
    flex: 1
  },
  clientOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  clientDocument: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  clientBalance: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500'
  },
  emptyState: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#666'
  }
});

export default TransferScreen;