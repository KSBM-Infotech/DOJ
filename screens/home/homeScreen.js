import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  Platform,
  UIManager,
  LayoutAnimation,
  PermissionsAndroid,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SharedElement} from 'react-navigation-shared-element';
import {Icon} from '@rneui/themed';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import Key from '../../constants/key';
import {connect} from 'react-redux';
import * as UserActions from '../../redux/actions/CustomerActions';
import {
  api_url,
  customer_filter,
  get_banner,
  get_nearest_restaurant,
  restaurant_like,
} from '../../constants/api';
import LinearGradient from 'react-native-linear-gradient';
import HomeBannerPlaceHolder from '../../simmers/HomeSimmer';
import CartItems from '../../components/CartItems';
import {BottomSheet, CheckBox} from '@rneui/themed';
import {restaurant_filters} from '../../constants/data';
import {Divider, Modal} from 'react-native-paper';
import {MotiView, useAnimationState, useDynamicAnimation} from 'moti';
import {Easing} from 'react-native-reanimated';
import Voice from '@react-native-voice/voice';

const {width} = Dimensions.get('window');

const todaysSpecialList = [
  {
    id: 't1',
    foodImage: require('../../assets/images/food/food11.png'),
    foodName: 'Chicken italiano cheezy periperi pizza',
    amount: 14.99,
    isVeg: false,
  },
  {
    id: 't2',
    foodImage: require('../../assets/images/food/food14.png'),
    foodName: 'Paneer Khurchan',
    amount: 19.99,
    isVeg: true,
  },
];

const foodCategoriesList = [
  {
    id: '1',
    category: 'Fast Food',
    foodImage: require('../../assets/images/food/food3.png'),
  },
  {
    id: '2',
    category: 'South Indian',
    foodImage: require('../../assets/images/food/food4.png'),
  },
  {
    id: '3',
    category: 'Chinese',
    foodImage: require('../../assets/images/food/food5.png'),
  },
  {
    id: '4',
    category: 'Diet Food',
    foodImage: require('../../assets/images/food/food6.png'),
  },
  {
    id: '5',
    category: 'Italian',
    foodImage: require('../../assets/images/food/food7.png'),
  },
  {
    id: '6',
    category: 'Sea Food',
    foodImage: require('../../assets/images/food/food8.png'),
  },
  {
    id: '7',
    category: 'Ice Cream',
    foodImage: require('../../assets/images/food/food9.png'),
  },
  {
    id: '8',
    category: 'Dessert',
    foodImage: require('../../assets/images/food/food10.png'),
  },
];

const foodTypeList = [
  {
    id: '1',
    category: 'All',
    foodImage: require('../../assets/images/food/food3.png'),
  },
  {
    id: '2',
    category: 'Panner',
    foodImage: require('../../assets/images/food/food4.png'),
  },
  {
    id: '3',
    category: 'Chiken',
    foodImage: require('../../assets/images/food/food5.png'),
  },
  {
    id: '4',
    category: 'Veg',
    foodImage: require('../../assets/images/food/food6.png'),
  },
];

const offersBannersList = [
  {
    id: 'o1',
    bannerImage: require('../../assets/images/offer_banner/Offer1.png'),
  },
  // {
  //   id: 'o2',
  //   bannerImage: require('../../assets/images/offer_banner/Offer2.png'),
  // },
];

const nearByRestaurantsList = [
  {
    id: '1',
    restaurantName: 'Marine Rise Restaurant',
    ratedPeopleCount: 198,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 4.3,
  },
  {
    id: '2',
    restaurantName: 'Sliver Leaf Restaurant',
    ratedPeopleCount: 170,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 4.0,
  },
  {
    id: '3',
    restaurantName: 'Johson Foods',
    ratedPeopleCount: 130,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 3.5,
  },
  {
    id: '4',
    restaurantName: 'Lepord Cafe',
    ratedPeopleCount: 100,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 3.0,
  },
  {
    id: '5',
    restaurantName: 'King Of Foods',
    ratedPeopleCount: 80,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 2.0,
  },
];

