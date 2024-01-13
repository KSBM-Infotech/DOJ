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
import * as CartActions from '../../redux/actions/CartActions';
import axios from 'axios';
import {api_url, get_cart_new, user_add_cart} from '../../constants/api';
import Loader from '../../components/Loader';
import {showToastWithGravity} from '../../components/toastMessages';

const sizesList = ['Medium', 'Small', 'Large', 'Extra Large'];

const productsList = [
  {
    id: '1',
    foodImage: require('../../assets/images/food/food20.png'),
    foodName: 'Veg Sandwich',
    cusomization: 'Sauce tomato,mozzarella, chilly etc.',
    timeToDelivered: '25 min',
    itemCount: 1,
    amount: 6.0,
    size: sizesList[0],
  },
  {
    id: '2',
    foodImage: require('../../assets/images/food/food21.png'),
    foodName: 'Veg Frankie',
    cusomization: 'Sauce tomato,mozzarella, chilly etc.',
    timeToDelivered: '35 min',
    itemCount: 1,
    amount: 10.0,
    size: sizesList[0],
  },
  {
    id: '3',
    foodImage: require('../../assets/images/food/food22.png'),
    foodName: 'Margherite Pizza',
    cusomization: 'Sauce tomato,mozzarella, chilly etc.',
    timeToDelivered: '23 min',
    itemCount: 1,
    amount: 10.0,
    size: sizesList[0],
  },
];

const ProductsScreen = ({
  navigation,
  forCartData,
  dispatch,
  route,
  customerData,
  isSelfPickup
}) => {
  const [state, setState] = useState({
    showSizeOptions: true,
    currentOptionsId: null,
    restaurant: route.params.restaurant,
    selcetedData: route.params.selcetedData,
    isLoading: false,
  });

  const updateState = data => setState(state => ({...state, ...data}));

  useEffect(() => {
    get_restaurant_data();
  }, []);

  const get_restaurant_data = () => {
    console.log(forCartData);
  };

  const add_to_cart = async () => {
    updateState({isLoading: true});

    let data = new FormData();
    data.append('user_id', customerData?.id.toString());
    data.append('item', JSON.stringify(selcetedData));
    data.append('type', isSelfPickup ? '1' : '0');
    console.log(data)
    await axios({
      method: 'post',
      url: api_url + user_add_cart,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          get_cart();
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
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
          showToastWithGravity('Items added to cart successfully');
          navigation.navigate('cartScreen', {restaurant_id: restaurant?.id});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const {
    showSizeOptions,
    currentOptionsId,
    restaurant,
    isLoading,
    selcetedData,
  } = state;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {productsInfo()}
              {itemCountInfo()}
            </>
          }
          contentContainerStyle={{paddingTop: Sizes.fixPadding - 5.0}}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {viewCartButton()}
    </SafeAreaView>
  );

  function itemCountInfo() {
    return (
      <View style={styles.itemCountInfoWrapStyle}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../assets/images/icons/cart.png')}
            style={{width: 28.0, height: 28.0, resizeMode: 'contain'}}
          />
          <View style={styles.totalItemCountWrapStyle}>
            <Text style={{lineHeight: 12.0, ...Fonts.whiteColor10SemiBold}}>
              {selcetedData.length}
            </Text>
          </View>
        </View>
        <Text
          style={{
            marginLeft: Sizes.fixPadding + 5.0,
            ...Fonts.blackColor14SemiBold,
          }}>
          {selcetedData.length} items | ₹{getTotalPrice()}
        </Text>
      </View>
    );
  }

  function getTotalPrice() {
    let x = 0;
    selcetedData.map(item => {
      x = parseFloat(item.discount) * parseInt(item.itemCount) + x;
    });
    return x;
  }

  function viewCartButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={add_to_cart}
        style={styles.viewCartButtonStyle}>
        <Text style={{...Fonts.whiteColor15Medium}}>Add To Cart</Text>
      </TouchableOpacity>
    );
  }

  function updateProductSize({id, selectedSize}) {
    const newList = selcetedData.map(item => {
      if (item.id === id) {
        const updatedItem = {...item, size: selectedSize};
        return updatedItem;
      }
      return item;
    });
    updateState({selcetedData: newList});
    // dispatch(CartActions.setForCart(newList));
  }

  function updateItemCount({id, type}) {
    const newList = selcetedData.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          itemCount:
            type == 'remove'
              ? item.itemCount > 1
                ? item.itemCount - 1
                : item.itemCount
              : item.itemCount + 1,
        };
        return updatedItem;
      }
      return item;
    });
    updateState({selcetedData: newList});
    // dispatch(CartActions.setForCart(newList));
  }

  function productsInfo() {
    const renderItem = ({item}) => (
      <View style={styles.productWrapStyle}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, padding: Sizes.fixPadding}}>
            <Text style={{...Fonts.blackColor16SemiBold}}>{item.foodName}</Text>
            <Text
              style={{
                marginVertical: Sizes.fixPadding - 5.0,
                ...Fonts.grayColor14Medium,
              }}>
              Sauce tomato,mozzarella, chilly etc.
            </Text>
            <Text style={{...Fonts.blackColor14SemiBold}}>25 min</Text>
          </View>
          <View style={{flex: 0.6}}>
            <Image
              source={{uri: item.foodImage}}
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
              activeOpacity={0.5}
              onPress={() => updateItemCount({id: item.id, type: 'remove'})}
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
              {item.itemCount}
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => updateItemCount({id: item.id, type: 'add'})}
              style={styles.productAddAndRemoveButtonWrapStyle}>
              <MaterialIcons name="add" color={Colors.whiteColor} size={12} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
    return (
      <FlatList
        data={selcetedData}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    );
  }

  function header() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2.0,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={22}
          onPress={() => navigation.pop()}
        />
        <Text
          style={{
            flex: 1,
            marginLeft: Sizes.fixPadding,
            ...Fonts.blackColor15Medium,
          }}>
          {restaurant?.name}
        </Text>
      </View>
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
  totalItemCountWrapStyle: {
    position: 'absolute',
    top: -8.0,
    width: 12.0,
    height: 12.0,
    borderRadius: 6.0,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCountInfoWrapStyle: {
    marginBottom: Sizes.fixPadding,
    marginTop: Sizes.fixPadding * 3.0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCartButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  forCartData: state.cart.forCartData,
  customerData: state.customer.customerData,
  isSelfPickup: state.customer.isSelfPickup,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsScreen);
