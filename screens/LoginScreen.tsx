import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import NeonButton from '../components/NeonButton';

// Mock de la fonction de connexion
const mockLogin = (email: string, password: string) => {
  // Ici, tu pourras remplacer par un appel API plus tard
  return email === 'test@haaze.com' && password === 'azerty';
};

const LoginScreen = ({ navigation, onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (mockLogin(email, password)) {
      setError('');
      if (onLogin) onLogin();
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#6EE7FF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#6EE7FF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <NeonButton color="blue" onPress={handleLogin} style={{width: '100%', marginTop: 16}}>
        Se connecter
      </NeonButton>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    color: '#3300FD',
    fontWeight: 'bold',
    marginBottom: 32,
    letterSpacing: 2,
    fontFamily: 'Minasans',
    // Aucun effet de néon
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#18181B',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#fff',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3300FD',
    fontSize: 16,
    fontFamily: 'Helvetica',
    shadowColor: '#3300FD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3300FD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#3300FD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: 'Minasans',
    textShadowColor: '#6EE7FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  error: {
    color: '#FF3600',
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    textShadowColor: '#FF3600',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});

export default LoginScreen;
