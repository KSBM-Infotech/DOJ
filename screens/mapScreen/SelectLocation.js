import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapViewDirections from 'react-native-maps-directions';
import {Key} from '../../constants/key';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import * as UserActions from '../../redux/actions/CustomerActions';
import {connect} from 'react-redux';

const SelectLocation = ({navigation, dispatch}) => {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressLoad, setAddressLoad] = useState(false);
  const [currentPoint, setCurrentPoint] = useState({
    latitude: 22.6293867,
    longitude: 88.4354486,
  });

  useEffect(() => {
    get_current_location();
  }, []);

  const get_current_location = async () => {
    // let {status} = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') {
    //   setErrorMsg('Permission to access location was denied');
    //   return;
    // }

    // let location = await Location.getCurrentPositionAsync({});

    Geolocation.getCurrentPosition(
      location => {
        setCurrentPoint({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        checkAvailability(location.coords.latitude, location.coords.longitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const checkAvailability = async (latitude, longitude) => {
    try {
      setAddressLoad(true);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Key.google_map_key}`,
      );
      let add = response.data.results[1].formatted_address;
      let result = (result = add.split(', '));
      let res = result.splice(result.length - 4, result.length);

      const results = response.data.results[1].address_components;
      var city = '';
      var state = '';

      for (var i = 0; i < results.length; ++i) {
        if (results[i].types[0] == 'locality') {
          city = results[i].long_name;
        }
        if (results[i].types[0] == 'administrative_area_level_1') {
          state = results[i].long_name;
        }
      }
      let a = {
        state: state,
        city: city,
        currentLocation: response.data.results[1].formatted_address,
        latitude: latitude,
        longitude: longitude,
      };
      setCurrentAddress(a);
      setAddressLoad(false);
    } catch (error) {
      console.log(error);
    }
  };

  const on_done = () => {
    dispatch(UserActions.isLocationDefined(true));
    dispatch(UserActions.setLocation(currentAddress));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <View style={{flex: 1}}>
        {trackingInfo()}
        {header()}
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
            <Text style={{...Fonts.grayColor13Medium}}>Address</Text>
            <View style={{height: Sizes.fixPadding * 5}}>
              {addressLoad ? (
                <ActivityIndicator color={Colors.primaryColor} />
              ) : (
                <Text numberOfLines={3} style={{...Fonts.blackColor14SemiBold}}>
                  {currentAddress && currentAddress?.currentLocation}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: Sizes.fixPadding * 2.0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              ...styles.callNowAndMessageButtonStyle,
              marginRight: Sizes.fixPadding,
            }}>
            <Text
              style={{
                marginLeft: Sizes.fixPadding - 5.0,
                ...Fonts.primaryColor15SemiBold,
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={on_done}
            style={{
              ...styles.callNowAndMessageButtonStyle,
              backgroundColor: Colors.primaryColor,
              marginLeft: Sizes.fixPadding,
            }}>
            <Text
              style={{
                marginLeft: Sizes.fixPadding - 5.0,
                ...Fonts.whiteColor15SemiBold,
              }}>
              Done
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
          style={{flex: 1}}
          initialRegion={{
            latitude: 22.6292757,
            longitude: 88.444781,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          region={{
            latitude: parseFloat(currentPoint.latitude),
            longitude: parseFloat(currentPoint.longitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          onPress={e => {
            setCurrentPoint({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
            checkAvailability(
              e.nativeEvent.coordinate.latitude,
              e.nativeEvent.coordinate.longitude,
            );
          }}>
          <Marker coordinate={currentPoint}>
            {/* <Image
              source={require("../../assets/images/marker4.jpeg")}
              style={{ width: 20.0, height: 20.0, resizeMode: "contain" }}
            /> */}
          </Marker>
        </MapView>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={22}
          onPress={() => navigation.pop()}
        />
      </View>
    );
  }
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(null, mapDispatchToProps)(SelectLocation);

const styles = StyleSheet.create({
  headerWrapStyle: {
    position: 'absolute',
    top: StatusBar.currentHeight + 30.0,
    left: 30.0,
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
    bottom: 20.0,
    left: 20.0,
    right: 20.0,
    backgroundColor: Colors.bodyBackColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 5.0,
  },
});
