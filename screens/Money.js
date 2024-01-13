import React from 'react';
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
import {Icon} from '@rneui/themed';
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

const Money = ({navigation}) => {
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
                  height: 250,
                  backgroundColor: '#28134D',
                  borderBottomLeftRadius: Sizes.fixPadding * 2,
                  borderBottomRightRadius: Sizes.fixPadding * 2,
                }}>
                <Image
                  source={require('../assets/images/money_transparent.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    opacity: 0.2,
                    alignSelf: 'center',
                  }}
                />
                <View style={{width: '100%', position: 'absolute'}}>
                  {header()}
                  {DiningImage()}
                  {mainButtons()}
                </View>
              </View>
              {paymnetBanner()}
              {GiftCardInfo()}
              {ClaimGiftCardInfo()}
            </>
          }
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 6.0}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

  function ClaimGiftCardInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>navigation.navigate('addVoucher')}
        style={{
          padding: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding * 0.7,
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.grayColor1,
          margin: Sizes.fixPadding * 1.5,
        }}>
        <View style={{flex: 0.6}}>
          <Text style={{...Fonts.blackColor16SemiBold}}>
            Claim and gift card
          </Text>
          <Text
            style={{
              ...Fonts.grayColor13Medium,
              lineHeight: 18,
              marginTop: Sizes.fixPadding * 0.5,
            }}>
            Add to your doj credit
          </Text>
        </View>
        <View style={{flex: 0.4, alignItems: 'flex-end'}}>
          <MaterialIcons
            name="arrow-forward-ios"
            color={Colors.grayColor}
            size={18}
          />
        </View>
      </TouchableOpacity>
    );
  }

  function GiftCardInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.grayColor1,
          borderRadius: Sizes.fixPadding * 0.7,
          padding: Sizes.fixPadding,
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: Sizes.fixPadding * 1.5,
          }}>
          <View style={{flex: 0.6}}>
            <Text style={{...Fonts.blackColor18SemiBold}}>Gift cards</Text>
            <Text
              style={{
                ...Fonts.grayColor13Medium,
                lineHeight: 18,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              > Auro ko bhi sikho{'\n'}> Buy & Share Instantly{'\n'}> Buy &
              Share Instantly
            </Text>
          </View>
          <View style={{flex: 0.4}}>
            <Image
              source={require('../assets/images/gift_card1.png')}
              style={{
                width: width * 0.35,
                height: width * 0.2,
                resizeMode: 'contain',
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('giftCards')}
          style={{
            position: 'absolute',
            bottom: -Sizes.fixPadding * 1.2,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.primaryColor,
            paddingHorizontal: Sizes.fixPadding,
            paddingVertical: Sizes.fixPadding * 0.5,
            borderRadius: 1000,
          }}>
          <Text
            style={{
              ...Fonts.whiteColor12SemiBold,
              marginRight: Sizes.fixPadding * 0.5,
            }}>
            Buy Now
          </Text>
          <MaterialIcons
            name="arrow-forward"
            color={Colors.whiteColor}
            size={16}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function DiningImage() {
    return (
      <View
        style={{
          flex: 0,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: Sizes.fixPadding * 4,
        }}>
        <Text style={{...Fonts.whiteColor18Bold}}>Money</Text>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../assets/images/fast_left.png')}
            style={{width: 50, height: 10}}
          />
          <Text
            style={{
              ...Fonts.grayColor13Medium,
              marginHorizontal: Sizes.fixPadding,
            }}>
            By Doj
          </Text>
          <Image
            source={require('../assets/images/fast_right.png')}
            style={{width: 50, height: 10}}
          />
        </View>
      </View>
    );
  }

  function mainButtons() {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('giftCards')}>
          <Text style={{...Fonts.grayColor13Medium}}>GIFT CARD</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('wallet')}>
          <Text style={{...Fonts.grayColor13Medium}}>WALLET</Text>
        </TouchableOpacity>

        <Text style={{...Fonts.grayColor13Medium}}>UPO AND MORE...</Text>
      </View>
    );
  }

  function paymnetBanner() {
    return (
      <View style={{margin: Sizes.fixPadding * 1.5}}>
        <LinearGradient
          // Button Linear Gradient
          colors={['#F7FCD5', '#D6EFF4']}
          start={{x: 0, y: 0}}
          style={{
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 0.7,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flex: 0.6}}>
            <Text style={{...Fonts.grayColor15Medium}}>Doj</Text>
            <Text
              style={{
                ...Fonts.blackColor13Medium,
                lineHeight: 18,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              Digital payment{' '}
              <Text style={{color: Colors.primaryColor}}>apnao</Text>
              {'\n'}Auro ko bhi sikhao
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.grayColor,
                paddingHorizontal: Sizes.fixPadding,
                borderRadius: 1000,
                alignSelf: 'flex-start',
                marginTop: Sizes.fixPadding,
              }}>
              <Ionicons
                name="md-arrow-forward-outline"
                color={Colors.whiteColor}
                size={18}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.4}}>
            <Image
              source={require('../assets/images/banner1.png')}
              style={{
                width: width * 0.35,
                height: width * 0.2,
                resizeMode: 'contain',
              }}
            />
          </View>
        </LinearGradient>
      </View>
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
});
export default Money;
