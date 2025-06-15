import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

const Dashboard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Limpar carrinho quando a tela receber foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCartItems([]);
    });
    return unsubscribe;
  }, [navigation]);
  
  const categories = [
    { name: 'Todos', icon: 'fastfood' },
    { name: 'Salgados', icon: 'local-pizza' },
    { name: 'Doces', icon: 'cake' },
    { name: 'Bebidas', icon: 'local-drink' },
  ];

  const [products] = useState([
    { id: 1, name: 'Pão Francês', price: 'R$ 0,50', category: 'Salgados', stock: 30, image: 'https://redemix.vteximg.com.br/arquivos/ids/214544-1000-1000/6914.jpg?v=638351307421600000' },
    { id: 2, name: 'Bolo de Chocolate', price: 'R$ 15,00', category: 'Doces', stock: 7, image: null },
    { id: 3, name: 'Croissant', price: 'R$ 4,50', category: 'Salgados', stock: 18, image: null },
    { id: 4, name: 'Torta de Frango', price: 'R$ 8,00', category: 'Salgados', stock: 13, image: null },
    { id: 5, name: 'Café Especial', price: 'R$ 5,00', category: 'Bebidas', stock: 30, image: null },
    { id: 6, name: 'Sonho', price: 'R$ 3,50', category: 'Doces', stock: 6, image: null },
    { id: 7, name: 'Pão de Queijo', price: 'R$ 1,00', category: 'Salgados', stock: 20, image: null },
    { id: 8, name: 'Biscoito Caseiro', price: 'R$ 2,50', category: 'Doces', stock: 16, image: null },
    { id: 9, name: 'Suco Natural', price: 'R$ 6,00', category: 'Bebidas', stock: 8, image: null },
    { id: 10, name: 'Empada', price: 'R$ 3,00', category: 'Salgados', stock: 12, image: null },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : 'fastfood';
  };

  const addToCart = (product) => {
    const cartItem = cartItems.find(item => item.id === product.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    
    if (currentQuantity >= product.stock) {
      Alert.alert('Estoque Insuficiente', `Desculpe, não há mais ${product.name} disponível em estoque.`);
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevItems.filter(item => item.id !== product.id);
    });
  };

  useEffect(() => {
    let results = products;
    
    if (searchQuery) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'Todos') {
      results = results.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory]);

  const renderItem = ({ item }) => {
    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
    const itemQuantity = cartItem ? cartItem.quantity : 0;
    const categoryIcon = getCategoryIcon(item.category);
    const isOutOfStock = item.stock <= 0;
    const almostOutOfStock = item.stock <= 5 && item.stock > 0;
     
    return (
      <Animated.View style={[
        styles.productCard,
        isOutOfStock && styles.outOfStockCard
      ]}>
        <View style={styles.iconContainer}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.productImage}
            />
          ) : (
            <Icon 
              name={categoryIcon} 
              size={40} 
              color={isOutOfStock ? "#ccc" : "#0FC2C0"} 
              style={styles.categoryIcon}
            />
          )}
        </View>

        <View style={styles.productDetails}>
          <Text style={[
            styles.productName,
            isOutOfStock && styles.outOfStockText
          ]}>
            {item.name}
          </Text>
          {isOutOfStock && (
            <Text style={styles.stockWarning}>ESGOTADO</Text>
          )}
          {almostOutOfStock && !isOutOfStock && (
            <Text style={styles.stockWarning}>ÚLTIMAS UNIDADES</Text>
          )}
          <View style={styles.infoContainer}>
            <Text style={[
              styles.price,
              isOutOfStock && styles.outOfStockText
            ]}>
              {item.price}
            </Text>
            {!isOutOfStock && (
              <Text style={styles.stockText}>
                Estoque: {item.stock} un.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.cartControls}>
          {!isOutOfStock && (
            <>
              <TouchableOpacity 
                style={styles.cartButton} 
                onPress={() => addToCart(item)}
                disabled={itemQuantity >= item.stock}
              >
                <Icon 
                  name="add-shopping-cart" 
                  size={24} 
                  color={itemQuantity >= item.stock ? "#ccc" : "#0FC2C0"} 
                />
              </TouchableOpacity>
              
              {itemQuantity > 0 && (
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeFromCart(item)}
                >
                  <Icon name="remove-shopping-cart" size={24} color="#ff4444" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </Animated.View>
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
    return sum + (price * (item.quantity || 1));
  }, 0);

  const navigateToCart = () => {
    navigation.navigate('Carrinho', { 
      cartItems,
      setCartItems: (updatedItems) => {
        setCartItems(updatedItems);
      }
    });
  };

  const navigateToProfile = () => {
  setMenuVisible(false);
  navigation.navigate('Profile'); 
};

  const navigateToSobre = () => {
    setMenuVisible(false);
    navigation.navigate('Sobre');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Itens do Menu"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          onPress={navigateToCart}
          style={styles.headerCartIcon}
        >
          <Icon name="shopping-cart" size={26} color="#000" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Categorias</Text>
            </View>
            
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryMenuItem,
                  selectedCategory === category.name && styles.selectedCategoryItem
                ]}
                onPress={() => {
                  setSelectedCategory(category.name);
                  setMenuVisible(false);
                }}
              >
                <Icon 
                  name={category.icon} 
                  size={24} 
                  color={selectedCategory === category.name ? '#0FC2C0' : '#333'} 
                />
                <Text style={styles.categoryMenuText}>{category.name}</Text>
                {selectedCategory === category.name && (
                  <Icon name="check" size={20} color="#0FC2C0" />
                )}
              </TouchableOpacity>
            ))}
            
            <View style={styles.divider} />
            
            <TouchableOpacity
              style={styles.menuOption}
              onPress={navigateToProfile}
            >
              <Icon name="person" size={24} color="#333" />
              <Text style={styles.menuOptionText}>Minha Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Pedidos');
              }}
            >
              <Icon name="list-alt" size={24} color="#333" />
              <Text style={styles.menuOptionText}>Meus Pedidos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={navigateToSobre}
            >
              <Icon name="info" size={24} color="#333" />
              <Text style={styles.menuOptionText}>Sobre</Text>
            </TouchableOpacity>
          </View>
          
          <Pressable 
            style={styles.menuOverlay} 
            onPress={() => setMenuVisible(false)}
          />
        </View>
      </Modal>

      <AnimatedFlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY }} }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />

      {totalItems > 0 && (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'rgb(250, 250, 250)' }}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryText}>VALOR TOTAL:</Text>
              <Text style={styles.summaryPrice}>R$ {totalPrice.toFixed(2)} / {totalItems} {totalItems === 1 ? 'Item' : 'Itens'}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.cartButtonSummary}
              onPress={navigateToCart}
            >
              <Text style={styles.cartButtonText}>
                Ver Carrinho ({totalItems})
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
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
    padding: 20,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: 'rgba(4, 245, 213, 0.51)',
    marginBottom: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgb(245, 245, 245)',
    borderRadius: 20,
    paddingHorizontal: 25,
    fontSize: 16,
    marginRight: 15,
    marginTop:7,
  },
  headerCartIcon: {
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    backgroundColor: 'rgb(252, 252, 252)',
    borderRadius: 10,
    elevation: 3,
  },
  outOfStockCard: {
    backgroundColor: 'rgba(245, 245, 245, 0.7)',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  outOfStockText: {
    color: '#ccc',
  },
  stockWarning: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 4,
  },
  stockText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    color: 'rgb(1, 200, 214)',
    fontWeight: 'bold',
    marginRight: 15,
  },
  cartControls: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  cartButton: {
    padding: 5,
  },
  removeButton: {
    padding: 5,
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContent: {
    width: width * 0.7,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  selectedCategoryItem: {
    backgroundColor: '#f9f9f9',
  },
  categoryMenuText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(68, 128, 127, 0.06)', 
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  categoryIcon: {
    textAlign: 'center',
    color:'rgba(0, 0, 0, 0.84)',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'rgb(250, 250, 250)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    paddingBottom: Platform.select({
      ios: 20,
      android: 35,
    })
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(2, 185, 209)',
  },
  cartButtonSummary: {
    backgroundColor: '#0FC2C0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    elevation: 3,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default Dashboard;