

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../aws-exports';
import { KeycodeInput } from 'react-native-keycode';
import FloatingLabelInput from '../floatingInput';

Amplify.configure(awsConfig);
const styles = require('./PasswordResetStyles');

export default class ResetPassword2 extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            code: "",
            new_password: "",
            focus: false
        };
    }

    handleErrors = (err) => {
        if (err.name === "NotAuthorizedException") {
            this.props.navigation.navigate('Login');
        } else {
            console.log(err)
        }
    }

    handleConfirmation = () => {

        console.log(this.state.username)

        Auth.forgotPasswordSubmit(this.state.username, this.state.code, this.state.new_password)
            .then(data => this.props.navigation.navigation('Login'))
            .catch(err => console.log(err));
    }

    ComponentDidMount() {
        this.setState({username: this.props.navigation.state.params.username})
        console.log(this.state.username)
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

                    <Text style={styles.bodyText}>Please enter the code that was emailed to you and your new password below</Text>
                </View>
                <TouchableOpacity activeOpacity={0.1} onPress={() => this.setState({ focus: true })}>
                    <View style={styles.keycode}>
                        <KeycodeInput
                            ref="KeycodeInput"
                            length={6}
                            numeric={true}
                            onChange={(value) => this.setState({ code: value })}
                            value={this.state.code}
                            autoFocus={this.state.focus}
                            autoCorrect={false}
                        />
                    </View>
                </TouchableOpacity>
                <View style={styles.forms}>
                    <View style={styles.inputs}>
                        <FloatingLabelInput
                            label="New Password"
                            style={styles.inputsText}
                            onChangeText={(text) => this.setState({ new_password: text })}
                            value={this.state.new_password}
                        />
                    </View>
                </View>
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

