import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Linking, Button, AsyncStorage, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import { SearchBar } from 'react-native-elements'
import SlidingUpPanel from 'rn-sliding-up-panel';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';

// import SafariView from 'react-native-safari-view';
// import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
// import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
// import Icon2 from 'react-native-vector-icons/FontAwesome5';

import styles from './Styles';


import GroupStack from './stacks/GroupStack';
import FriendStack from './stacks/FriendStack';
import NotiStack from './stacks/NotiStack';
import MoreStack from './stacks/MoreStack';
import AddStack from './stacks/AddStack';

import AddTab from './tabs/AddTab';
import AddButton from './tabs/AddButton';

const MainScreen = createBottomTabNavigator({
  Groups: {
    screen: GroupStack,
    navigationOptions: {
      tabBarIcon: () => {
        return (
          <Icon
            name="home"
            size={30}
          >
          </Icon>
        )
      }
    }
  },
  Friends: {
    screen: FriendStack,
    navigationOptions: {
      tabBarIcon: () => {
        return (
          <Icon
            name="users"
            size={30}
          >
          </Icon>
        )
      }
    }
  },
  Add: {
    screen: () => null,
    navigationOptions: ({ navigation }) => ({
      title: '',
      tabBarLabel: '',
      tabBarIcon: () => {
        return <AddButton navigation={navigation}/>
      }
    }),
      // <Icon name="plus-circle" size={50} color="#ffd300"/>
      // tabBarIcon: () => {
      //   return (
      //     <AddButton />
      //   )
      // }
      // tabBarIcon: () => {
      //   return (
      //     // <Icon
      //     //   name="plus-circle"
      //     //   size={30}
      //     // >
      //     // </Icon>
      //
      //   )
      // }
  },
  Notifications: {
    screen: NotiStack,
    navigationOptions: {
      tabBarIcon: () => {
        return (
          <Icon
            name="list-ul"
            size={30}
          >
          </Icon>
        )
      }
    }
  },
  More: {
    screen: MoreStack,
    navigationOptions: {
      tabBarIcon: () => {
        return (
          <Icon
            name="user-circle"
            size={30}
          >
          </Icon>
        )
      }
    }
  }
}, {
  animationEnabled: true,
  tabBarPosition: "bottom",
  tabBarOptions: {
    showIcon: true,
    activeTintColor: '#ffd300'
  }
})

export default MainScreen;
