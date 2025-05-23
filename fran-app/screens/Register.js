import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.10/fran-new/api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', result.message, [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Registration Failed', result.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Register to start ordering</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#333333', // Dark gray text
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff', // White input background
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000000', // Black border
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000000', // Black button background
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#333333', // Dark gray text
  },
  link: {
    color: '#000000', // Black link
    fontWeight: 'bold',
  },
});

export default Register;