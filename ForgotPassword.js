import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, 
  TouchableOpacity, Image, Alert, ActivityIndicator
} from 'react-native';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu email');
      return;
    }

    // Validação simples de email
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      // Substitua pela URL real do seu backend
      const response = await fetch('https://192.168.0.3:5000/api/send-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('VerifyCode', { email });
      } else {
        Alert.alert('Erro', data.message || 'Falha ao enviar código de recuperação');
      }
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../mobile/assets/ForgotPassword.png')} 
        style={styles.logo}
      />

      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>Insira seu email para receber o código de verificação</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={handleReset}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.resetButtonText}>Enviar Código</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
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
    marginBottom: 30,
    color: '#666',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  resetButton: {
    backgroundColor: '#0FC2C0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});