// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC5jdIXnKyIkRu82oqp88Q4ojztyR7lNJE",
  authDomain: "project-giuaky-reactnative.firebaseapp.com",
  databaseURL: "https://project-giuaky-reactnative-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "project-giuaky-reactnative",
  storageBucket: "project-giuaky-reactnative.appspot.com",
  messagingSenderId: "378374382797",
  appId: "1:378374382797:web:cbfa1ba107105d96933584",
  measurementId: "G-LJLRKNMV24"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Auth với AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const database = getDatabase(app);

export { auth, database };
