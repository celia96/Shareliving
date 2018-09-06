import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform, Linking, Button, AsyncStorage, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import NotiTab from '../tabs/NotiTab';

const NotiStackNavigator = createStackNavigator({
  NotiTab: {
    screen: NotiTab,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      title: 'Shareliving'

    })

  }
})

export default NotiStackNavigator;
