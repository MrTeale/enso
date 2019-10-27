import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StatusBar, Dimensions, Platform } from 'react-native';
import Amplify from 'aws-amplify';
import awsConfig from '../../aws-exports';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

Amplify.configure(awsConfig);
const styles = require('./ViewTradeStyles');

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class ViewTrade extends Component {
    constructor() {
        super();
        this.state = {
            height: HEIGHT / 8 * 3,
            backgroundHeight: HEIGHT / 8 * 3,
            barStyle: 'dark-content'
        };
    }

    _onScroll(e) {
        // from the nativeEvent we can get the contentOffsett
        var offset_y = e.nativeEvent.contentOffset.y;
        if (offset_y > 0) {
            if (this.state.height >= 0) {
                // we are scrolling down the list, decrease height of the empty view
                this.setState({ height: this.state.height - offset_y });
            }
        }
        if (offset_y < 0) {
            if (this.state.height - offset_y <= this.state.backgroundHeight) {
                // we are scrolling up the list, increase size of empty view/map view 
                this.setState({ height: this.state.height - offset_y });
            } else {
                this.setState({ height: this.state.backgroundHeight })
            }
        }
        if (this.state.height < 30) {
            this.setState({ barStyle: 'light-content' })
        } else {
            this.setState({ barStyle: 'dark-content' })
        }
    }

    text_color = (num) => {
        if (num < 0) {
            return { color: '#E71B1B' }
        } else if (num > 0) {
            return { color: '#1BE777' }
        } else {
            return { color: '#FFFFFF' }
        }
    };


    findAccount = async () => {
        const api_key = await AsyncStorage.getItem('OANDA_API_KEY');

        fetch('https://api-fxpractice.oanda.com/v3/accounts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + api_key.replace(/"/g, '')
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                let obj = responseJson.accounts.find(o => o.id.substr(o.id.length - 3) === '001');
                AsyncStorage.setItem('OANDA_Account', obj.id);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    checkAccountID = async () => {
        const accountID = await AsyncStorage.getItem('OANDA_Account');
        if (accountID === null) {
            this.findAccount();
        } else {
            this.getTrade();
        }
    }

    getTrade = async () => {
        const api_key = await AsyncStorage.getItem('OANDA_API_KEY');
        const accountId = await AsyncStorage.getItem('OANDA_Account');

        fetch('https://api-fxpractice.oanda.com/v3/accounts/' + accountId + '/trades/' + this.state.trade.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + api_key.replace(/"/g, '')
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.getPricing(responseJson.trade);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getPricing = async (accountTrade) => {
        const api_key = await AsyncStorage.getItem('OANDA_API_KEY');
        const accountId = await AsyncStorage.getItem('OANDA_Account');
        const instrument = [accountTrade.instrument]
        const data = {
            instruments: instrument,
            includeUnitsAvialable: false,
            includeHomeConversions: true
        }
        var queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');
        fetch('https://api-fxpractice.oanda.com/v3/accounts/' + accountId + '/pricing?' + queryString, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + api_key
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (accountTrade.currentUnits < 0) {
                    var pips = -(parseFloat(responseJson.prices[0].asks[0].price) - parseFloat(accountTrade.price)) * 10000
                    accountTrade.pips = pips
                    accountTrade.currentPrice = responseJson.prices[0].asks[0].price
                } else {
                    var pips = (parseFloat(responseJson.prices[0].bids[0].price) - parseFloat(accountTrade.price)) * 10000
                    accountTrade.pips = pips
                    accountTrade.currentPrice = responseJson.prices[0].bids[0].price
                };
                this.setState({ trade: accountTrade })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    intervalCalls = () => {
        this.getTrade();
    }

    UNSAFE_componentWillMount() {
        this.checkAccountID();
        this.setState({ trade: this.props.navigation.state.params.trade })
        var intervalID = setInterval(this.intervalCalls, 5000);
        this.setState({ intervalID: intervalID });
    }

    renderChart(instrument) {
        const isAndroid = Platform.OS === 'android'
        return (
            <WebView
                source={{
                    uri: isAndroid
                        ? 'file:///android_asset/charting_library/index.html'
                        : 'index.html'
                }}
                allowUniversalAccessFromFileURLs={true}
                onShouldStartLoadWithRequest={request => {
                    return true
                }}
                useWebKit={false}
            />
        );
    }


    render() {
        return (
            <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
                <StatusBar barStyle={this.state.barStyle} translucent={true} />
                <View style={{ height: HEIGHT, width: WIDTH }}>
                    <View style={styles.headerContainer}>
                        <Image style={styles.logo} source={require('../../images/logo.png')} />
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                            <View style={{ width: 60, height: 18 }}>
                                <View style={{ backgroundColor: '#212121', width: 35, height: 4 }}></View>
                                <View style={{ backgroundColor: '#212121', width: 35, height: 4, marginTop: 6, marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.instrumentText}>{this.state.trade.instrument.replace('_', ' / ')}</Text>
                        <View style={styles.sizingContainer}>
                            <Text style={styles.sideText}>{this.state.trade.initialUnits < 0 ? "Short" : "Long"}</Text>
                            <Text style={styles.unitsText}>{this.state.trade.initialUnits.replace('-', '')} units</Text>
                        </View>
                        <View style={styles.pricesContainer}>
                            <View style={styles.pricesLeft}>
                                <Text style={styles.exitsText}>TP: {"takeProfitOrder" in this.state.trade ? this.state.trade.takeProfitOrder.price : "--"}</Text>
                                <Text style={styles.exitsText}>SL: {"stopLossOrder" in this.state.trade ? this.state.trade.stopLossOrder.price : "--"}</Text>
                                <Text style={styles.exitsText}>TS: {"trailingStopLossOrder" in this.state.trade ? String(((parseFloat(this.state.trade.currentPrice) - parseFloat(this.state.trade.trailingStopLossOrder.trailingStopValue)) * 10000).toFixed(2)).replace('-', '') : "--"}</Text>
                            </View>
                            <View style={styles.pricesRight}>
                                <Text style={styles.priceText}>{this.state.trade.price}</Text>
                                <Image style={styles.arrow} source={require('../../images/arrow-right.png')} />
                                <Text style={styles.priceText}>{this.state.trade.currentPrice}</Text>
                            </View>
                        </View>
                        <View style={styles.plContainer}>
                            <Text style={[styles.dollarsText, this.text_color(this.state.trade.unrealizedPL)]}>{(this.state.trade.unrealizedPL) < 0 ? "-" : "+"} ${parseFloat(this.state.trade.unrealizedPL.replace('-', '').replace('+', '')).toFixed(2)}</Text>
                            <Text style={[styles.pipsText, this.text_color(this.state.trade.pips)]}>{(this.state.trade.pips) < 0 ? "-" : "+"} {parseFloat(String(this.state.trade.pips).replace('-', '')).toFixed(2)} pips</Text>
                        </View>
                    </View>
                </View>
                <View pointerEvents="box-none" style={{ height: HEIGHT, width: WIDTH, position: 'absolute' }}>
                    <View pointerEvents="none" style={{ height: this.state.height }} />
                    <View style={{ height: HEIGHT - this.state.height, backgroundColor: '#212121', borderRadius: 30 }}>
                        <Image style={styles.fullscreen} source={require('../../images/fullscreen_light.png')} />
                        <View style={{ marginTop: 30, marginBottom: 20, flex: 1, overflow: "hidden" }}>
                            {this.renderChart(this.state.trade.instrument.replace('_', ''))}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

