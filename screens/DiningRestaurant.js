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
} from 'react-native';
import {Colors, Fonts, Sizes} from '../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SharedElement} from 'react-navigation-shared-element';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import CircularProgress from 'react-native-circular-progress-indicator';
import {Icon} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import ImageView from 'react-native-image-viewing';

const {width} = Dimensions.get('window');

const images = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1573273787173-0eb81a833b34',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1569569970363-df7b6160d111',
  },
];

const filterTypeList = [
  {
    id: 1,
    text: 'Offers',
    icon: 'tune',
  },
  {
    id: 2,
    text: 'Photo',
    icon: 'expand-more',
  },
  {
    id: 3,
    text: 'Menu',
    icon: 'speed',
  },
  {
    id: 4,
    text: 'Events',
    icon: 'tune',
  },
];

const DiningRestaurant = ({navigation, route}) => {
  const [restaruantData] = useState(route.params.restaruantData);
  console.log(restaruantData);
  const [state, setState] = useState({
    activeTab: 1,
    menuCardData: [],
    gallaryImageData: [],
    dineImageVisible: false,
    dineImageIndex: 0,
    gallaryImageVisible: false,
    gallaryImageIndex: 0,
  });

  useEffect(() => {
    get_menu_cards();
  }, []);

  const get_menu_cards = () => {
    let cards = restaruantData?.dine_gallery;
    let gallary = restaruantData?.dine_gallery;
    let new_arr = [];
    cards.forEach(element => {
      new_arr.push({uri: element.image_url});
    });

    let new_arr_a = [];
    gallary.forEach(element => {
      new_arr_a.push({uri: element.image_url});
    });

    updateState({menuCardData: new_arr, gallaryImageData: new_arr_a});
  };

  const updateState = data => setState({...state, ...data});

  const {
    activeTab,
    menuCardData,
    dineImageVisible,
    dineImageIndex,
    gallaryImageData,
    gallaryImageIndex,
    gallaryImageVisible,
  } = state;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <StatusBar translucent={false} backgroundColor={'#28134D'} />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#28134D',
                  borderBottomLeftRadius: Sizes.fixPadding * 2,
                  borderBottomRightRadius: Sizes.fixPadding * 2,
                }}>
                <Image
                  source={require('../assets/images/dining_transparent.png')}
                  style={{
                    width: '100%',
                    height: 320,
                    opacity: 0.2,
                    alignSelf: 'center',
                    top: Sizes.fixPadding * 2,
                  }}
                />
                <View style={{width: '100%', position: 'absolute'}}>
                  {header()}
                  {restaurantInfo()}
                </View>
              </View>
              {filterType()}
              {activeTab == 1 ? (
                <>
                  {carnivalOfferInfo()}
                  {otherOfferInfo()}
                </>
              ) : activeTab == 2 ? (
                <>{gallaryImageInfo()}</>
              ) : activeTab == 3 ? (
                <>{menuCardsInfo()}</>
              ) : null}
            </>
          }
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 6.0}}
          showsVerticalScrollIndicator={false}
        />
        {bottomButtons()}
        {showDineImages()}
        {showGallaryImages()}
      </View>
    </SafeAreaView>
  );

  function bottomButtons() {
    return (
      <View
        style={{
          flex: 0,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          position: 'absolute',
          bottom: 0,
          backgroundColor: Colors.whiteColor,
          paddingVertical: Sizes.fixPadding,
          elevation: 8,
        }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('bookSeat', {restaruantData: restaruantData})
          }
          style={{
            flex: 0,
            width: '47%',
            justifyContent: 'center',
            alignItems: 'center',
            height: Sizes.fixPadding * 5,
            borderRadius: Sizes.fixPadding * 0.5,
            borderWidth: 0.5,
            borderColor: Colors.grayColor,
          }}>
          <Text style={{...Fonts.blackColor13Medium}}>Book a seat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 0,
            width: '47%',
            justifyContent: 'center',
            alignItems: 'center',
            height: Sizes.fixPadding * 5,
            borderRadius: Sizes.fixPadding * 0.5,
            backgroundColor: Colors.primaryColor,
          }}>
          <Text style={{...Fonts.whiteColor15SemiBold}}>Pay bill</Text>
          <Text style={{...Fonts.whiteColor12SemiBold}}>
            FLAT 20% OFF with Gold
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function showGallaryImages(){
    return (
      <ImageView
        images={gallaryImageData}
        imageIndex={gallaryImageIndex}
        visible={gallaryImageVisible}
        doubleTapToZoomEnabled
        onRequestClose={() => updateState({gallaryImageVisible: false})}
      />
    );
  }

  function showDineImages() {
    return (
      <ImageView
        images={menuCardData}
        imageIndex={dineImageIndex}
        visible={dineImageVisible}
        doubleTapToZoomEnabled
        onRequestClose={() => updateState({dineImageVisible: false})}
      />
    );
  }

  function gallaryImageInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() =>
            updateState({gallaryImageIndex: index, gallaryImageVisible: true})
          }
          style={{
            width: width * 0.28,
            height: width * 0.28,
            marginRight: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
          }}>
          <Image
            source={{uri: item?.uri}}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <FlatList data={gallaryImageData} renderItem={renderItem} numColumns={3} />
      </View>
    );
  }

  function menuCardsInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() =>
            updateState({dineImageIndex: index, dineImageVisible: true})
          }
          style={{
            width: width * 0.28,
            height: width * 0.28,
            marginRight: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
          }}>
          <Image
            source={{uri: item?.uri}}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <FlatList data={menuCardData} renderItem={renderItem} numColumns={3} />
      </View>
    );
  }

  function otherOfferInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding * 2,
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.blackColor18SemiBold}}>Other offers</Text>
          <TouchableOpacity>
            <Text style={{...Fonts.primaryColor14SemiBold}}>
              See all offers
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{...Fonts.grayColor13Medium}}>No prebooking required</Text>
      </View>
    );
  }

  function carnivalOfferInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding * 2,
        }}>
        <Text style={{...Fonts.blackColor18SemiBold}}>Carnival offer</Text>
        <Text style={{...Fonts.grayColor13Medium}}>
          Pre booking mandatory to avail this offer
        </Text>
        <LinearGradient
          colors={['#361a66', '#1d0b3b']}
          start={{x: 0.3, y: 0.3}}
          end={{x: 0.9, y: 0.3}}
          locations={[0, 0.9]}
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding * 0.7,
            borderRadius: Sizes.fixPadding * 0.5,
            marginTop: Sizes.fixPadding,
          }}>
          <View style={{flex: 0.6}}>
            <Text
              style={{
                ...Fonts.whiteColor15SemiBold,
                marginBottom: Sizes.fixPadding,
              }}>
              Carnival saving{'\n'}await you
            </Text>
            <Text style={{...Fonts.whiteColor15Medium}}>FLAT 50% OFF</Text>
            <Text style={{...Fonts.whiteColor12SemiBold}}>
              for limited seat only
            </Text>
            <TouchableOpacity
              style={{
                width: '70%',
                alignSelf: 'flex-start',
                backgroundColor: Colors.primaryColor,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: Sizes.fixPadding * 0.5,
                borderRadius: Sizes.fixPadding,
                marginTop: Sizes.fixPadding * 2,
              }}>
              <Text style={{...Fonts.whiteColor12SemiBold}}>
                Save your seat
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CircularProgress
              value={3}
              radius={width * 0.1}
              duration={2000}
              progressValueColor={Colors.whiteColor}
              inActiveStrokeColor={'#361a66'}
              activeStrokeColor={Colors.whiteColor}
              inActiveStrokeWidth={15}
              activeStrokeWidth={15}
              maxValue={100}
              title={''}
              titleColor={'white'}
              titleStyle={{fontWeight: 'bold'}}
            />
            <Text
              style={{
                ...Fonts.whiteColor12SemiBold,
                marginTop: Sizes.fixPadding,
              }}>
              SEAT AVAILABLE{'\n'}FROM 5 PM
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  function filterType() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => updateState({activeTab: item.id})}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: width * 0.2,
          marginRight: Sizes.fixPadding + 5.0,
          backgroundColor:
            item.id == activeTab ? Colors.primaryColor : Colors.whiteColor,
          paddingVertical: Sizes.fixPadding * 0.5,
          borderRadius: 1000,
          borderWidth: item.id == activeTab ? 0 : 1,
          borderColor: Colors.grayColor,
        }}>
        <Text
          style={{
            ...Fonts.blackColor13Medium,
            marginRight: 5,
            color: item.id == activeTab ? Colors.whiteColor : Colors.blackColor,
          }}>
          {item.text}
        </Text>
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
            paddingTop: Sizes.fixPadding * 1.5,
          }}
        />
      </View>
    );
  }

  function restaurantInfo() {
    return (
      <View style={{marginTop: Sizes.fixPadding * 3}}>
        <View
          style={{
            flex: 0,
            marginHorizontal: Sizes.fixPadding * 0.8,
            // height: 250,
            backgroundColor: Colors.whiteColor,
            alignSelf: 'center',
            borderRadius: Sizes.fixPadding * 2,
            paddingHorizontal: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
          }}>
          <ImageBackground
            source={require('../assets/images/dining_fold.png')}
            style={{
              width: width * 0.3,
              height: width * 0.1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: -13,
              left: 20,
            }}
            resizeMode="contain">
            <Text style={{...Fonts.whiteColor15Medium}}>DINING</Text>
          </ImageBackground>
          <View
            style={{
              alignSelf: 'flex-end',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.grayColor,
                borderRadius: Sizes.fixPadding,
                paddingHorizontal: Sizes.fixPadding * 0.7,
                paddingVertical: Sizes.fixPadding * 0.1,
              }}>
              <Ionicons name="star" color={'#fca311'} size={16} />
              <Text
                style={{
                  ...Fonts.blackColor13Medium,
                  marginLeft: Sizes.fixPadding * 0.5,
                }}>
                5.0
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.grayColor13Medium,
              }}>
              Review
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: Sizes.fixPadding * 2,
              top: -Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.blackColor20Bold}}>
              {restaruantData?.first_name}
            </Text>
            <Text numberOfLines={1} style={{...Fonts.grayColor13Medium}}>
              {restaruantData?.description}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.grayColor13Medium,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              {restaruantData?.address}
            </Text>
            <Text
              style={{
                ...Fonts.blackColor15Medium,
                marginTop: Sizes.fixPadding,
              }}>
              ₹ 150 for two
            </Text>
            <View
              style={{
                flex: 0,
                backgroundColor: Colors.blueColor + '10',
                width: '70%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                alignSelf: 'flex-start',
                padding: Sizes.fixPadding * 0.5,
                marginTop: Sizes.fixPadding,
                borderRadius: Sizes.fixPadding,
              }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="security"
                  color={Colors.greenColor}
                  size={16}
                />
                <Text
                  style={{
                    ...Fonts.blackColor12SemiBold,
                    marginLeft: Sizes.fixPadding * 0.5,
                  }}>
                  Open now
                </Text>
                <View
                  style={{
                    width: 2,
                    height: 10,
                    backgroundColor: Colors.grayColor,
                    marginHorizontal: 3,
                  }}
                />
                <Text style={{...Fonts.blackColor12SemiBold}}>12non-1am</Text>
              </View>
              <MaterialIcons
                name="arrow-drop-down"
                color={Colors.blackColor}
                size={20}
              />
            </View>
          </View>
          <View
            style={{
              flex: 0,
              borderTopWidth: 0.8,
              marginTop: Sizes.fixPadding,
              borderTopColor: Colors.lightGrayColor,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 0,
                width: '75%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                borderRightWidth: 0.8,
                paddingVertical: Sizes.fixPadding * 0.8,
                borderRightColor: Colors.lightGrayColor,
              }}>
              <View
                style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons
                  name="dinner-dining"
                  color={Colors.primaryColor}
                  size={22}
                />
                <Text
                  style={{
                    ...Fonts.blackColor13Medium,
                    marginLeft: Sizes.fixPadding,
                  }}>
                  Book a seat
                </Text>
              </View>
              <TouchableOpacity style={{}}>
                <MaterialIcons
                  name="directions"
                  color={Colors.primaryColor}
                  size={22}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                width: '25%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather
                name="phone-call"
                color={Colors.primaryColor}
                size={18}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            type="MaterialIcons"
            name="arrow-back"
            size={22}
            color={Colors.whiteColor}
          />
        </TouchableOpacity>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={styles.headerRightButtons}>
            <Ionicons
              name="heart-outline"
              size={18}
              color={Colors.blackColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.headerRightButtons,
              marginLeft: Sizes.fixPadding,
            }}>
            <MaterialCommunityIcons
              name="share-outline"
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
  headerRightButtons: {
    width: 30,
    height: 30,
    backgroundColor: Colors.whiteColor,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding,
    justifyContent: 'space-between',
  },
});

export default DiningRestaurant;
