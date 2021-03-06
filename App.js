import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, ImageBackground, Image } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import Button from './components/Button'
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

let socket = null;

function Login({navigation}) {
  useKeepAwake();
  const [emailText, onChangeEmail] = React.useState("");
  const [passwordText, onChangePassword] = React.useState("");

  const signIn = async () => {
    const url = 'https://rainoapp.herokuapp.com/login'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailText,
        password: passwordText
      })
    });
    const json = await res.json();
    if (!json.success) {
      return alert(json.msg);
    }
    await AsyncStorage.setItem('@token', json.token);
    await AsyncStorage.setItem('@tokenSelector', json.selector);
    socket = io('https://rainoapp.herokuapp.com')
    socket.on('connected', () => {
      socket.emit('authenticate', {
        selector: json.selector,
        token: json.token
      });
    });
    socket.on('authenticated', async () => {
      navigation.replace('Chat')
      socket.on('message', data => {
        alert('message: ' + data.message);
        setMessages([...messages, data])
      });
    
      socket.on('channel messages', data => {
        setMessages(data.messages)
      });
    });
    socket.on('auth denied', () => {
      alert('Could not sign in! Try again');
    });
  }

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
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="lightgray"
          />
          <TextInput
            secureTextEntry={true}
            onChangeText={onChangePassword}
            value={passwordText}
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="lightgray"
          />
          <Button title='Continue' onPress={signIn} btnStyle={styles.continueBtn} textStyle={styles.continueText} />
        </View>
      </ImageBackground>
    </View>
  );
}

let messages, setMessages;

function Chat() {
  const [messagesXD, setMessagesXD] = React.useState([])
  messages = messagesXD;
  setMessages = setMessagesXD;
  useKeepAwake();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Chat screen</Text>
      {
        messages.map(m => <Text key={m.dbID}>{m.message}</Text>)
      }
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const options = { headerShown: false };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={options} />
        <Stack.Screen name="Chat" component={Chat} options={options} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  inputsWrapper: {
    width: '70%',
    alignItems: 'center',
    marginTop: 100
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
    marginBottom: 20
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
    marginBottom: 20,
    alignSelf: 'flex-start'
  },
  continueBtn: {
    backgroundColor: 'white',
    color: 'black',
    width: 150,
    marginTop: 20,
    paddingVertical: 5,
    borderRadius: 20
  },
  continueText: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Bold',
  }
});
