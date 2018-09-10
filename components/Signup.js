import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native'
import styles from './Styles'

import url from './url';
// const url = 'https://c56f787d.ngrok.io'

export default class Signup extends React.Component {

  static navigationOptions = {
    title: "Shareliving",
    headerLeftTitle: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    this.setState({
      name: '',
      email: '',
      password: ''
    })
  }

  register() {
    console.log("Register");
    var user = {
      email: this.state.email,
      password: this.state.password
    }
    console.log(user);
    fetch(url + '/signup', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("DOING GOOD");
      if (responseJson.success) {
        this.props.navigation.navigate('Logo')
      }
    })
    .catch((err) => {
      console.log("Error in attempting to sign up: ", err)
    })

  }

  toggleLogin() {
    this.props.navigation.navigate('Login')
  }

  render() {
    return (
      // flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000'
      <KeyboardAvoidingView behavior="padding" style = {{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd300' }}>
        <Text style={styles.registerHeader}>Registration</Text>

        <TextInput
          style={styles.textInput}
          placeholder='Your name'
          onChangeText={(text) => this.setState({name: text})}
        />

        <TextInput
          style={styles.textInput}
          placeholder='Your email'
          onChangeText={(text) => this.setState({email: text})}
        />

        <TextInput
          style={styles.textInput}
          placeholder='Your password'
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => this.register()}>
          <Text style = {{
            fontWeight: 'bold',
            color: '#ffd300'
          }}>Sign up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}
