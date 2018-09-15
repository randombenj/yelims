import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

import { Divider } from 'react-native-elements';
import { Reactions } from './components/reactions';

let emojiItems = [
  "😀","😁", "😂", "🤣", "😃", "😄", "😇", "🤠", "🤡", "😸", "😹", "😻",
  "👫", "👭", "👬", "💑","👩", "❤️‍", "👩", "💩", "💩"
]

let users = [
  "@randombenj", "@fliiiix", "@tuxtimo", "@eddex", "@murc"
]

const data = [
  {
    'emoji': emojiItems[Math.floor(Math.random()*emojiItems.length)],
    "count": 5,
  },
  {
    'emoji': emojiItems[Math.floor(Math.random()*emojiItems.length)],
    "count": 5,
  },
  {
    'emoji': emojiItems[Math.floor(Math.random()*emojiItems.length)],
    "count": 5,
  },
  {
    'emoji': emojiItems[Math.floor(Math.random()*emojiItems.length)],
    "count": 5,
  }
];


export class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'YELIMS',    
  };
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
                <Text style={styles.text}>{emojiItems[Math.floor(Math.random()*emojiItems.length)]}{emojiItems[Math.floor(Math.random()*emojiItems.length)]}</Text>
                <Reactions reactions={data} />
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
