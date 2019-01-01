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
  Image,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import SlidingUpPanel from 'rn-sliding-up-panel';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import { TextField } from 'react-native-material-textfield';
import LabelSelect from '../../../../LabelSelect';
import { Dropdown } from 'react-native-material-dropdown';

import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ImagePicker, Camera, Permissions } from 'expo';

import styles from '../../../../Styles';
import url from '../../../../url';

// const url = 'https://c56f787d.ngrok.io'


class EditBill extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Edit Bill",
    headerRight: <View style={{ marginRight: 10 }}><FontAwesome name="save" size={25} onPress={() => navigation.state.params.save()}></FontAwesome></View>
  });

  constructor(props) {
    super(props);
    var newArr = [...this.props.group.members];
    for (var i = 0; i < newArr.length; i ++) {
      newArr[i].isSelected = false
    }
    newArr = newArr.filter((item) => item.id !== this.props.user._id)

    this.state = {
      title: this.props.bill.title, // title of the bill
      total: this.props.bill.total,
      participants: newArr, // members that participated in this bill
      groupPicks: [],
      selectedGroup: this.props.bill.group,
      image: this.props.bill.image,
      date: this.props.bill.date,
      note: this.props.bill.note
    }
    this.selectConfirm = this.selectConfirm.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount() {
    // participatns for selection
    console.log("mounting");
    this.props.navigation.setParams({
      save: this.edit.bind(this)
    })

  }

  edit () {
    var groupId = this.state.selectedGroup.id
    var participants = [];
    this.state.participants.forEach((p) => {
      if (p.isSelected) {
        var obj = {
          name: p.name,
          email: p.email,
          id: p.id
        }
        participants.push(obj)
      }
    })
    var bill = {
      _id: this.props.bill._id,
      title: this.state.title,
      date: this.state.date,
      total: parseFloat(this.state.total),
      payer: this.props.user,
      participants: participants,
      group: this.state.selectedGroup,
      image: this.state.image,
      note: this.state.note
    }
    console.log("Adding started");
    console.log("BIll is ", bill);
    fetch(url + '/bill/edit/' + groupId, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bill: bill
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("DOING GOOD");
      if (responseJson.success) {
        // when updating a bill make sure to pass iPaid!
        // also update the group
        this.props.updateGroup(responseJson.group);
        var obj = Object.assign({}, responseJson.bill, {iPaid: true})
        this.props.updateBill(obj);
        console.log("editing a bill was successful");
        this.props.navigation.navigate('BillDetail');
        console.log("Now: ", this.props.group, this.props.bill);
      }
    })
    .catch((err) => {
      console.log("Error in attempting to sign up: ", err)
    })

  }

  selectConfirm(list) {
    let {participants} = this.state;
    for (let item of list) {
      let index = participants.findIndex(ele => ele === item);
      if (~index) participants[index].isSelected = true;
      else continue;
    }
    this.setState({participants: participants});
  }

  deleteItem(item) {
    let {participants} = this.state;
    let index = participants.findIndex(a => a === item);
    participants[index].isSelected = false;
    this.setState({participants: participants});
  }

  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    console.log("Status: ", status);
    this.setState({ hasCameraRollPermission: status === 'granted' });
    console.log("Getting there");
    console.log(this.state.hasCameraRollPermission);
    if (this.state.hasCameraRollPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      }).catch((err) => console.log("what's the problem? ", err));

      console.log(result);

      if (!result.cancelled) {
        this.setState({
          image: result.uri,
        });
      }
    }
  }

  render() {
    console.log("Note: ", this.state.participants);
    return (
      <KeyboardAwareScrollView style={{flex: 1, paddingTop: 30, backgroundColor: '#ffd300', paddingHorizontal: 10}}>

        <View style={{ paddingVertical: 5 }} />

        {this.state.selectedGroup &&
          <View>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Participants</Text>
            <LabelSelect
              title="Who owed"
              ref="select"
              style={styles.labelSelect}
              onConfirm={this.selectConfirm}
            >
              {this.state.participants.filter(item => item.isSelected).map((item, index) =>
                <LabelSelect.Label
                  key={'label-' + index}
                  data={item}
                  onCancel={() => {this.deleteItem(item);}}
                >{item.name}</LabelSelect.Label>
              )}
              {this.state.participants.filter(item => !item.isSelected).map((item, index) =>
                <LabelSelect.ModalItem
                  key={'modal-item-' + index}
                  data={item}
                >{item.name}</LabelSelect.ModalItem>
              )}
            </LabelSelect>
          </View>
        }

        <View style={{ flexDirection: 'row' }}>
          {/* image */}
          {this.state.image
            ?
              // <Text>there is a pic</Text>
              <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.pickImage()}>
                  <Image source={{ uri: this.state.image }} style={{ width: 120, height: 120, margin: 20 }} />
                </TouchableOpacity>
              </View>
            :
              <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                <MaterialIcons
                  name="add-a-photo"
                  size={150}
                  onPress={() => this.pickImage()}
                >
                </MaterialIcons>
              </View>
          }

          {/* icon, title, and total */}
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch', marginLeft: 15, marginTop: 5, marginBottom: 5 }}>
            <View>
              <TextField
                label='Title'
                labelTextStyle={{ fontWeight: 'bold'}}
                value={this.state.title}
                tintColor='black'
                baseColor='black'
                labelFontSize={14}
                onChangeText={(text) => this.setState({title: text})}
              />
            </View>

            <View>
              <TextField
                label='Total'
                labelTextStyle={{ fontWeight: 'bold'}}
                value={this.state.total.toString()}
                tintColor='black'
                baseColor='black'
                keyboardType='numeric'
                labelFontSize={14}
                onChangeText={(text) => this.setState({total: text})}
              />
            </View>
          </View>
        </View>

        <View style={{ paddingVertical: 5 }} />

        <View style={{ alignItems: 'center', flexDirection: 'row'}}>
          <View style={{ marginHorizontal: 10, marginTop: 5 }}>
            <FontAwesome name='calendar' size={35}/>
          </View>
          <DatePicker
            date={this.state.date}
            style={{ marginTop: 10, width: 300 }}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              dateInput: {
                marginRight: 36,
                borderRadius: 10,
                borderColor: 'black',
                backgroundColor: '#fff'
              }
            }}
            onDateChange={(date) => {this.setState({date: date})}}/>
         </View>

         <View style={{ paddingVertical: 5 }} />

         <View>
           <Text style={{ fontSize: 14, fontWeight: 'bold'}}>Note</Text>
           <TextInput
             style={pickerSelectStyles.inputIOS}
             multiline={true}
             value={this.state.note}
             onChangeText={(text) => this.setState({note: text})}
             blurOnSubmit={false}
          />
         </View>

         <View style={{ paddingBottom: 50 }} />

      </KeyboardAwareScrollView>

    )
  }
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
    },
});

const mapStateToProps = (state) => {
  console.log("Edit Bill state: ", state);
  return {
    user: state.user,
    group: state.group,
    bill: state.bill
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateGroup: (group) => dispatch({ // add a bill to a group state
      type: 'UPDATE_GROUP',
      payload: group
    }),
    updateBill: (bill) => dispatch({
      type: 'UPDATE_BILL',
      payload: bill
    })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBill);
