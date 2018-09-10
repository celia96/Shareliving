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
  KeyboardAvoidingView
} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, ListItem } from 'react-native-elements'
import SlidingUpPanel from 'rn-sliding-up-panel';
import DatePicker from 'react-native-datepicker';
import LabelSelect from 'react-native-label-select';
import { Dropdown } from 'react-native-material-dropdown';

import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Swipeout from 'react-native-swipeout';
import { createMaterialTopTabNavigator } from 'react-navigation';

import styles from '../../Styles';
import url from '../../url';
// const url = 'https://c56f787d.ngrok.io'

class ChoreTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      inCharge: [], // members that are in charge of this chore
      groupPicks: [],
      selectedGroup: undefined
    }
  }

  choreView(chore, index) {
    var date = chore.date;
    var chores = chore.chores;
    return (
      <View key={'chore-groupedby-date' + index}>
        <View style={{ backgroundColor: '#d3d3d3'}}>
          <Text style={{ fontWeight: 'bold' }}>{date}</Text>
        </View>
        {chores.map((item) => {
          var incharge = []
          for (var i = 0; i < item.inCharge.length; i++) {
            incharge.push(item.inCharge[i].name)
          }
          return (
            <View key={'chore' + item._id} style={{backgroundColor: '#fff'}}>
              <ListItem
                title={item.title}
                subtitle={incharge.join(', ')}
                // rightTitle={item.total} // whether done or not
                leftIcon={{name: 'trash-o', type: 'font-awesome', size: 30}}
                onPress={() => this.viewDetail(item)}
              />
            </View>)
        })}
      </View>
    )
  }

  viewDetail(chore) {
    console.log("viewing details of chore");
    fetch(url + '/chore/info/' + chore._id)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.success) {
          this.props.updateChore(responseJson.chore)
          console.log("CHORE ", responseJson.chore);
          console.log("AFTER update: ", this.props.chore);
          this.props.navigation.navigate('ChoreDetail', {name: chore.title});
        }
      })
      .catch((err) =>{
        console.log("There was an error in loading a chore: ", err);
      })
  }

  render() {
    console.log("Chore VIEW");
    var chores = this.props.group.chores.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    var newArr = []
    var newChore = {}
    if (chores.length !== 0) {
      newChore.date = chores[0].date.slice(0,10);
      newChore.chores = [];
      newChore.chores.push(chores[0]);
      if (chores.length === 1) {
        newArr.push(newChore)
      } else {
        for (var i = 0; i < chores.length-1; i++) {
          if (chores[i].date.slice(0,10) === chores[i+1].date.slice(0,10)) {
            newChore.chores.push(chores[i+1])
            if (i+1 === chores.length-1) {
              newArr.push(newChore);
            }
          } else {
            newArr.push(newChore);
            newChore = {};
            newChore.date = chores[i+1].date.slice(0,10);
            newChore.chores = [];
            newChore.chores.push(chores[i+1]);
            if (i+1 === chores.length-1) {
              newArr.push(newChore);
            }
          }
        }
      }
      console.log("Final Chores", newArr);
      chores = newArr;
    }
    return (
      <View style={styles.homeContainer}>
        <ScrollView>
          {chores.map((bill, index) => this.choreView(bill, index))}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.log("Chore tab state: ", state);
  return {
    user: state.user,
    group: state.group,
    chore: state.chore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateChore: (chore) => dispatch({ // add a bill to a group state
      type: 'UPDATE_CHORE',
      payload: chore
    }),
  };
};

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5, paddingLeft: 80 },
};

export default connect(mapStateToProps, mapDispatchToProps)(ChoreTab);
