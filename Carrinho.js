import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';


const generateOrderNumber = () => `#${Math.floor(Math.random() * 900) + 100}`;

const CATEGORY_ICONS = {
  Salgados: 'local-pizza',
  Doces: 'cake',
  Bebidas: 'local-drink',
  Padaria: 'bakery-dining',
};

const PRODUCTS_WITH_STOCK = [
  { id: 1, name: 'Pão Francês', price: 'R$ 0,50', category: 'Salgados', stock: 30 },
  { id: 2, name: 'Bolo de Chocolate', price: 'R$ 15,00', category: 'Doces', stock: 7 },
  { id: 3, name: 'Croissant', price: 'R$ 4,50', category: 'Salgados', stock: 18 },
  { id: 4, name: 'Torta de Frango', price: 'R$ 8,00', category: 'Salgados', stock: 13 },
  { id: 5, name: 'Café Especial', price: 'R$ 5,00', category: 'Bebidas', stock: 30 },
  { id: 6, name: 'Sonho', price: 'R$ 3,50', category: 'Doces', stock: 6 },
  { id: 7, name: 'Pão de Queijo', price: 'R$ 1,00', category: 'Salgados', stock: 20 },
  { id: 8, name: 'Biscoito Caseiro', price: 'R$ 2,50', category: 'Doces', stock: 16 },
  { id: 9, name: 'Suco Natural', price: 'R$ 6,00', category: 'Bebidas', stock: 8 },
  { id: 10, name: 'Empada', price: 'R$ 3,00', category: 'Salgados', stock: 12 },
];

