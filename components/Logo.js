import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { AppLoading, Asset, Font, Icon } from 'expo';

import styles from './Styles';
import logo from '../assets/shareliving-logo1.png';

const url = 'https://c56f787d.ngrok.io'


class Logo extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      loadingUser: false
    }
  }

  componentDidMount() {
    this.setState({
      loadingUser: true,
    })
    AsyncStorage.getItem('user')
      .then((result) => {
        console.log("R", result);
        if (result) {
          var parsedResult = JSON.parse(result);
          console.log(parsedResult);
          var email = parsedResult.email;
          var password = parsedResult.password;
          if (email && password) {
            fetch(url + '/user/' + parsedResult._id)
              .then((response) => response.json())
              .then((responseJson) => {
                if (responseJson.success) {
                  console.log("YES");
                  this.props.onLogin(responseJson.user);
                  // this.props.toggle();
                  // console.log("USER now is: ", this.props.user);
                  // console.log("Current state is: ", this.props.loggedIn);
                  this.props.navigation.navigate('Main');
                  this.setState({
                    loadingUser: false
                  })
                  // this.setTimeout(() => {
                  //   this.setState({
                  //     loadingUser: false
                  //   },() => console.log("still loading user?", this.state.loadingUser))
                  // }, 2000)

                }
              })
              .then(() => {
                this.setState({
                  loadingUser: false
                })
              })
              .catch((err) => {
                console.log("ERROR");
              })
          } else {
            this.setState({
              loadingUser: false
            })
          }
        } else {
          this.setState({
            loadingUser: false
          })
          console.log("loading... ", this.state.loadingUser);
        }

      })
      .catch(err => {
        console.log('ERR: ',err);
      })
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('../assets/shareliving-logo1.png'),
      ])
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ loading: false });
  };

  render() {
    console.log("loading user? ", this.state.loadingUser);
    return (
      // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd300'}}>
      //   {this.state.loading
      //     ?
      //       <AppLoading
      //         startAsync={this._loadResourcesAsync}
      //         onError={this._handleLoadingError}
      //         onFinish={this._handleFinishLoading}
      //       />
      //     :
      //
      //       <View>
      //         <Image
      //           style={{ width: 275, height: 288 }}
      //           source={logo}
      //         />
      //         <Text style={{ marginVertical: 15, fontSize: 18, fontWeight: 'bold' }}>Welcome to Shareliving</Text>
      //         <TouchableOpacity
      //           style={styles.startButton}
      //           onPress={() => this.props.navigation.navigate('Login')}>
      //           <Text style = {{
      //             fontWeight: 'bold',
      //             color: '#ffd300'
      //           }}>Login</Text>
      //         </TouchableOpacity>
      //         <TouchableOpacity
      //           style={styles.startButton}
      //           onPress={() => this.props.navigation.navigate('Signup')}>
      //           <Text style = {{
      //             fontWeight: 'bold',
      //             color: '#ffd300'
      //           }}>Sign Up</Text>
      //         </TouchableOpacity>
      //       </View>
      //   }
      // </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd300'}}>
        {this.state.loading ?
            <AppLoading
              startAsync={this._loadResourcesAsync}
              onError={this._handleLoadingError}
              onFinish={this._handleFinishLoading}
            />
          : this.state.loadingUser ?
            <View style={{justifyContent: 'center', padding: 10, alignItems: 'center'}}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          :
            <View>
              <Image
                style={{ width: 275, height: 288 }}
                source={logo}
              />
              <View>
                <Text style={{ marginVertical: 15, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Welcome to Shareliving</Text>
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => this.props.navigation.navigate('Login')}>
                <Text style = {{
                  fontWeight: 'bold',
                  color: '#ffd300'
                }}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => this.props.navigation.navigate('Signup')}>
                <Text style = {{
                  fontWeight: 'bold',
                  color: '#ffd300'
                }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
        }
      </View>


    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    loggedIn: state.loggedIn
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // update the user state by logging in
    onLogin: (user) => dispatch({
      type: 'GET_USER',
      payload: user
    }),
    toggle: () => dispatch({
      type: 'TOGGLE'
    })

  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Logo);
