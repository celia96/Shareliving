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

class ChoreDetail extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Detail',
    headerLeft: <View style={{ marginLeft: 10 }}>
                  <MaterialIcons name="home" size={25} onPress={() => navigation.navigate('GroupView')}>
                  </MaterialIcons>
                </View>,
    headerRight: <View style={{ marginRight: 10 }}>
                  <FontAwesome name="edit" size={25} onPress={() => navigation.state.params.edit()}>
                  </FontAwesome>
                 </View>

  });

  constructor(props) {
    super(props)

    this.state = {
      chore: {},
      image: this.props.chore.image
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      edit: this.edit.bind(this)
    })
  }

  edit() {
    this.props.navigation.navigate('EditChore')
  }

  attemptDelete(choreId) {
    console.log("attempting to delete");
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this chore?',
      [
        {text: 'Yes', onPress: () => this.delete(choreId)},
        {text: 'No', onPress: () => console.log('No')},
      ],
      { cancelable: true }
    )
  }

  delete(choreId) {
    fetch(url + '/chore/delete/' + choreId, {
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
        this.props.navigation.navigate('GroupView')
      }
    })
    .catch((err) => {
      console.log("Error in attempting to sign up: ", err)
    })
  }

  remindAttempt(inCharge) {
    console.log("Let's send a notification and email to this participant");
    Alert.alert(
      'Reminder',
      'Are you sure you want to send a reminder?',
      [
        {text: 'Yes', onPress: () => this.remind(inCharge)},
        {text: 'No', onPress: () => console.log('No')},
      ],
      { cancelable: true }
    )
  }

  remind(inCharge) {
    fetch(url + '/send/reminder', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inCharge: inCharge,
        from: this.props.user.name,
        task: this.props.chore.title
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          'Success',
          'Reminder has been sent!',
        )
      }
    })
    .catch((err) => {
      console.log("There was an error in attempting to send an email ", err);
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
        // fetch post the image to the bill model
        this.setState({
          image: result.uri,
        });
        fetch(url + '/chore/update/image/:id', {
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

  participantView(participant) {
    return (
      <View key={'participant-chore-detail' + participant.id} style={{backgroundColor: '#fff'}}>
        <ListItem
          title={participant.name}
          rightTitle={'remind'}
          rightIcon={{name: 'send', type: 'font-awesome', size: 30}}
          onPressRightIcon={() => this.remindAttempt(participant)}
          leftIcon={{name: 'user', type: 'font-awesome', size: 30}}
        />
      </View>
    )
  }

  render() {
    console.log("rendering chore detail");
    console.log("props ", this.props.chore);
    return (
      <View style={styles.homeContainer}>
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#ffd300', flexDirection: 'row' }}>
            {this.props.chore.image
              ?
                // <Text>there is a pic</Text>
                <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                  <TouchableOpacity onPress={() => this.pickImage()}>
                    <Image source={{ uri: this.state.image }} style={{ width: 60, height: 60, margin: 20 }} />
                  </TouchableOpacity>
                </View>
              :
                <View style={{ alignItems: 'flex-start', justifyContent: 'center', margin: 20 }}>
                  <FontAwesome
                    name="trash-o"
                    size={60}
                    onPress={() => this.pickImage()}
                  >
                  </FontAwesome>
                </View>
            }
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{this.props.chore.title}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{this.props.chore.date.slice(0, 10)}</Text>
            </View>
          </View>
          <Divider style={{ backgroundColor: 'black' }} />

          <ScrollView>
            <View style={{ flex: 1 }}>
              {this.props.chore.inCharge.map((p) =>
                this.participantView(p))}
            </View>
            <View style={{ marginVertical: 15 }}/>
            <View style={{ marginHorizontal: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold'}}>Note</Text>
              <TextInput
                style={pickerSelectStyles.inputIOS}
                multiline={true}
                editable={false}
                value={this.props.chore.note}
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
                onPress={() => this.attemptDelete(this.props.chore._id)}
                title='DELETE' />
            </View>
            <View style={{ marginVertical: 15}}/>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.log("Chore detail state: ", state);
  return {
    user: state.user,
    group: state.group,
    chore: state.chore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateChore: (chore) => dispatch({
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

export default connect(mapStateToProps, mapDispatchToProps)(ChoreDetail);
