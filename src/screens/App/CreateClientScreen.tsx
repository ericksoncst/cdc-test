import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Controller } from "react-hook-form";
import { useCreateClientViewModel } from "../../viewModels/useCreateClientViewModel";
import { isCPF } from "../../utils";
import Input from "../../components/input/Input";
import Button from "../../components/Button/Button";


interface CreateClientProps {
  navigation: any;
}

const CreateClientScreen: React.FC<CreateClientProps> = ({ navigation }) => {
  const { form, handleSave, isLoading } = useCreateClientViewModel(navigation);
  const { control, handleSubmit, watch, formState: { errors } } = form;

  const documentValue = watch("document");
  const isPersonalDocument = isCPF(documentValue);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} testID="back-button">
          <Icon name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Cliente</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input placeholder="Nome completo" value={value} onChangeText={onChange} autoCapitalize="words" />
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF/CNPJ *</Text>
            <Controller
              control={control}
              name="document"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={value}
                  onChangeText={onChange}
                  useMask
                  keyboardType="numeric"
                />
              )}
            />
            {errors.document && <Text style={styles.errorText}>{errors.document.message}</Text>}
          </View>

          {isPersonalDocument ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Idade *</Text>
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, value } }) => (
                  <Input placeholder="Idade em anos" value={value} onChangeText={onChange} keyboardType="numeric" />
                )}
              />
              {errors.age && <Text style={styles.errorText}>{errors.age.message}</Text>}
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de Fundação *</Text>
              <Controller
                control={control}
                name="foundationDate"
                render={({ field: { onChange, value } }) => (
                  <Input placeholder="DD/MM/AAAA" value={value} onChangeText={onChange} keyboardType="numeric" />
                )}
              />
              {errors.foundationDate && (
                <Text style={styles.errorText}>{errors.foundationDate.message}</Text>
              )}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Renda Mensal *</Text>
            <Controller
              control={control}
              name="monthlyIncome"
              render={({ field: { onChange, value } }) => (
                <Input placeholder="R$ 0,00" value={value} onChangeText={onChange} keyboardType="numeric" />
              )}
            />
            {errors.monthlyIncome && <Text style={styles.errorText}>{errors.monthlyIncome.message}</Text>}
          </View>

          <View style={styles.infoBox}>
            <Icon name="info" size={16} color="#007AFF" />
            <Text style={styles.infoText}>O saldo inicial do cliente será R$ 0,00</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isLoading ? "Salvando..." : "Salvar Cliente"}
          onPress={handleSubmit(handleSave)}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: "600", color: "#333", textAlign: "center" },
  headerSpacer: { width: 40 },
  content: { flex: 1 },
  form: { padding: 20 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 8 },
  errorText: { color: "#e74c3c", fontSize: 14, marginTop: 5, marginLeft: 10 },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: { flex: 1, fontSize: 14, color: "#1976d2", marginLeft: 8 },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});

export default CreateClientScreen;
