// src/screens/EditProductScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { getDatabase, ref, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker'; // Sử dụng expo-image-picker

const EditProductScreen = ({ route, navigation }) => {
  const { product, uid } = route.params; // Nhận uid từ params
  const [name, setName] = useState(product.name);
  const [type, setType] = useState(product.type);
  const [price, setPrice] = useState(product.price);
  const [imageUri, setImageUri] = useState(product.image); // Thêm trạng thái cho ảnh

  const handleEditProduct = async () => {
    if (!name || !type || !price || !imageUri) {
      Alert.alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
      return;
    }

    const updates = {
      name,
      type,
      price,
      image: imageUri, // Cập nhật đường dẫn ảnh
    };

    const productRef = ref(getDatabase(), `products/${uid}/${product.key}`); // Sử dụng uid
    try {
      await update(productRef, updates);
      Alert.alert('Sửa sản phẩm thành công');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi sửa sản phẩm', error.message);
    }
  };

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
      setImageUri(pickerResult.assets[0].uri); // Lưu URI của ảnh vào trạng thái
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Loại sản phẩm"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Chọn ảnh sản phẩm" onPress={handleSelectImage} />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : null}
      <Button title="Lưu thay đổi" onPress={handleEditProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default EditProductScreen;
