import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, push, set } from 'firebase/database';
import { auth } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker'; // Import Picker

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Đồ ăn'); // Mặc định là 'Đồ ăn'
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
//Sử dụng push để tạo một khóa mới cho sản phẩm và sau đó sử dụng set để lưu thông tin sản phẩm.
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
      setType('Đồ ăn');
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
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Đồ ăn" value="Đồ ăn" />
        <Picker.Item label="Nước uống" value="Nước uống" />
      </Picker>
      <Text style={styles.label}>Giá:</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
        <Text style={styles.buttonText}>Chọn hình ảnh</Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      )}
      <TouchableOpacity style={styles.submitButton} onPress={handleAddProduct}>
        <Text style={styles.submitButtonText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
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
    shadowColor: '#000', // Tạo bóng mờ
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, // Bóng mờ nổi trên Android
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000', // Tạo bóng mờ
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, // Bóng mờ nổi trên Android
  },
  button: {
    backgroundColor: '#007BFF', // Màu nền cho nút chọn hình ảnh
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000', // Tạo bóng mờ
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, // Bóng mờ nổi trên Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745', // Màu nền cho nút thêm sản phẩm
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000', // Tạo bóng mờ
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, // Bóng mờ nổi trên Android
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddProductScreen;
