import SignUp from './components/Signup/Signup';
import Login from './components/Login/Login';
import OandaAuth from './components/OandaAuth/OandaAuth';
import ResetPassword1 from './components/ResetPassword/ResetPassword1';
import ResetPassword2 from './components/ResetPassword/ResetPassword2';
import Confirmation from './components/Confirmation/Confirmation';
import Home from './components/Home/Home';
import ViewTrade from './components/ViewTrade/ViewTrade';


import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const AppStack = createSwitchNavigator({ Home: Home, ViewTrade: ViewTrade});
const AuthStack = createSwitchNavigator({
    Login: Login,
    SignUp: SignUp,
    ResetPassword1: ResetPassword1,
    ResetPassword2: ResetPassword2,
    Confirmation: Confirmation,
    OandaAuth: OandaAuth
});

export const createRootNavigator = (signedIn = false) => {
    return createAppContainer(
        createSwitchNavigator(
            {
                App: AppStack,
                Auth: AuthStack,
            },
            {
                initialRouteName: signedIn ?  "App" : "Auth"
            }
        )
    )
};