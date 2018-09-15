import React from 'react';
import { Text, StatusBar, SafeAreaView } from 'react-native';

export class SearchScreen extends React.Component {
    static navigationOptions = {
      title: 'Search',
    };
    componentDidMount() {
        let isAndroid = true;
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            isAndroid && StatusBar.setBackgroundColor('#ff00ff');
        });
    }
    
    componentWillUnmount() {
        this._navListener.remove();
    }
    render() {
        return (
            <SafeAreaView style={[{ backgroundColor: '#00ff00' }]}>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
                <Text>ASDTEST</Text>
            </SafeAreaView>
        );
    }
}