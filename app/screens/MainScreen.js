import React from 'react';
import { 
  StyleSheet,
  ScrollView,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import EmojiInput from 'react-native-emoji-input';

import { Divider, Button } from 'react-native-elements';
import { Reactions } from '../components/reactions';

let emojiItems = [
  "😀","😁", "😂", "🤣", "😃", "😄", "😇", "🤠", "🤡", "😸", "😹", "😻",
  "👫", "👭", "👬", "💑","👩", "❤️‍", "👩", "💩", "💩"
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

const limit = 10;
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'YELIMS',    
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, 
      refreshing: false,
      offset: 0,
      posts: []
    }
  }

  _onRefresh = () => {
    this.state.offset = 0;
    this.state.posts = [];
    this.state.refreshing = true;
    this._load();
  }

  _load() {
    return fetch('http://192.168.43.56/posts?offset=' + this.state.offset +  '&limit=' + limit)
      .then((response) => response.json())
      .then((responseJson) => {
        /*if (this.state.posts) {
          let posts = this.state.posts.concat(
            responseJson.posts
          );
        }
        else {
          let posts = responseJson.posts;
        }*/
        let posts = this.state.posts.concat(responseJson.posts);
        let offset = this.state.offset + limit;
        this.setState({
          isLoading: false,
          refreshing: false,
          offset: offset,
          posts: posts,
        }, function(){

        });
      })
      .catch((error) => {
        /*this.setState({
          isLoading: false,
          refreshing: false,
          posts: [
            {
              _id: {
                $oid: "5b9ce382e6ce4f000868e150"
              },
              username: "page_not_working",
              message: "😥😥",
              timestamp: {
                $date: 1537008514444
              },
              reactions: [ ]
            }]
        });*/
      });
  }

  componentDidMount(){
    this._load();
  }

  renderEdit() {
    if (false) {
      return (
        <EmojiInput onEmojiSelected={(emoji) => {
          this.state.emoji = emoji;
        }}
        keyboardBackgroundColor={"white"}
        enableFrequentlyUsedEmoji={true}
        enableSearch={false} />
      )
    } else {
      return (
        <TouchableOpacity
          style={{
            borderWidth:1,
            borderColor:'rgba(0,0,0,1)',
            alignItems:'center',
            justifyContent:'center',
            width:100,
            height:100,
            backgroundColor:'#7a0068',
            borderRadius: 50,
            position: "absolute",
            bottom: 5,
            right: 5
          }}
        >
          <Text style={{fontSize: 40}}>✍️</Text>
        </TouchableOpacity>
      )
    }
   
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={[styles.container, styles.horizontal, {paddingTop: 150}]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }

    return (
      <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer} 
        style={styles.container}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            this._load();
          }
        }}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        {
          this.state.posts.map((post) =>  
            (
              <View key={post._id.$oid}>
                <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
                  <Text style={styles.title}>@{post.username}</Text>
                  <Text style={styles.titleDate}>5h ago</Text>
                </View>
                <Text style={styles.reaction}>{post.message}</Text>
                <Reactions reactions={data} />
                <Divider />
              </View>
            )
          )
        }
      </ScrollView>
      {this.renderEdit()}
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
  reaction: {
    fontSize: 120  
  }
});
