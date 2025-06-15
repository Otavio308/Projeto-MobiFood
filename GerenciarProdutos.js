import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  Alert,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native'; // <-- ✅ Adicione esta linha

const { width } = Dimensions.get('window');

const GerenciarProdutos = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([
    { id: 1, name: 'Pão Francês', price: '0.50', category: 'Salgados', quantity: '50', image: null },
    { id: 2, name: 'Bolo de Chocolate', price: '15.00', category: 'Doces', quantity: '10', image: null },
    { id: 3, name: 'Croissant', price: '4.50', category: 'Salgados', quantity: '25', image: null },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Salgados',
    quantity: '',
    image: null
  });
  
  const categories = ['Salgados', 'Doces', 'Bebidas', 'Outros'];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para adicionar fotos');
      }
    })();
  }, []);

  const clearForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'Salgados',
      quantity: '',
      image: null
    });
    setCurrentProduct(null);
  };

  const openProductModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        quantity: product.quantity.toString(),
        image: product.image
      });
    } else {
      clearForm();
    }
    setModalVisible(true);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData({
          ...formData,
          image: result.assets[0].uri
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
      console.error(error);
    }
  };

  const saveProduct = () => {
    if (!formData.name || !formData.price || !formData.quantity) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (currentProduct) {
      setProducts(products.map(p => 
        p.id === currentProduct.id ? { ...p, ...formData } : p
      ));
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...formData
      };
      setProducts([...products, newProduct]);
    }
    
    setModalVisible(false);
    clearForm();
  };

  const deleteProduct = (product) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o produto ${product.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            setProducts(products.filter(p => p.id !== product.id));
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDetails}>
          {item.category} - R$ {parseFloat(item.price).toFixed(2)}
        </Text>
        <Text style={styles.productDetails}>
          Estoque: {item.quantity} unidades
        </Text>
      </View>
      
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => openProductModal(item)}
        >
          <Icon name="edit" size={24} color="#0FC2C0" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteProduct(item)}
        >
          <Icon name="delete" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('DashRestaurante')} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Produtos</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Icon name="fastfood" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => openProductModal()}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </Text>
            
            <TouchableOpacity 
              style={styles.imagePicker} 
              onPress={handleAddPhoto}
            >
              {formData.image ? (
                <Image 
                  source={{ uri: formData.image }} 
                  style={styles.productImagePreview}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="add-a-photo" size={30} color="#666" />
                  <Text style={styles.imagePlaceholderText}>Adicionar Foto</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="Nome do Produto"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Preço (ex: 5.99)"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => handleInputChange('price', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Quantidade em estoque"
              keyboardType="numeric"
              value={formData.quantity}
              onChangeText={(text) => handleInputChange('quantity', text)}
            />
            
            <View style={styles.categoryContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    formData.category === category && styles.selectedCategory
                  ]}
                  onPress={() => handleInputChange('category', category)}
                >
                  <Text 
                    style={[
                      styles.categoryText,
                      formData.category === category && styles.selectedCategoryText
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  clearForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveProduct}
              >
                <Text style={styles.saveButtonText}>
                  {currentProduct ? 'Salvar' : 'Adicionar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Para espaçar a seta e o botão de adicionar
    padding: 10,
    backgroundColor: 'rgba(4, 245, 213, 0.51)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight || 0,
  },
  backButton: { // <-- ✅ Novo estilo para o botão de voltar
    marginRight: 10,
    padding: 5, // Aumenta a área de toque
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1, // Para o título ocupar o espaço restante
    textAlign: 'center', // Centralizar o título
    marginLeft: -30, 
  },
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
  },
  productActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0FC2C0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    height: 120,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: 5,
    color: '#666',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#0FC2C0',
    borderColor: '#0FC2C0',
  },
  categoryText: {
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0FC2C0',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GerenciarProdutos;