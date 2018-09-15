import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'

export class LoginScreen extends React.Component {
    static navigationOptions = {
      title: 'Login',
    };
    _login() {
        console.log("username: " + this.state.user + "pass: " + this.state.pass);
        fetch('http://192.168.43.56/auth', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: this.state.user,
            password: this.state.pass,
        }),}).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.ok){
                    console.log("user login");
                    console.log(responseJson);
                    this.props.navigation.navigate('Home', {authtoken: responseJson.data.token, authrefresh: responseJson.data.refresh});
                }
                else {
                    console.error(responseJson);
                }
          })
        .catch((error) => {
          console.error(error);
      });
    };
    _signup() {
        console.log("username: " + this.state.user + "pass: " + this.state.pass);
        fetch('http://192.168.43.56/register', {
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
                if (responseJson.ok){
                    console.log("user create");
                    this._login();
                }
                else {
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
            <View style={[styles.container, styles.horizontal, {paddingTop: 15}]}>
            <Text style={styles.title}>📓😀</Text>

            <FormLabel>Username</FormLabel>
            <FormInput onChangeText = {this.handle_user} />

            <FormLabel>Password</FormLabel>
            <FormInput onChangeText = {this.handle_pass} />

            <Button onPress={() => this._login()} buttonStyle={styles.login} rightIcon={{name: 'arrow-forward'}} title='Login' />
            <Button onPress={() => this._signup()} buttonStyle={styles.login} rightIcon={{name: 'arrow-forward'}} title='Sign up' />
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
        marginRight: 10
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