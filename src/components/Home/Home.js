import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StatusBar, Dimensions, ScrollView } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../aws-exports';
import AsyncStorage from '@react-native-community/async-storage';
import CardView from 'react-native-cardview'
import { SafeAreaView } from 'react-navigation';

Amplify.configure(awsConfig);
const styles = require('./HomeStyles');

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            height: HEIGHT / 8 * 3,
            backgroundHeight: HEIGHT / 8 * 3,
            barStyle: 'light-content',
            summaryInfo: {
                nav: '0.00',
                openPositions: '0',
                pl: '+0.00'
            }
        };
        this.handleSignOut = this.handleSignOut.bind(this);
        this.intervalCalls = this.intervalCalls.bind(this);
    }

    handleAuthError = (err) => {
        console.log(err)
    }

    handleSignOut = () => {
        Auth.signOut().then(() => {
            console.log("User Logged Out");
            AsyncStorage.clear();
            clearInterval(this.state.intervalID);
            this.props.navigation.navigate('Login');
        })
            .catch(err => this.handleAuthError(err));
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
            this.setState({ barStyle: 'dark-content' })
        } else {
            this.setState({ barStyle: 'light-content' })
        }
    }

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

    getSummaryInfo = async () => {
        const api_key = await AsyncStorage.getItem('OANDA_API_KEY');
        const accountId = await AsyncStorage.getItem('OANDA_Account');

        fetch('https://api-fxpractice.oanda.com/v3/accounts/' + accountId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + api_key.replace(/"/g, '')
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                const summaryInfo = {
                    nav: parseFloat(responseJson.account.NAV).toFixed(2),
                    openPositions: responseJson.account.openPositionCount,
                    pl: parseFloat(responseJson.account.unrealizedPL).toFixed(2)
                }
                this.setState({ summaryInfo: summaryInfo });
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
            this.getSummaryInfo();
            this.getTrades();
        }
    }

    getTrades = async () => {
        const api_key = await AsyncStorage.getItem('OANDA_API_KEY');
        const accountId = await AsyncStorage.getItem('OANDA_Account');

        fetch('https://api-fxpractice.oanda.com/v3/accounts/' + accountId + '/trades', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + api_key.replace(/"/g, '')
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.getPricing(responseJson.trades);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getPricing = async (accountTrades) => {
        const api_key = await AsyncStorage.getItem('OANDA_API_KEY');
        const accountId = await AsyncStorage.getItem('OANDA_Account');
        const instruments = accountTrades.map(trade => {
            return trade.instrument
        })
        const data = {
            instruments: instruments,
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
                const trade_details = accountTrades.map(trade => {
                    return responseJson.prices.map(price => {
                        if (price.instrument === trade.instrument) {
                            if (trade.currentUnits < 0) {
                                var pips = -(parseFloat(price.asks[0].price) - parseFloat(trade.price)) * 10000
                                trade.pips = pips
                                return trade
                            } else {
                                var pips = (parseFloat(price.bids[0].price) - parseFloat(trade.price)) * 10000
                                trade.pips = pips
                                return trade
                            }
                        }
                    }).filter(function (el) {return el != null;})[0]
                })
                this.setState({accountTrades: trade_details})

            })
            .catch((error) => {
                console.error(error);
            });
    }

    intervalCalls = () => {
        this.getSummaryInfo();
        this.getTrades();
    }

    UNSAFE_componentWillMount() {
        this.checkAccountID();
        var intervalID = setInterval(this.intervalCalls, 1000);
        this.setState({ intervalID: intervalID });

    }

    UNSAFE_componentWillUnmount() {
        clearInterval(this.state.intervalID);
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

    renderCards = () => {
        if (this.state.accountTrades !== undefined) {
            return this.state.accountTrades.map(trade => {
                return (
                    <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('ViewTrade', {trade: trade})}>
                        <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={8} style={styles.card} shadowOpacity={0.5}>
                            <View style={styles.cardContainer}>
                                <View style={styles.cardLeft}>
                                    <Text style={styles.instrumentText}>{trade.instrument.replace('_', ' / ')}</Text>
                                    <View style={styles.sizingContainer}>
                                        <Text style={styles.sideText}>{trade.initialUnits < 0 ? "Short" : "Long"}</Text>
                                        <Text style={styles.unitsText}>{trade.initialUnits.replace('-', '')} units</Text>
                                    </View>
                                </View>
                                <View style={styles.cardRight}>
                                    <Text style={[styles.dollarText, this.text_color(trade.unrealizedPL)]}>{(trade.unrealizedPL) < 0 ? "-" : "+"} ${parseFloat(trade.unrealizedPL.replace('-', '').replace('+', '')).toFixed(2)}</Text>
                                    <Text style={[styles.pipsText, this.text_color(trade.pips)]}>{(trade.pips) < 0 ? "-" : "+"} {parseFloat(String(trade.pips).replace('-', '')).toFixed(2)} pips</Text>
                                </View>
                            </View>
                        </CardView>
                    </TouchableOpacity>
                )
            });
        }
    }

    render() {

        return (
            <SafeAreaView style={{ backgroundColor: '#212121' }}>
                <StatusBar barStyle={this.state.barStyle} translucent={true} />
                <View style={{ height: HEIGHT, width: WIDTH }}>
                    <View style={styles.headerContainer}>
                        <Image style={styles.logo} source={require('../../images/logo_white.png')} />
                        <TouchableOpacity onPress={this.handleSignOut}>
                            <View style={{ width: 60, height: 18 }}>
                                <View style={{ backgroundColor: '#ffffff', width: 35, height: 4 }}></View>
                                <View style={{ backgroundColor: '#ffffff', width: 35, height: 4, marginTop: 6, marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>Summary</Text>
                        <Text style={styles.navText}>$ {this.state.summaryInfo.nav}</Text>
                        <View style={styles.infoContainer}>
                            <Text style={[styles.totalDollarText, this.text_color(this.state.summaryInfo.pl)]}>{(this.state.summaryInfo.pl) < 0 ? "-" : "+"} ${this.state.summaryInfo.pl.replace('-', '').replace('+', '')}</Text>
                            <View style={styles.positionContainer}>
                                <Text style={styles.positionNumText}>{this.state.summaryInfo.openPositions}</Text>
                                <Text style={styles.positionText}>{this.state.summaryInfo.openPositions == 1 ? "position" : "positions"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View pointerEvents="box-none" style={{ height: HEIGHT, width: WIDTH, position: 'absolute' }}>
                    <View pointerEvents="none" style={{ height: this.state.height }} />
                    <View style={{ height: HEIGHT - this.state.height, backgroundColor: '#FFFFFF', borderRadius: 30 }}>
                        <ScrollView onScroll={(e) => this._onScroll(e)} scrollEventThrottle={10} style={{ marginTop: 30 }}>
                            {this.renderCards()}
                        </ScrollView>
                    </View>
                </View>

            </SafeAreaView>
        )
    }
}

