import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Controller } from "react-hook-form";
import { Client } from "../../types";
import { useEditClientViewModel } from "../../viewModels/useEditClientViewModel";
import Input from "../../components/input/Input";
import { formatDocument } from "../../utils";
import Button from "../../components/Button/Button";


interface EditClientProps {
  navigation: any;
  route: {
    params: {
      client: Client;
    };
  };
}

const EditClientScreen: React.FC<EditClientProps> = ({ navigation, route }) => {
  const { client } = route.params;

  const {
    control,
    handleSubmit,
    onSubmit,
    isLoading,
    isPersonalDocument,
  } = useEditClientViewModel(client, () =>
    Alert.alert("Sucesso", "Cliente atualizado com sucesso!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ])
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Cliente</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <>
                  <Input
                    placeholder="Nome completo"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF/CNPJ</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledText}>
                {formatDocument(client.document)}
              </Text>
            </View>
            <Text style={styles.helperText}>
              O CPF/CNPJ não pode ser alterado
            </Text>
          </View>

          {isPersonalDocument ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Idade *</Text>
              <Controller
                control={control}
                name="age"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <>
                    <Input
                      placeholder="Idade em anos"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                    />
                    {error && (
                      <Text style={styles.errorText}>{error.message}</Text>
                    )}
                  </>
                )}
              />
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de Fundação *</Text>
              <Controller
                control={control}
                name="foundationDate"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <>
                    <Input
                      placeholder="DD/MM/AAAA"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                    />
                    {error && (
                      <Text style={styles.errorText}>{error.message}</Text>
                    )}
                  </>
                )}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Renda Mensal *</Text>
            <Controller
              control={control}
              name="monthlyIncome"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <>
                  <Input
                    placeholder="0.00"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.balanceInfo}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Saldo Atual:</Text>
              <Text style={styles.balanceValue}>
                R${" "}
                {client.balance
                  .toFixed(2)
                  .replace(".", ",")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isLoading ? "Salvando..." : "Salvar Alterações"}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

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
  disabledInput: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center'
  },
  disabledText: {
    fontSize: 16,
    color: '#666'
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 10
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10
  },
  balanceInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  }
});

export default EditClientScreen;