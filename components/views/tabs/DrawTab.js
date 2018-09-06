import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Linking,
  AsyncStorage,
  Alert,
  ScrollView
} from 'react-native';
import { NativeRouter, Route, Link, Switch, FlatList } from 'react-router-native';
import { SearchBar, List, ListItem, Divider, Button } from 'react-native-elements'
import SlidingUpPanel from 'rn-sliding-up-panel';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import { createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import _ from 'lodash';

import styles from '../../Styles';

const url = 'https://c56f787d.ngrok.io'

class DrawTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      members: [],
      data: [],
      fullData: [],
      visible: false,
      search: ''
    }
  }

  componentDidMount() {
    console.log("Drawer");
    this.makeRemoteRequest()
  }

  makeRemoteRequest = _.debounce(() => {
    getFriends(20, this.state.search.toLowerCase(), this.props.user.friends)
      .then((friends) => {
        this.setState({
          data: friends,
          fullData: friends
        })
        // console.log("DATA: ", this.state.data);
        // console.log("FUll: ", this.state.fullData);
      })
      .catch((err) => {
        console.log("Something went wrong with fetching all the users information");
      })
  }, 250)

  showPanel() {
    this.setState({
      visible: true
    })
  }

  typeSearch(text) {
    console.log("typing");
    console.log("Search value: ", text);
    const formatSearch = text.toLowerCase();
    const data = _.filter(this.state.fullData, user => {
      return contains(user, formatSearch);
    })
    this.setState({
      search: text,
      data: data
    }, () => {
      this.makeRemoteRequest();
    })
  }

  clearSearch() {
    console.log("clearing");
    this.setState({
      search: ''
    })
  }

  leaveAttempt(me) {
    console.log("Attempting to Leave the group");
    Alert.alert(
      'Leave',
      'Are you sure you want to leave this group?',
      [
        {text: 'Yes', onPress: () => this.leave(me)},
        {text: 'No', onPress: () => console.log('No')},
      ],
      { cancelable: true }
    )
  }

  leave(me) {
    fetch(url + '/group/leave/' + me._id, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId: this.props.group._id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("DOING GOOD");
      if (responseJson.success) {
        console.log("leaving was successful");
        this.props.updateUser(responseJson.user)
        console.log("let's go to a group tab");
        this.props.navigation.navigate('GroupTab');
      }
    })
    .catch((err) => {
      console.log("Error in attempting to sign up: ", err)
    })
  }

  inviteAttempt(friend) {
    console.log("inviting a friend");
    console.log(friend);
    Alert.alert(
      'Invite',
      'Are you sure you want to invite?',
      [
        {text: 'Yes', onPress: () => this.invite(friend)},
        {text: 'No', onPress: () => console.log('No')},
      ],
      { cancelable: true }
    )
  }

  invite(friend) {
    console.log("F: ", friend);
    console.log("G ", this.props.group);
    fetch(url + '/group/invite/' + friend.id, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        friend: friend,
        group: this.props.group
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("DOING GOOD");
      if (responseJson.success) {
        // this.props.toggle();
        console.log("inviting was successful");
        console.log(responseJson.invitee);
        this.props.addMember(responseJson.invitee)
        console.log("Now after adding a member: ", this.props.group);
        this.setState({
          members: this.props.group.members,
          visible: false
        })
      }
    })
    .catch((err) => {
      console.log("Error in attempting to sign up: ", err)
    })
  }

  memberView(member) {
    return (
      <View key={'member-list-key' + member.id} style={{backgroundColor: '#fff'}}>
        <ListItem
          title={member.name}
          hideChevron={true}
          leftIcon={{name: 'user-circle-o', type: 'font-awesome', size: 25}}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View style={{ backgroundColor: '#ffd300' }}>
          <View style={{ marginVertical: 5, marginLeft: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Setting</Text>
          </View>
        </View>
        <Divider style={{ height: 2, backgroundColor: 'black', flexDirection: 'row' }} />
        <View style={{ flex: 0.25, flexDirection: 'row', marginVertical: 5, marginLeft: 10, alignItems: 'center' }}>
          <Icon3 name='ios-people' size={20}/>
          <View style={{ marginHorizontal: 1 }}/>
          <Text style={{ fontWeight: 'bold' }}>Members</Text>
        </View>
        {/* <ListItem
          title={'Members'}
          titleStyle={{ fontWeight: 'bold' }}
          hideChevron={true}
          leftIcon={{name: 'ios-people', type: 'ionicons', size: 25}}
        /> */}
        <Divider style={{ height: 2, backgroundColor: 'black' }} />
        <ScrollView style={{ height: 300 }}>
          <View key={'member-list-key-invite'}>
            <ListItem
              title={'invite'}
              hideChevron={true}
              leftIcon={{name: 'add-circle', size: 25}}
              leftIconOnPress={() => this.showPanel()}
            />
          </View>
          {this.props.group.members.map((member) => this.memberView(member))}
        </ScrollView>
        <Divider style={{ height: 2, backgroundColor: 'black' }} />
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 50 }}>
          <Button
            small
            rightIcon={{name: 'log-out', type: 'entypo'}}
            title='Leave'
            containerViewStyle={{ borderRadius: 5 }}
            borderRadius={5}
            backgroundColor="#ffd300"
            onPress={() => this.leaveAttempt(this.props.user)}
          />
        </View>
        <SlidingUpPanel
          visible={this.state.visible}
          allowDragging={false}
          onRequestClose={() => this.setState({visible: false})}>
          <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 110 }}>
            {/* Search for users and add friends */ }
            <View style={{ alignItems: 'center' }}>
              <Icon
                name="caret-down"
                size={20}
                onPress={() => this.setState({visible: false})}
              >
              </Icon>
            </View>
            <SearchBar
              round
              lightTheme
              platform="ios"
              clearIcon={{name : 'clear'}}
              searchIcon={{ size: 24 }}
              onChangeText={(text) => this.typeSearch(text)}
              onClear={() => this.clearSearch()}
              value={this.state.search}
              placeholder='Search' />
            <ScrollView>
              {this.state.data.map((result) =>
                <View key={'invite-search' + result.id} style={{backgroundColor: '#fff'}}>
                  <ListItem
                    title={result.name}
                    subtitle={result.email}
                    leftIcon={{name: 'person', size: 50}}
                    onPress={() => this.inviteAttempt(result)}
                  />
                </View>
              )}
            </ScrollView>

          </View>
        </SlidingUpPanel>

      </View>
    )
  }
}


const mapStateToProps = (state) => {
  console.log("STATE IN VIEWwwww: ", state);
  return {
    user: state.user,
    group: state.group
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateGroup: (group) => dispatch({
      type: 'UPDATE_GROUP',
      payload: group
    }),
    updateUser: (user) => dispatch({
      type: 'UPDATE_USER',
      payload: user
    }),
    addMember: (member) => dispatch({
      type: 'ADD_MEMBER',
      payload: member
    }),
    leaveGroup: (group) => dispatch({
      type: 'LEAVE',
      payload: group
    })
  };
};


const contains = ({name, email}, search) => {
  if (name.toLowerCase().includes(search) || email.toLowerCase().includes(search)) {
    return true;
  }
  return false;
}

const getFriends = (limit, search, friends) => {
  console.log("Getting users function called");
  return new Promise ((resolve, reject) => {
    if (search.length === 0) {
      resolve(_.take(friends, limit))
    } else {
      const formattedSearch = search.toLowerCase();
      const result = _.filter(friends, friend => {
        return contains(friend, formattedSearch);
      });
      resolve(_.take(result, limit));
    }
  });
}


export default connect(mapStateToProps, mapDispatchToProps)(DrawTab);
