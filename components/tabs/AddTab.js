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
} from 'react-native';import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/MaterialIcons';

import styles from '../Styles'

import AddBill from './add/AddBill';
import AddChore from './add/AddChore';

const url = 'https://c56f787d.ngrok.io'

class AddTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openBill: false,
      openChore: false,
      groupList: [],
      friendList: []
    }
  }

  componentDidMount() {

  }

  toggleBill() {
    console.log("adding a bill");
    // this.props.navigation.navigate('AddBill');
    console.log(this.props.user);
    console.log(this.props.group);
    this.props.navigation.navigate('AddBill');

  }

  toggleChore(){
    console.log("adding a chore");

    // this.props.navigation.navigate('AddBill');
    console.log(this.props.user);
    console.log(this.props.group);
    this.props.navigation.navigate('AddChore');

    // fetch(url + '/user/' + this.props.user._id)
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     this.setState({
    //       openChore: !this.state.openChore,
    //       groupList: responseJson.user.groups,
    //       friendList: responseJson.user.friends,
    //     }, console.log("hi ", this.state.groupList))
    //   })

  }

  render() {
    return (
      <View style={styles.homeContainer}>
        <View style={{backgroundColor: 'steelblue', alignItems: 'center'}}>
          <Icon2
            name="add-to-list"
            size={70}
          >
          </Icon2>
          <Text style={styles.homeTitles}>Add</Text>
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'space-between', marginTop: 120, marginLeft: 40, marginRight: 40}}>
          <View style={{marginTop: 15}}>
            <Icon3.Button
              name="receipt"
              backgroundColor="#808080"
              size={30}
              onPress={() => this.toggleBill()}
              {...iconStyles}
            >
              + Bill
            </Icon3.Button>
          </View>
          <View style={{marginTop: 30}}>
            <Icon3.Button
              name="delete-sweep"
              backgroundColor="#3b5998"
              size={30}
              onPress={() => this.toggleChore()}
              {...iconStyles}
            >
              + Chore
            </Icon3.Button>
          </View>
        </View>
        {/* <AddBill groupList={this.state.groupList} friendList={this.state.friendList} visible={this.state.openBill} toggle={() => this.toggleBill()}/>
        <AddChore groupList={this.state.groupList} friendList={this.state.friendList} visible={this.state.openChore} toggle={() => this.toggleChore()}/> */}
      </View>
    )
  }
}

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5, paddingLeft: 80 },
};


const mapStateToProps = (state) => {
  console.log("Add tab state: ", state);
  return {
    user: state.user,
    group: state.group,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addChore: (chore) => dispatch({ // add a bill to a group state
      type: 'ADD_CHORE',
      payload: chore
    }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTab);
