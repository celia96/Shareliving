import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform, Linking, Button, AsyncStorage, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import FriendTab from '../tabs/FriendTab';
import FriendView from '../views/FriendView';

const FriendStackNavigator = createStackNavigator({
  FriendTab: {
    screen: FriendTab,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      title: 'Shareliving'

    })

  },
  FriendView: {
    screen: FriendView,
  }
})

export default FriendStackNavigator;
