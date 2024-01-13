import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Text,
  Platform,
  Linking,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {
  api_url,
  get_cart_new,
  phonepe_payment,
  user_save_order,
} from '../../constants/api';
import {connect} from 'react-redux';
import Loader from '../../components/Loader';
import * as CartActions from '../../redux/actions/CartActions';
import {CommonActions} from '@react-navigation/native';
import moment from 'moment';
import {PhonePe, Constants} from 'phonepesdk';

const SelectPaymentMethodScreen = ({
  navigation,
  route,
  customerData,
  location,
  dispatch,
}) => {
  const paymentMethodsList = [
    {
      id: '1',
      paymentMethod: 'Wallet',
      paymentMethodIcon: require('../../assets/images/paymentMethod/wallet.png'),
    },
    {
      id: '2',
      paymentMethod: 'Credit card/Debit card',
      paymentMethodIcon: require('../../assets/images/paymentMethod/card.png'),
    },
    {
      id: '3',
      paymentMethod:
        route.params.delivery_type == '1'
          ? 'Cash on delivery'
          : 'Cash on counter',
      paymentMethodIcon: require('../../assets/images/paymentMethod/cash.png'),
    },
    {
      id: '4',
      paymentMethod: 'PhonePe',
      paymentMethodIcon: require('../../assets/images/paymentMethod/phonepe.png'),
    },
    {
      id: '5',
      paymentMethod: 'PayUmoney',
      paymentMethodIcon: require('../../assets/images/paymentMethod/payUmoney.png'),
    },
  ];
  const [state, setState] = useState({
    selectedPaymentMethodId: paymentMethodsList[2].id,
    isLoading: false,
  });

  const updateState = data => setState(state => ({...state, ...data}));

  const place_order = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + user_save_order,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: customerData?.id,
        address: location?.currentLocation,
        latitude: location?.latitude.toString(),
        longitude: location?.longitude.toString(),
        amount: route.params.total_price.toString(),
        payment_type: 'cash',
        restaurant_id: route.params.restaurant_id,
        order_type: route.params.delivery_type,
        keep_time: route.params.schedule_time,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        get_cart(customerData?.id);
        navigation.navigate('OrderPlaceInfo', {
          total_price: route.params.total_price,
          orderData: res.data,
          order_type: route.params.delivery_type,
        });
      })
      .catch(err => {
        updateState({isLoading: false});
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
              dispatch(CartActions.setSelfDeliveryCartData(self_delivery_data));
            }
          } else {
            dispatch(CartActions.setCartData(null));
            dispatch(CartActions.setSelfDeliveryCartData(null));
          }
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const on_phone_pe = async () => {
    await axios({
      method: 'post',
      url: 'https://doj.patialamart.com/admin/doj/api/payment',
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json'
      },
      data: {
        user_id: '24',
        amount: 1,
        address: location?.currentLocation,
        latitude: location?.latitude.toString(),
        longitude: location?.longitude.toString(),
        amount: route.params.total_price.toString(),
        payment_type: 'phonepe',
        restaurant_id: route.params.restaurant_id,
        order_type: route.params.delivery_type,
        keep_time: route.params.schedule_time,
      },
    })
      .then(res => {
        console.log(JSON.stringify(res.data));
        Linking.openURL(res.data.url)
          .then(supported => {
            if (supported) {
              return Linking.openURL(res.data.url);
            } else {
              console.log('PhonePe app is not installed.');
            }
          })
          .catch(err => console.error('An error occurred', err));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const {selectedPaymentMethodId, isLoading} = state;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={<>{paymentMethodInfo()}</>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 2.0}}
        />
      </View>
      <View style={{backgroundColor: Colors.bodyBackColor}}>
        {amountPayableInfo()}
        {proceedToCheckoutButton()}
      </View>
    </SafeAreaView>
  );

  function proceedToCheckoutButton() {
    const on_pay = () => {
      if (selectedPaymentMethodId == '4') {
        on_phone_pe();
      } else {
        place_order();
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => on_pay()}
        style={styles.proceedToCheckoutButtonStyle}>
        <Text style={{...Fonts.whiteColor15Medium}}>Proceed To Checkout</Text>
      </TouchableOpacity>
    );
  }

  function amountPayableInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{...Fonts.blackColor18SemiBold}}>Amount Payable</Text>
        <Text style={{...Fonts.blackColor18SemiBold}}>
          ₹{route.params.total_price}
        </Text>
      </View>
    );
  }

  function paymentMethodInfo() {
    const renderItem = ({item, index}) => (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={item.id != '3' && item.id != '4'}
          onPress={() => updateState({selectedPaymentMethodId: item.id})}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.radioButtonOuterStyle}>
              {selectedPaymentMethodId == item.id ? (
                <View style={styles.radioButtonInnerStyle}></View>
              ) : null}
            </View>
            <Text
              style={{
                flex: 1,
                marginLeft: Sizes.fixPadding,
                ...Fonts.blackColor13Medium,
              }}>
              {item.paymentMethod}
            </Text>
          </View>
          <Image
            source={item.paymentMethodIcon}
            style={{width: 20.0, height: 20.0, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
        {index == paymentMethodsList.length - 1 ? null : (
          <View
            style={{
              marginVertical: Sizes.fixPadding * 2.0,
              backgroundColor: Colors.grayColor,
              height: 1.0,
            }}
          />
        )}
      </View>
    );
    return (
      <View style={styles.paymentMethodInfoWrapStyle}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding + 10.0,
            textAlign: 'center',
            ...Fonts.blackColor16SemiBold,
          }}>
          How'd you like to pay?
        </Text>
        <FlatList
          data={paymentMethodsList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
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
        <Text
          style={{
            marginLeft: Sizes.fixPadding - 5.0,
            flex: 1,
            ...Fonts.blackColor16SemiBold,
          }}>
          Select Payment Method
        </Text>
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
  proceedToCheckoutButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodInfoWrapStyle: {
    marginVertical: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    elevation: 1.0,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingTop: Sizes.fixPadding + 5.0,
    paddingBottom: Sizes.fixPadding * 3.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
  },
  radioButtonOuterStyle: {
    width: 16.0,
    height: 16.0,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    borderRadius: 8.0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInnerStyle: {
    width: 10.0,
    height: 10.0,
    borderRadius: 5.0,
    backgroundColor: Colors.primaryColor,
  },
});

const mapStateToProps = state => ({
  forCartData: state.cart.forCartData,
  customerData: state.customer.customerData,
  location: state.customer.location,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectPaymentMethodScreen);
