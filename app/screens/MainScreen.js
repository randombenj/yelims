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
const CONFIG = require('../config');
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

  _chooseReactionHandler = (postId) => {
    this.setState({
      postId: postId,
      edit: true
    });
  }

  _load() {
    return fetch(CONFIG.API_URL + 'posts?offset=' + this.state.offset +  '&limit=' + limit)
      .then((response) => response.json())
      .then((responseJson) => {
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
        console.error(error);
      });
  }

  _addReaction = (postId, emoji) => {
    console.log("call to _addReaction");
    console.log("postid: ", postId);
    console.log("reaction: ", emoji);
    let count = this.state.count + 1;
    fetch(CONFIG.API_URL + 'posts/' + postId + '/' + 'reaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'test',
            message: emoji,
        })
    })
    .then((response) => response.json())
    .then((json) => {
      console.log("GOT RESP: ", json);
      let posts = this.state.posts;
      let post = posts.find(p => p._id.$oid == postId);
      let index = posts.indexOf(post);
      console.log("INDEX: ", index);
      posts[index] = json;
      this.setState({
          posts: posts
      });
      this.forceUpdate();
    })
    .catch((err) => {
        console.log(err);
    });
  }

  componentDidMount(){
    this._load();
  }

  renderEdit() {
    const { navigation } = this.props;
    const authtoken = navigation.getParam('authtoken', undefined);
    const authrefresh = navigation.getParam('authrefresh', undefined);
    if (this.state.edit) {
      return (
        <EmojiInput onEmojiSelected={(emoji) => {
          console.log(emoji);
          this._addReaction(this.state.postId, emoji.char);
          this.setState({
            edit: false
          })
        }}
        keyboardBackgroundColor={"white"}
        enableFrequentlyUsedEmoji={true}
        enableSearch={false} />
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
                <Reactions  
                  postId={post._id.$oid} 
                  reactions={post.reaction_summary} 
                  handler={this._chooseReactionHandler} 
                  addreaction={this._addReaction}
                />
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
