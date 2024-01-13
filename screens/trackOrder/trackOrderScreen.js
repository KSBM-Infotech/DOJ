import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapViewDirections from 'react-native-maps-directions';
import {Key} from '../../constants/key';
import MapView, {Marker} from 'react-native-maps';
import database from '@react-native-firebase/database';
import axios from 'axios';
import { Linking } from 'react-native';

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

const TrackOrderScreen = ({navigation, route}) => {
  const [orderData] = useState(route.params.orderData);
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [orderStatus, setOrderStatus] = useState('0');
  const [duration, setDuration] = useState(null)

  const deliveryMarker = {
    latitude: 28.6284893,
    longitude: 77.3673503,
  };

  const deliveryBoyMarker = {
    latitude: 28.6384893,
    longitude: 77.3673503,
  };

  useEffect(() => {
    get_delivery_boy();
  }, []);

  const get_delivery_boy = () => {
    database()
      .ref(`orders/${orderData?.id}`)
      .on('value', snapshot => {
        if (snapshot.val()?.driver?.latitude.length != 0) {
          setDeliveryBoy(snapshot.val()?.driver);
          calculate_duration();
        }
        if(snapshot.val()?.order_status == '4'){
          navigation.goBack()
        }
        setOrderStatus(snapshot.val()?.order_status);
      });
  };

  const calculate_duration = async()=>{
    let origin={
      latitude: parseFloat(orderData?.restaurant?.latitude),
      longitude: parseFloat(orderData?.restaurant?.longitude),
    }
    let destination={
      latitude: parseFloat(orderData?.latitude),
      longitude: parseFloat(orderData?.longitute),
    }
    await axios({
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&mode=driving&key=${Key.google_map_key}`
    }).then(res=>{
      setDuration(res.data.rows[0].elements[0].duration.text)
    }).catch(err=>{
      console.log(err)
    })
  }  

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent backgroundColor={Colors.greenColor} />
      <View style={{flex: 1}}>
        {header()}
        {trackingInfo()}
        {deliveryManInfo()}
      </View>
    </SafeAreaView>
  );

  function deliveryManInfo() {
    return (
      <View style={styles.deliveryManInfoWrapStyle}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{...Fonts.grayColor13Medium}}>Delivery man</Text>
            <Text style={{...Fonts.blackColor14SemiBold}}>{deliveryBoy?.first_name}</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{...Fonts.grayColor13Medium}}>Arriving in</Text>
            <Text style={{...Fonts.blackColor14SemiBold}}>{duration}</Text>
          </View>
        </View>
        <View
          style={{
            marginTop: Sizes.fixPadding * 2.0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={()=>Linking.openURL(`tel:${deliveryBoy?.phone}`)}
            style={{
              ...styles.callNowAndMessageButtonStyle,
              marginRight: Sizes.fixPadding,
            }}>
            <MaterialIcons name="phone" color={Colors.primaryColor} size={22} />
            <Text
              style={{
                marginLeft: Sizes.fixPadding - 5.0,
                ...Fonts.primaryColor15SemiBold,
              }}>
              Call Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.push('Message')}
            style={{
              ...styles.callNowAndMessageButtonStyle,
              backgroundColor: Colors.primaryColor,
              marginLeft: Sizes.fixPadding,
            }}>
            <MaterialCommunityIcons
              name="message"
              color={Colors.whiteColor}
              size={22}
            />
            <Text
              style={{
                marginLeft: Sizes.fixPadding - 5.0,
                ...Fonts.whiteColor15SemiBold,
              }}>
              Message
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function trackingInfo() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
        <MapView
          style={{flex: 0.7}}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: parseFloat(orderData?.latitude),
            longitude: parseFloat(orderData?.longitute),
            latitudeDelta: 0.0009,
            longitudeDelta: 0.0009,
          }}
          showsBuildings={false}
          showsCompass={true}
          // showsUserLocation={true}
        >
          {deliveryBoy && (
            <MapViewDirections
              origin={{
                latitude: deliveryBoy?.latitude,
                longitude: deliveryBoy?.longitude,
              }}
              destination={{
                latitude: parseFloat(orderData?.restaurant?.latitude),
                longitude: parseFloat(orderData?.restaurant?.longitude),
              }}
              apikey={Key.google_map_key}
              lineDashPattern={[1]}
              // lineCap="square"
              strokeColor={Colors.blackColor}
              strokeWidth={3}
            />
          )}

          <MapViewDirections
            origin={{
              latitude: parseFloat(orderData?.restaurant?.latitude),
              longitude: parseFloat(orderData?.restaurant?.longitude),
            }}
            destination={{
              latitude: parseFloat(orderData?.latitude),
              longitude: parseFloat(orderData?.longitute),
            }}
            apikey={Key.google_map_key}
            lineDashPattern={[1]}
            lineCap="square"
            strokeColor={Colors.blackColor}
            strokeWidth={3}
          />
          {deliveryBoy && (
            <Marker
              coordinate={{
                latitude: deliveryBoy?.latitude,
                longitude: deliveryBoy?.longitude,
              }}>
              <Image
                source={require('../../assets/images/marker2.png')}
                style={{width: 30.0, height: 30.0}}
              />
            </Marker>
          )}

          <Marker
            coordinate={{
              latitude: parseFloat(orderData?.restaurant?.latitude),
              longitude: parseFloat(orderData?.restaurant?.longitude),
            }}>
            <Image
              source={require('../../assets/images/marker5.png')}
              style={{width: 30.0, height: 30.0}}
            />
          </Marker>

          <Marker
            coordinate={{
              latitude: parseFloat(orderData?.latitude),
              longitude: parseFloat(orderData?.longitute),
            }}>
            {/* <Image
              source={require('../../assets/images/marker1.png')}
              style={{width: 20.0, height: 20.0}}
            /> */}
          </Marker>
        </MapView>
      </View>
    );
  }

  function orderStatusInfo() {
    let jsxElement;
    switch (orderStatus) {
      case '1':
        jsxElement = (
          <Text
            style={{
              ...Fonts.whiteColor20Bold,
              textAlign: 'center',
              marginVertical: Sizes.fixPadding * 1.5,
            }}>
            Preparing your order
          </Text>
        );
        break;
      case '2':
        jsxElement = (
          <Text
            style={{
              ...Fonts.whiteColor20Bold,
              textAlign: 'center',
              marginVertical: Sizes.fixPadding * 1.5,
            }}>
            Dispatched your order
          </Text>
        );
        break;
      case '3':
        jsxElement = (
          <Text
            style={{
              ...Fonts.whiteColor20Bold,
              textAlign: 'center',
              marginVertical: Sizes.fixPadding * 1.5,
            }}>
            Complete Payment
          </Text>
        );
        break;
      case '4':
        jsxElement = (
          <Text
            style={{
              ...Fonts.whiteColor20Bold,
              textAlign: 'center',
              marginVertical: Sizes.fixPadding * 1.5,
            }}>
            Order Complete
          </Text>
        );
        break;
      default:
        jsxElement = <></>;
    }

    return jsxElement;
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <MaterialIcons
            name="arrow-back"
            color={Colors.whiteColor}
            size={22}
            onPress={() => navigation.pop()}
          />
          <Text style={{...Fonts.whiteColor15Medium}}>
            {orderData?.restaurant?.name}
          </Text>
          <MaterialCommunityIcons
            name="share-outline"
            color={Colors.whiteColor}
            size={22}
            onPress={() => navigation.pop()}
          />
        </View>
        {orderStatusInfo()}
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginBottom: Sizes.fixPadding * 2,
          }}>
          <View
            style={{
              padding: Sizes.fixPadding,
              backgroundColor: Colors.whiteColor + '50',
              borderRadius: Sizes.fixPadding,
              marginRight: Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.whiteColor12SemiBold}}>
              Arriving in {duration && duration}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              backgroundColor: Colors.whiteColor + '50',
              borderRadius: Sizes.fixPadding,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="refresh"
              color={Colors.whiteColor}
              size={22}
              // onPress={() => navigation.pop()}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flex: 0.25,
    backgroundColor: Colors.greenColor,
    paddingTop: StatusBar.currentHeight + 15,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    // left: 30.0,
  },
  callNowAndMessageButtonStyle: {
    flexDirection: 'row',
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 3.0,
  },
  deliveryManInfoWrapStyle: {
    position: 'absolute',
    bottom: 0.0,
    left: 20.0,
    right: 20.0,
    backgroundColor: Colors.bodyBackColor,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 5.0,
  },
});

export default TrackOrderScreen;
