// src/components/AddProductScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, push, set } from 'firebase/database';
import { auth } from '../firebaseConfig';

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Quyền truy cập thư viện ảnh bị từ chối');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !type || !price || !image) {
      Alert.alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
      return;
    }

    const uid = auth.currentUser.uid;
    const productRef = ref(getDatabase(), `products/${uid}`);
    const newProductRef = push(productRef);

    try {
      await set(newProductRef, {
        name,
        type,
        price,
        image,
      });
      Alert.alert('Thêm sản phẩm thành công!');
      setName('');
      setType('');
      setPrice('');
      setImage(null);
      navigation.navigate('Home');  // Điều hướng trở lại màn hình chính
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên sản phẩm:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Text style={styles.label}>Loại sản phẩm:</Text>
      <TextInput
        value={type}
        onChangeText={setType}
        style={styles.input}
      />
      <Text style={styles.label}>Giá:</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Chọn hình ảnh" onPress={handleSelectImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      )}
      <Button title="Thêm sản phẩm" onPress={handleAddProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    
  },
});

export default AddProductScreen;
