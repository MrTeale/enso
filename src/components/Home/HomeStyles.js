import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    card: {
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        height: 70,
        margin: 10,
        width: '80%'
    },
    instrumentText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 20,
    },
    sideText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 16,
    },
    unitsText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 16,
        marginLeft: 10
    },
    dollarText: {
        fontFamily: "Montserrat",
        fontWeight: '600',
        fontSize: 20,
        textAlign: "right"
    },
    pipsText: {
        fontFamily: "Montserrat",
        fontWeight: '600',
        fontSize: 16,
        textAlign: "right"
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginVertical: 10,
    },
    sizingContainer: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    cardLeft: {
        marginLeft: '5%',
    },
    cardRight: {
        marginRight: '5%',
    },
    summaryContainer: {
        width: '65%',
        marginTop: '4%',
        alignSelf: "center"
    },
    summaryText: {
        fontFamily: "Montserrat",
        fontWeight: '600',
        fontSize: 24,
        color: '#ffffff',
    },
    navText: {
        marginTop: 20,
        fontFamily: "Montserrat",
        fontWeight: '400',
        fontSize: 36,
        color: '#ffffff',
        alignSelf: "center"
    },
    totalDollarText: {
        fontFamily: "Montserrat",
        fontWeight: '600',
        fontSize: 20,
        color: '#ffffff',
    },
    positionNumText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 20,
        color: '#ffffff'
    },
    positionText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 20,
        color: '#ffffff'
    },
    infoContainer: {
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: "space-between",
        alignItems: "center"
    },
    positionContainer: {
        alignItems: "center"
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
});