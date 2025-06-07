import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Pedidos = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [pedidos, setPedidos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Adicionar novo pedido se vier da tela de Carrinho
  useEffect(() => {
    if (route.params?.newOrder) {
      setPedidos(prev => [route.params.newOrder, ...prev]);
      
      // Configurar botão de voltar para ir ao Dashboard
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => {
            route.params?.onGoBack?.();
          }}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )
      });
    }
  }, [route.params]);

  const renderItem = ({ item }) => {
    const total = item.items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
      return sum + (price * item.quantity);
    }, 0).toFixed(2);
    
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
          <Text style={styles.pedidoTotal}>R$ {total.replace('.', ',')}</Text>
          <Text style={styles.paymentMethod}>Pagamento: {item.paymentMethod}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <Icon name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Meus Pedidos</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={pedidos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={pedidos.length === 0 ? styles.emptyListContent : styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="receipt" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 15,
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
});

export default Pedidos;