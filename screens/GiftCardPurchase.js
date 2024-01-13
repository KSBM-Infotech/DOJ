import {
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors, Fonts, Sizes} from '../constants/styles';
import {ScrollView} from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { api_url, purchase_gift_card } from '../constants/api';
import Loader from '../components/Loader';
import { connect } from 'react-redux';
import { showToastWithGravity } from '../components/toastMessages';

const PAGE_WIDTH = Dimensions.get('window').width;

const {width, height} = Dimensions.get('window');

const GiftCardPurchase = ({navigation, route, customerData}) => {
  const [state, setState] = useState({
    amount: route.params?.amount,
    image: route.params?.image?.image_path,
    cardData: route.params?.cardData,
    isLoading: false,
    description: route.params?.description
  });

  const buy_gift_card = async()=>{
    updateState({isLoading: true})
    await axios({
      method: 'post',
      url: api_url + purchase_gift_card,
      data:{
        customer_id: customerData?.id,
        image_url: image,
        message: description,
        card_value: amount
      }
    }).then(res=>{
      updateState({isLoading: false})
      if(res.data.status){
        showToastWithGravity(res.data.message)
      }
    }).catch(err=>{
      updateState({isLoading: false})
      console.log(err)
    })
  }

  const updateState = data => setState({...state, ...data});

  const {image, amount, cardData, isLoading, description} = state;
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar backgroundColor={Colors.whiteColor} barStyle="dark-content" />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {header()}
              {showCardInfo()}
              {showSocialShareInfo()}
              {showBillSummary()}
              {showMessageInfo()}
              {/* {showFilters()} */}
              {/* {showBanners()} */}

              {/* {showChooseAmountInfo()} */}
              {/* {showAddMessageInfo()} */}
            </>
          }
        />
      </View>
      {showBottomButton()}
    </View>
  );

  function showBottomButton() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.whiteColor,
          elevation: 10,
          padding: Sizes.fixPadding,
        }}>
        <View style={{flex: 0.4}}>
          <Text style={{...Fonts.grayColor13Medium}}>Pay Using</Text>
          <Text style={{...Fonts.blackColor13Medium}}>Google Pay UPI</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={buy_gift_card}
          style={{
            flex: 0.6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Colors.primaryColor,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
          }}>
          <View>
            <Text style={{...Fonts.whiteColor15SemiBold}}>₹{amount}</Text>
            <Text style={{...Fonts.whiteColor12SemiBold}}>Total</Text>
          </View>
          <View>
            <Text style={{...Fonts.whiteColor15SemiBold}}>Buy Card</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function showMessageInfo() {
    return (
      <View
        style={{
          marginBottom: Sizes.fixPadding * 2,
          marginHorizontal: Sizes.fixPadding * 1.5,
        }}>
        <Text style={{...Fonts.grayColor13Medium}}>
          All gift cards are issued by Qwikcliver and have an expiry of 1 year.
          Read <Text style={{color: Colors.primaryColor}}>T&Cs</Text>
        </Text>
      </View>
    );
  }

  function showBillSummary() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginBottom: Sizes.fixPadding,
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          <View
            style={{
              width: '30%',
              height: 0.5,
              backgroundColor: Colors.grayColor,
            }}
          />
          <Text style={{...Fonts.grayColor13Medium}}>BILL SUMMARY</Text>
          <View
            style={{
              width: '30%',
              height: 0.5,
              backgroundColor: Colors.grayColor,
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: Colors.whiteColor,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: 0.5,
              borderBottomColor: Colors.grayColor + '80',
              paddingBottom: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{...Fonts.blackColor13Medium}}>Subtotal</Text>
            <Text style={{...Fonts.blackColor13Medium}}>₹{amount}</Text>
          </View>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{...Fonts.blackColor14SemiBold}}>Grand Total</Text>
            <Text style={{...Fonts.blackColor14SemiBold}}>₹{amount}</Text>
          </View>
        </View>
      </View>
    );
  }

  function showSocialShareInfo() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginVertical: Sizes.fixPadding * 2,
          backgroundColor: Colors.greenColor + '20',
          padding: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
          borderWidth: 1,
          borderColor: Colors.whiteColor,
        }}>
        <Image
          source={require('../assets/images/users/user1.png')}
          style={{width: 40, height: 40, borderRadius: 1000}}
        />
        <Text
          style={{
            ...Fonts.blackColor10Medium,
            flex: 1,
            marginLeft: Sizes.fixPadding,
          }}>
          Complete payment and share this e-gift card with your loved using any
          app
        </Text>
      </View>
    );
  }

  function showCardInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.whiteColor,
          borderRadius: Sizes.fixPadding * 2,
          elevation: 8,
          shadowColor: Colors.grayColor + '20',
        }}>
        <Image
          source={{uri: image}}
          style={{
            width: '100%',
            height: 180,
            borderRadius: Sizes.fixPadding * 2,
            zIndex: 3,
          }}
        />
        <View
          style={{
            flex: 0,
            paddingTop: Sizes.fixPadding * 3,
            paddingBottom: Sizes.fixPadding,
            backgroundColor: '#ffd45290',
            borderBottomLeftRadius: Sizes.fixPadding * 2,
            borderBottomRightRadius: Sizes.fixPadding * 2,
            position: 'relative',
            top: -Sizes.fixPadding * 2,
            zIndex: 2,
          }}>
          <Text style={{...Fonts.blackColor11Medium, textAlign: 'center'}}>
            {route.params?.cardData?.title}
          </Text>
        </View>
        <View
          style={{
            flex: 0,
            paddingTop: Sizes.fixPadding * 3,
            backgroundColor: Colors.whiteColor,
            borderBottomLeftRadius: Sizes.fixPadding * 2,
            borderBottomRightRadius: Sizes.fixPadding * 2,
            position: 'relative',
            top: -Sizes.fixPadding * 4,
            zIndex: 1,
            marginBottom: -Sizes.fixPadding * 2,
          }}>
          <Text style={{...Fonts.blackColor11Medium, textAlign: 'center'}}>
            Gift Card amount
          </Text>
          <Text style={{...Fonts.blackColor16SemiBold, textAlign: 'center'}}>
            ₹{amount}
          </Text>
        </View>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding * 1.5,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.whiteColor,
        }}>
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={22}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            flex: 0,
            textAlign: 'center',
            marginLeft: Sizes.fixPadding,
            ...Fonts.blackColor16SemiBold,
          }}>
          Complete Purchase
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  location: state.customer.location,
  isLocationDefined: state.customer.isLocationDefined,
  cartData: state.cart.cartData,
  customerData: state.customer.customerData,
});

export default connect(mapStateToProps, null)(GiftCardPurchase);
