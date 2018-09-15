import React from 'react';
import {
  StyleSheet,
  Image,
  View
} from 'react-native';

import MapView, {
  Marker
}  from 'react-native-maps';

import marker from '../img/map-marker.png'
const CONFIG = require('../config');


const latitudeDelta = 0.025;
const longitudeDelta = 0.025;


export class MapScreen extends React.Component {


    static navigationOptions = {
      title: 'Map',
    };


    state = {
      region: {
        latitudeDelta,
        longitudeDelta,
        latitude: 47.3898512,
        longitude: 8.5134361
      },
      marker: []
    }


    constructor(props) {

      super(props);

      this._load();
    }


    _updateMarker = (marker) => {

      this.setState({
        marker: marker
      });
    }


    _load() {

      return fetch(CONFIG.API_URL + 'posts?offset=' + 0 +  '&limit=' + 200)
        .then((response) => response.json())
        .then((data) => {
          
          let marker = data.posts
          .filter(
            p => p.location
          ).map(
            p => {
              return {
                'key': p._id.$oid,
                'message': p.message,
                'coordinates': {
                  'latitude': p.location.coordinates[0],
                  'longitude': p.location.coordinates[1]
                } 
              }
            }
          );

          console.log("MARK: ", marker);
          
          this._updateMarker(marker);
          this.state.marker = marker;

          console.log("LOCATION: ", this.state.marker);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  
    
    onRegionChange = region => {

      this.setState({
        region
      })

    }


    render() {

      const { region } = this.state

      return (
        <View style={styles.main}>
          <MapView style={styles.map} region={region} >
            {
              this.state.marker.map(m => (
                <Marker
                  key={m.key}
                  title={m.message}
                  coordinate={m.coordinates}
                />
              ))
            }
          </MapView>
          <View pointerEvents="none">
            <Image style={styles.markerFixed} source={marker} />
          </View>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    main: {
      flex: 1
    },
    map: {
      flex: 1
    },
    marker: {
      height: 48,
      width: 48
    },
    markerFixed: {
      left: '50%',
      marginLeft: -24,
      marginTop: -48,
      position: 'absolute',
      top: '50%'
    }
  });