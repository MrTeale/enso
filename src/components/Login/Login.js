import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import FloatingLabelInput from '../floatingInput';
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import awsConfig from '../../aws-exports';
import AsyncStorage from '@react-native-community/async-storage';

Amplify.configure(awsConfig);
const styles = require('./LoginStyles');

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
        };
        this.handleSignIn = this.handleSignIn.bind(this);
    }

    handleAuthError = (err) => {
        if (err.name === "UserNotConfirmedException") {
            this.props.navigation.navigate('Confirmation')
        } else {
            console.log(err)
        }
    }

    handleSignIn = async () => {
        const query = `
            query listAll {
                listEnsoUsers(filter: {
                username: {
                    contains: ${JSON.stringify(this.state.username)}
                }
                }) {
                items {
                    id
                    oandaAPIKey
                    username
                }
                }
            }
        `

        Auth.signIn(
            this.state.username,
            this.state.password).then(async user => {
                console.log("User Logged In")
                AsyncStorage.setItem('USERNAME', user.username);
                AsyncStorage.setItem('ACCESS_TOKEN', user.signInUserSession.accessToken.jwtToken);
                AsyncStorage.setItem('ID_TOKEN', user.signInUserSession.idToken.jwtToken);
                AsyncStorage.setItem('REFRESH_TOKEN', user.signInUserSession.refreshToken.token);
                const result = await API.graphql(graphqlOperation(query));
                if (typeof result.data.listEnsoUsers.items[0] !== 'undefined') {
                    AsyncStorage.setItem('OANDA_API_KEY', result.data.listEnsoUsers.items[0].oandaAPIKey);
                    this.props.navigation.navigate('App');
                } else {
                    this.props.navigation.navigate('OandaAuth', {username: this.state.username});
                }

            })
            .catch(err => this.handleAuthError(err));
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../images/logo.png')} />
                </View>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Welcome</Text>
                    <Text style={styles.headerText}>Back</Text>
                </View>
                <View style={styles.forms}>
                    <View style={styles.inputs}>
                        <FloatingLabelInput
                            label="Username"
                            style={styles.inputsText}
                            onChangeText={(text) => this.setState({ username: text })}
                            value={this.state.username}
                        />
                    </View>
                    <View style={styles.inputs}>
                        <FloatingLabelInput
                            label="Password"
                            style={styles.inputsText}
                            onChangeText={(text) => this.setState({ password: text })}
                            value={this.state.password}
                            secureTextEntry={true}
                        />
                    </View>
                </View>
                <View style={styles.forgot}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ResetPassword1')}>
                        <Text style={styles.linkText}>Forgot your password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.submitContainer}>
                    <TouchableOpacity onPress={this.handleSignIn} style={styles.submit}>
                        <Text style={styles.submitText}>Sign In</Text>
                        <Image source={require('../../images/arrow-right.png')} style={styles.submitArrow} />
                    </TouchableOpacity>
                </View>
                <View style={styles.signup}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                        <Text style={styles.linkText}>Don’t have an account? Sign up</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.socials}>
                    <TouchableOpacity onPress={() => Auth.federatedSignIn({provider: 'Facebook'})} style={styles.facebook}>
                        <Image source={require('../../images/facebook.png')} style={styles.socialIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Auth.federatedSignIn({provider: 'Google'})} style={styles.google}>
                        <Image source={require('../../images/google.png')} style={styles.socialIcon} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

