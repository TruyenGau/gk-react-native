// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Button, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './src/firebaseConfig';
import HomeScreen from './src/screens/HomeScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import EditProductScreen from './src/screens/EditProductScreen'; // Import màn hình EditProduct
import SignIn from './src/components/SignIn';
import SignUp from './src/components/SignUp';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      Alert.alert('Đăng xuất thành công!');
    } catch (error) {
      Alert.alert('Lỗi đăng xuất', error.message);
    }
  };

  const handleSignIn = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleSignUp = (loggedInUser) => {
    setUser(loggedInUser);
    setShowSignUp(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              initialParams={{ uid: user.uid, email: user.email, onLogout: handleLogout }} // Truyền uid, email và onLogout
            />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} />
          </>
        ) : showSignUp ? (
          <Stack.Screen name="SignUp">
            {props => <SignUp {...props} onSignUp={handleSignUp} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="SignIn">
            {props => <SignIn {...props} onSignIn={handleSignIn} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
      {!user && (
        <View style={{ padding: 20 }}>
          <Button
            title={showSignUp ? 'Quay lại đăng nhập' : 'Chuyển đến tạo tài khoản'}
            onPress={() => setShowSignUp(!showSignUp)}
          />
        </View>
      )}
    </NavigationContainer>
  );
};

export default App;
