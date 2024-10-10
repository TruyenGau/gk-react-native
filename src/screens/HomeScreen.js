import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons'; // Import icon

const HomeScreen = ({ navigation, route }) => {
  const { uid, email } = route.params;
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); //Chuỗi tìm kiếm để lọc sản phẩm.
  const [filteredProducts, setFilteredProducts] = useState([]); //anh sách sản phẩm sau khi lọc dựa trên searchQuery

  useEffect(() => {
    const productsRef = ref(getDatabase(), `products/${uid}`);
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productList = data ? Object.entries(data).map(([key, value]) => ({ key, ...value })) : [];
      setProducts(productList);
      setFilteredProducts(productList); // Set initial filtered products
    });

    return () => unsubscribe();
  }, [uid]);

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
    if (route.params.onLogout) {
      route.params.onLogout();
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Đăng xuất" onPress={handleLogout} color="red"/>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Chào mừng {email}</Text>
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
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProduct', { product: item, uid })}
              >
                <Ionicons name="pencil-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteProduct(item.key)}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct', { uid })}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9f1f7',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e90ff',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#1e90ff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  productContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
    borderRadius: 12,
    resizeMode: 'cover',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default HomeScreen;
