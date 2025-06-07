import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, Image, 
  TouchableOpacity, SafeAreaView, Alert,
  ActivityIndicator, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '@env';
import { AuthContext } from './AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { userToken, logout } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    name: 'Carregando...',
    email: 'carregando@exemplo.com',
    mobile: '(00) 00000-0000'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { 
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
        
        setUserData({
          name: response.data.name || 'Nome não disponível',
          email: response.data.email || 'Email não disponível',
          mobile: response.data.mobile || 'Telefone não disponível'
        });
        
        if (response.data.profileImage) {
          setProfileImage(`${API_URL}/${response.data.profileImage}`);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        Alert.alert('Erro', 'Falha ao carregar dados do perfil');
      } finally {
        setIsLoading(false);
      }
    };

    if (userToken) fetchUserData();
  }, [userToken]);

  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const formData = new FormData();
        formData.append('profileImage', {
          uri,
          type: 'image/jpeg',
          name: 'profile.jpg'
        });

        await axios.put(`${API_URL}/api/auth/profile-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userToken}`,
          },
        });
        setProfileImage(uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a imagem');
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir sua conta permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/api/auth/users`, {
                headers: { Authorization: `Bearer ${userToken}` },
              });
              logout();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir conta');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0FC2C0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Parte superior (barra ciano) */}
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
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
        </View>
      </View>

      {/* Informações do perfil */}
      <ScrollView style={styles.infoContainer}>
        <View style={styles.infoSection}>
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
            onPress={logout}
          >
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Sair</Text>
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
  },
  logoutButtonText: {
    color: '#0FC2C0',
  },
});

export default ProfileScreen;