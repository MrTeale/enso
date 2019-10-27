import React, { Component } from 'react';
import { createRootNavigator } from './src/router'
import { isSignedIn } from './src/auth';
import Amplify from 'aws-amplify';
import awsConfig from './src/aws-exports';

Amplify.configure(awsConfig);

export default class App extends Component {
	state = {
		signedIn: false,
		checkedSignIn: false
	};

	componentDidMount() {
		isSignedIn()
			.then(res => this.setState({ signedIn: res, checkedSignIn: true}));
	}

	render() {
		const { checkedSignIn, signedIn } = this.state;

		if (!checkedSignIn) {
			return null;
		}

		const Layout = createRootNavigator(signedIn);
		return <Layout />

	}
}