const CartScreen = ({ route }) => {
  const { cartItems: initialCartItems, setCartItems } = route.params;
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cartItems, setLocalCartItems] = useState(initialCartItems);

  const getCategoryIcon = (category) => CATEGORY_ICONS[category] || 'fastfood';

  useEffect(() => {
    checkStock();
  }, []);

  useEffect(() => {
    return () => {
      if (setCartItems) {
        setCartItems(cartItems);
      }
    };
  }, [cartItems]);

  const checkStock = () => {
    const updatedItems = [];
    const outOfStock = [];
    
    cartItems.forEach(item => {
      const productInStock = PRODUCTS_WITH_STOCK.find(p => p.id === item.id);
      
      if (!productInStock || productInStock.stock <= 0) {
        outOfStock.push(item);
        return;
      }
      
      const quantity = Math.min(item.quantity, productInStock.stock);
      if (quantity < item.quantity) {
        outOfStock.push({...item, requested: item.quantity, available: quantity});
      }
      
      updatedItems.push({
        ...item,
        quantity: quantity
      });
    });
    
    if (outOfStock.length > 0) {
      showOutOfStockAlert(outOfStock);
      setLocalCartItems(updatedItems);
      setOutOfStockItems(outOfStock);
    }
  };

  const showOutOfStockAlert = (items) => {
    const message = items.map(item => {
      if (!item.requested) {
        return `• ${item.name} - ESGOTADO`;
      }
      return `• ${item.name} - Pedido: ${item.requested}, Disponível: ${item.available}`;
    }).join('\n');
    
    Alert.alert(
      'Atenção - Estoque Insuficiente',
      `Alguns itens do seu carrinho não estão mais disponíveis na quantidade desejada:\n\n${message}\n\nPedimos desculpas pelo inconveniente.`,
      [{ text: 'Entendi' }]
    );
  };

  const addToCart = (product) => {
    const productInStock = PRODUCTS_WITH_STOCK.find(p => p.id === product.id);
    
    if (!productInStock || productInStock.stock <= 0) {
      Alert.alert('Estoque Insuficiente', 'Este produto está esgotado.');
      return;
    }
    
    const cartItem = cartItems.find(item => item.id === product.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    
    if (currentQuantity >= productInStock.stock) {
      Alert.alert(
        'Estoque Insuficiente',
        `Desculpe, não há mais ${product.name} disponível em estoque.`
      );
      return;
    }

    setLocalCartItems(prevItems => {
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
    setLocalCartItems(prevItems => {
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

  const deleteFromCart = (productId) => {
    setLocalCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
    return sum + (price * (item.quantity || 1));
  }, 0);

  const handleFinalizePurchase = () => {
    if (!selectedPayment) {
      Alert.alert('Atenção', 'Selecione uma forma de pagamento');
      return;
    }

    const hasOutOfStock = cartItems.some(item => {
      const productInStock = PRODUCTS_WITH_STOCK.find(p => p.id === item.id);
      return !productInStock || productInStock.stock < item.quantity;
    });

    if (hasOutOfStock) {
      checkStock();
      Alert.alert(
        'Estoque Atualizado',
        'Alguns itens do seu carrinho não estão mais disponíveis na quantidade desejada. Por favor, revise seu pedido.'
      );
      return;
    }

     // Criar novo pedido
  const newOrder = {
    id: Date.now().toString(),
    numero: generateOrderNumber(),
    data: new Date().toLocaleString('pt-BR'),
    items: [...cartItems], // Fazemos uma cópia dos itens do carrinho
    total: totalPrice.toFixed(2),
    status: 'Pedido realizado',
    statusColor: '#FFA500',
    paymentMethod: selectedPayment === 'dinheiro' ? 'Dinheiro' : 
                  selectedPayment === 'pix' ? 'Pix' : 'Cartão'
  };

  // Navegar para Pedidos passando o novo pedido e a função para atualizar a lista
  navigation.navigate('Pedidos', { 
    newOrder,
    onOrderAdded: (updatedOrders) => {
      // Esta função será chamada pela tela de Pedidos
      if (setCartItems) {
        setCartItems([]); // Limpa o carrinho
      }
    }
  });
};

  const paymentOptions = [
    { id: 'dinheiro', icon: 'attach-money', text: 'Em dinheiro' },
    { id: 'pix', icon: 'qr-code', text: 'Pix' },
    { id: 'cartao', icon: 'credit-card', text: 'Cartão de Débito/Crédito' }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrinho</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Lista de itens */}
      <ScrollView 
        style={styles.itemsContainer}
        contentContainerStyle={{ 
          paddingBottom: Platform.select({
            ios: 340,
            android: 380
          })
        }}
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="remove-shopping-cart" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
            <TouchableOpacity 
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => {
            const productInStock = PRODUCTS_WITH_STOCK.find(p => p.id === item.id);
            const isOutOfStock = !productInStock || productInStock.stock <= 0;
            const isLimitedStock = productInStock && item.quantity >= productInStock.stock;

            return (
              <View key={item.id} style={[
                styles.itemContainer,
                isOutOfStock && styles.outOfStockItem
              ]}>
                <View style={styles.iconContainer}>
                  <Icon 
                    name={getCategoryIcon(item.category)} 
                    size={30} 
                    style={[
                      styles.categoryIcon,
                      isOutOfStock && styles.outOfStockIcon
                    ]} 
                  />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[
                    styles.itemName,
                    isOutOfStock && styles.outOfStockText
                  ]}>
                    {item.name}
                  </Text>
                  {isOutOfStock && (
                    <Text style={styles.stockAlert}>ESGOTADO</Text>
                  )}
                  <Text style={[
                    styles.itemPrice,
                    isOutOfStock && styles.outOfStockText
                  ]}>
                    {item.price}
                  </Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => removeFromCart(item)}
                      disabled={isOutOfStock}
                    >
                      <Icon 
                        name="remove" 
                        size={20} 
                        color={isOutOfStock ? "#ccc" : "#0FC2C0"} 
                      />
                    </TouchableOpacity>
                    <Text style={[
                      styles.quantityText,
                      isOutOfStock && styles.outOfStockText
                    ]}>
                      {item.quantity || 1}
                    </Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => addToCart(item)}
                      disabled={isOutOfStock || isLimitedStock}
                    >
                      <Icon 
                        name="add" 
                        size={20} 
                        color={isOutOfStock || isLimitedStock ? "#ccc" : "#0FC2C0"} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteFromCart(item.id)}
                >
                  <Icon name="delete" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Container de pagamento */}
      {cartItems.length > 0 && (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff' }}>
          <View style={styles.paymentFooter}>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>VALOR TOTAL:</Text>
              <Text style={styles.summaryPrice}>
                R$ {totalPrice.toFixed(2).replace('.', ',')} • {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.paymentTitle}>Forma de pagamento</Text>
            {paymentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.paymentOption}
                onPress={() => setSelectedPayment(option.id)}
              >
                <Icon 
                  name={option.icon} 
                  size={22} 
                  color="#555" 
                  style={styles.paymentIcon} 
                />
                <Text style={styles.paymentText}>{option.text}</Text>
                <View style={styles.checkboxContainer(selectedPayment === option.id)}>
                  {selectedPayment === option.id && (
                    <Icon name="check" size={16} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.finalizeButton}
              onPress={handleFinalizePurchase}
            >
              <Text style={styles.finalizeText}>Finalizar Compra</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: 'rgba(4, 245, 213, 0.51)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 100,
  },
  continueShoppingButton: {
    backgroundColor: '#0FC2C0',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  continueShoppingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outOfStockItem: {
    backgroundColor: 'rgba(245, 245, 245, 0.7)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(68, 128, 127, 0.06)',
  },
  categoryIcon: {
    color: 'rgba(0, 0, 0, 0.84)',
  },
  outOfStockIcon: {
    color: '#ccc',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  outOfStockText: {
    color: '#ccc',
  },
  stockAlert: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#0FC2C0',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0FC2C0',
    borderRadius: 15,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
    paddingTop: 28,
    marginLeft: 10,
  },
  paymentFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: Platform.select({
      ios: 20,
      android: 35,}),
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0FC2C0',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: (isSelected) => ({
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0FC2C0',
    backgroundColor: isSelected ? '#0FC2C0' : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  finalizeButton: {
    backgroundColor: '#0FC2C0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  finalizeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;