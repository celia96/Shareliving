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
  ScrollView,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, ListItem, Button, Divider } from 'react-native-elements'
import SlidingUpPanel from 'rn-sliding-up-panel';
import DatePicker from 'react-native-datepicker';
import LabelSelect from 'react-native-label-select';
import { Dropdown } from 'react-native-material-dropdown';

import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Swipeout from 'react-native-swipeout';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { ImagePicker, Camera, Permissions } from 'expo';


import styles from '../../../Styles';
import url from '../../../url';

// const url = 'https://c56f787d.ngrok.io'

class BillDetail extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Details',
    headerLeft: <View style={{ marginLeft: 10 }}>
      <MaterialIcons name="home" size={25} onPress={() => navigation.navigate('GroupView')}>
      </MaterialIcons>
    </View>,
    headerRight: <View>
      {navigation.state.params.iPaid
        ?
          <View style={{ marginRight: 10 }}>
            <FontAwesome name="edit" size={25} onPress={() => navigation.state.params.edit()}>
            </FontAwesome>
          </View>
        :
          <View></View>
        }
      </View>,
  });

  constructor(props) {
    super(props)

    this.state = {
      bill: {},
      image: this.props.bill.image
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      edit: this.edit.bind(this)
    })
  }


  edit() {
    this.props.navigation.navigate('EditBill')

  }

  attemptDelete(billId) {
    console.log("attempting to delete");
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this bill?',
      [
        {text: 'Yes', onPress: () => this.delete(billId)},
        {text: 'No', onPress: () => console.log('No')},
      ],
      { cancelable: true }
    )
  }

  delete(billId) {
    fetch(url + '/bill/delete/' + billId, {
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
        this.props.updateGroup(responseJson.group)
        console.log("deleting was successful");
        console.log(responseJson.group);
        console.log(responseJson.bills);
        this.props.navigation.navigate('GroupView')
      }
    })
    .catch((err) => {
      console.log("Error in attempting to sign up: ", err)
    })
  }

  requestAttempt(participant, amount) {
    console.log("Let's send a notification and email to this participant");
    Alert.alert(
      'Request',
      'Are you sure you want to send a request?',
      [
        {text: 'Yes', onPress: () => this.request(participant, amount)},
        {text: 'No', onPress: () => console.log('No')},
      ],
      { cancelable: true }
    )
  }

  request(participant, amount) {
    fetch(url + '/send/request', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        participant: participant,
        amount: amount,
        from: this.props.user.name
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          'Success',
          'Request has been sent!',
        )
      }
    })
    .catch((err) => {
      console.log("There was an error in attempting to send an email ", err);
    })
  }

  youPaidParticipantView(participant, amount) {
    var name = participant.name;
    var verb = "owes"
    if (participant.id.toString() === this.props.user._id.toString()) {
      console.log("It's me!");
      name = "You";
      verb = "owe"
    }
    return (
      <View key={'participant-bill-detail' + participant.id} style={{backgroundColor: '#fff'}}>
          <ListItem
            title={name}
            subtitle={verb + ' $' + amount}
            leftIcon={{name: 'user', type: 'font-awesome', size: 30}}
          />
      </View>
    )
  }

  iPaidParticipantView(participant, amount) {
    return (
      <View key={'participant-bill-detail' + participant.id} style={{backgroundColor: '#fff'}}>
        <ListItem
          title={participant.name}
          subtitle={'owes $' + amount}
          rightTitle={'request'}
          rightIcon={{name: 'send', type: 'font-awesome', size: 30}}
          onPressRightIcon={() => this.requestAttempt(participant, amount)}
          leftIcon={{name: 'user', type: 'font-awesome', size: 30}}
        />
      </View>
    )
  }

  youPaidView(amount) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#ffd300', flexDirection: 'row' }}>
          <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
            {this.props.bill.image
              ?
              <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                <Image source={{ uri: this.state.image }} style={{ width: 60, height: 60, margin: 20 }} />
              </View>
              :
              <View style={{ alignItems: 'flex-start', justifyContent: 'center', margin: 20 }}>
                <MaterialCommunityIcons
                  name="receipt"
                  size={60}
                >
                </MaterialCommunityIcons>
              </View>
            }
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{this.props.bill.title}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>${this.props.bill.total}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{this.props.bill.date.slice(0, 10)}</Text>
          </View>
        </View>
        <Divider style={{ backgroundColor: 'black', height: 2 }} />
        <View style={{ height: 40, backgroundColor: '#ffc30b', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: 20 }}>
            {this.props.bill.payer.name} paid ${this.props.bill.total}
          </Text>
        </View>
        <Divider style={{ backgroundColor: 'black' }} />
        <ScrollView>
          {this.props.bill.participants.map((p) =>
            this.youPaidParticipantView(p, amount))}
        </ScrollView>

      </View>
    )
  }

  iPaidView(amount) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#ffd300', flexDirection: 'row' }}>
          {this.props.bill.image
            ?
              // <Text>there is a pic</Text>
              <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.pickImage()}>
                  <Image source={{ uri: this.state.image }} style={{ width: 60, height: 60, margin: 20 }} />
                </TouchableOpacity>
              </View>
            :
              <View style={{ alignItems: 'flex-start', justifyContent: 'center', margin: 20 }}>
                <MaterialCommunityIcons
                  name="receipt"
                  size={60}
                  onPress={() => this.pickImage()}
                >
                </MaterialCommunityIcons>
              </View>
          }
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{this.props.bill.title}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>${this.props.bill.total}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{this.props.bill.date.slice(0, 10)}</Text>
          </View>
        </View>
        <Divider style={{ backgroundColor: 'black', height: 2 }} />
        <View style={{ height: 40, backgroundColor: '#ffc30b', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: 20 }}>
            You paid ${this.props.bill.total}
          </Text>
        </View>
        <Divider style={{ backgroundColor: 'black' }} />
        <ScrollView>
          <View style={{ flex: 1 }}>
            <View>
              {this.props.bill.participants.map((p) =>
                this.iPaidParticipantView(p, amount))}
            </View>
            <View style={{ marginVertical: 15 }}/>
            <View style={{ marginHorizontal: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold'}}>Note</Text>
              <TextInput
                style={pickerSelectStyles.inputIOS}
                multiline={true}
                editable={false}
                value={this.props.bill.note}
              />
            </View>
            <View style={{ marginVertical: 15}}/>
            <View>
              <Button
                round
                containerViewStyle={{ borderRadius: 5 }}
                borderRadius={5}
                backgroundColor="#ffd300"
                icon={{name: 'remove', type: 'font-awesome'}}
                onPress={() => this.attemptDelete(this.props.bill._id)}
                title='DELETE' />
            </View>
            <View style={{ marginVertical: 15}}/>
          </View>
        </ScrollView>
      </View>
    )
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
        // fetch post the image to the bill model
        this.setState({
          image: result.uri,
        });
        fetch(url + '/bill/update/image/:id', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image: result.uri,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.success) {
            console.log("successfully updated a image");
          }
        })
        .catch((err) => {
          console.log("There was an error in attempting to send an email ", err);
        })
      }
    }

  }

  render() {
    console.log("rendering bill details");
    console.log("", this.props.bill.participants);
    var amount = Math.round((this.props.bill.total / (this.props.bill.participants.length + 1)) * 100) / 100;
    console.log("Amount to pay: ", amount);
    return (
      <View style={styles.homeContainer}>
        {this.props.bill.iPaid
        ?
          this.iPaidView(amount)
        :
          this.youPaidView(amount)
        }

      </View>
    )
  }
}


const mapStateToProps = (state) => {
  console.log("Bill detail state: ", state);
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
    }),
    updateGroup: (group) => dispatch({
      type: 'UPDATE_GROUP',
      payload: group
    })

  };
};

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

export default connect(mapStateToProps, mapDispatchToProps)(BillDetail);
