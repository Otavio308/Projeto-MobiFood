import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, Image,
  TouchableOpacity, SafeAreaView, Alert,
  ActivityIndicator, ScrollView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '@env'; // Certifique-se de que API_URL está configurada corretamente
import { AuthContext } from './AuthContext'; // Certifique-se de que o caminho está correto

const ProfileScreen = ({ navigation }) => {
  const { userToken, logout } = useContext(AuthContext); // userToken e logout do AuthContext
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    name: 'Carregando...',
    email: 'carregando@exemplo.com',
    mobile: '(00) 00000-0000',
    profilePic: null // Adicionado para armazenar a URL completa da foto de perfil
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // Para mostrar loading no botão da câmera

  useEffect(() => {
    // Solicitar permissões de mídia ao montar o componente
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'É preciso permitir acesso à galeria para escolher uma foto.');
      }
    })();
    if (userToken) { // Só busca dados se houver um token
      fetchUserData();
    }
  }, [userToken]); // userToken como dependência para recarregar se o token mudar

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${userToken}`, // Usa o token do contexto
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      // Atualiza userData com nome, email, telefone e a URL da foto de perfil
      setUserData({
        name: response.data.name || 'Nome não disponível',
        email: response.data.email || 'Email não disponível',
        mobile: response.data.mobile || 'Telefone não disponível',
        profilePic: response.data.profileImage // Assumindo que o backend retorna 'profileImage'
      });

      // Se houver uma profileImage retornada do backend, usa ela
      if (response.data.profileImage) {
        // Se response.data.profileImage JÁ VEM como URL completa, simplesmente use-a
        // E certifique-se de que não haja barras invertidas, caso o backend seja Windows
        const fullImageUrl = response.data.profileImage.replace(/\\/g, '/');
        
        // Adicione um console.log extra para verificar se há duplicação AGORA
        console.log('Valor de profileImage vindo do backend (ANTES DE QUALQUER CONCATENAÇÃO):', response.data.profileImage);
        console.log('URL Completa da Imagem do Perfil (Usada diretamente do Backend):', fullImageUrl);

        setProfileImage(fullImageUrl);
      } else {
        setProfileImage(null);
      }

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      // Se o token for inválido (por exemplo, 401 Unauthorized), desloga
      if (error.response && error.response.status === 401) {
        logout(); // Desloga o usuário
        navigation.replace('Login'); // Volta para a tela de login
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    setIsUploading(true); // Inicia o indicador de upload
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrigido para MediaTypeOptions
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const formData = new FormData();
        // O nome do campo 'profileImage' deve corresponder ao que seu backend espera
        formData.append('profileImage', {
          uri: uri,
          name: `profile_${Date.now()}.jpg`, // Nome único para a imagem
          type: 'image/jpeg',
        });

        // Endpoint de upload de imagem - VERIFIQUE SE SEU BACKEND USA ESTE ENDPOINT
        const uploadResponse = await axios.put(`${API_URL}/api/auth/profile-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Essencial para envio de arquivos
            Authorization: `Bearer ${userToken}`, // Envia o token de autenticação
          },
          timeout: 30000 // Aumenta o tempo limite para uploads
        });

        console.log('Upload de imagem bem-sucedido:', uploadResponse.data);
        Alert.alert('Sucesso', 'Foto de perfil atualizada!');
        // Após o upload, recarregar os dados do usuário para obter a nova URL da imagem
        await fetchUserData(); // Chama fetchUserData para atualizar a imagem exibida
      }
    } catch (error) {
      console.error('Erro no upload da imagem:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Não foi possível atualizar a imagem. Verifique o servidor.');
    } finally {
      setIsUploading(false); // Finaliza o indicador de upload
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir sua conta permanentemente? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              // Endpoint de exclusão de usuário - VERIFIQUE SE SEU BACKEND USA ESTE ENDPOINT
              await axios.delete(`${API_URL}/api/auth/users`, {
                headers: { Authorization: `Bearer ${userToken}` }, // Envia o token de autenticação
                timeout: 10000
              });
              Alert.alert('Sucesso', 'Sua conta foi excluída com sucesso.');
              logout(); // Desloga o usuário do AuthContext
              navigation.replace('Login'); // Volta para a tela de login
            } catch (error) {
              console.error('Erro ao excluir conta:', error.response ? error.response.data : error.message);
              Alert.alert('Erro', 'Falha ao excluir conta. Verifique o servidor.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          onPress: () => {
            logout(); // Desloga o usuário do AuthContext
            navigation.replace('Login'); // Redireciona para a tela de Login
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0FC2C0" />
        <Text style={{ marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileIconContainer}>
                <Ionicons name="person" size={80} color="#fff" />
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleAddPhoto}
              disabled={isUploading} // Desabilita o botão durante o upload
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.name}</Text> 
        </View>
      </View>

      {/* Informações do perfil */}
      <ScrollView style={styles.infoContainer}>
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="person" size={20} color="#666" style={styles.icon} /> 
            <Text style={styles.infoText}>{userData.name}</Text> 
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{userData.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="call" size={20} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{userData.mobile}</Text>
          </View>
        </View>

        {/* Botões inferiores */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteProfile}
          >
            <Text style={styles.buttonText}>Excluir Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout} // Chama a função que trata o logout
          >
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    backgroundColor: 'rgba(4, 245, 213, 0.51)',
    height: 280,
    paddingTop: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: StatusBar.currentHeight || 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileIconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(11, 66, 59, 0.51)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#0FC2C0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoContainer: {
    flex: 1,
  },
  infoSection: {
    padding: 20,
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 15,
    width: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    padding: 20,
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#0FC2C0',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff', // Cor do texto do botão de excluir
  },
  logoutButtonText: {
    color: '#0FC2C0',
  },
});

export default ProfileScreen;