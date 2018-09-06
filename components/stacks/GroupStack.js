import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform, Linking, Button, AsyncStorage, ScrollView } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import GroupTab from '../tabs/GroupTab';
import GroupView from '../views/GroupView';
import BillDetail from '../views/tabs/details/BillDetail';
import ChoreDetail from '../views/tabs/details/ChoreDetail';
import EditBill from '../views/tabs/details/edit/EditBill';
import EditChore from '../views/tabs/details/edit/EditChore';

const GroupStackNavigator = createStackNavigator({
  GroupTab: {
    screen: GroupTab,
    navigationOptions: ({ navigation }) => ({
      // header: null,
      title: 'Shareliving'

    })

  },
  GroupView: {
    screen: GroupView,
    // navigationOptions: () => ({
    //   header: null,
    //   // headerBackTitle: 'Back'
    // })
  },
  BillDetail: {
    screen: BillDetail,
  },
  EditBill: {
    screen: EditBill
  },
  ChoreDetail: {
    screen: ChoreDetail,
  },
  EditChore: {
    screen: EditChore
  }

})

export default GroupStackNavigator;
