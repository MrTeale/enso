import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Alert} from 'react-native';
import FloatingLabelInput from '../floatingInput';
import AsyncStorage from '@react-native-community/async-storage';
import Auth0 from 'react-native-auth0';

const styles = require('./LoginStyles');

var credentials = require('../../auth0-credentials');
const auth0 = new Auth0(credentials);

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
        };
    }

    alert(title, message) {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
        );
    }

    onSuccess = async (credentials) => {
        auth0.auth
            .userInfo({ token: credentials.accessToken })
            .then(profile => {
                console.log("User Logged In")
                console.log(profile)
                console.log(credentials)
                console.log(profile.sub)
                AsyncStorage.setItem('USERNAME', profile.nickname);
                AsyncStorage.setItem('ACCESS_TOKEN', credentials.accessToken);
                AsyncStorage.setItem('ID_TOKEN', credentials.idToken);
                AsyncStorage.setItem('USER_ID', profile.sub);
                if (profile.emailVerified == false) {
                    this.props.navigation.navigate('Confirmation');
                } else {
                    if (profile["https://enso:au:auth0:com/user_metadata"] !== undefined) {
                        AsyncStorage.setItem('OANDA_API_KEY', profile["https://enso:au:auth0:com/user_metadata"].oandaApiKey);    
                        this.props.navigation.navigate('App');
                    } else {
                        this.props.navigation.navigate('OandaAuth');
                    }
                }
            })
            .catch(error => Alert.alert('Error', error.json.error_description));
    }

    handleSignIn = () => {
        auth0.auth
            .passwordRealm({
                username: this.state.email,
                password: this.state.password,
                realm: 'Username-Password-Authentication',
                scope: 'openid profile email read:current_user update:current_user_metadata',
                audience: 'https://' + credentials.domain + '/api/v2/'
            })
            .then(credentials => {
                this.onSuccess(credentials);
            })
            .catch(error => this.alert('Error', error.json.error_description));
    }

    webAuth(connection) {
        auth0.webAuth
            .authorize({
                scope: 'openid profile email read:current_user update:current_user_metadata',
                connection: connection,
                audience: 'https://' + credentials.domain + '/api/v2/'
            })
            .then(credentials => {
                this.onSuccess(credentials);
            })
            .catch(error => Alert.alert('Error', error.error_description));
    };

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
                            label="Email"
                            style={styles.inputsText}
                            onChangeText={(text) => this.setState({ email: text })}
                            value={this.state.email}
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
                    <TouchableOpacity onPress={() => this.webAuth('facebook')} style={styles.facebook}>
                        <Image source={require('../../images/facebook.png')} style={styles.socialIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.webAuth('google-oauth2')} style={styles.google}>
                        <Image source={require('../../images/google.png')} style={styles.socialIcon} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

