// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet, Alert, TextInput } from 'react-native';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

const HomeScreen = ({ navigation, route }) => {
  const { uid, email } = route.params; // Lấy uid và email từ params
  const [products, setProducts] = useState([]);
  //trạng thái lưu trữ từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  // Trạng thái lưu trữ danh sách sản phẩm đã được lọc theo từ khóa tìm kiếm.
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  //Sử dụng useEffect để lấy dữ liệu sản phẩm
  useEffect(() => {
    const productsRef = ref(getDatabase(), `products/${uid}`);
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productList = data ? Object.entries(data).map(([key, value]) => ({ key, ...value })) : [];
      setProducts(productList);
      setFilteredProducts(productList); // Set initial filtered products
    });

    // Hủy đăng ký lắng nghe khi component unmount
    return () => unsubscribe();
  }, [uid]);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleDeleteProduct = (productKey) => {
    const productRef = ref(getDatabase(), `products/${uid}/${productKey}`);
    remove(productRef)
      .then(() => Alert.alert('Xóa sản phẩm thành công'))
      .catch((error) => Alert.alert('Lỗi xóa sản phẩm', error.message));
  };

  const handleLogout = () => {
    // Gọi hàm đăng xuất
    if (route.params.onLogout) {
      route.params.onLogout();
    }
  };

  // Thiết lập nút điều hướng
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Đăng xuất" onPress={handleLogout} color="red" />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Chào mừng, {email}</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm sản phẩm theo tên"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>Tên sản phẩm: {item.name}</Text>
            <Text style={styles.productType}>Loại sản phẩm: {item.type}</Text>
            <Text style={styles.productPrice}>Giá: {item.price}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.productImage} />
            )}
            <View style={styles.buttonGroup}>
              <Button
                title="Sửa sản phẩm"
                onPress={() => navigation.navigate('EditProduct', { product: item, uid })} // Truyền uid
              />
              <Button
                title="Xóa sản phẩm"
                onPress={() => handleDeleteProduct(item.key)}
                color="red"
              />
            </View>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Thêm sản phẩm"
          onPress={() => navigation.navigate('AddProduct', { uid })} // Truyền uid
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  productContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  productType: {
    fontSize: 16,
    color: '#7f8c8d',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  productImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
});

export default HomeScreen;
