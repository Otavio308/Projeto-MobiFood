import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TextInput, TouchableOpacity, Pressable,
  Alert, Image, ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './SplashScreen';
import SignInScreen from './SingInScreen';
import Dashboard from './dashboard';
import Carrinho from './Carrinho';
import GerenciarProdutos from './GerenciarProdutos';
import Sobre from './Sobre';
import ProfileScreen from './ProfileScreen';
import { API_URL } from '@env';
import Pedidos from './Pedidos';
import DetalhesPedido from './DetalhesPedido';
import ForgotPassword from './ForgotPassword';
import VerifyCode from './VerifyCode';
import ResetPassword from './ResetPassword';
import DashRestaurante from './DashRestaurante';
import Loginsvendas from './Loginsvendas';
import SignInVendas from './SignInVendas';

import { AuthContext, AuthProvider } from './AuthContext'; // ✅ Novo import

const LoginScreen = ({ navigation }) => {
  const { login } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigation.navigate('Dashboard');
    } else {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./assets/ImageLogin2.png')} style={styles.image} />
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email ou Telefone"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* "Esquecei minha senha" movido para aqui */}
      <View style={styles.forgotPasswordContainer}>
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Esquecei minha senha</Text>
        </Pressable>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.bottomLinksContainer}>
        <View style={styles.registerContainer}>
          <Text>Não tem Login? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Registrar</Text>
          </Pressable>
        </View>

        {/* Novo botão "Já sou vendedor" */}
        <Pressable onPress={() => navigation.navigate('Loginsvendas')}>
          <Text style={styles.sellerText}>Já sou vendedor</Text>
        </Pressable>
      </View>
    </ScrollView>
    
  );
};


const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={SignInScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Carrinho" component={Carrinho} />
          <Stack.Screen name="GerenciarProdutos" component={GerenciarProdutos} />
          <Stack.Screen name="Sobre" component={Sobre} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Pedidos" component={Pedidos} />
          <Stack.Screen name="DetalhesPedido" component={DetalhesPedido} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="VerifyCode" component={VerifyCode} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="DashRestaurante" component={DashRestaurante} />
          <Stack.Screen name="Loginsvendas" component={Loginsvendas} />
          <Stack.Screen name="SignInVendas" component={SignInVendas} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
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
    marginTop: 20, // Ajuste para dar espaço após o "Esquecei minha senha"
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  registerText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  forgotPasswordContainer: { // Novo estilo para o container do "Esquecei minha senha"
    width: '100%',
    alignItems: 'flex-end', // Alinha o conteúdo à direita
    marginBottom: 10, // Espaço entre o link e o botão de continuar
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  bottomLinksContainer: {
    alignItems: 'center',
    marginTop: 5,
    paddingBottom: 30,
  },
  sellerText: {
    color: '#007AFF',
    fontWeight: 'bold',
    paddingTop: 15,
    paddingBottom: 30,
  },
});

export default App;