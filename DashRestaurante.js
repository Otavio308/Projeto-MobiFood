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
  StatusBar,
  Platform,
  Image,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const DashRestaurante = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dados de exemplo - substitua pela sua lógica de API
  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = () => {
    setRefreshing(true);
    // Simulando requisição à API
    setTimeout(() => {
      setPedidos([
        {
          id: '1',
          numero: '#123',
          data: new Date().toLocaleString('pt-BR'),
          items: [
            { id: 1, name: 'Pão Francês', price: 'R$ 0,50', quantity: 2 },
            { id: 2, name: 'Café Especial', price: 'R$ 5,00', quantity: 1 }
          ],
          status: 'Pedido recebido',
          statusColor: '#FFA500',
          paymentMethod: 'Pix'
        },
        {
          id: '2',
          numero: '#124',
          data: new Date(Date.now() - 3600000).toLocaleString('pt-BR'),
          items: [
            { id: 3, name: 'Bolo de Chocolate', price: 'R$ 15,00', quantity: 1 },
            { id: 4, name: 'Suco Natural', price: 'R$ 6,00', quantity: 2 }
          ],
          status: 'Em preparação',
          statusColor: '#4285F4',
          paymentMethod: 'Cartão'
        },
        {
          id: '3',
          numero: '#125',
          data: new Date(Date.now() - 7200000).toLocaleString('pt-BR'),
          items: [
            { id: 5, name: 'Pão de Queijo', price: 'R$ 1,00', quantity: 5 }
          ],
          status: 'Pronto para retirada',
          statusColor: '#0F9D58',
          paymentMethod: 'Dinheiro'
        }
      ]);
      setRefreshing(false);
    }, 1000);
  };

  const atualizarStatusPedido = (pedidoId, novoStatus) => {
    setPedidos(pedidos.map(pedido => {
      if (pedido.id === pedidoId) {
        let novoStatusColor = '#FFA500'; // Laranja - padrão
        
        if (novoStatus === 'Em preparação') {
          novoStatusColor = '#4285F4'; // Azul
        } else if (novoStatus === 'Pronto para retirada') {
          novoStatusColor = '#0F9D58'; // Verde
        } else if (novoStatus === 'Finalizado') {
          novoStatusColor = '#757575'; // Cinza
        }
        
        return {
          ...pedido,
          status: novoStatus,
          statusColor: novoStatusColor
        };
      }
      return pedido;
    }));
  };

  const calcularTotal = (items) => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.pedidoCard}
        onPress={() => navigation.navigate('DetalhesPedido', { pedido: item })}
      >
        <View style={styles.pedidoHeader}>
          <Text style={styles.pedidoNumero}>{item.numero}</Text>
          <Text style={styles.pedidoData}>{item.data}</Text>
        </View>
        
        <View style={styles.pedidoBody}>
          <Text style={styles.pedidoTotal}>R$ {calcularTotal(item.items).replace('.', ',')}</Text>
          <Text style={styles.paymentMethod}>Pagamento: {item.paymentMethod}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        {/* Botões de ação para o restaurante */}
        <View style={styles.actionsContainer}>
          {item.status === 'Pedido recebido' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => atualizarStatusPedido(item.id, 'Em preparação')}
            >
              <Icon name="play-arrow" size={20} color="#4285F4" />
            </TouchableOpacity>
          )}
          
          {item.status === 'Em preparação' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => atualizarStatusPedido(item.id, 'Pronto para retirada')}
            >
              <Icon name="check" size={20} color="#0F9D58" />
            </TouchableOpacity>
          )}
          
          {item.status === 'Pronto para retirada' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => atualizarStatusPedido(item.id, 'Finalizado')}
            >
              <Icon name="done-all" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const navigateToProfile = () => {
    setMenuVisible(false);
    navigation.navigate('Profile');
  };

  const navigateToSobre = () => {
    setMenuVisible(false);
    navigation.navigate('Sobre');
  };

  const navigateToGerenciarProdutos = () => {
    setMenuVisible(false);
    navigation.navigate('GerenciarProdutos');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pedidos..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Menu lateral */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu Restaurante</Text>
            </View>
            
            <TouchableOpacity
              style={styles.menuOption}
              onPress={navigateToProfile}
            >
              <Icon name="person" size={24} color="#333" />
              <Text style={styles.menuOptionText}>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={navigateToGerenciarProdutos}
            >
              <Icon name="inventory" size={24} color="#333" />
              <Text style={styles.menuOptionText}>Gerenciar Produtos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={navigateToSobre}
            >
              <Icon name="info" size={24} color="#333" />
              <Text style={styles.menuOptionText}>Sobre</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.menuOverlay} 
            onPress={() => setMenuVisible(false)}
            activeOpacity={1}
          />
        </View>
      </Modal>

      {/* Lista de pedidos */}
      <FlatList
        data={pedidos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={pedidos.length === 0 ? styles.emptyListContent : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={carregarPedidos}
            colors={['#0FC2C0']}
            tintColor="#0FC2C0"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="receipt" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum pedido recebido</Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={carregarPedidos}
            >
              <Icon name="refresh" size={24} color="#0FC2C0" />
              <Text style={styles.refreshText}>Recarregar</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(4, 245, 213, 0.51)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: StatusBar.currentHeight || 0,
  },
  menuButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgb(245, 245, 245)',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
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
    width: '70%',
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
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  listContent: {
    padding: 15,
  },
  emptyListContent: {
    flex: 1,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  pedidoHeader: {
    flex: 1,
  },
  pedidoNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pedidoData: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  pedidoBody: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  pedidoTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0FC2C0',
    marginBottom: 5,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#0FC2C0',
  },
  refreshText: {
    color: '#0FC2C0',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default DashRestaurante;