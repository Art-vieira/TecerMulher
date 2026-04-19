import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase.config';

export default function AddMaterialScreen() {
  const router = useRouter();

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [altImage, setAltImage] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Função para abrir a galeria
  const pickImage = async () => {
    // Pedir permissão
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'É preciso permitir o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Função principal para salvar o material
  const handleSave = async () => {
    if (!titulo.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o título e a descrição.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // 1. Fazer o upload da imagem se houver uma selecionada
      if (imageUri) {
        // Converter URI para Blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Criar referência no Storage
        const filename = `materiais/${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
        const storageRef = ref(storage, filename);

        // Upload
        const uploadTask = await uploadBytesResumable(storageRef, blob);
        
        // Pegar URL pública
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      // 2. Salvar os dados no Firestore
      // A estrutura de blocos será útil para a leitura do Expo Speech depois
      const novoMaterial = {
        title: titulo.trim(),
        description: descricao.trim(),
        imageUrl: imageUrl, // pode ser nulo se não houver imagem
        imageAlt: altImage.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'materiais'), novoMaterial);

      Alert.alert('Sucesso', 'Material adicionado com sucesso!');
      router.back();

    } catch (error: any) {
      console.error("Erro ao salvar material:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o material. Verifique sua conexão.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#391A65' }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Cabeçalho */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginLeft: 8 }}>
            Cancelar
          </Text>
        </TouchableOpacity>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 'auto', marginRight: 'auto' }}>
          Novo Material
        </Text>
        <View style={{ width: 60 }} /> {/* Espaçador para balancear flex */}
      </View>

      {/* Formulário Branco */}
      <View style={{ flex: 1, backgroundColor: '#E8E5ED', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Input Título */}
          <Text style={{ color: '#2D1B50', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Título da Aula</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: Módulo 1 - O que é Cidadania?"
            style={{ backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#C5BFD0' }}
          />

          {/* Input Descrição */}
          <Text style={{ color: '#2D1B50', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Conteúdo / Descrição</Text>
          <TextInput
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Digite o texto explicativo da aula aqui..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={{ backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#C5BFD0', minHeight: 120 }}
          />

          {/* Upload de Imagem */}
          <Text style={{ color: '#2D1B50', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Imagem Ilustrativa (Opcional)</Text>
          <TouchableOpacity 
            onPress={pickImage}
            activeOpacity={0.8}
            style={{ backgroundColor: '#FFFFFF', borderRadius: 10, height: 160, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#CF96D5', borderStyle: 'dashed', marginBottom: 12, overflow: 'hidden' }}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="image-outline" size={40} color="#CF96D5" />
                <Text style={{ color: '#7A6E8A', marginTop: 8 }}>Toque para escolher da galeria</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Input Texto Alternativo da Imagem */}
          <Text style={{ color: '#2D1B50', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Descrição da Imagem (Acessibilidade)</Text>
          <TextInput
            value={altImage}
            onChangeText={setAltImage}
            placeholder="Ex: Foto de uma mulher tecendo..."
            style={{ backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, fontSize: 14, marginBottom: 30, borderWidth: 1, borderColor: '#C5BFD0' }}
          />

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
            style={{ backgroundColor: '#391A65', borderRadius: 12, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>SALVAR MATERIAL</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
