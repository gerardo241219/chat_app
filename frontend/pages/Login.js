import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';

import imgLogin from './../assets/usuario.png';
import { alertInfo } from './../alerts.js';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {

  const [sesion, setSesion] = useState([]);

  const [inputUser, setInputUser] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  useEffect(() => {
    setInputUser("");
    setInputPassword("");
  }, [])

  const storeData = async (usuario_id, sucural_id, usuario_nombre, usuario_correo, usuario_rol) => {
    await AsyncStorage.setItem('@sesion_usuario_id', usuario_id)
    await AsyncStorage.setItem('@sesion_sucursal_id', sucural_id)
    await AsyncStorage.setItem('@sesion_usuario_nombre', usuario_nombre)
    await AsyncStorage.setItem('@sesion_usuario_correo', usuario_correo)
    await AsyncStorage.setItem('@sesion_usuario_rol', usuario_rol)
  }

  const apiLogin = async (user, password) => {
    const url = `https://chatwa.gpoptima.info/api-login?user=${user}&password=${password}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.status) {
      storeData('9', '3', 'Gerardo Amel', 'gcastaneda@gpoptima.com', 'Asesor');
      navigation.navigate('Home');
    } else if (result.message === "error_sesion") {
      alertInfo('Error', 'El usuario o la contraseña son incorrectos' + password);
    } else {
      alertInfo('Error', 'Error inesperado, volver a intentarlo');
    }
  }

  const btnLogin = () => {
    if (inputUser != "" && inputPassword != "") {
      apiLogin(inputUser, inputPassword);
    } else {
      alertInfo('Error', 'Todos los campos son obligatorios');
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={imgLogin}
        style={styles.imgLogin}
      />

      <Text
        style={styles.titleLogin}>
        Inicio de Sesión
      </Text>

      <TextInput
        style={styles.inputLogin}
        placeholder="Usuario"
        value={inputUser}
        onChangeText={e => setInputUser(e)}
      />

      <TextInput
        style={styles.inputLogin}
        placeholder="Contraseña"
        value={inputPassword}
        secureTextEntry={true}
        onChangeText={e => setInputPassword(e)}
      />

      <TouchableOpacity
        style={styles.btnLogin}
        onPress={btnLogin}>
        <Text
          style={styles.textButton}>
          Entrar
        </Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imgLogin: {
    width: 100,
    height: 100,
    marginBottom: 30,
    marginTop: 100
  },
  titleLogin: {
    fontSize: 25,
    color: '#64748b',
    marginBottom: 20
  },
  inputLogin: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: '#64748b',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  btnLogin: {
    width: 200,
    marginTop: 50,
    backgroundColor: "#f4511e",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 5
  },
  textButton: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15
  }
});
