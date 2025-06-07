import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const Sobre = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre o Aplicativo</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>Sobre o App</Text>
          <Text style={styles.text}>
            Aplicativo desenvolvido para modernizar o atendimento do refeitório da UNIFACIMP-Wyden,
            substituindo processos manuais por um sistema digital eficiente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Versão</Text>
          <Text style={styles.text}>1.0.0 (Alpha)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Desenvolvedores</Text>
          <Text style={styles.text}>
            • Otávio Carvalho Rocha{'\n'}
            • Pedro {'\n'}
            • João Vitor{'\n\n'}
            Projeto desenvolvido para matéria extensionista da faculdade.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Termos de Uso</Text>
          <Text style={styles.text}>
            Este aplicativo armazenará dados cadastrais como:{'\n'}
            - E-mail{'\n'}
            - Número de telefone{'\n'}
            - Foto de perfil (opcional){'\n\n'}
            Todos os dados são gerenciados exclusivamente pela equipe de desenvolvimento estudantil para fins acadêmicos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Contato</Text>
          <Text style={styles.text}>
            Dúvidas ou sugestões?{'\n'}
            Entre em contato com a equipe através dos canais acadêmicos.
          </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.select({
      ios: 0,
      android: 35,
    }),
    backgroundColor: 'rgba(4, 245, 213, 0.51)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0FC2C0',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default Sobre;