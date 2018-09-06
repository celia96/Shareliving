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
  ScrollView,
  Dimensions
} from 'react-native';
import { NativeRouter, Route, Link, Switch, FlatList } from 'react-router-native';
import { SearchBar, List, ListItem, Header } from 'react-native-elements';
import Drawer from 'react-native-drawer';
import { createDrawerNavigator } from 'react-navigation';

import SlidingUpPanel from 'rn-sliding-up-panel';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import { createMaterialTopTabNavigator } from 'react-navigation';
import SegmentedControlTab from 'react-native-segmented-control-tab'

import GroupTab from '../tabs/GroupTab';

import BillTab from './tabs/BillTab';
import ChoreTab from './tabs/ChoreTab';
import DrawTab from './tabs/DrawTab';

import styles from '../Styles';

const url = 'https://c56f787d.ngrok.io'

class GroupView extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
    headerLeft: <View style={{ marginLeft: 10 }}><Icon name="home" size={25} onPress={() => navigation.navigate('GroupTab')}></Icon></View>,
    headerRight: <View style={{ marginRight: 10 }}><MaterialIcons name="settings" size={25} onPress={() => navigation.state.params.toggleDrawer()}></MaterialIcons></View>
  });

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      members: [],
      chores: [],
      biils: [],
      selectedIndex: 0,
      isOpen: false,
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      toggleDrawer: this.toggleDrawer.bind(this)
    })
    this.setState({
      group: this.props.group,
    })
  }

  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
    });
  }

  toggleDrawer() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    return (
      <Drawer
        type="overlay"
        open={this.state.isOpen}
        tapToClose={true}
        side={'right'}
        openDrawerOffset={0.3}
        styles={drawerStyles}
        content={<DrawTab navigation={this.props.navigation}/>}
      >
        <View style={styles.homeContainer}>
          <View style={styles.homeHeader}>
            <Icon
              name="home"
              size={80}
            >
            </Icon>
          </View>
          <View>
            <SegmentedControlTab
              values={['Bills', 'Chores']}
              selectedIndex={this.state.selectedIndex}
              onTabPress={this.handleIndexChange}
              borderRadius={0}
              tabsContainerStyle={{ height: 50, backgroundColor: '#F2F2F2' }}
              tabStyle={{ backgroundColor: '#F2F2F2', borderWidth: 0, borderColor: 'transparent' }}
              activeTabStyle={{ backgroundColor: 'white', marginTop: 2 }}
              tabTextStyle={{ color: '#444444', fontWeight: 'bold' }}
              activeTabTextStyle={{ color: '#888888' }} />
            />
          </View>
          {this.state.selectedIndex === 0 &&
              <BillTab navigation={this.props.navigation}/>}
          {this.state.selectedIndex === 1 &&
              <ChoreTab navigation={this.props.navigation}/>}

        </View>
      </Drawer>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    group: state.group
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch({
      type: 'GET_USER',
      payload: user
    }),
    updateGroup: (group) => dispatch({
      type: 'UPDATE_GROUP',
      payload: group
    })

  };
};

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}

// const drawernav = createDrawerNavigator({
//   GroupView: {
//       screen: GroupView,
//     }
//   }, {
//     contentComponent: DrawTab,
//     drawerWidth: Dimensions.get('window').width - 120,
// });


export default connect(mapStateToProps, mapDispatchToProps)(GroupView);
