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
} from 'react-native';
import {Colors, Fonts, Sizes} from '../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SharedElement} from 'react-navigation-shared-element';
import {Icon} from '@rneui/themed';
import axios from 'axios';
import {api_url, customer_get_nearest_dine} from '../constants/api';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

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

const Dining = ({navigation}) => {
  const [state, setState] = useState({
    isLoading: false,
    restaruantData: null,
    refreshing: false
  });

  const updateState = data => setState(state => ({...state, ...data}));

  useEffect(()=>{
    get_restaruants()
  }, [])

  const get_restaruants = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + customer_get_nearest_dine,
      data: {
        latitude: '28.6284992',
        longitude: '77.3774876',
      },
    }).then(res=>{
      updateState({isLoading: false})
      if(res.data.status){
        updateState({restaruantData: res.data.data})
      }
    }).catch(err=>{
      updateState({isLoading: false})
      console.log(err)
    });
  };

  const get_restaruants_on_refresh = async()=>{
    updateState({refreshing: true});
    await axios({
      method: 'post',
      url: api_url + customer_get_nearest_dine,
      data: {
        latitude: '28.6284992',
        longitude: '77.3774876',
      },
    }).then(res=>{
      updateState({refreshing: false})
      if(res.data.status){
        updateState({restaruantData: res.data.data})
      }
    }).catch(err=>{
      updateState({refreshing: false})
      console.log(err)
    });
  }

  const {isLoading, restaruantData, refreshing} = state;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <StatusBar translucent={false} backgroundColor={'#28134D'} />
      <View style={{flex: 1}}>
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={get_restaruants_on_refresh} />}
          ListHeaderComponent={
            <>
              <View
                style={{
                  width: '100%',
                  height: 450,
                  backgroundColor: '#28134D',
                  borderBottomLeftRadius: Sizes.fixPadding * 2,
                  borderBottomRightRadius: Sizes.fixPadding * 2,
                  //   opacity: 0.92,
                }}>
                <Image
                  source={require('../assets/images/dining_transparent.png')}
                  style={{
                    width: '100%',
                    height: 300,
                    opacity: 0.2,
                    alignSelf: 'center',
                    top: Sizes.fixPadding * 5,
                  }}
                />
                <View style={{width: '100%', position: 'absolute'}}>
                  {header()}
                  {searchInfo()}
                  {DiningImage()}
                  {starRow()}
                  {mainButtons()}
                </View>
              </View>
              {filterType()}
              {restaurantsInfo()}
            </>
          }
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 6.0}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

  function restaurantsInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('diningRestaurant', {restaruantData: item})
        }
        style={{
          backgroundColor: Colors.lightGrayColor,
          borderRadius: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={{uri: item?.restaurant_img}}
          style={styles.restaurantToExplore}>
          <LinearGradient
            colors={['#00000000', '#00000099']}
            style={{
              height: 200,
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
              <View
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
              </View>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'flex-end',
                padding: Sizes.fixPadding,
              }}>
              <Image
                source={{uri: item.restaurant_img}}
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
        {
          restaruantData &&   <FlatList
          data={restaruantData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
        }
      
      </View>
    );
  }

  function DiningImage() {
    return (
      <ImageBackground
        source={require('../assets/images/dining_fold.png')}
        style={{
          width: width * 0.6,
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
        resizeMode="contain">
        <Text style={{...Fonts.whiteColor18Bold}}>DINING</Text>
      </ImageBackground>
    );
  }

  function starRow() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.whiteColor12SemiBold}}>
          <Ionicons name="star" color={'#fca311'} size={20} /> Save your seat
        </Text>
        <Text
          style={{
            ...Fonts.whiteColor12SemiBold,
            marginLeft: Sizes.fixPadding,
          }}>
          <Ionicons name="star" color={'#fca311'} size={20} /> Pay with Doj
        </Text>
      </View>
    );
  }

  function mainButtons() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: Sizes.fixPadding * 7,
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{width: width * 0.25, height: width * 0.3}}>
          <ImageBackground
            source={require('../assets/images/dining_back_a.png')}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
            }}
            resizeMode="contain">
            <Text
              style={{
                ...Fonts.whiteColor18Bold,
                position: 'absolute',
                top: 9,
                alignSelf: 'center',
              }}>
              %
            </Text>
            <View
              style={{
                flex: 0,
                width: '100%',
                flexDirection: 'row',
                padding: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{...Fonts.whiteColor12SemiBold}}>
                All{'\n'}Orders
              </Text>
              <View
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: Colors.whiteColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 1000,
                }}>
                <Ionicons
                  name="arrow-forward"
                  color={Colors.grayColor}
                  size={14}
                />
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{width: width * 0.25, height: width * 0.3}}>
          <ImageBackground
            source={require('../assets/images/dining_back_b.png')}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
            }}
            resizeMode="contain">
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Ionicons
                name="map-outline"
                color={Colors.whiteColor}
                size={25}
              />
              <View
                style={{
                  flex: 0,
                  width: '100%',
                  flexDirection: 'row',
                  padding: Sizes.fixPadding * 1.5,
                  justifyContent: 'space-between',
                }}>
                <Text style={{...Fonts.whiteColor12SemiBold}}>
                  Event{'\n'}Ticket
                </Text>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: Colors.whiteColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 1000,
                  }}>
                  <Ionicons
                    name="arrow-forward"
                    color={Colors.grayColor}
                    size={14}
                  />
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{width: width * 0.25, height: width * 0.3}}>
          <ImageBackground
            source={require('../assets/images/dining_back_b.png')}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
            }}
            resizeMode="contain">
            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Ionicons
                name="map-outline"
                color={Colors.whiteColor}
                size={25}
              />
              <View
                style={{
                  flex: 0,
                  width: '100%',
                  flexDirection: 'row',
                  padding: Sizes.fixPadding * 1.5,
                  justifyContent: 'space-between',
                }}>
                <Text style={{...Fonts.whiteColor12SemiBold}}>
                  View{'\n'}Picker
                </Text>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: Colors.whiteColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 1000,
                  }}>
                  <Ionicons
                    name="arrow-forward"
                    color={Colors.grayColor}
                    size={14}
                  />
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }

  function filterType() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('RestaurantsList')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: Sizes.fixPadding + 5.0,
          backgroundColor: Colors.whiteColor,
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding * 0.4,
          borderRadius: 1000,
          borderWidth: 1,
          borderColor: Colors.grayColor,
        }}>
        <Text
          style={{
            ...Fonts.grayColor12Regular,
            marginRight: 5,
          }}>
          {item.text}
        </Text>
        <Icon
          type="MaterialIcons"
          name={item.icon}
          color={Colors.grayColor}
          size={14}
        />
      </TouchableOpacity>
    );
    return (
      <View>
        <FlatList
          data={filterTypeList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding * 3,
          }}
        />
      </View>
    );
  }

  function searchInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('Search')}
        style={styles.searchInfoWrapStyle}>
        <Text style={{...Fonts.grayColor12Medium}}>
          Search for restaurant,food...
        </Text>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <MaterialIcons name="search" color={Colors.blackColor} size={18} />
          {/* <View
            style={{
              height: 20,
              width: 1,
              backgroundColor: Colors.blackColor,
              marginHorizontal: Sizes.fixPadding,
            }}
          /> */}
          {/* <MaterialIcons
            name="keyboard-voice"
            color={Colors.primaryColor}
            size={18}
          /> */}
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
        <TouchableOpacity onPress={() => navigation.navigate('selectAddress')}>
          <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="navigate"
              type="ionicon"
              color={Colors.primaryColor}
              size={18}
            />
            <Text style={{...Fonts.whiteColor15Medium, marginHorizontal: 5}}>
              Noida
            </Text>
            <Icon
              name="chevron-down-outline"
              type="ionicon"
              color={Colors.grayColor}
              size={18}
            />
          </View>
          <Text style={{...Fonts.whiteColor12SemiBold}}>
            H-91 Sector 63, Noida....
          </Text>
        </TouchableOpacity>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={{paddingHorizontal: Sizes.fixPadding * 0.3}}>
            <Icon
              type="MaterialIcons"
              name="g-translate"
              size={18}
              color={Colors.whiteColor}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{paddingHorizontal: Sizes.fixPadding * 0.3}}>
            <Icon
              type="MaterialIcons"
              name="headset-mic"
              size={18}
              color={Colors.whiteColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('profile')}
            style={{paddingHorizontal: Sizes.fixPadding * 0.3}}>
            <Icon
              type="Ionicons"
              name="person"
              size={18}
              color={Colors.whiteColor}
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
    height: 200,
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
});

export default Dining;
