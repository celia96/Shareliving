import React, {Component} from 'react';
import {Animated, Easing, TouchableHighlight, TouchableOpacity, View, TextInput, Text, Dimensions} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import SlidingUpPanel from 'rn-sliding-up-panel';

const SIZE = 80;
const durationIn = 300;
const durationOut = 200;

export default class AddButton extends Component {
    mode = new Animated.Value(0);
    icon1 = new Animated.Value(0);
    icon2 = new Animated.Value(0);

    toggleView = () => {
        if (this.mode._value) {
            Animated.parallel(
                [this.mode, this.icon1, this.icon2].map((item) => Animated.timing(item, {
                    toValue: 0,
                    duration: durationIn,
                    easing: Easing.cubic
                }))
            ).start();
        } else {

            Animated.parallel([
                Animated.timing(this.mode, {
                    toValue: 1,
                    duration: durationOut,
                    easing: Easing.cubic
                }),
                Animated.sequence([
                    ...[this.icon1, this.icon2].map((item) => Animated.timing(item, {
                        toValue: 1,
                        duration: durationOut,
                        easing: Easing.elastic(1)
                    }))
                ])
            ]).start();
        }
    };

    toggleBill() {
      this.props.navigation.navigate('AddBill')
    }

    toggleChore() {
      this.props.navigation.navigate('AddChore')
    }

    render() {
        const firstX = this.icon1.interpolate({
            inputRange: [0, 1],
            outputRange: [20, -40]
        });
        const firstY = this.icon1.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -30]
        });
        const thirdX = this.icon2.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 80]
        });
        const thirdY = this.icon2.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -30]
        });

        const rotation = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '45deg']
        });

        const bluring = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 5]
        });

        const blurin2 = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -20]
        });
        console.log("DIM ", Dimensions.get('window').width);
        return (
            <View style={{
                position: 'absolute',
                alignItems: 'center'
            }}>
                <SubAddButton
                    style={{
                        left: firstX,
                        top: firstY
                    }}
                    icon="receipt"
                    onPress={() => this.toggleBill()}
                />
                <SubAddButton
                    style={{
                        left: thirdX,
                        top: thirdY
                    }}
                    icon="delete-empty"
                    onPress={() => this.toggleChore()}
                />

                <TouchableOpacity
                    onPress={this.toggleView}
                    activeOpacity={1}
                >
                  <Animated.View style={{
                      transform: [
                          {rotate: rotation}
                      ],
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: SIZE,
                      height: SIZE,
                      borderRadius: SIZE / 2,
                      backgroundColor: '#ffd300',
                  }}>
                    <Icon name="plus" size={24} color="#F8F8F8"/>
                  </Animated.View>
                </TouchableOpacity>

            </View>
        );
    }
}

class SubAddButton extends Component {
    render() {
        const {
            style,
            icon,
            onPress
        } = this.props;

        return (
            <Animated.View style={{
                position: 'absolute',
                ...style
            }}>
                <TouchableHighlight
                    onPress={() => onPress && onPress()}
                    style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: SIZE / 2,
                        height: SIZE / 2,
                        borderRadius: SIZE / 4,
                        backgroundColor: '#ffd300'
                    }}
                >
                    <MaterialCommunityIcons name={icon} size={22} color="#F8F8F8"/>
                </TouchableHighlight>
            </Animated.View>
        );
    }
}

SubAddButton.propTypes = {
    icon: PropTypes.string.isRequired,
    onPress: PropTypes.func
};
