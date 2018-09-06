import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Linking,
  Button,
  AsyncStorage,
  Alert,
  ScrollView
} from 'react-native';
import { NativeRouter, Route, Link, Switch, FlatList } from 'react-router-native';
import { SearchBar, List, ListItem } from 'react-native-elements'
import SlidingUpPanel from 'rn-sliding-up-panel';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import _ from 'lodash';

import styles from '../Styles'

const url = 'https://c56f787d.ngrok.io'

// search friends like venmo
class FriendTab extends React.Component {
  static navigationOptions = {
    tabBarIcon: () => {
      return (
        <Icon
          name="users"
          size={25}
        >
        </Icon>
      )
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      search: '',
      friends: [],
      users: [],
      data: [], // what I am gonna render (partial result)
      fullData: [] // what I got from the server (full result)
    }
  }

  componentDidMount() {
    console.log("Friends");
    this.setState({
      friends: this.props.user.friends
    })
    this.makeRemoteRequest();
  }

  makeRemoteRequest = _.debounce(() => {
    fetch(url + '/allusers')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Hi");
        if (responseJson.success) {
          this.setState({
            users: responseJson.users
          })
          console.log('Loading all the users: ', this.state.users);
          return getUsers(20, this.state.search.toLowerCase(), this.state.users)
        } else {
          console.log("Failed");
        }
      })
      .then((users) => {
        this.setState({
          data: users,
          fullData: users
        })
        console.log("DATA: ", this.state.data);
        console.log("FUll: ", this.state.fullData);
      })
      .catch((err) => {
        console.log("Something went wrong with fetching all the users information");
      })
  }, 250)

  add(friendName, friendEmail, friendId) {
    console.log("adding friend", friendId);
    fetch(url + '/friend/add/' + this.props.user._id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: friendName,
        email: friendEmail,
        id: friendId
      })
    })
    .then(response => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        console.log('Successfully added a friend');
        this.props.updateUser(responseJson.user)
        console.log("Now: ", this.props.user);
        this.setState({
          visible: false,
          title: '',
          friends: this.props.user.friends
        })
        console.log(this.state.visible);
      }
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  }

  delete(friendId) {
    fetch(url + '/friend/delete/' + friendId, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: this.props.user._id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("DOING GOOD");
      if (responseJson.success) {
        // this.props.toggle();
        console.log("deleting was successful");
        console.log(responseJson.user);
        console.log(responseJson.friends);
        this.props.updateUser(responseJson.user)
        console.log("Now: ", this.props.user);
        this.setState({
          friends: this.props.user.friends
        })
      }
    })
    .catch((err) => {
      console.log("Error in attempting to sign up: ", err)
    })
  }

  deleteAttempt(friendId) {
    console.log("Deleting the item/group");
    Alert.alert(
      'Delete',
      'Are you sure you want to delete?',
      [
        {text: 'Yes', onPress: () => this.delete(friendId)},
        {text: 'No', onPress: () => console.log('No')},
      ],
      { cancelable: true }
    )
  }

  friendView(friend) {
    return (
      <Swipeout key={'swipe-friend' + friend.id} right={[{ onPress: () => console.log("call this.inviteAttempt(friend.id)"), text: 'Invite', backgroundColor: 'blue'}, { onPress: () => this.deleteAttempt(friend.id), text: 'Delete', type: 'delete' }]}>
        <View key={'view-friend' + friend.id} style={{backgroundColor: '#fff'}}>
          <ListItem
            key={'listing-view' + friend.id}
            title={friend.name}
            subtitle={friend.email}
            leftIcon={{name: 'person', size: 50}}
            onPress={() => console.log('Pressing')}
          />
        </View>
      </Swipeout>
    )
  }

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

  render() {
    return (
      <View style={styles.homeContainer}>
        <View style={styles.homeHeader}>
          <Icon
            name="users"
            size={80}
          >
          </Icon>
          <Text style={styles.homeTitles}>Friends</Text>
        </View>
        <ScrollView>
          {this.state.friends.map(friend => this.friendView(friend))}
        </ScrollView>
        <View style={{flex: 1, position:'absolute', top: 480, left: 300 }}>
          <Icon
            name="plus"
            size={70}
            onPress={() => this.showPanel()}
          >
          </Icon>
        </View>
        <SlidingUpPanel
          visible={this.state.visible}
          allowDragging={false}
          onRequestClose={() => this.setState({visible: false})}>
          <View style={{flex: 1, backgroundColor: 'white', marginBottom: 110}}>
            {/* Search for users and add friends */ }
            <View style={{alignItems: 'center'}}>
              <Icon
                name="caret-down"
                size={25}
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
                <View key={'search-friend' + result._id} style={{backgroundColor: '#fff'}}>
                  <ListItem
                    key={'list-search-friend' + result._id}
                    title={result.name}
                    subtitle={result.email}
                    leftIcon={{name: 'person', size: 50}}
                    onPress={() => this.add(result.name, result.email, result._id)}
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

const contains = ({name, email}, search) => {
  if (name.toLowerCase().includes(search) || email.toLowerCase().includes(search)) {
    return true;
  }
  return false;
}

const getUsers = (limit, search, users) => {
  console.log("Getting users function called");
  return new Promise ((resolve, reject) => {
    if (search.length === 0) {
      resolve(_.take(users, limit))
    } else {
      const formattedSearch = search.toLowerCase();
      const result = _.filter(users, user => {
        return contains(user, formattedSearch);
      });
      resolve(_.take(result, limit));
    }
  });
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // update the user state by logging in
    addFriend: (friend) => dispatch({
      type: 'ADD_FRIEND',
      payload: friend
    }),
    updateUser: (user) => dispatch({
      type: 'GET_USER',
      payload: user
    })

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendTab);
