import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Pressable, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Adicione esta importação para fazer requisições HTTP
import { API_URL } from '@env';

export default function SignInScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleSignUp = async () => {
    if (name === '' || email === '' || password === '' || mobile === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Envia os dados para o backend
      const response = await axios.post(`${API_URL}/api/auth/users`, {
        name,
        email,
        password,
        mobile,
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login'); // Volta para a tela de Login após o cadastro
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
    }
  };
    // ... (dentro do componente SignInScreen, após seus outros handlers)

  const showTermsAndConditions = () => {
    setModalTitle('Termos e Condições');
    setModalContent(`
      TERMOS E CONDIÇÕES DE USO

      Última atualização: 12 de Junho de 2025

      Bem-vindo(a) ao MobiFood! Ao acessar ou usar nosso aplicativo, você concorda em cumprir e estar vinculado(a) aos seguintes termos e condições de uso. Por favor, leia-os atentamente.

      1. Aceitação dos Termos
      Ao se registrar, navegar ou usar o aplicativo, você reconhece que leu, entendeu e concorda em estar vinculado(a) a estes Termos de Uso, bem como à nossa Política de Privacidade. Se você não concorda com qualquer parte destes termos, não deve usar nosso aplicativo.

      2. Elegibilidade
      Você deve ter pelo menos 18 anos de idade para usar este aplicativo e seus serviços. Ao usar o aplicativo, você declara e garante que tem pelo menos 18 anos de idade e que tem o direito, autoridade e capacidade de celebrar este acordo.

      3. Sua Conta
      Você é responsável por manter a confidencialidade de sua conta e senha e por restringir o acesso ao seu dispositivo, e você concorda em aceitar a responsabilidade por todas as atividades que ocorram sob sua conta ou senha. Notifique-nos imediatamente sobre qualquer uso não autorizado de sua conta.

      4. Conteúdo do Usuário
      Você é o único responsável por qualquer conteúdo, dados, texto, informações, nomes de usuário, gráficos, imagens, fotografias, perfis, clipes de áudio e vídeo, itens e links que você enviar, publicar ou exibir no aplicativo.

      5. Conduta Proibida
      Você concorda em não:
      a) Usar o aplicativo para qualquer finalidade ilegal ou não autorizada.
      b) Violar quaisquer leis em sua jurisdição (incluindo, mas não se limitando a, leis de direitos autorais).
      c) Publicar ou transmitir conteúdo que seja ofensivo, difamatório, obsceno, pornográfico, abusivo, ameaçador ou de qualquer forma questionável.
      d) Interferir ou interromper os serviços ou servidores ou redes conectados aos serviços.
      e) Tentar obter acesso não autorizado a qualquer parte do aplicativo.

      6. Pedidos e Transações
      Ao fazer um pedido através do aplicativo, você concorda em pagar por todos os itens que solicitar. Nós não somos responsáveis por quaisquer disputas entre você e os restaurantes/estabelecimentos parceiros, embora nos esforcemos para mediar e resolver problemas quando possível.

      7. Propriedade Intelectual
      Todo o conteúdo presente no aplicativo, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio e vídeo, compilações de dados e software, é de propriedade de [Nome da sua Empresa/Desenvolvedor] ou de seus fornecedores de conteúdo e protegido pelas leis de direitos autorais.

      8. Rescisão
      Podemos encerrar ou suspender seu acesso ao nosso aplicativo imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os Termos.

      9. Limitação de Responsabilidade
      Em nenhuma circunstância os desenvolvedores serão responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou exemplares, incluindo, mas não se limitando a, danos por perda de lucros, boa vontade, uso, dados ou outras perdas intangíveis.

      10. Alterações nos Termos
      Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer pelo menos 30 dias de aviso prévio antes que quaisquer novos termos entrem em vigor.

      11. Lei Aplicável
      Estes Termos serão regidos e interpretados de acordo com as leis Brasileiras sem levar em consideração seus conflitos de disposições legais.

      Ao usar nosso aplicativo, você confirma sua aceitação destes Termos e Condições.

      Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em @202302367011@alunos.facimp.edu.br.
    `);
    setModalVisible(true);
  };

  const showPrivacyPolicy = () => {
    setModalTitle('Política de Privacidade');
    setModalContent(`
      POLÍTICA DE PRIVACIDADE

      Última atualização: 12 de Junho de 2025

      Esta Política de Privacidade descreve como MobiFood coleta, usa e compartilha suas informações pessoais quando você usa nosso aplicativo.

      1. Informações que Coletamos
      Coletamos informações que você nos fornece diretamente, como:
      - Dados de registro: Nome, email, senha, número de telefone.
      - Informações de perfil: Imagens de perfil.
      - Informações de pedidos: Detalhes dos pedidos, histórico de compras.
      - Informações de pagamento(Ainda não implementado): Dados de pagamento (processados por terceiros seguros, não armazenamos dados completos de cartão de crédito).

      Também coletamos automaticamente certas informações quando você usa o aplicativo, incluindo:
      - Dados de dispositivo: Tipo de dispositivo, sistema operacional, identificadores únicos.
      - Dados de uso: Páginas visitadas, recursos usados, tempo gasto no aplicativo.

      3. Como Usamos Suas Informações
      Usamos as informações coletadas para:
      - Fornecer, operar e manter nosso aplicativo.
      - Processar suas transações e gerenciar seus pedidos.
      - Personalizar sua experiência no aplicativo.
      - Enviar comunicações importantes, como atualizações de pedidos e notificações.
      - Melhorar nosso aplicativo e desenvolver novos recursos.
      - Realizar análises e pesquisas para entender como o aplicativo é usado.
      - Detectar e prevenir fraudes e outras atividades maliciosas.
      - Cumprir obrigações legais.

      4. Compartilhamento de Informações
      Podemos compartilhar suas informações com:
      - Parceiros de serviço: Fornecedores que nos ajudam a operar o aplicativo (processadores de pagamento, provedores de hospedagem).
      - Restaurantes/Estabelecimentos: Para processar seus pedidos.
      - Provedores de análise: Para entender o uso do aplicativo.
      - Autoridades legais: Quando exigido por lei ou para proteger nossos direitos.

      Não vendemos suas informações pessoais a terceiros.

      5. Segurança dos Dados
      Implementamos medidas de segurança razoáveis para proteger suas informações pessoais contra acesso, uso ou divulgação não autorizados. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.

      6. Seus Direitos
      Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você também pode ter o direito de restringir ou se opor ao processamento de seus dados. Para exercer esses direitos, entre em contato conosco.

      7. Alterações nesta Política
      Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página.

      8. Contato
      Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em 202302367011@alunos.facimp.edu.br.
    `);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Imagem no topo */}
      <Image
        source={require('./assets/ImageSingIn.png')} // Substitua pelo caminho correto da sua imagem
        style={styles.image}
      />

      {/* Título */}
      <Text style={styles.title}>Registrar</Text>

      {/* Campo Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Campo Nome */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Campo Mobile */}
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
      </View>

      {/* Campo Senha */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Termos e Condições */}
      <Text style={styles.termsText}>
        Ao se inscrever, você concorda com nossos{' '}
        <Text style={styles.linkText} onPress={showTermsAndConditions}>
          Termos e Condições
        </Text>{' '}
        e{' '}
        <Text style={styles.linkText} onPress={showPrivacyPolicy}>
          Políticas de Privacidade
        </Text>
        .
      </Text>

      {/* Botão Continuar */}
      <TouchableOpacity style={styles.continueButton} onPress={handleSignUp}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Link para Login */}
      <View style={styles.loginContainer}>
        <Text>Já tem cadastro? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalViewTitle}>{modalTitle}</Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Ionicons name="close-circle" size={30} color="#0FC2C0" />
              </Pressable>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalText}>{modalContent}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc', // Borda cinza clara
    borderRadius: 8, // Bordas arredondadas
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff', // Fundo branco
  },
  icon: {
    marginRight: 10,
    color: '#666', // Cor do ícone
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333', // Cor do texto digitado
    backgroundColor: 'transparent', // Fundo transparente
    borderWidth: 0, // Remove a borda interna
    fontFamily: 'Arial', // Fonte mais limpa
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  continueButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0FC2C0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  loginText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#0FC2C0', // Uma cor que combine com seu tema, ou a que você tinha antes
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Adiciona sublinhado para indicar que é clicável
  },

  // NOVOS ESTILOS PARA O MODAL
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro transparente
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15, // Raio da borda do modal
    padding: 20,
    width: '90%',
    maxHeight: '80%', // Altura máxima do modal para telas menores
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalViewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalScrollView: {
    maxHeight: '85%', // Altura máxima para o conteúdo rolante dentro do modal
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22, // Espaçamento entre as linhas para melhor leitura
    color: '#555',
  },
  modalCloseButton: {
    backgroundColor: '#0FC2C0', // Cor do seu botão
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    alignSelf: 'center',
    width: '100%',
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});