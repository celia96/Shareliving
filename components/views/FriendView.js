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
import { createMaterialTopTabNavigator } from 'react-navigation';

import styles from '../Styles';

const url = 'https://c56f787d.ngrok.io'

class FriendView extends React.Component {

  // static navigationOptions = ({ navigation }) => ({
  //   title: `${navigation.state.params.name}`,
  //   header: null,
  //   headerLeft: <Button title='Back' onPress={ () => {this.props.navigation.navigate('GroupTab')} } />
  // });

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      members: [],
      chores: [],
      biils: []
    }
  }

  componentDidMount() {
    // this.setState({
    //   title: this.props.group.name
    // })
  }

  render() {
    console.log("FriendSS VIEW");
    return (
      <View style={styles.homeContainer}>
        <View style={{backgroundColor: 'steelblue', alignItems: 'center'}}>
          <Icon
            name="home"
            size={80}
          >
          </Icon>
        </View>
        <Text>Friend View</Text>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.log("STATE: ", state);
  return {
    user: state.user,
    group: state.group
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addGroup: (group) => dispatch({
      type: 'ADD_GROUP',
      payload: group
    }),
    getGroup: (group) => dispatch({
      type: 'VIEW_GROUP',
      payload: group
    }),
    updateUser: (user) => dispatch({
      type: 'GET_USER',
      payload: user
    })

  };
};


export default connect(mapStateToProps, mapDispatchToProps)(FriendView);

// export default GroupView;
