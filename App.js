import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, ImageBackground, Image } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';

export default function App() {
  useKeepAwake(); // remove later
  const [emailText, onChangeEmail] = React.useState("");
  const [passwordText, onChangePassword] = React.useState("");
  return (
    <View>
      <ImageBackground
        source={require('./assets/images/login-background.gif')}
        resizeMode="cover"
        style={styles.background}
      >
        <Image
          source={require('./assets/images/logo.png')}
          style={styles.logo}
          resizeMode='contain'
        ></Image>
        <View style={styles.inputsWrapper}>
          <Text style={styles.loginHeader}>Login</Text>
          <TextInput
            secureTextEntry={false}
            onChangeText={onChangeEmail}
            value={emailText}
            style={{...styles.input, marginBottom: 20}}
          />
          <TextInput
            secureTextEntry={true}
            onChangeText={onChangePassword}
            value={passwordText}
            style={styles.input}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  inputsWrapper: {
    color: 'white',
    width: '70%',
    margin: 'auto'
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderColor: 'lightgray',
    color: 'white',
    fontSize: 18,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    fontFamily: 'AvenirNext-Medium',
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    position: 'absolute',
    left: '8%',
    top: '17%',
    width: '50%',
    height: '7%'
  },
  loginHeader: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    fontFamily: 'AvenirNext-Bold',
    marginBottom: 20
  }
});
