import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, 
  TouchableOpacity, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from 'react-native';

export default function VerifyCode({ navigation, route }) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { email } = route.params;

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Erro', 'Por favor, insira o código de verificação');
      return;
    }

    setIsLoading(true);
    
    try {
      // Substitua pela URL real do seu backend
      const response = await fetch('https://seuservidor.com/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('ResetPassword', { 
          email, 
          resetToken: data.resetToken 
        });
      } else {
        Alert.alert('Erro', data.message || 'Código inválido ou expirado');
      }
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Não foi possível verificar o código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Verificação de Código</Text>
        <Text style={styles.subtitle}>Insira o código de 6 dígitos enviado para:</Text>
        <Text style={styles.emailText}>{email}</Text>

        <TextInput
          style={styles.input}
          placeholder="Código de verificação"
          placeholderTextColor="#999"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verificar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={() => Alert.alert('Info', 'Código reenviado com sucesso!')}
        >
          <Text style={styles.resendText}>Não recebeu? Reenviar código</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#0FC2C0',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: '#666',
  },
  emailText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#0FC2C0',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#0FC2C0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    color: '#0FC2C0',
    fontWeight: 'bold',
  },
});