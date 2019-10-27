

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../aws-exports';
import FloatingLabelInput from '../floatingInput';

Amplify.configure(awsConfig);
const styles = require('./PasswordResetStyles');

export default class ResetPassword1 extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            code: "",
            new_password: "",
            error_message: ""
        };
    }

    handleErrors = (err) => {
        if (err.name === "InvalidParameterException") {
            this.setState({error_message: "This account doesn't have a verified email. Please contact support"})
        } else if (err.name === "LimitExceededException") {
            this.setState({error_message: "Too many attempts. Please try again shortly"})
        }else {
            console.log(err)
        }
    }

    handleResetPassword = () => {
        Auth.forgotPassword(this.state.username)
            .then(data => this.props.navigation.navigate('ResetPassword2', {username: JSON.stringify(this.state.username)}))
            .catch(err => this.handleErrors(err));
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../images/logo.png')} />
                </View>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Reset your</Text>
                    <Text style={styles.headerText}>Password</Text>

                    <Text style={styles.bodyText}>Please enter your username below</Text>
                </View>
                <View style={styles.forms}>
                    <Text>{this.state.error_message}</Text>
                    <View style={styles.inputs}>
                        <FloatingLabelInput
                            label="Username"
                            style={styles.inputsText}
                            onChangeText={(text) => this.setState({ username: text })}
                            value={this.state.username}
                        />
                    </View>
                </View>
                <View style={styles.submitContainer}>
                    <TouchableOpacity onPress={this.handleResetPassword} style={styles.submit}>
                        <Text style={styles.submitText}>Continue</Text>
                        <Image source={require('../../images/arrow-right.png')} style={styles.submitArrow} />
                    </TouchableOpacity>
                </View>
                <View style={styles.signup}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={styles.linkText}>Remembered your password? Click here to Sign In </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

