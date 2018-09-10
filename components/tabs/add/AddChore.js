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
import LabelSelect from 'react-native-label-select';
import { Dropdown } from 'react-native-material-dropdown';

import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ImagePicker, Camera, Permissions } from 'expo';

import styles from '../../Styles';
import url from '../../url';
// const url = 'https://46fb06a7.ngrok.io'

class AddChore extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: "New Chore",
    headerRight: <View style={{ marginRight: 10 }}><FontAwesome name="save" size={25} onPress={() => navigation.state.params.save()}></FontAwesome></View>
  });

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      inCharge: [], // members that are in charge of this chore
      groupPicks: [],
      image: undefined,
      selectedGroup: undefined,
      note: ''
    }
    this.selectConfirm = this.selectConfirm.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount() {
    console.log("mounting");
    this.props.navigation.setParams({
      save: this.add.bind(this)
    })


    // groups for selection
    var newArr2 = [...this.props.user.groups];
    for (var i = 0; i < newArr2.length; i ++) {
      newArr2[i].label = newArr2[i].name;
      newArr2[i].value = {
        id: newArr2[i].id,
        name: newArr2[i].name
      }
    }
        this.setState({
      date: new Date(),
      groupPicks: newArr2

    }, () => {
      console.log("Today is: ", this.state.date);
      console.log("Groups: ", this.state.groupPicks);
    })
  }

  add () {
    // var groupId = "5b6a4a3fc552795d4d14f5d8" // hardcode: Hellop's id
    if (!this.state.selectedGroup) {
      console.log("No group chosen");
      Alert.alert(
        'Group name',
        'Please add a group name'
      )
      return;
    } else {
      var groupId = this.state.selectedGroup.id;
      var inCharge = [];
      this.state.inCharge.forEach((i) => {
        if (i.isSelected) {
          var obj = {
            name: i.name,
            email: i.email,
            id: i.id
          }
          inCharge.push(i)
        }
      })
      var chore = {
        title: this.state.title,
        date: this.state.date,
        inCharge: inCharge,
        group: this.state.selectedGroup,
        note: this.state.note,
        image: this.state.image
      }
      console.log("Adding started");
      console.log("Chore is ", chore);
      fetch(url + '/chore/add/' + groupId, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chore: chore
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("DOING GOOD");
        if (responseJson.success) {
          // this.props.toggle();
          console.log("adding a chore was successful");
          // this.props.addChore(responseJson.chore)
          this.props.navigation.navigate('Main');
          this.setState({
            title: '',
            inCharge: [], // members that should participate in this chore
            note: ''
          })
        }
      })
      .catch((err) => {
        console.log("Error in attempting to sign up: ", err)
      })
    }
  }

  selectConfirm(list) {
    let {inCharge} = this.state;
    for (let item of list) {
      let index = inCharge.findIndex(ele => ele === item);
      if (~index) inCharge[index].isSelected = true;
      else continue;
    }
    this.setState({inCharge: inCharge});
  }

  deleteItem(item) {
    let {inCharge} = this.state;
    let index = inCharge.findIndex(a => a === item);
    inCharge[index].isSelected = false;
    this.setState({inCharge: inCharge});
  }

  selectGroup(value, index) {
    console.log("Select this group ", value, index);
    console.log("toggling");
    if (value) {
      fetch(url + '/group/info/' + value.id)
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.success) {

            if (responseJson.group.members) {
              var members = responseJson.group.members;
              console.log("success ", members);

              var newArr = [...members];
              for (var i = 0; i < newArr.length; i ++) {
                newArr[i].isSelected = false
              }

              console.log("new ", newArr);
              this.setState({
                inCharge: newArr,
                selectedGroup: value
              })
            } else {
              Alert.alert(
                'No members',
                'This group does not have any members in it'
              )
            }
          }
        })
    }
  }

  toggleLabelSelect(selectedGroup) {
    console.log("toggling");
    fetch(url + '/group/info/' + selectedGroup.id)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          var members = responseJson.group.members;
          console.log("success ", members);
          this.setState({
            inCharge: members
          })
        }
      })
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
    let data = [{
      value: 'Banana',
    }, {
      value: 'Mango',
    }, {
      value: 'Pear',
    }];

    return (
      <KeyboardAwareScrollView style={{flex: 1, paddingTop: 30, backgroundColor: '#ffd300', paddingHorizontal: 10}}>
        <View>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Group</Text>
          <RNPickerSelect
            placeholder={{
                label: 'Select a Group',
                value: null,
            }}
            items={this.state.groupPicks}
            onValueChange={(value, index) => this.selectGroup(value, index)}
            style={{ ...pickerSelectStyles }}
            value={this.state.selectedGroup}
          />
        </View>

        <View style={{ paddingVertical: 5 }} />

        {this.state.selectedGroup &&
          <View>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Participants</Text>
            <LabelSelect
              title="Who's in charge"
              ref="select"
              style={styles.labelSelect}
              onConfirm={this.selectConfirm}
            >
              {this.state.inCharge.filter(item => item.isSelected).map((item, index) =>
                <LabelSelect.Label
                  key={'label-' + index}
                  data={item}
                  onCancel={() => {this.deleteItem(item);}}
                >{item.name}</LabelSelect.Label>
              )}
              {this.state.inCharge.filter(item => !item.isSelected).map((item, index) =>
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
                marginRight: 10,
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
  console.log("add chore state: ", state);
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

export default connect(mapStateToProps, mapDispatchToProps)(AddChore);
