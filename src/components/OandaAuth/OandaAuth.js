

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsConfig from '../../aws-exports';
import AWSAppSyncClient from "aws-appsync";
import AsyncStorage from '@react-native-community/async-storage';
import FloatingLabelInput from '../floatingInput';

Amplify.configure(awsConfig);
const styles = require('./OandaAuthStyles.js');

export default class OandaAuth extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            oandaAPIKey: ""
        };
    }

    handleAPIKey = () => {
        const mutation = `
            mutation createEnsoUsers($createensousersinput: CreateEnsoUsersInput!) {
                createEnsoUsers(input: $createensousersinput) {
                    id
                    oandaAPIKey
                    username
                }
            }
        `

        inputs = {
            oandaAPIKey: JSON.stringify(this.state.oandaAPIKey),
            username: JSON.stringify(this.state.username)
        };

        API.graphql(graphqlOperation(mutation, { input: inputs }));
        AsyncStorage.setItem('OANDA_API_KEY', this.state.oandaAPIKey);
        this.props.navigation.navigate('Home');
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

                    <Text style={styles.bodyText}>An email will arrive shortly with a designated code.</Text>
                    <Text style={styles.bodyText}>Please enter this code below</Text>
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

