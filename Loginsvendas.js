// Loginsvendas.js
import React from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TextInput, TouchableOpacity, Pressable,
  Alert, Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './AuthContext';

const Loginsvendas = ({ navigation }) => {
  // Usamos a mesma função de login do AuthContext
  const { login } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLoginVendedor = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Chama a mesma função de login, pois os dados são os mesmos
      const success = await login(email, password); 

      if (success) {
        // Se o login for bem-sucedido, navega para a DashRestaurante
        navigation.navigate('DashRestaurante'); 
      } else {
        Alert.alert('Erro', 'Credenciais inválidas para vendedor');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login. Tente novamente.');
      console.error('Erro de login do vendedor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={require('./assets/ImageLogin2.png')} style={styles.image} 
        />

      <Text style={styles.title}> Login Restaurante </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email ou Telefone do Restaurante"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha do Restaurante"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.forgotPasswordContainer}>
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </Pressable>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleLoginVendedor} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueButtonText}>Entrar como Restaurante</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomLinksContainer}>
        <View style={styles.registerContainer}>
          <Text>Não tem cadastro? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Registrar</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
    color: '#666',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontFamily: 'Arial',
  },
  continueButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0FC2C0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: 20,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 30,
  },
  registerText: {
    color: '#007AFF',
    fontWeight: 'bold',
    paddingBottom: 30,
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  bottomLinksContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
});

export default Loginsvendas;