const filterTypeList = [
  {
    id: 1,
    text: 'Filter',
    icon: 'tune',
  },
  {
    id: 2,
    text: 'Sort by',
    icon: 'expand-more',
  },
  {
    id: 3,
    text: 'Fast Delivery',
    icon: 'speed',
  },
  {
    id: 4,
    text: 'Custome',
    icon: 'tune',
  },
];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = ({
  navigation,
  dispatch,
  location,
  isLocationDefined,
  cartData,
  customerData,
  selfPickup,
  selfDeliveryCartData,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [topBanners, setTopBanners] = useState(null);
  const [nearestRestaurantData, setNearestRestaurantData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [state, setState] = useState({
    filterData: restaurant_filters,
    showSortFilter: false,
    showCuisinesFilter: false,
    cuisinesFilterData: null,
    sortFilterData: restaurant_filters[0].options,
    selectedCuisines: [],
    selectedSort: 'relevance',
    filters: {},
    voicePermissionVisible: false,
    voiceSerachVisible: false,
    isMikeOn: false,
    voiceSearchedValue: '',
    isVoiceSearched: false,
  });
  const voiceAnimation = useAnimationState({
    from: {opacity: 0.8, scale: 0.9},
    active: {
      scale: 2,
      opacity: 0,
    },
  });
  const updateState = data => setState({...state, ...data});

  useEffect(() => {
    dispatch(UserActions.setIsSelfPickup(selfPickup));
    get_top_banner();
    // get_filters();
    if (location) {
      get_near_by_restaurant(location?.latitude, location?.longitude);
    }
  }, [selfPickup]);

  useEffect(() => {
    console.log('hisdfjsjdf');
  }, [isMikeOn]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    // Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
  };

  const onSpeechRecognized = e => {
    console.log('onSpeechRecognized: ', e);
  };

  const onSpeechEnd = e => {
    voiceAnimation.transitionTo('from');
    console.log('onSpeechEnd: ', e);
  };

  const onSpeechError = e => {
    console.log('onSpeechError: ', e);
    voiceAnimation.transitionTo('from');
    updateState({isVoiceSearched: true});
  };

  const onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    voiceAnimation.transitionTo('from');
    let value = e?.value[0]
    updateState({voiceSerachVisible: false})
    navigation.navigate('homeSearch', {voice_value: value})
  
  };

  const onSpeechPartialResults = e => {
    console.log('onSpeechPartialResults: ', e);
    voiceAnimation.transitionTo('from');
  };

  const get_top_banner = async () => {
    setIsLoading(true);
    await axios({
      method: 'get',
      url: api_url + get_banner,
    })
      .then(res => {
        setIsLoading(false);
        setTopBanners(res.data);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const get_near_by_restaurant = async (latitude, longitude) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_nearest_restaurant,
      data: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        type: selfPickup ? '1' : '0',
        ...filters,
      },
    })
      .then(res => {
        setIsLoading(false);
        setNearestRestaurantData(res.data.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_near_by_restaurant_on_refresh = async () => {
    setIsRefreshing(true);
    await axios({
      method: 'post',
      url: api_url + get_nearest_restaurant,
      data: {
        latitude: location?.latitude.toString(),
        longitude: location?.longitude.toString(),
        type: selfPickup ? '1' : '0',
      },
    })
      .then(res => {
        setIsRefreshing(false);
        setNearestRestaurantData(res.data.nearestRestaurant);
      })
      .catch(err => {
        setIsRefreshing(false);
        console.log(err);
      });
  };

  const like_restaurant = async (restaurant_id, status) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + restaurant_like,
      data: {
        customer_id: customerData?.id,
        restaurant_id: restaurant_id,
        status: status,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_filters = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + customer_filter,
      data: {
        user_id: customerData?.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          const cusinesData = res.data.data.filter(
            item => item.title == 'Cuisines',
          )[0].filter_option;
          const sortData = res.data.data.filter(item => item.title == 'Sort')[0]
            .filter_option;
          updateState({
            filterData: res.data.data,
            cuisinesFilterData: cusinesData,
            sortFilterData: sortData,
            selectedSort: sortData[0]?.id,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 250) {
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
      setIsSticky(true);
    } else {
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsSticky(false);
    }
  };

  const {
    filterData,
    showCuisinesFilter,
    showSortFilter,
    cuisinesFilterData,
    sortFilterData,
    selectedCuisines,
    selectedSort,
    filters,
    voicePermissionVisible,
    voiceSerachVisible,
    isMikeOn,
    voiceSearchedValue,
    isVoiceSearched,
  } = state;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{flex: 1}}>
        {isLoading ? (
          <HomeBannerPlaceHolder />
        ) : (
          <>
            <FlatList
              onScroll={handleScroll}
              ListHeaderComponent={
                <>
                  {header()}
                  {searchInfo()}
                  {banners()}
                  {filterType()}
                  {foodTypeInfo()}
                  {nearestRestaurantData && restaurantToExplore()}
                  {foodOffDelivery()}
                  {foodCategoriesInfo()}
                  {offersInfo()}
                  {nearByRestaurantsInfo()}
                  {todaysSpecialInfo()}
                </>
              }
              contentContainerStyle={{paddingBottom: Sizes.fixPadding * 6.0}}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={get_near_by_restaurant_on_refresh}
                  colors={[Colors.primaryColor]}
                />
              }
            />
            {isSticky && (
              <View
                style={{
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  backgroundColor: Colors.whiteColor,
                  paddingBottom: Sizes.fixPadding,
                  elevation: 5,
                  shadowColor: Colors.grayColor,
                }}>
                {filterType()}
              </View>
            )}
          </>
        )}
      </View>
      {selfPickup
        ? selfDeliveryCartData && (
            <CartItems navigation={navigation} data={selfDeliveryCartData} />
          )
        : cartData && <CartItems navigation={navigation} data={cartData} />}
      {cuisinesFilterData && cuisinesFilterSheet()}
      {sortFilterData && sortFilterSheet()}
      {microphonePermissionInfo()}
      {voiceSearchInfo()}
    </SafeAreaView>
  );

  function voiceSearchInfo() {
    const on_start = async () => {
      voiceAnimation.transitionTo('active');
      updateState({isMikeOn: true, isVoiceSearched: false});
      try {
        await Voice.start('en-US');
      } catch (e) {
        console.error(e);
      }
    };
    return (
      <BottomSheet
        isVisible={voiceSerachVisible}
        onBackdropPress={() => updateState({voiceSerachVisible: false})}>
        <View>
          <TouchableOpacity
            onPress={() => updateState({voiceSerachVisible: false})}
            style={{
              width: 40,
              height: 40,
              borderRadius: 1000,
              backgroundColor: Colors.blackColor,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: Sizes.fixPadding * 2,
            }}>
            <Ionicons name="close" color={Colors.whiteColor} size={25} />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: Colors.whiteColor,
              borderTopLeftRadius: Sizes.fixPadding * 2,
              borderTopRightRadius: Sizes.fixPadding * 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                paddingVertical: Sizes.fixPadding,
                marginTop: Sizes.fixPadding,
              }}>
              {isVoiceSearched ? (
                <>
                  <Text
                    style={{...Fonts.blackColor15Medium, textAlign: 'center'}}>
                    Sorry! Didn't hear that
                  </Text>
                  <Text
                    style={{
                      ...Fonts.grayColor13Medium,
                      textAlign: 'center',
                      marginTop: Sizes.fixPadding,
                    }}>
                    Try saying restaurant name or dish
                  </Text>
                </>
              ) : (
                <Text
                  style={{
                    ...Fonts.grayColor13Medium,
                    textAlign: 'center',
                  }}>
                  Listening...
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => on_start()}
              style={{
                width: 50,
                height: 50,
                borderRadius: 1000,
                backgroundColor: Colors.primaryColor,
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: Sizes.fixPadding * 2,
              }}>
              {[...Array(3).keys()].map(index => {
                return (
                  <MotiView
                    key={index}
                    state={voiceAnimation}
                    transition={{
                      loop: voiceAnimation.current == 'from' ? false : true,
                      type: 'timing',
                      duration: 2000,
                      delay: index * 400,
                      easing: Easing.out(Easing.ease),
                      repeatReverse: voiceAnimation.current == 'from' ? false : true,
                    }}
                    style={[StyleSheet.absoluteFillObject, styles.dot]}
                  />
                );
              })}
              <MaterialCommunityIcons
                name="microphone"
                color={Colors.whiteColor}
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    );
  }

  function microphonePermissionInfo() {
    const requestMicroPhoneAccess = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        updateState({voicePermissionVisible: true});
      }
    };
    return (
      <Modal
        visible={voicePermissionVisible}
        onDismiss={() => updateState({voicePermissionVisible: false})}
        contentContainerStyle={{
          backgroundColor: Colors.whiteColor,
          margin: Sizes.fixPadding * 2,
          borderRadius: Sizes.fixPadding,
        }}>
        <View
          style={{
            marginTop: Sizes.fixPadding * 3,
            paddingHorizontal: Sizes.fixPadding,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 1000,
              backgroundColor: Colors.primaryColor + '30',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="microphone-off"
              color={Colors.primaryColor}
              size={35}
            />
          </View>
          <Text
            style={{
              ...Fonts.blackColor13Medium,
              marginVertical: Sizes.fixPadding,
            }}>
            Microphone permission is not enabled
          </Text>
          <Text
            style={{
              ...Fonts.grayColor12Medium,
              textAlign: 'center',
              marginBottom: Sizes.fixPadding * 3,
            }}>
            Please grant us permission to access{'\n'}voice search
          </Text>
          <Divider style={{width: '100%'}} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={requestMicroPhoneAccess}
            style={{paddingVertical: Sizes.fixPadding * 1.5}}>
            <Text style={{...Fonts.primaryColor12SemiBold}}>
              <MaterialCommunityIcons
                name="microphone"
                color={Colors.primaryColor}
                size={14}
              />
              Grant microphone permission
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function cuisinesFilterSheet() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.blackColor13Medium}}>{item?.title}</Text>
          <CheckBox
            center
            right
            style={{backgroundColor: 'red'}}
            containerStyle={{padding: 0}}
            checked={selectedCuisines.includes(item.id)}
            onPress={() => {
              let is_selected = selectedCuisines.includes(item.id);
              if (is_selected) {
                let new_arr = selectedCuisines.filter(i => i != item.id);
                updateState({selectedCuisines: new_arr});
              } else {
                let new_arr = selectedCuisines;
                new_arr.push(item.id);
                updateState({selectedCuisines: new_arr});
              }
            }}
            checkedIcon={
              <Icon
                name="check-box"
                type="material"
                color="green"
                size={25}
                iconStyle={{marginRight: 10}}
              />
            }
            uncheckedIcon={
              <Icon
                name="check-box-outline-blank"
                type="material"
                color="grey"
                size={25}
                iconStyle={{marginRight: 10}}
              />
            }
          />
        </View>
      );
    };
    return (
      <BottomSheet
        isVisible={showCuisinesFilter}
        onBackdropPress={() => updateState({cuisinesFilterData: false})}
        modalProps={{animationType: 'fade'}}>
        <View>
          <TouchableOpacity
            onPress={() => updateState({showCuisinesFilter: false})}
            style={{
              width: 40,
              height: 40,
              borderRadius: 1000,
              backgroundColor: Colors.blackColor,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: Sizes.fixPadding * 2,
            }}>
            <Ionicons name="close" color={Colors.whiteColor} size={25} />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: Colors.whiteColor,
              borderTopLeftRadius: Sizes.fixPadding * 2,
              borderTopRightRadius: Sizes.fixPadding * 2,
            }}>
            <View
              style={{
                paddingVertical: Sizes.fixPadding,
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.grayColor + '50',
                marginTop: Sizes.fixPadding,
              }}>
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                  marginLeft: Sizes.fixPadding * 1.5,
                }}>
                Cuisines
              </Text>
            </View>
            <View style={{padding: Sizes.fixPadding * 1.5}}>
              <Text style={{...Fonts.grayColor12Medium}}>POPULAR</Text>
              {<FlatList data={cuisinesFilterData} renderItem={renderItem} />}
            </View>

            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: Sizes.fixPadding * 0.5,
                borderTopWidth: 0.5,
                borderTopColor: Colors.grayColor + '50',
                paddingHorizontal: Sizes.fixPadding * 2,
              }}>
              <TouchableOpacity
                onPress={() => updateState({selectedCuisines: []})}
                activeOpacity={0.8}
                style={{flex: 0.4}}>
                <Text
                  style={{...Fonts.primaryColor14Medium, textAlign: 'center'}}>
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.6,
                  backgroundColor:
                    selectedCuisines.length == 0
                      ? Colors.grayColor1
                      : Colors.primaryColor,
                  paddingVertical: Sizes.fixPadding,
                  borderRadius: Sizes.fixPadding,
                }}>
                <Text
                  style={
                    selectedCuisines.length == 0
                      ? {...Fonts.grayColor14Medium, textAlign: 'center'}
                      : {...Fonts.whiteColor15Medium, textAlign: 'center'}
                  }>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>
    );
  }

  function sortFilterSheet() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.blackColor13Medium}}>{item?.title}</Text>
          <CheckBox
            center
            right
            style={{backgroundColor: 'red'}}
            containerStyle={{padding: 0}}
            checked={selectedSort == item?.api_value}
            onPress={() => {
              let filterData = filters;
              Object.assign(filterData, {sort_by: 'rating_high_to_low'});
              updateState({filters: filterData, selectedSort: item?.api_value});
            }}
            checkedIcon={
              <Icon
                name="radio-button-checked"
                type="material"
                color={Colors.primaryColor}
                size={25}
                iconStyle={{marginRight: 10}}
              />
            }
            uncheckedIcon={
              <Icon
                name="radio-button-unchecked"
                type="material"
                color="grey"
                size={25}
                iconStyle={{marginRight: 10}}
              />
            }
          />
        </View>
      );
    };
    return (
      <BottomSheet
        isVisible={showSortFilter}
        onBackdropPress={() => updateState({showSortFilter: false})}
        modalProps={{animationType: 'fade'}}>
        <View>
          <TouchableOpacity
            onPress={() => updateState({showSortFilter: false})}
            style={{
              width: 40,
              height: 40,
              borderRadius: 1000,
              backgroundColor: Colors.blackColor,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: Sizes.fixPadding * 2,
            }}>
            <Ionicons name="close" color={Colors.whiteColor} size={25} />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: Colors.whiteColor,
              borderTopLeftRadius: Sizes.fixPadding * 2,
              borderTopRightRadius: Sizes.fixPadding * 2,
            }}>
            <View
              style={{
                paddingVertical: Sizes.fixPadding,
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.grayColor + '50',
                marginTop: Sizes.fixPadding,
              }}>
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                  marginLeft: Sizes.fixPadding * 1.5,
                }}>
                Sort
              </Text>
            </View>
            <View style={{padding: Sizes.fixPadding * 1.5}}>
              {<FlatList data={sortFilterData} renderItem={renderItem} />}
            </View>

            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: Sizes.fixPadding * 0.5,
                borderTopWidth: 0.5,
                borderTopColor: Colors.grayColor + '50',
                paddingHorizontal: Sizes.fixPadding * 2,
              }}>
              <TouchableOpacity
                onPress={() => {
                  updateState({
                    selectedSort: 'relevance',
                    showSortFilter: false,
                  });
                  get_near_by_restaurant(
                    location?.latitude,
                    location?.longitude,
                  );
                }}
                activeOpacity={0.8}
                style={{flex: 0.4}}>
                <Text
                  style={{...Fonts.primaryColor14Medium, textAlign: 'center'}}>
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  updateState({showSortFilter: false});
                  get_near_by_restaurant(
                    location?.latitude,
                    location?.longitude,
                  );
                }}
                style={{
                  flex: 0.6,
                  backgroundColor:
                    selectedSort == 'relevance'
                      ? Colors.grayColor1
                      : Colors.primaryColor,
                  paddingVertical: Sizes.fixPadding,
                  borderRadius: Sizes.fixPadding,
                }}>
                <Text
                  style={
                    selectedSort == 'relevance'
                      ? {...Fonts.grayColor14Medium, textAlign: 'center'}
                      : {...Fonts.whiteColor15Medium, textAlign: 'center'}
                  }>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>
    );
  }

  function todaysSpecialInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('OfferDetail', {item: item})}
        style={{
          backgroundColor: Colors.lightGrayColor,
          borderRadius: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
        }}>
        <SharedElement id={item.id}>
          <Image
            source={item.foodImage}
            style={styles.todaysSpecialFoodImageStyle}
          />
        </SharedElement>
        <View style={styles.todaysSpecialFoodInfoWrapStyle}>
          <Text
            numberOfLines={2}
            style={{flex: 1, ...Fonts.blackColor13Medium}}>
            {item.foodName}
          </Text>
          <View
            style={{flex: 0.5, alignItems: 'flex-end', alignSelf: 'center'}}>
            <View
              style={{
                borderColor: item.isVeg ? Colors.greenColor : Colors.redColor,
                ...styles.vegOrnonVegIconOuterStyle,
              }}>
              <View
                style={{
                  ...styles.vegOrnonVegIconInnerStyle,
                  backgroundColor: item.isVeg
                    ? Colors.greenColor
                    : Colors.redColor,
                }}
              />
            </View>
          </View>
        </View>
        <Text
          style={{
            position: 'absolute',
            top: 5.0,
            right: 5.0,
            ...Fonts.whiteColor14Bold,
          }}>
          {item.amount.toFixed(2)}$
        </Text>
      </TouchableOpacity>
    );
    return (
      <View style={{margin: Sizes.fixPadding * 2.0}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.blackColor16SemiBold,
          }}>
          Today's Special
        </Text>
        <FlatList
          data={todaysSpecialList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function nearByRestaurantsInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('RestaurantDetail', {id: item.id})}
        style={styles.nearByRestaurantsWrapStyle}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <SharedElement id={item.id}>
              <View style={styles.nearByRestaurantsIconWrapStyle}>
                <Image
                  source={require('../../assets/images/icons/restaurant_icon.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    flex: 1,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </SharedElement>
            <View style={{flex: 1, marginLeft: Sizes.fixPadding}}>
              <Text style={{...Fonts.blackColor12SemiBold}}>
                {item.restaurantName}
              </Text>
              <Text style={{...Fonts.grayColor12Medium}}>
                {item.ratedPeopleCount} People Rated
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                marginRight: Sizes.fixPadding - 5.0,
                ...Fonts.primaryColor12SemiBold,
              }}>
              {item.rating.toFixed(1)}
            </Text>
            <MaterialIcons name="star" color={Colors.primaryColor} size={14} />
          </View>
        </View>
        <View
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MaterialIcons
            name="location-on"
            color={Colors.primaryColor}
            size={16}
          />
          <Text
            style={{
              marginLeft: Sizes.fixPadding - 5.0,
              ...Fonts.grayColor12Medium,
            }}>
            {item.restaurantAddress}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View>
        <View
          style={{
            marginBottom: Sizes.fixPadding,
            marginTop: Sizes.fixPadding * 2.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.blackColor16SemiBold}}>
            Restaurants Near You
          </Text>
          <Text
            onPress={() => navigation.push('RestaurantsList')}
            style={{...Fonts.primaryColor12SemiBold}}>
            see all
          </Text>
        </View>
        <FlatList
          listKey="nearByRestaurants"
          data={nearByRestaurantsList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  function offersInfo() {
    const renderItem = ({item}) => (
      <SharedElement id={item.id}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push('OfferDetail', {item: item})}
          style={styles.offerBannerWrapStyle}>
          <Image
            source={item.bannerImage}
            style={styles.offerBannerImageStyle}
          />
        </TouchableOpacity>
      </SharedElement>
    );
    return (
      <View style={{marginTop: Sizes.fixPadding * 2.0}}>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.blackColor16SemiBold}}>Offers For You</Text>
          <Text style={{...Fonts.primaryColor12SemiBold}}>see all</Text>
        </View>
        <FlatList
          data={offersBannersList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function foodCategoriesInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('RestaurantsList')}
        style={{alignItems: 'center', marginRight: Sizes.fixPadding + 5.0}}>
        <Image
          source={item.foodImage}
          style={{
            width: width * 0.18,
            height: width * 0.19,
            borderRadius: Sizes.fixPadding,
          }}
        />
        <Text
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor11SemiBold,
          }}>
          {item.category}
        </Text>
      </TouchableOpacity>
    );
    return (
      <View>
        <Text
          style={{
            marginTop: Sizes.fixPadding * 2.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            ...Fonts.blackColor16SemiBold,
          }}>
          Food Categories
        </Text>
        <FlatList
          data={foodCategoriesList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function filterType() {
    const apply_filter = key => {
      switch (key) {
        case 'Sort':
          if (filters.hasOwnProperty('sort_by')) {
            let filterData = filters;
            delete filterData['sort_by'];
            updateState({filters: 'sort_by'});
          } else {
            let filterData = filters;
            Object.assign(filterData, {sort_by: 'rating_high_to_low'});
            updateState({showSortFilter: true});
          }
          break;
        case 'Nearest':
          if (filters.hasOwnProperty('nearest')) {
            let filterData = filters;
            delete filterData['nearest'];
            updateState({filters: filterData});
          } else {
            let filterData = filters;
            Object.assign(filterData, {nearest: 1});
            updateState({filters: filterData});
          }
          get_near_by_restaurant(location?.latitude, location?.longitude);
          break;
        case 'Great Offers':
          if (filters.hasOwnProperty('great_offers')) {
            let filterData = filters;
            delete filterData['great_offers'];
            updateState({filters: filterData});
          } else {
            let filterData = filters;
            Object.assign(filterData, {great_offers: 1});
            updateState({filters: filterData});
          }
          get_near_by_restaurant(location?.latitude, location?.longitude);
          break;
        case 'Rating 4.0+':
          if (filters.hasOwnProperty('rating')) {
            let filterData = filters;
            delete filterData['rating'];
            updateState({filters: filterData});
          } else {
            let filterData = filters;
            Object.assign(filterData, {rating: 'rating_high_to_low'});
            updateState({filters: filterData});
          }
          get_near_by_restaurant(location?.latitude, location?.longitude);
          break;
        case 'Pure Veg':
          if (filters.hasOwnProperty('pure_veg')) {
            let filterData = filters;
            delete filterData['pure_veg'];
            updateState({filters: filterData});
          } else {
            let filterData = filters;
            Object.assign(filterData, {pure_veg: 1});
            updateState({filters: filterData});
          }
          get_near_by_restaurant(location?.latitude, location?.longitude);
          break;
        default:
          console.log('bysf');
      }
    };

    const filter_selection = title => {
      switch (title) {
        case 'Sort':
          if (filters.hasOwnProperty('sort_by')) {
            return true;
          }
          return false;
          break;
        case 'Nearest':
          if (filters.hasOwnProperty('nearest')) {
            return true;
          }
          return false;
          break;
        case 'Great Offers':
          if (filters.hasOwnProperty('great_offers')) {
            return true;
          }
          return false;
          break;
        case 'Rating 4.0+':
          if (filters.hasOwnProperty('rating')) {
            return true;
          }
          return false;
          break;
        case 'Pure Veg':
          if (filters.hasOwnProperty('pure_veg')) {
            return true;
          }
          return false;
          break;
        default:
          return false;
      }
    };

    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => apply_filter(item.title)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: Sizes.fixPadding + 5.0,
          backgroundColor: filter_selection(item.title)
            ? Colors.primaryColor
            : Colors.whiteColor,
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding * 0.4,
          borderRadius: 1000,
          borderWidth: filter_selection(item.title) ? 0 : 1,
          borderColor: Colors.grayColor,
        }}>
        <Text
          style={
            filter_selection(item.title)
              ? {
                  ...Fonts.whiteColor12SemiBold,
                  marginRight: 5,
                }
              : {...Fonts.grayColor12Medium, marginRight: 5}
          }>
          {item?.title}
        </Text>
        <Icon
          type="MaterialIcons"
          name={filter_selection(item.title) ? 'close' : item.icon}
          color={
            filter_selection(item.title) ? Colors.whiteColor : Colors.grayColor
          }
          size={14}
        />
      </TouchableOpacity>
    );
    return (
      <View>
        <FlatList
          data={filterData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function foodTypeInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('RestaurantsList')}
        style={{
          alignItems: 'center',
          marginRight: Sizes.fixPadding * 2.1,
          backgroundColor: item.id == 1 ? Colors.blueColor : Colors.whiteColor,
          elevation: 5,
          shadowColor: Colors.grayColor,
          marginBottom: Sizes.fixPadding,
          padding: Sizes.fixPadding,
          borderRadius: 1000,
        }}>
        <Image
          source={item.foodImage}
          style={{
            width: width * 0.11,
            height: width * 0.11,
            borderRadius: 1000,
          }}
        />
        <Text
          style={{
            marginVertical: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor11Regular,
            color: item.id == 1 ? Colors.whiteColor : Colors.grayColor,
          }}>
          {item.category}
        </Text>
      </TouchableOpacity>
    );
    return (
      <View style={{marginTop: Sizes.fixPadding * 1.0}}>
        <FlatList
          data={foodTypeList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function banners() {
    const renderItem = ({item}) => (
      <Image
        source={{uri: item.banner_photo_url}}
        style={styles.bannerImageStyle}
      />
    );
    return (
      <View style={{height: 120}}>
        {topBanners && (
          <FlatList
            data={topBanners}
            keyExtractor={item => `${item.id}`}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingLeft: Sizes.fixPadding * 2.0}}
          />
        )}
      </View>
    );
  }

  function foodOffDelivery() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('OfferDetail', {item: item})}
        style={{
          width: width * 0.22,
          borderRadius: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
          alignItems: 'center',
        }}>
        <View
          style={{
            elevation: 8,
            width: width * 0.15,
            height: width * 0.15,
            marginBottom: 10,
          }}>
          <Image
            source={item.foodImage}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: Sizes.fixPadding * 10,
              borderWidth: 1,
              borderColor: Colors.whiteColor,
            }}
          />
        </View>

        <Text style={{...Fonts.grayColor13Medium}}>{item.category}</Text>
      </TouchableOpacity>
    );
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2.0}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.blackColor14SemiBold,
          }}>
          20% off on food delivery
        </Text>
        <FlatList
          data={foodCategoriesList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          numColumns={4}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function restaurantToExplore() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('RestaurantDetail', {item: item, id: item.id})
        }
        style={{
          backgroundColor: Colors.lightGrayColor,
          borderRadius: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={{uri: item?.restaurant_image}}
          style={styles.restaurantToExplore}>
          <LinearGradient
            colors={['#00000099', '#ffffff00', '#00000099']}
            style={{
              height: 140,
              width: '100%',
              justifyContent: 'space-between',
              flex: 1,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
            }}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: Sizes.fixPadding * 0.7,
              }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: Colors.whiteColor,
                  borderRadius: 1000,
                  paddingHorizontal: Sizes.fixPadding * 0.5,
                }}>
                <MaterialIcons name="star-rate" color={'#fca311'} size={16} />
                <Text style={{...Fonts.blackColor13SemiBold}}>5.0</Text>
              </View>
              <TouchableOpacity
                onPress={() => like_restaurant(item.id, 1)}
                style={{
                  flex: 0,
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors.whiteColor,
                  borderRadius: 1000,
                }}>
                <Ionicons
                  name="heart-outline"
                  color={Colors.blueColor}
                  size={18}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'flex-end',
                padding: Sizes.fixPadding,
              }}>
              <Image
                source={{uri: item.restaurant_image}}
                style={{
                  width: width * 0.15,
                  height: width * 0.15,
                  borderRadius: Sizes.fixPadding * 0.5,
                  borderWidth: 1,
                  borderColor: Colors.whiteColor,
                }}
              />
              <View style={{marginLeft: Sizes.fixPadding}}>
                <Text style={{...Fonts.whiteColor12SemiBold}}>{item.name}</Text>
                <Text style={{...Fonts.whiteColor12SemiBold}}>
                  ₹ 150 per plate 10 mint{' '}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
    return (
      <View style={{margin: Sizes.fixPadding * 2.0}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.blackColor14SemiBold,
          }}>
          Restaurant to explore
        </Text>
        <FlatList
          data={nearestRestaurantData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function searchInfo() {
    const request_voice_permission = async () => {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      console.log(granted);
      if (granted) {
        updateState({voiceSerachVisible: true});
      } else {
        updateState({voicePermissionVisible: true});
      }
    };
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('homeSearch')}
        style={styles.searchInfoWrapStyle}>
        <Text style={{...Fonts.grayColor12Medium}}>
          Search for restaurant,food...
        </Text>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <MaterialIcons name="search" color={Colors.blackColor} size={18} />
          <View
            style={{
              height: 20,
              width: 1,
              backgroundColor: Colors.blackColor,
              marginHorizontal: Sizes.fixPadding,
            }}
          />
          <MaterialIcons
            name="keyboard-voice"
            color={Colors.primaryColor}
            size={18}
            onPress={request_voice_permission}
          />
        </View>
      </TouchableOpacity>
    );
  }

  function header() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('selectAddress')}
          style={{width: '70%'}}>
          <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="navigate"
              type="ionicon"
              color={Colors.primaryColor}
              size={18}
            />
            <Text style={{...Fonts.blackColor15Medium, marginHorizontal: 5}}>
              {location && location?.city}
            </Text>
            <Icon
              name="chevron-down-outline"
              type="ionicon"
              color={Colors.grayColor}
              size={18}
            />
          </View>
          <Text numberOfLines={1} style={{...Fonts.grayColor12Regular}}>
            {location && location?.currentLocation}
          </Text>
        </TouchableOpacity>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            // onPress={() => navigation.push('cartScreen')}
            style={{paddingHorizontal: Sizes.fixPadding * 0.3}}>
            <Icon
              type="MaterialIcons"
              name="g-translate"
              size={18}
              color={Colors.blackColor}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{paddingHorizontal: Sizes.fixPadding * 0.3}}>
            <Icon
              type="MaterialIcons"
              name="headset-mic"
              size={18}
              color={Colors.blackColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('profile')}
            style={{paddingHorizontal: Sizes.fixPadding * 0.3}}>
            <Icon
              type="Ionicons"
              name="person"
              size={18}
              color={Colors.blackColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  searchInfoWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.grayColor1,
    borderRadius: Sizes.fixPadding - 5.0,
    margin: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding + 5.0,
    // elevation: 2.0,
  },
  bannerImageStyle: {
    width: 320,
    height: 120,
    resizeMode: 'stretch',
    borderRadius: Sizes.fixPadding * 0.5,
    marginRight: Sizes.fixPadding * 2.0,
  },
  offerBannerWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginRight: Sizes.fixPadding * 2.0,
    height: width - 270.0,
    width: width - 140.0,
  },
  offerBannerImageStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  vegOrnonVegIconOuterStyle: {
    width: 12.0,
    height: 12.0,
    borderWidth: 1.0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegOrnonVegIconInnerStyle: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
  },

  restaurantToExplore: {
    height: 140,
    width: '100%',
    justifyContent: 'space-between',
    flex: 1,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  todaysSpecialFoodImageStyle: {
    height: 120,
    width: '100%',
    flex: 1,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  todaysSpecialFoodInfoWrapStyle: {
    padding: Sizes.fixPadding,
    height: 55.0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearByRestaurantsWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  nearByRestaurantsIconWrapStyle: {
    width: 35.0,
    height: 35.0,
    backgroundColor: '#E6E6E6',
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.fixPadding - 6.0,
  },
  dot: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: Colors.primaryColor,
  },
});

const mapStateToProps = state => ({
  location: state.customer.location,
  isLocationDefined: state.customer.isLocationDefined,
  cartData: state.cart.cartData,
  customerData: state.customer.customerData,
  selfDeliveryCartData: state.cart.selfDeliveryCartData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
