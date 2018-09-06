import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Linking,
  AsyncStorage,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import styles from './Styles';
import Signup from './Signup';
import MainScreen from './MainScreen';
import Logo from './Logo';
import { connect } from 'react-redux';

import { StackNavigator } from 'react-navigation';

// import SafariView from 'react-native-safari-view';
// import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
// import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

import Icon from 'react-native-vector-icons/FontAwesome';


const url = 'https://c56f787d.ngrok.io'


class Login extends React.Component {

  static navigationOptions = {
    title: "Shareliving",
    headerStyle: {
      backgroundColor: '#fff'
    }
    // header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      user: undefined,
      signup: false,
      emailLogin: false,
      userInfo: {},
      loading: false
    }
  }

  componentDidMount() {
    this.setState({
      loading: true,
      email: '',
      password: ''
    })
  }

  emailLogin() {
    console.log("Email login");
    fetch(url + '/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          email: '',
          password: ''
        })
        console.log("User info: ", responseJson.userInfo);
        AsyncStorage.setItem('user', JSON.stringify(
          responseJson.userInfo
        ));
        this.props.onLogin(responseJson.userInfo)
        console.log("USER now is: ", this.props.user);
        console.log("Current state is: ", this.props.loggedIn);
        this.props.toggle(); // loggedIn
        this.props.navigation.navigate('Main');
      }
    })
    .catch((err) => {
      console.log("err is ", err);
      Alert.alert(
        'Incorrect Username or Password',
      )
    })
  }

  toggleSignup() {
    // this.setState({
    //   signup: !this.state.signup
    // })
    this.props.navigation.navigate('Signup')
  }

  render() {
    console.log("LOGGEDIN? ", this.props.loggedIn);
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd300' }} enabled>
        <Text style={styles.registerHeader}>Login</Text>

        <TextInput
          style={styles.textInput}
          placeholder='Email'
          keyboardType='email-address'
          onChangeText={(text) => this.setState({email: text})}
        />

        <TextInput
          style={styles.textInput}
          placeholder='Password'
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => this.emailLogin()}>
          <Text style = {{
            fontWeight: 'bold',
            color: '#ffd300'
          }}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loggedIn: state.loggedIn
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // update the user state by logging in
    onLogin: (user) => dispatch({
      type: 'GET_USER',
      payload: user
    }),
    toggle: () => dispatch({
      type: 'TOGGLE'
    })

  };
};

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
