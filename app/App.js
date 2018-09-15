import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

import { Divider, Card } from 'react-native-elements';

let items = [
  "😀","😁", "😂", "🤣", "😃", "😄", "😇", "🤠", "🤡", "😸", "😹", "😻",
  "👫", "👭", "👬", "💑","👩", "❤️‍", "👩", "💩", "💩"
]

let users = [
  "@randombenj", "@fliiiix", "@tuxtimo", "@eddex", "@murc"
]


export default class App extends React.Component {
  render() {
    return (
      <ScrollView
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center',}} 
        style={styles.container}
      >
        {
          Array.from({length: 20}, (x, i) => 
            (
              <View key={i}>
                <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
                  <Text style={styles.title}>{users[Math.floor(Math.random()*users.length)]}</Text>
                  <Text style={styles.titleDate}>5h ago</Text>
                </View>
                <Text style={styles.text}>{items[Math.floor(Math.random()*items.length)]}{items[Math.floor(Math.random()*items.length)]}</Text>
                <View style={styles.reactionsContainer}>
                    <View>
                      <Text style={{ fontSize: 30 }}>😀</Text>
                    </View>
                    <View style={styles.reactCount}>
                      <Text>500</Text>
                    </View>

                    <View>
                      <Text style={{ fontSize: 30 }}>❤️‍</Text>
                    </View>
                    <View style={styles.reactCount}>
                      <Text>5</Text>
                    </View>

                    <View>
                      <Text style={{ fontSize: 30 }}>😄️‍</Text>
                    </View>
                    <View style={styles.reactCount}>
                      <Text>5</Text>
                    </View>
                </View> 
                <Divider />
              </View>
            )
          )
        }
      </ScrollView>
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
  reactionsContainer: {
    flexDirection: "row",
    marginBottom: 20
  },
  reactCount: { 
      top: 22, 
      left: -20, 
      paddingLeft: 4, 
      paddingRight: 4,
      height: 23,
      position: "relative",
      backgroundColor: 'white', 
      borderColor: '#efefef', 
      borderWidth: 1, 
      borderRadius: 20,
      marginRight: -20
  },
  title: {
    fontWeight: 'bold',
    marginTop: 15,
    color: "#333",
    fontSize: 20
  },
  titleDate: {
    fontSize: 15,
    marginTop: 15,
    fontStyle: 'italic',
    color: "#efefef"
  },
  text: {
    fontSize: 120  }
});
