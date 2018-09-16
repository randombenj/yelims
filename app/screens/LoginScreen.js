import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    AsyncStorage
} from 'react-native';

import {
    FormLabel,
    FormInput,
    FormValidationMessage,
    Button
} from 'react-native-elements';

const CONFIG = require('../config');

export class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Logout',
        tabBarVisible: false,
    };
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            pass: '',
        };
    };

    _storeToken = (api_token, refresh_token) => {
        try {
            AsyncStorage.setItem('api_token', api_token).done();
            AsyncStorage.setItem('refresh_token', refresh_token).done();
        } catch (error) {
            // Error saving data
            console.warn(error);
        }
    }

    _getToken = () => {
        try {
            const api_token = AsyncStorage.getItem('api_token').done();
            const refresh_token = AsyncStorage.getItem('refresh_token').done();

            console.log("GETTING TOKEN: ", api_token)

            return { api_token, refresh_token };
         } catch (error) {
           // Error retrieving data
         }
    }

    _login = ()  =>  {

        // first check if the token is still usable
        const {
            api_token,
            refresh_token
        } = this._getToken();

        if (api_token && refresh_token) {

            CONFIG.API_TOKEN = api_token;
            CONFIG.API_REFRESH = refresh_token;

            this.props.navigation.navigate('Home');
        }
    
        console.log("Login: username: " + this.state.user + "pass: " + this.state.pass);
        fetch(CONFIG.API_URL + 'auth', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.user,
                    password: this.state.pass,
                }),
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.ok) {
                    console.log("user login");
                    console.log(responseJson);
                    
                    CONFIG.API_TOKEN = responseJson.data.token;
                    CONFIG.API_REFRESH = responseJson.data.refresh;
                    CONFIG.USERNAME = responseJson.data.username;

                    this._storeToken(
                        CONFIG.API_TOKEN,
                        CONFIG.API_REFRESH
                    )

                    this.props.navigation.navigate('Home');
                } else {
                    console.error(responseJson);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    _signup = ()  => {
        console.log("Signup: username: " + this.state.user + "pass: " + this.state.pass);
        fetch(CONFIG.API_URL + '/register', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.user,
                    password: this.state.pass,
                }),
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.ok) {
                    console.log("user create");
                    this._login();
                } else {
                    console.error(responseJson);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    handle_user = (text) => {
        this.setState({ user: text })
    };
    handle_pass = (text) => {
        this.setState({ pass: text })
    };
    render() {
        return (
            <View style={[styles.container]}>
            <Text style={styles.title}>📓😀</Text>

            <FormLabel>Username</FormLabel>
            <FormInput onChangeText={this.handle_user} />

            <FormLabel>Password</FormLabel>
            <FormInput onChangeText={this.handle_pass} />

            <Button onPress={this._login} buttonStyle={styles.login} rightIcon={{name: 'arrow-forward'}} title='Login' />
            <Button onPress={this._signup} buttonStyle={styles.login} rightIcon={{name: 'arrow-forward'}} title='Sign up' />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        margin: 10,
        marginRight: 10,
        paddingTop: 30
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    reactionsContainer: {
        flexDirection: "row",
    },
    login: {
        marginTop: 15,
    },
    title: {
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 20,
        color: "#333",
        textAlign: 'center',
        fontSize: 80,
    },
});
