import React from 'react';
import { Text, View } from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import { createStackNavigator } from 'react-navigation'
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';

import Logo from './components/Logo'
import Signup from './components/Signup';
import Login from './components/Login';
import EmailLogin from './components/EmailLogin';
import MainScreen from './components/MainScreen';
import GroupView from './components/views/GroupView';

import AddBill from './components/tabs/add/AddBill';
import AddChore from './components/tabs/add/AddChore';
import CameraScreen from './components/tabs/add/CameraScreen';

import rootReducer from './components/reducers/rootReducer'

const store = createStore(rootReducer);


export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppStackNavigator/>
      </Provider>
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Logo: {
    screen: Logo
  },
  Login: {
    screen: Login
  },
  Signup: {
    screen: Signup
  },
  Main: {
    screen: MainScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerLeft: null,
    }),
  },
  // GroupView: {
  //   screen: GroupView,
  //   navigationOptions: ({ navigation }) => ({
  //     headerBackTitle: null
  //   }),
  // }
  AddBill: {
    screen: AddBill
  },
  AddChore: {
    screen: AddChore
  }
  
}, {
  navigationOptions: {
    gesturesEnabled: false
  }
})

// const AppStackNavigator = createStackNavigator({
//   Login: {
//     screen: Login
//   },
//   EmailLogin: {
//     screen: EmailLogin
//   },
//   Signup: {
//     screen: Signup
//   },
//   Main: {
//     screen: MainScreen,
//     navigationOptions: ({ navigation }) => ({
//       title: 'House Manager',
//       headerLeft: null
//     }),
//   },
//   GroupView: {
//     screen: GroupView,
//     navigationOptions: ({ navigation }) => ({
//       headerBackTitle: null
//     }),
//   }
// })
