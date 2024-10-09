import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';

// lưu thông tin người dùng hiện tại
const Auth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return user;
};

export default Auth;
