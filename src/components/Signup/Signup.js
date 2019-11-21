import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import FloatingLabelInput from '../floatingInput';
import Auth0 from 'react-native-auth0';

const styles = require('./SignUpStyles');
var credentials = require('../../auth0-credentials');
const auth0 = new Auth0(credentials);

export default class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            username: ""
        };
        this.handleSignUp = this.handleSignUp.bind(this);
    }
    
    alert(title, message) {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
        );
    }

    handleSignUp = () => {
        auth0.auth
            .createUser({
                email: this.state.email,
                password: this.state.password,
                username: this.state.username,
                connection: 'Username-Password-Authentication',
            })
            .then(success => {
                console.log(success)
                this.alert('Success', 'New user created')
            })
            .catch(error => { 
                Alert.alert('Error', error.json.description) 
            });
    }


    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../images/logo.png')}/>
                </View>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Create an</Text>
                    <Text style={styles.headerText}>Account</Text>
                </View>
                <View style={styles.forms}>
                    <View style={styles.inputs}>
                        <FloatingLabelInput
                            label="Email"
                            style={styles.inputsText}
                            onChangeText={(text) => this.setState({email: text})}
                            value={this.state.email}
                        />
                    </View>
                    <View style={styles.inputs}>
                        <FloatingLabelInput
                            label="Username"
                            style={styles.inputsText}
                            onChangeText={(text) => this.setState({username: text})}
                            value={this.state.username}
                        />
                    </View>
                    <View style={styles.inputs}>
                        <FloatingLabelInput
                            label="Password"
                            style={styles.inputsText}
                            onChangeText={(text) => this.setState({password: text})}
                            value={this.state.password}
                            secureTextEntry={true}
                        />
                    </View>
                </View>
                <View style={styles.submitContainer}>
                    <TouchableOpacity onPress={this.handleSignUp} style={styles.submit}>
                        <Text style={styles.submitText}>Sign Up</Text>
                        <Image source={require('../../images/arrow-right.png')} style={styles.submitArrow} />
                    </TouchableOpacity>
                </View>
                <View style={styles.signup}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={styles.linkText}>Already have an account? Sign In</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.socials}>
                    <TouchableOpacity onPress={this.handlPress} style={styles.facebook}>
                        <Image source={require('../../images/facebook.png')} style={styles.socialIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlPress} style={styles.google}>
                        <Image source={require('../../images/google.png')} style={styles.socialIcon} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

