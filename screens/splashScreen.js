import React, {useState, useCallback, useEffect} from 'react';
import {
  BackHandler,
  SafeAreaView,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Dimensions,
  Button,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../constants/styles';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {checkMultiple, requestMultiple} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as UserActions from '../redux/actions/CustomerActions';
import * as CartActions from '../redux/actions/CartActions';
import {api_url, get_cart_new, get_profile, get_video} from '../constants/api';
import {connect} from 'react-redux';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from 'react-native-geolocation-service';
import Key from '../constants/key';

const {width, height} = Dimensions.get('screen');

const SplashScreen = ({navigation, dispatch}) => {
  const [isRegisterd, setIsRegisterd] = useState(false);
  const [splashData, setSplashData] = useState(false);
  const [status, setStatus] = React.useState({});
  const video = React.useRef(null);

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [backAction]),
  );

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    get_splash();
    requestMultiplePermissions();
    requestUserPermission();
    setTimeout(() => {
      is_registerd();
    }, 3000);
  }, []);

  const get_splash = async () => {
    await axios({
      method: 'get',
      url: api_url + get_video,
    })
      .then(res => {
        setSplashData(res.data[0]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const is_registerd = async () => {
    let user = await AsyncStorage.getItem('userData');
    let userData = JSON.parse(user);
    if (userData) {
      get_profile_data(userData?.id);
    } else {
      setIsRegisterd(true);
    }
  };

  const get_profile_data = async id => {
    await axios({
      method: 'post',
      url: api_url + get_profile,
      data: {
        id: id,
      },
    })
      .then(async res => {
        if (res.data.status) {
          if (res.data.profile.name == null || res.data.profile.name == '') {
            navigation.push('updateName', {id: id});
          } else {
            dispatch(UserActions.setCustomerData(res.data.profile));
            get_cart(id);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const get_cart = async id => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + get_cart_new,
      data: {
        user_id: id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          if (res.data.data.length != 0) {
            let cart_data = res.data.data;
            let delivery_boy_data = new Object();
            let self_delivery_data = new Object();
            Object.keys(cart_data).map(key => {
              let obj = cart_data[key];
              if (obj[0].type == '1') {
                Object.assign(self_delivery_data, {[key]: obj});
              } else {
                Object.assign(delivery_boy_data, {[key]: obj});
              }
            });
            if (Object.keys(delivery_boy_data).length != 0) {
              dispatch(CartActions.setCartData(delivery_boy_data));
            }
            if (Object.keys(self_delivery_data).length != 0) {
              console.log(self_delivery_data)
              dispatch(CartActions.setSelfDeliveryCartData(self_delivery_data));
            }
          } else {
            dispatch(CartActions.setCartData(null));
            dispatch(CartActions.setSelfDeliveryCartData(null));
          }
          // navigation.push('BottomTabBar');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'BottomTabBar'}],
            }),
          );
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Doj App Location Permission',
          message:
            'Doj App needs access to your location ' +
            'so you can take your live location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        get_current_location();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestMultiplePermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          // Add more permissions as needed
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        Object.keys(granted).forEach(permission => {
          if (granted[permission] !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log(`Permission ${permission} denied.`);
          }
        });
        requestLocationPermission()
      } else if (Platform.OS === 'ios') {
        const permissions = [
          'camera',
          'location',
          // Add more permissions as needed
        ];

        const statuses = await checkMultiple(permissions);

        Object.keys(statuses).forEach(permission => {
          if (statuses[permission] !== 'granted') {
            console.log(`Permission ${permission} denied.`);
          }
        });

        const results = await requestMultiple(permissions);

        Object.keys(results).forEach(permission => {
          if (results[permission] !== 'granted') {
            console.log(`Permission ${permission} denied.`);
          }
        });
      }
    } catch (error) {
      console.error('Error requesting permissions: ', error);
    }
  };

  function _spring() {
    updateState({backClickCount: 1});
    setTimeout(() => {
      updateState({backClickCount: 0});
    }, 1000);
  }

  const [state, setState] = useState({
    backClickCount: 0,
  });

  const updateState = data => setState(state => ({...state, ...data}));

  const {backClickCount} = state;

  const get_started = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        // onPress={() => navigation.push('Signin')}
        onPress={() => navigation.push('applyPromocode')}
        style={styles.signupButtonStyle}>
        <Text style={{...Fonts.whiteColor18Bold}}>Get Started</Text>
      </TouchableOpacity>
    );
  };

  const get_current_location = async () => {
    Geolocation.getCurrentPosition(
      location => {
        checkAvailability(location.coords.latitude, location.coords.longitude);
        console.log(location)
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
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Key.google_map_key}`,
      );
      // console.log(response.data)
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
      // setCity(city);
      // setState(state);
      // setCurrentLocation(response.data.results[1].formatted_address);
      let a = {
        state: state,
        city: city,
        currentLocation: response.data.results[1].formatted_address,
        latitude: latitude,
        longitude: longitude,
      };
      dispatch(UserActions.setLocation(a));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      {splashData == null ? (
        <>{showImage()}</>
      ) : splashData?.images == null && splashData?.vedio != null ? (
        <>{showViedo()}</>
      ) : (
        <>{showImage()}</>
      )}

      {backClickCount == 1 ? (
        <View style={[styles.animatedView]}>
          <Text style={{...Fonts.whiteColor12SemiBold}}>
            Press Back Once Again to Exit
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );

  function signupButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('Signup')}
        style={styles.signupButtonStyle}>
        <Text style={{...Fonts.whiteColor20Bold}}>Sign Up</Text>
      </TouchableOpacity>
    );
  }

  function signinButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('Signin')}
        style={styles.signinButtonStyle}>
        <Text style={{...Fonts.blackColor20Bold}}>Sign In</Text>
      </TouchableOpacity>
    );
  }

  function showImage() {
    return (
      <ImageBackground
        source={
          splashData != null && splashData?.images != null
            ? {uri: splashData?.banner_photo_url}
            : require('../assets/images/bg.png')
        }
        style={{flex: 1}}>
        <LinearGradient
          colors={['#00000000', '#00000099']}
          style={styles.pageStyle}>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.primaryColor,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.whiteColor18Bold}}>doj</Text>
            </View>
            <View
              style={{
                width: 50,
                height: 55,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.whiteColor18Bold}}>Doj</Text>
            </View>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{...Fonts.whiteColor15Medium}}>Food</Text>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 2,
                  backgroundColor: Colors.primaryColor,
                  marginHorizontal: 10,
                }}
              />
              <Text style={{...Fonts.whiteColor15Medium}}>Instamart</Text>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 2,
                  backgroundColor: Colors.primaryColor,
                  marginHorizontal: 10,
                }}
              />
              <Text style={{...Fonts.whiteColor15Medium}}>Genie</Text>
            </View>
            <View
              style={{
                flex: 0,
                height: 0.5,
                backgroundColor: Colors.grayColor,
                marginVertical: 10,
              }}
            />
            {isRegisterd && get_started()}
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  function showViedo() {
    // useEffect(() => {
    //   video.current.loadAsync({
    //     uri: splashData?.banner_photo_url,
    //   });
    //   video.current.playAsync()
    // return ()=>{
    //   video.current.pauseAsync()
    // }
    // }, []);
    return (
      <View style={{flex: 1}}>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: splashData?.banner_photo_url,
          }}
          isLooping
          muted
          onLoad={() => {
            console.log('on_load');
          }}
          onLoadStart={() => console.log('on_load_start')}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        <LinearGradient
          colors={['#00000000', '#00000099']}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            position: 'absolute',
            width: '100%',
            height: '100%',
            // backgroundColor: "rgba(0,0,0,0.45)",
            paddingTop: StatusBar.currentHeight + Sizes.fixPadding * 4.0,
            paddingBottom: Sizes.fixPadding * 4.0,
          }}>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.primaryColor,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.whiteColor18Bold}}>doj</Text>
            </View>
            <View
              style={{
                width: 50,
                height: 55,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.whiteColor18Bold}}>Doj</Text>
            </View>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{...Fonts.whiteColor15Medium}}>Food</Text>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 2,
                  backgroundColor: Colors.primaryColor,
                  marginHorizontal: 10,
                }}
              />
              <Text style={{...Fonts.whiteColor15Medium}}>Instamart</Text>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 2,
                  backgroundColor: Colors.primaryColor,
                  marginHorizontal: 10,
                }}
              />
              <Text style={{...Fonts.whiteColor15Medium}}>Genie</Text>
            </View>
            <View
              style={{
                flex: 0,
                height: 0.5,
                backgroundColor: Colors.grayColor,
                marginVertical: 10,
              }}
            />
            {isRegisterd && get_started()}
          </View>
        </LinearGradient>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    margin: Sizes.fixPadding * 2.0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding * 0.5,
    // marginHorizontal: Sizes.fixPadding * 2.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding,
    marginTop: Sizes.fixPadding * 2.0,
  },
  signinButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    margin: Sizes.fixPadding * 2.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding,
  },
  pageStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: "rgba(0,0,0,0.45)",
    paddingTop: StatusBar.currentHeight + Sizes.fixPadding * 4.0,
    paddingBottom: Sizes.fixPadding * 4.0,
  },
  animatedView: {
    backgroundColor: Colors.blackColor,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
  },
  video: {
    alignSelf: 'center',
    width: width,
    height: height,
    resizeMode: 'cover',
  },
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(null, mapDispatchToProps)(SplashScreen);
