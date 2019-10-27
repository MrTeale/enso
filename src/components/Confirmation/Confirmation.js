

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../aws-exports';
import { KeycodeInput } from 'react-native-keycode';
import AsyncStorage from '@react-native-community/async-storage';

Amplify.configure(awsConfig);
const styles = require('./ConfirmationStyles');

export default class Confirmation extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            code: "",
            focus: false,
        };
    }

    handleErrors = (err) => {
        if (err.name == "NotAuthorizedException") {
            this.props.navigation.navigate('Login');
        }
    }

    handleConfirmation = () => {
        Auth.confirmSignUp(this.state.username, this.state.code, {
        }).then(data => this.props.navigation.navigate('oandaAuth'))
          .catch(err => this.handleErrors(err));
    }

    componentDidMount() {
        this.setState({username: AsyncStorage.getItem('USERNAME')});
        console.log(this.state.username)
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../images/logo.png')}/>
                </View>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Confirm your</Text>
                    <Text style={styles.headerText}>Account</Text>

                    <Text style={styles.bodyText}>An email will arrive shortly with a designated code.</Text>
                    <Text style={styles.bodyText}>Please enter this code below</Text>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({focus: true})}>
                    <View style={styles.keycode}>
                    
                        <KeycodeInput 
                            ref="KeycodeInput"
                            length={6}
                            numeric={true}
                            onChange={(value) => this.setState({code: value})}
                            value={this.state.code}
                            autoFocus={this.state.focus}
                            autoCorrect={false}/>
                    </View>
                </TouchableOpacity>

                <View style={styles.submitContainer}>
                    <TouchableOpacity onPress={this.handleConfirmation} style={styles.submit}>
                        <Text style={styles.submitText}>Confirm</Text>
                        <Image source={require('../../images/arrow-right.png')} style={styles.submitArrow} />
                    </TouchableOpacity>
                </View>
                <View style={styles.signup}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={styles.linkText}>Didn't recieve an email? Click here to resend</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

