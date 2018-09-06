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

import styles from '../Styles'

const url = 'https://c56f787d.ngrok.io'

class GroupTab extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      groups: [],
      title: '',
      members: [],
    }
  }

  // Get list of all the groups
  componentDidMount() {
    // console.log("Existing group is: ", this.props.user.groups);
    console.log("group tab mount");
    fetch(url + '/user/' + this.props.user._id)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log("YES");

          this.setState({
            groups: responseJson.user.groups
          })

        }
      })

  }

  componentDidUpdate(prevProps, prevState) {
    console.log('prev', prevProps);
    console.log('prevstate', prevState);
    console.log("now ", this.props.user);
    if (prevState.length !== this.props.user.groups.length) {
      console.log("props changed");
    }
  }

  add() {
    var member = {
      email: this.props.user.email,
      name: this.props.user.name,
      id: this.props.user._id
    }
    console.log("adding ", this.state.title);
    if (this.state.title) {
      fetch(url + '/group/add/' + this.props.user._id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: this.state.title,
          member: member
        })
      })
      .then(response => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log('Successfully added a group');
          console.log(responseJson.group);
          var obj = {
            name: responseJson.group.name,
            id: responseJson.group._id
          }
          this.props.addGroup(responseJson.group)
          console.log("Now: ", this.props.user);
          this.setState({
            visible: false,
            title: '',
            groups: this.props.user.groups
          })
          console.log(this.state.visible);
        }
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
    } else {
      Alert.alert(
        'Group name',
        'Please add a group name'
      )
    }
  }

  showPanel() {
    this.setState({
      visible: true
    })
  }

  delete(groupId) {
    fetch(url + '/group/delete/' + groupId, {
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
        console.log(responseJson.groups);
        this.props.updateUser(responseJson.user)
        console.log("Now: ", this.props.user);
        this.setState({
          groups: this.props.user.groups
        })
      }
    })
    .catch((err) => {
      console.log("Error in attempting to sign up: ", err)
    })
  }

  deleteAttempt(groupId) {
    console.log("Deleting the item/group");
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this group?',
      [
        {text: 'Yes', onPress: () => this.delete(groupId)},
        {text: 'No', onPress: () => console.log('No')},
      ],
      { cancelable: true }
    )
  }

  viewGroup(group) {
    console.log("Viewing a group");
    console.log(group.id);
    fetch(url + '/group/info/' + group.id)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.success) {
          this.props.updateGroup(responseJson.group)
          console.log("res ", responseJson.group);
          console.log("AFTER update: ", this.props.group);
          this.props.navigation.navigate('GroupView', {name: group.name});
        }
      })
      .catch((err) =>{
        console.log("There was an error in loading a group: ", err);
      })
  }

  groupView(group) {
    return (
      <Swipeout key={group.id} right={[{ onPress: () => this.deleteAttempt(group.id), text: 'Delete', type: 'delete' }]}>
        <View style={{backgroundColor: '#fff'}}>
          <ListItem
            title={group.name}
            leftIcon={{name: 'home', size: 50}}
            onPress={() => this.viewGroup(group)}
          />
        </View>
      </Swipeout>
    )
  }

  render() {
    return (
      <View style={styles.homeContainer}>
        <View style={styles.homeHeader}>
          <Icon
            name="home"
            size={80}
          >
          </Icon>
          <Text style={styles.homeTitles}>Groups</Text>
        </View>
        <ScrollView>
          {this.state.groups.map(group => this.groupView(group))}
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
          allowMomentum={true}
          onRequestClose={() => this.setState({visible: false})}>
          <View style={{flex: 1, backgroundColor: '#fffdd0'}}>
            <View style={{alignItems: 'center'}}>
              <Icon
                name="caret-down"
                size={25}
                onPress={() => this.setState({visible: false})}
              >
              </Icon>
            </View>
            <View style={{flex: 1, alignItems: 'center', marginTop: 100}}>
              {/* <TextInput
                style={{backgroundColor: '#fff', borderRadius: 10, width: 200, height: 50, textAlign: 'center', fontSize: 20,}}
                placeholder="Group Name"
                onChangeText={(text) => this.setState({title: text})}
              />
              <TouchableOpacity
                style={{backgroundColor: 'black', borderRadius: 10, width: 200, height: 50}}
                onPress={() => this.add()}>
                <Text style = {{
                  textAlign: 'center',
                  fontSize: 20,
                  color: '#fff'
                }}>Enter</Text>
              </TouchableOpacity> */}

              <TextInput
                style={styles.addInput}
                placeholder='Group Name'
                onChangeText={(text) => this.setState({title: text})}
              />

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => this.add()}>
                <Text style = {{
                  fontWeight: 'bold',
                  color: 'black',
                  textAlign: 'center'
                }}>Add</Text>
              </TouchableOpacity>
            </View>

          </View>
        </SlidingUpPanel>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.log("Group tab STATE: ", state);
  return {
    user: state.user,
    group: state.group
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addGroup: (group) => dispatch({ // add group to user info
      type: 'ADD_GROUP',
      payload: group
    }),
    updateUser: (user) => dispatch({ // for deleting user and update a user info
      type: 'GET_USER',
      payload: user
    }),
    updateGroup: (group) => dispatch({
      type: 'UPDATE_GROUP',
      payload: group
    })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupTab);
