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
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import styles from './Styles';
import Signup from './Signup';
import MainScreen from './MainScreen';
import { connect } from 'react-redux';


import { StackNavigator } from 'react-navigation';

// import SafariView from 'react-native-safari-view';
// import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
// import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';


import Icon from 'react-native-vector-icons/FontAwesome';


const url = 'https://c56f787d.ngrok.io'


class EmailLogin extends React.Component {

  static navigationOptions = {
    title: "House Manager",
    headerBackTitle: 'Back'
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }
  }

  componentDidMount() {
    this.setState({
      email: '',
      password: ''
    })
  }

  emailLogin() {
    console.log("Email login");
    console.log(this.state.email, this.state.password);
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
      Alert.alert(
        'Incorrect Username or Password',
      )
    })
  }


  render() {
    //
    // if (this.props.loggedIn) {
    //   return (<MainScreen />)
    // }

    return (
      <KeyboardAvoidingView behavior="padding" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000'}}>
        <TextInput
          style={styles.registerInput}
          placeholder="Email"
          onChangeText={(text) => this.setState({email: text})}
        />
        <TextInput
          style={styles.registerInput}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => this.emailLogin()}>
        <Text style = {{
          textAlign: 'center',
          fontSize: 20,
          color: 'black'
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

export default connect(mapStateToProps, mapDispatchToProps)(EmailLogin);
