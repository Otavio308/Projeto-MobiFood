import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const DetalhesPedido = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { pedido } = params;

  // Função para formatar a data
  const formatarData = (dataString) => {
    return dataString || 'Data não disponível';
  };

  // Função para calcular o total
  const calcularTotal = (items) => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pedido {pedido.numero}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status do Pedido */}
        <View style={[styles.statusContainer, { backgroundColor: pedido.statusColor }]}>
          <Text style={styles.statusText}>{pedido.status}</Text>
        </View>

        {/* Informações do Pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Pedido</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número:</Text>
            <Text style={styles.infoValue}>{pedido.numero}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data:</Text>
            <Text style={styles.infoValue}>{formatarData(pedido.data)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pagamento:</Text>
            <Text style={styles.infoValue}>{pedido.paymentMethod}</Text>
          </View>
        </View>

        {/* Itens do Pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens</Text>
          {pedido.items.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.itemContainer}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  {item.quantity} x {item.price} = R$ {(parseFloat(item.price.replace('R$ ', '').replace(',', '.')) * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Resumo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Itens:</Text>
            <Text style={styles.infoValue}>{pedido.items.reduce((sum, item) => sum + item.quantity, 0)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor Total:</Text>
            <Text style={[styles.infoValue, styles.totalValue]}>
              R$ {calcularTotal(pedido.items).replace('.', ',')}
            </Text>
          </View>
        </View>

        {/* Ações */}
        {pedido.status === 'Pedido realizado' && (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
    backgroundColor: 'rgba(4, 245, 213, 0.51)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: StatusBar.currentHeight || 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0FC2C0',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DetalhesPedido;