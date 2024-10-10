import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { getDatabase, ref, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker'; // Sử dụng expo-image-picker
import { Picker } from '@react-native-picker/picker'; // Import Picker

const EditProductScreen = ({ route, navigation }) => {
  const { product, uid } = route.params; // Nhận uid từ params
  const [name, setName] = useState(product.name);
  const [type, setType] = useState(product.type); // Loại sản phẩm
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
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Đồ ăn" value="Đồ ăn" />
        <Picker.Item label="Nước uống" value="Nước uống" />
      </Picker>
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
    backgroundColor: '#f7f8fa', 
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d1d1', 
    padding: 12,
    marginBottom: 20,
    borderRadius: 10, 
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff', 
    borderColor: '#d1d1d1', 
    borderWidth: 1,
    borderRadius: 10, 
    paddingHorizontal: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
  },
  image: {
    width: '100%', 
    height: 200, 
    marginVertical: 10,
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
  },
});

export default EditProductScreen;
