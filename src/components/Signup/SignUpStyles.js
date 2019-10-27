import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    logoContainer: {
        paddingLeft: '10%',
        paddingTop: '20%'
    },
    logo: {
        width: 150,
        height: 150
    },
    headerContainer: {
        paddingLeft: '12%',
        marginTop: '10%',
    },
    headerText: {
        fontFamily: "Montserrat",
        fontWeight: '600',
        fontSize: 40
    },
    forms: {
        paddingTop: 10,
        paddingLeft: '12%',
    },
    inputs: {
        paddingTop: 30,
        borderBottomWidth: 2,
        borderColor: '#000000',
    },
    inputsText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 14,
        paddingLeft: 15,
        height: 20,
        color: '#000000',
        top: -5
    },
    submit: {
        marginTop: '7%',
        flexDirection:'row',
        width: '40%',
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 12,
        padding: 12,
        justifyContent: "center"
    },
    submitText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 20,
        color: '#000000',
        paddingRight: 12
    },
    submitContainer: {  
        paddingTop: '10%',
        alignItems: "center"
    },
    submitArrow: {
        width: 25,
        height: 25
    },
    signup: {
        paddingTop: 10,
        alignItems: "center",
    },
    linkText: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 12,
        color: '#aaa',
        textDecorationLine: 'underline'
    },
    socials: {
        marginTop: '10%',
        paddingTop: '5%',
        flexDirection:'row',
        justifyContent:"center",
        alignSelf: "center",
        borderTopColor: '#aaa',
        borderTopWidth: 1,
        width: '75%'
    },
    facebook: {
        marginRight: '8%',
    },
    google: {
        marginLeft: '8%',
    },
    socialIcon:{
        height: 30,
        width: 30
    },
    socialtext: {
        fontFamily: "Montserrat",
        fontWeight: '300',
        fontSize: 16,
        color: '#aaa',
    }
});