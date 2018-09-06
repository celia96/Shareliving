import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform, Linking, Button, AsyncStorage, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import MoreTab from '../tabs/MoreTab';

const MoreStackNavigator = createStackNavigator({
  MoreTab: {
    screen: MoreTab,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      title: 'Shareliving'

    })

  }
})

export default MoreStackNavigator;
