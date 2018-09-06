import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform, Linking, Button, AsyncStorage, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import SlidingUpPanel from 'rn-sliding-up-panel';

import styles from '../Styles'

const url = 'https://c56f787d.ngrok.io'

// shows up everytime someone adds a bill or chores

export default class NotiTab extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      notifications: []
    }
  }

  notiView(noti) {
    return (
      <View style={{backgroundColor: '#fff'}}>
        <ListItem
          title={noti.name}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.homeContainer}>
        <View style={styles.homeHeader}>
          <Icon
            name="list"
            size={80}
          >
          </Icon>
          <Text style={styles.homeTitles}>Notifications</Text>
        </View>
        <ScrollView>
          {this.state.notifications.map(noti => this.notiView(noti))}
        </ScrollView>
      </View>
    )
  }
}
