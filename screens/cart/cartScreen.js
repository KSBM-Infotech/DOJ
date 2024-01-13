import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Menu, MenuItem} from 'react-native-material-menu';
import {connect} from 'react-redux';
import axios from 'axios';
import {
  api_url,
  cart_update_item,
  get_cart_new,
  user_get_cart,
} from '../../constants/api';
import * as CartActions from '../../redux/actions/CartActions';
import CircleLoader from '../../components/CircleLoader';
import {CartSimmer} from '../../simmers/Simmers';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {showToastWithGravity} from '../../components/toastMessages';
import { SCREEN_WIDTH } from '../config/screen';

const sizesList = ['Medium', 'Small', 'Large', 'Extra Large'];

const deliveryMedium = ['Delivery Boy', 'Self'];

let timeout;

const CartScreen = ({
  navigation,
  customerData,
  cartData,
  route,
  dispatch,
  isSelfPickup,
  selfDeliveryCartData,
}) => {
  const [timeVisible, setTimeVisible] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);
  const [state, setState] = useState({
    cartProducts: null,
    showSizeOptions: true,
    currentOptionsId: null,
    isLoading: false,
    rerender: false,
    isDeliveryBoy: isSelfPickup ? 0 : 1,
    showDiliveryType: false,
    deliveryCharge: isSelfPickup ? 0 : 2.5,
    time: null,
  });

  useEffect(() => {
    get_cart_data();
    return ()=>{
      updateState({time: null})
    }
  }, [rerender, isLoading, isSelfPickup]);

  const get_cart_data = async () => {
    try {
      let id = route.params.restaurant_id;
      let data;
      if (isSelfPickup) {
        data = selfDeliveryCartData[id];
      } else {
        data = cartData[id];
      }
      updateState({cartProducts: data});
    } catch (e) {
      console.log(e);
    }
  };

  const update_cart = async (item_id, quantity) => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + cart_update_item,
      data: {
        item_id: item_id,
        quantity: quantity,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        get_cart();
      })
      .catch(err => {
        updateState({isLoading: false});
      });
  };

  const get_cart = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + get_cart_new,
      data: {
        user_id: customerData?.id,
      },
    })
      .then(res => {
        updateState({isLoading: false, rerender});
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

  const timeHandle = (event, date) => {
    setTimeVisible(false);
    if (event.type == 'set') {
      const currentTime = new Date();
      const next2Hours = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000);
      if (new Date(date).getHours >= next2Hours.getHours) {
        console.log('Next 2 Hours:', next2Hours.toISOString());
        updateState({time: date});
      } else {
        showToastWithGravity(
          'Shedule time will alwasys greater than current time',
        );
      }
    }
  };

  const updateState = data => setState(state => ({...state, ...data}));

  const {
    cartProducts,
    showSizeOptions,
    currentOptionsId,
    isLoading,
    rerender,
    isDeliveryBoy,
    showDiliveryType,
    deliveryCharge,
    time,
  } = state;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      {/* <CircleLoader visible={isLoading} /> */}
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {cartProducts && cartProductsInfo()}
              {applyPromocode()}
              {cartProducts && totalInfo()}
              {showDeliveryTypeInfo()}
              {isSelfPickup && sheduleOrderInfo()}
            </>
          }
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 7.0}}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {cartProducts && proceedToCheckoutButton()}
      {timeVisible && (
        <DateTimePicker
          value={time == null ? new Date() : time}
          mode="time"
          onChange={timeHandle}
        />
      )}
    </SafeAreaView>
  );

  function totalInfo() {
    const totalPrice = cartProducts.reduce(
      (total, item) =>
        total + parseInt(item.quantity) * parseFloat(item.discount),
      0,
    );
    const tax = 2.5;
    const payableAmount = totalPrice + tax + deliveryCharge;

    return (
      <>
        {!isLoading ? (
          <View style={styles.totalInfoWrapStyle}>
            <View style={styles.subTotalWrapStyle}>
              <Text style={{...Fonts.blackColor16SemiBold}}>Sub Total</Text>
              <Text style={{...Fonts.blackColor16SemiBold}}>
                {`₹`}
                {totalPrice.toFixed(1)}
              </Text>
            </View>
            <View style={{padding: Sizes.fixPadding}}>
              <View style={styles.totalDetailWrapStyle}>
                <Text style={{...Fonts.blackColor15Medium}}>Service Tax</Text>
                <Text>
                  {`₹`}
                  {tax}
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: Sizes.fixPadding,
                  ...styles.totalDetailWrapStyle,
                }}>
                <Text style={{...Fonts.blackColor15Medium}}>
                  Delivery Charge
                </Text>
                <Text>
                  {`₹`}
                  {deliveryCharge}
                </Text>
              </View>
              <View style={styles.totalDetailWrapStyle}>
                <Text style={{...Fonts.primaryColor15SemiBold}}>
                  Amount Payable
                </Text>
                <Text style={{...Fonts.primaryColor15SemiBold}}>
                  {`₹`}
                  {payableAmount.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          CartSimmer()
        )}
      </>
    );
  }

  function proceedToCheckoutButton() {
    const totalPrice = cartProducts.reduce(
      (total, item) =>
        total + parseInt(item.quantity) * parseFloat(item.discount),
      0,
    );
    const tax = 2.5;
    const payableAmount = totalPrice + tax + deliveryCharge;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (isDeliveryBoy == 0) {
            navigation.navigate('SelectPaymentMethod', {
              total_price: payableAmount,
              restaurant_id: route.params.restaurant_id,
              delivery_type: isDeliveryBoy,
              schedule_time: time == null ? time : moment(time).format('hh:mm')
            });
          } else {
            navigation.navigate('SelectDeliveryAddress', {
              total_price: payableAmount,
              restaurant_id: route.params.restaurant_id,
              delivery_type: isDeliveryBoy,
              schedule_time: time == null ? time : moment(time).format('hh:mm')
            });
          }
        }}
        style={styles.proceedToCheckoutButtonStyle}>
        <Text style={{...Fonts.whiteColor15Medium}}>Proceed To Checkout</Text>
      </TouchableOpacity>
    );
  }

  function sheduleOrderInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => setTimeVisible(true)}>
          <Text style={{...Fonts.primaryColor14Medium, textDecorationLine: 'underline'}}>
          Schedule Your Order
          </Text>
        </TouchableOpacity>
        {time && (
          <Text style={{...Fonts.primaryColor14Medium}}>
            {moment(time).format('hh:mm A')}
          </Text>
        )}
      </View>
    );
  }

  function showDeliveryTypeInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2,
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'space-between',
        }}>
        <Text style={{...Fonts.blackColor14SemiBold}}>Delivery Type: </Text>
        <Text style={{...Fonts.blackColor13Medium}}>
          {isSelfPickup ? 'Self Pickup' : 'Delivery Boy'}
        </Text>
      </View>
    );
  }

  function updateProductSize({id, selectedSize}) {
    const newList = cartProducts.map(item => {
      if (item.id === id) {
        const updatedItem = {...item, size: selectedSize};
        return updatedItem;
      }
      return item;
    });
    updateState({cartProducts: newList});
  }

  function updateItemCount({id, type, quantity}) {
    let newList = [];
    if (quantity == 0) {
      newList = cartProducts.filter(item => item.id != id);
    } else {
      newList = cartProducts.map(item => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            quantity:
              type == 'remove'
                ? parseInt(item.quantity) > 1
                  ? parseInt(item.quantity) - 1
                  : parseInt(item.quantity)
                : parseInt(item.quantity) + 1,
          };
          return updatedItem;
        }
        return item;
      });
    }
    if (newList.length == 0) {
      updateState({cartProducts: newList});
      update_cart(id, quantity);
      navigation.goBack();
    } else {
      updateState({cartProducts: newList});
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        update_cart(id, quantity);
      }, 2000);
    }
  }

  function applyPromocode() {
    return (
      <>
      {showViewMore == true ? (
      <View style={{width: SCREEN_WIDTH, padding: Sizes.fixPadding*2}}>
        <Text style={{...Fonts.blackColor18Medium, color:Colors.grayColor, marginBottom:Sizes.fixPadding}}>Promocode</Text>
          <View style={{backgroundColor:Colors.whiteColor, padding:Sizes.fixPadding, borderTopRightRadius:Sizes.fixPadding*2, borderTopLeftRadius:Sizes.fixPadding*2, elevation:2}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width:'10%'}}>
            <Image source={require('../../assets/images/save.png')} style={{width:SCREEN_WIDTH*0.04, height:SCREEN_WIDTH*0.052, resizeMode: 'cover'}}/>
            </View>
            <View style={{width:'65%'}}>
            <Text style={{...Fonts.blackColor15Medium}}>PAYTMFOOD</Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
            <TouchableOpacity onPress={() => setShowViewMore(!showViewMore)} style={{backgroundColor: Colors.primaryColor, paddingHorizontal: Sizes.fixPadding*2, paddingVertical: Sizes.fixPadding*0.5, borderRadius:Sizes.fixPadding*2}}>
              <Text style={{...Fonts.blackColor10Medium, color:Colors.whiteColor}}>apply</Text>
            </TouchableOpacity>
            </View>
          </View>
          <Text style={{...Fonts.blackColor12SemiBold, marginTop:Sizes.fixPadding*0.5, color:Colors.grayColor}}>Save 50% on this order</Text>
          </View>
        <View style={{borderTopColor: Colors.grayColor, borderTopWidth:1, backgroundColor:Colors.whiteColor, padding: Sizes.fixPadding, borderBottomRightRadius:Sizes.fixPadding*2, borderBottomLeftRadius:Sizes.fixPadding*2, elevation:2}}>
          <TouchableOpacity style={{alignItems:'center', justifyContent:'center'}}>
            <Text style={{...Fonts.blackColor12SemiBold, color:Colors.grayColor}}>View More</Text>
          </TouchableOpacity>
        </View>
      </View>
      ) : (
        <View style={{width: SCREEN_WIDTH, padding: Sizes.fixPadding*2}}>
          <Text style={{...Fonts.blackColor18Medium, color:Colors.grayColor, marginBottom:Sizes.fixPadding}}>Promocode</Text>
          <View style={{backgroundColor:Colors.whiteColor, paddingHorizontal:Sizes.fixPadding*2, paddingVertical:Sizes.fixPadding, borderRadius:Sizes.fixPadding*2, elevation:2}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width:'10%'}}>
            <Image source={require('../../assets/images/save.png')} style={{width:SCREEN_WIDTH*0.04, height:SCREEN_WIDTH*0.052, resizeMode: 'cover'}}/>
            </View>
            <View style={{width:'65%'}}>
            <Text style={{...Fonts.blackColor15Medium}}>PAYTMFOOD</Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
            <TouchableOpacity onPress={() => updateState({showViewMore})} style={{backgroundColor: Colors.primaryColor, paddingHorizontal: Sizes.fixPadding*2, paddingVertical: Sizes.fixPadding*0.5, borderRadius:Sizes.fixPadding*2}}>
              <Text style={{...Fonts.blackColor10Medium, color:Colors.whiteColor}}>Remove</Text>
            </TouchableOpacity>
            </View>
          </View>
          <Text style={{...Fonts.blackColor12SemiBold, marginTop:Sizes.fixPadding*0.5, color:Colors.grayColor}}>₹200 saving</Text>
          </View>
        </View>
      )}
      </>
    )
  }

  function cartProductsInfo() {
    const renderItem = ({item}) => (
      <View style={styles.productWrapStyle}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, padding: Sizes.fixPadding}}>
            <Text style={{...Fonts.blackColor16SemiBold}}>{item.foodName}</Text>
            <Text
              style={{
                marginTop: Sizes.fixPadding - 5.0,
                ...Fonts.blackColor14SemiBold,
              }}>
              25 min
            </Text>
          </View>
          <View style={{flex: 0.6}}>
            <Image
              source={{uri: item?.foodImage}}
              style={styles.productImageStyle}
            />
          </View>
        </View>
        <View style={styles.productSizeAndCountInfoWrapStyle}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{...Fonts.blackColor12SemiBold}}>Size</Text>
            <Menu
              visible={currentOptionsId == item.id ? showSizeOptions : false}
              style={{paddingTop: Sizes.fixPadding}}
              anchor={
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    updateState({
                      currentOptionsId: item.id,
                      showSizeOptions: true,
                    })
                  }
                  style={{
                    marginLeft: Sizes.fixPadding + 5.0,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{...Fonts.primaryColor11SemiBold}}>
                    {item.size}
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={18}
                    color={Colors.primaryColor}
                    style={{marginLeft: Sizes.fixPadding}}
                  />
                </TouchableOpacity>
              }
              onRequestClose={() => updateState({showSizeOptions: false})}>
              {sizesList.map((size, index) => (
                <MenuItem
                  key={`${index}`}
                  textStyle={{...Fonts.primaryColor12SemiBold}}
                  onPress={() => {
                    updateProductSize({id: item.id, selectedSize: size});
                    updateState({showSizeOptions: false});
                  }}>
                  {size}
                </MenuItem>
              ))}
            </Menu>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                marginRight: Sizes.fixPadding + 5.0,
                ...Fonts.blackColor12SemiBold,
              }}>
              {`₹`}
              {parseFloat(item.discount).toFixed(1)}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              // disabled={item.quantity == '1'}
              onPress={() =>
                updateItemCount({
                  id: item.id,
                  type: 'remove',
                  quantity: parseInt(item.quantity) - 1,
                })
              }
              style={styles.productAddAndRemoveButtonWrapStyle}>
              <MaterialIcons
                name="remove"
                color={Colors.whiteColor}
                size={12}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginHorizontal: Sizes.fixPadding,
                ...Fonts.blackColor13Medium,
              }}>
              {item.quantity}
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              // disabled
              // onPress={() => update_cart(item.id, parseInt(item.quantity)+1 )}
              onPress={() =>
                updateItemCount({
                  id: item.id,
                  type: 'add',
                  quantity: parseInt(item.quantity) + 1,
                })
              }
              style={styles.productAddAndRemoveButtonWrapStyle}>
              <MaterialIcons name="add" color={Colors.whiteColor} size={12} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
    return (
      <FlatList
        data={cartProducts}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    );
  }

  function header() {
    return (
      <Text
        style={{...Fonts.blackColor18SemiBold, margin: Sizes.fixPadding * 2.0}}>
        My Cart
      </Text>
    );
  }
};

const styles = StyleSheet.create({
  productWrapStyle: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
    elevation: 2.0,
    marginBottom: Sizes.fixPadding + 10.0,
  },
  productImageStyle: {
    width: '100%',
    height: '100%',
    alignSelf: 'flex-start',
    flex: 1,
    resizeMode: 'stretch',
  },
  productSizeAndCountInfoWrapStyle: {
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 2.0,
    backgroundColor: '#DEE2EB',
    borderBottomLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productAddAndRemoveButtonWrapStyle: {
    backgroundColor: Colors.blackColor,
    width: 18.0,
    height: 18.0,
    borderRadius: Sizes.fixPadding - 7.0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedToCheckoutButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding,
    elevation: 1.0,
  },
  subTotalWrapStyle: {
    backgroundColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
  },
  totalDetailWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  cartData: state.cart.cartData,
  selfDeliveryCartData: state.cart.selfDeliveryCartData,
  isSelfPickup: state.customer.isSelfPickup,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);
