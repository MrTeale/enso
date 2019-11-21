

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FloatingLabelInput from '../floatingInput';
import Auth0 from 'react-native-auth0';

const styles = require('./OandaAuthStyles');

var credentials = require('../../auth0-credentials');
const auth0 = new Auth0(credentials);

export default class OandaAuth extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            oandaAPIKey: ""
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

    handleAPIKey = async () => {
        const USER_ID = await AsyncStorage.getItem('USER_ID');
        const ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
        console.log(USER_ID)
        console.log(ACCESS_TOKEN)
        auth0.users(ACCESS_TOKEN)
            .patchUser({id: USER_ID, metadata: {"oandaApiKey": this.state.oandaAPIKey}})
            .then(success => {
                AsyncStorage.setItem('OANDA_API_KEY', this.state.oandaAPIKey);    
                this.props.navigation.navigate('App');
            })
            .catch(error => { 
                console.log(error)
                this.alert('Error', error.json.description) 
            });
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
                    <Text style={styles.headerText}>OANDA</Text>
                    <Text style={styles.headerText}>API Key</Text>

                    <Text style={styles.bodyText}>Your OANDA API Key will be needed for this application to function</Text>
                    <Text style={styles.bodyText}>Please enter your key below</Text>
                </View>
                <View style={styles.forms}>
                    <View style={styles.inputs}>
                        <FloatingLabelInput
                            label="OANDA API Key"
                            style={styles.inputsText}
                            onChangeText={(text) => this.setState({oandaAPIKey: text})}
                            value={this.state.oandaAPIKey}
                        />
                    </View>
                </View>
                <View style={styles.submitContainer}>
                    <TouchableOpacity onPress={this.handleAPIKey} style={styles.submit}>
                        <Text style={styles.submitText}>Confirm</Text>
                        <Image source={require('../../images/arrow-right.png')} style={styles.submitArrow} />
                    </TouchableOpacity>
                </View>
                <View style={styles.signup}>
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.linkText}>Don't know where you API Key is? Click here</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

