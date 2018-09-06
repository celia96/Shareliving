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
import BillDetail from './details/BillDetail';


const url = 'https://c56f787d.ngrok.io'

class BillTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      visible: false,
      title: '',
      total: 0,
      participants: [], // members that participated in this bill
      groupPicks: [],
      selectedGroup: undefined
    }

  }

  billView(bill, index) {
    var date = bill.date;
    var bills = bill.bills;
    return (
      <View key={'bill-groupedby-date' + index}>
        <View style={{ backgroundColor: '#d3d3d3'}}>
          <Text style={{ fontWeight: 'bold' }}>{date}</Text>
        </View>
        {bills.map((item) => {
          var iPaid = false;
          var Iamhere = false;
          var who = '';
          if (item.payer.id === this.props.user._id) {
            var iPaid = true;
          }
          for (i = 0; i < item.participants.length; i++) {
            if (item.participants[i].id.toString() === this.props.user._id.toString()) {
              Iamhere = true;
            }
          }
          var rightTitle = '';
          var amount = Math.round((item.total / (item.participants.length + 1)) * 100) / 100;
          console.log("amount ", amount);
          if (iPaid) {
            rightTitle = `receive: $${amount * item.participants.length}`;
            who = 'You'
          } else {
            who = item.payer.name
            if (Iamhere) {
              rightTitle = `owe: $${amount}`;
            } else {
              rightTitle = 'owe: $0';
            }
          }
          console.log("right title ", rightTitle);
          return (
            <View key={'bill' + item._id} style={{backgroundColor: '#fff'}}>
              <ListItem
                title={item.title}
                subtitle={`${who} paid $` + item.total}
                rightTitle={rightTitle}
                leftIcon={{name: 'receipt', size: 30}}
                onPress={() => this.viewDetail(item)}
              />
            </View>
          )
        })}
      </View>
    )
  }

  viewDetail(bill) {
    console.log("viewing details of bill");
    fetch(url + '/bill/info/' + bill._id)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.success) {
          var iPaid = false;
          // var participants = responseJson.bill.participants.filter((item) => item.id !== responseJson.bill.payer.id)
          if (responseJson.bill.payer.id === this.props.user._id) {
            var iPaid = true
          }
          var obj = Object.assign({}, responseJson.bill, {iPaid: iPaid})
          // obj = Object.assign({}, obj, {participants: participants})
          console.log("OBJ ", obj);
          this.props.updateBill(obj)
          console.log("BILL ", responseJson.bill);
          console.log("AFTER update: ", this.props.bill);
          this.props.navigation.navigate('BillDetail', {name: bill.title, iPaid: iPaid});
        }
      })
      .catch((err) =>{
        console.log("There was an error in loading a bill: ", err);
      })
  }

  render() {
    var bills = this.props.group.bills.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    var newArr = []
    var newBill = {}
    if (bills.length !== 0) {
      newBill.date = bills[0].date.slice(0,10);
      newBill.bills = [];
      newBill.bills.push(bills[0]);
      if (bills.length === 1) {
        newArr.push(newBill)
      } else {
        for (var i = 0; i < bills.length-1; i++) {
          if (bills[i].date.slice(0,10) === bills[i+1].date.slice(0,10)) {
            newBill.bills.push(bills[i+1])
            if (i+1 === bills.length-1) {
              newArr.push(newBill);
            }
          } else {
            newArr.push(newBill);
            newBill = {};
            newBill.date = bills[i+1].date.slice(0,10);
            newBill.bills = [];
            newBill.bills.push(bills[i+1]);
            if (i+1 === bills.length-1) {
              newArr.push(newBill);
            }
          }
        }
      }
      console.log("Final Bills", newArr);
      bills = newArr;
    }
    return (
      <View style={styles.homeContainer}>
        <ScrollView>
          {bills.map((bill, index) => this.billView(bill, index))}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.log("Bill tab state: ", state);
  return {
    user: state.user,
    group: state.group,
    bill: state.bill
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBill: (bill) => dispatch({
      type: 'UPDATE_BILL',
      payload: bill
    })
  };
};

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5, paddingLeft: 80 },
};

export default connect(mapStateToProps, mapDispatchToProps)(BillTab);
