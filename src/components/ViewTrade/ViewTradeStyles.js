import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    summaryContainer: {
        width: '70%',
        marginTop: '4%',
        alignSelf: "center"
    },
    headerContainer: {
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        width: 40,
        height: 40
    },
    instrumentText: {
        fontFamily: "Montserrat",
        fontWeight: '600',
        fontSize: 30,
    },
    sideText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 20,
    },
    unitsText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 20,
        marginLeft: 15
    },
    exitText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 16,
    },
    dollarsText: {
        fontFamily: "Montserrat",
        fontWeight: '600',
        fontSize: 20,
    },
    pipsText: {
        fontFamily: "Montserrat",
        fontWeight: '600',
        fontSize: 16,
    },
    arrow: {
        height: 18,
        width: 18,
        transform: [{ rotate: '90deg' }]
    },
    sizingContainer: {
        flexDirection: 'row'
    },
    pricesContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 15,
        width: '90%'
    },
    pricesLeft: {
    },
    pricesRight: {
        alignItems: "center"
    },
    plContainer: {
        marginTop: 10
    },
    fullscreen: {
        height: 30,
        width: 30
    }
});