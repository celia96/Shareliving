import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform, Linking, Button, AsyncStorage, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import AddTab from '../tabs/AddTab';
import AddBill from '../tabs/add/AddBill';
import AddChore from '../tabs/add/AddChore';

const AddStackNavigator = createStackNavigator({
  AddTab: {
    screen: AddTab,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      title: 'House Manager'
    })
  },
  AddBill: {
    screen: AddBill
  },
  AddChore: {
    screen: AddChore
  }
})

export default AddStackNavigator;
