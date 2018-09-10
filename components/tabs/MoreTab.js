import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform, Linking, AsyncStorage, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import { SearchBar, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { connect } from 'react-redux';

import styles from '../Styles'
import url from '../url';
// const url = 'https://46fb06a7.ngrok.io'


class MoreTab extends React.Component {

  logout() {
    // const { navigate } = this.props.navigation;
    fetch(url + '/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      })
    })
    .then(response => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        console.log('Successfully logged out');
        AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
        console.log("YESSSS");
        this.props.toggle();
        this.props.navigation.navigate('Logo');

      }
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  }

  render() {
    return (

      <View style={styles.homeContainer}>
        <View style={styles.homeHeader}>
          <Icon
            name="user-circle"
            size={80}
          >
          </Icon>
          <Text style={styles.homeTitles}>{this.props.user.name}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 50 }}>
          <Button
            large
            containerViewStyle={{ borderRadius: 5 }}
            borderRadius={5}
            backgroundColor="#ffd300"
            fontWeight='bold'
            rightIcon={{name: 'log-out', type: 'entypo'}}
            title='Logout'
            onPress={() => this.logout()}
          />
        </View>
      </View>
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


export default connect(mapStateToProps, mapDispatchToProps)(MoreTab);
