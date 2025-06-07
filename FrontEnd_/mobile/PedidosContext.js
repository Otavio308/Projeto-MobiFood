import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PedidosContext = createContext();

export const PedidosProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);

  // Carregar pedidos salvos ao iniciar
  useEffect(() => {
    const loadPedidos = async () => {
      try {
        const savedPedidos = await AsyncStorage.getItem('@pedidos');
        if (savedPedidos) {
          setPedidos(JSON.parse(savedPedidos));
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      }
    };
    loadPedidos();
  }, []);

  // Salvar pedidos sempre que houver mudança
  useEffect(() => {
    const savePedidos = async () => {
      try {
        await AsyncStorage.setItem('@pedidos', JSON.stringify(pedidos));
      } catch (error) {
        console.error('Erro ao salvar pedidos:', error);
      }
    };
    savePedidos();
  }, [pedidos]);

  const addPedido = (novoPedido) => {
    setPedidos(prev => [novoPedido, ...prev]);
  };

  return (
    <PedidosContext.Provider value={{ pedidos, addPedido }}>
      {children}
    </PedidosContext.Provider>
  );
};