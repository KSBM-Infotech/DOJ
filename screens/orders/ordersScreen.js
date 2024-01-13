import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
  BackHandler,
  RefreshControl,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {api_url, customer_get_order_list, img_url} from '../../constants/api';
import {connect} from 'react-redux';
import moment from 'moment';
import CircleLoader from '../../components/CircleLoader';

const orderInProcessList = [
  {
    id: '1',
    orderDate: new Date().toDateString(),
    orderMonth: 'May',
    restaurantName: 'Marine Rise Restaurant',
    orderNumber: 'CCA123654',
    totalOrderItemsCount: 3,
    totalAmount: 32.0,
    isDispatch: false,
    image: require('../../assets/images/food/food1.png'),
    address: 'Noida Uttar Pradesh',
    itemName: 'Combo 1',
  },
  {
    id: '2',
    orderDate: new Date().toDateString(),
    orderMonth: 'May',
    restaurantName: 'Seven Star Restaurant',
    orderNumber: 'FTR145987',
    totalOrderItemsCount: 2,
    totalAmount: 30.0,
    isDispatch: true,
    image: require('../../assets/images/food/food2.png'),
    address: 'Noida Uttar Pradesh',
    itemName: 'Combo 1',
  },
];

const pastOrdersList = [
  {
    id: '1',
    orderDate: new Date().toDateString(),
    orderMonth: 'May',
    restaurantName: 'Hunger Spot',
    orderNumber: 'DET146587',
    totalOrderItemsCount: 3,
    totalAmount: 40.0,
    image: require('../../assets/images/food/food3.png'),
    address: 'Noida Uttar Pradesh',
    itemName: 'Combo 1',
  },
  {
    id: '2',
    orderDate: new Date().toDateString(),
    orderMonth: 'May',
    restaurantName: 'Food by Jesica',
    orderNumber: 'DET158973',
    totalOrderItemsCount: 4,
    totalAmount: 54.0,
    image: require('../../assets/images/food/food4.png'),
    address: 'Noida Uttar Pradesh',
    itemName: 'Combo 1',
  },
  {
    id: '3',
    orderDate: new Date().toDateString(),
    orderMonth: 'May',
    restaurantName: 'Hunger Spot',
    orderNumber: 'TYR147896',
    totalOrderItemsCount: 4,
    totalAmount: 42.0,
    image: require('../../assets/images/food/food5.png'),
    address: 'Noida Uttar Pradesh',
    itemName: 'Combo 1',
  },
  {
    id: '4',
    orderDate: new Date().toDateString(),
    orderMonth: 'May',
    restaurantName: 'Marine Rise Restaurant',
    orderNumber: 'TeQ145632',
    totalOrderItemsCount: 2,
    totalAmount: 35.0,
    image: require('../../assets/images/food/food6.png'),
    address: 'Noida Uttar Pradesh',
    itemName: 'Combo 1',
  },
];

const OrdersScreen = ({navigation, route, customerData}) => {
  const [orderData, setOrderData] = useState(null);
  const [currentOrderData, setCurrentOrderData] = useState(null);
  const [completedOrderData, setCompletedOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const backAction = () => {
    if (typeof route.params?.is_from_order_place != 'undefined') {
      navigation.push('BottomTabBar');
    } else {
      navigation.pop();
    }
    return true;
  };
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [backAction]),
  );

  useEffect(() => {
    get_orders();
  }, []);

  const get_orders = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + customer_get_order_list,
      data: {
        user_id: customerData?.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        // console.log(typeof res.data.orders)
        if (typeof res.data.orders == 'object') {
          let current = res.data.orders
            .filter(
              item =>
              parseInt(item.order_status) >= 0 &&
              parseInt(item.order_status) < 4,
            )
            .reverse();
          let completed = res.data.orders
            .filter(
              item =>
                parseInt(item.order_status) == -1 ||
                parseInt(item.order_status) == 4,
            )
            .reverse();
          setCurrentOrderData(current);
          setCompletedOrderData(completed);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_orders_on_refresh = async () => {
    setRefreshing(true);
    await axios({
      method: 'post',
      url: api_url + customer_get_order_list,
      data: {
        user_id: customerData?.id,
      },
    })
      .then(res => {
        setRefreshing(false);
        // console.log(typeof res.data.orders)
        if (typeof res.data.orders == 'object') {
          let current = res.data.orders
            .filter(
              item =>
                parseInt(item.order_status) >= 0 &&
                parseInt(item.order_status) < 4,
            )
            .reverse();
          let completed = res.data.orders
            .filter(
              item =>
                parseInt(item.order_status) == -1 ||
                parseInt(item.order_status) == 4,
            )
            .reverse();
          setCurrentOrderData(current);
          setCompletedOrderData(completed);
        }
      })
      .catch(err => {
        setRefreshing(false);
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <CircleLoader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {currentOrderData && ordersInProcessInfo()}
              {completedOrderData && pastOrdersInfo()}
            </>
          }
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 7.0}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={get_orders_on_refresh}
            />
          }
        />
      </View>
    </SafeAreaView>
  );

  function pastOrdersInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('OrderDetail', {orderData: item})}
        style={styles.orderInfoWrapStyle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.lightGrayColor,
            paddingHorizontal: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding,
          }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Image
              source={{uri: item.foodImage}}
              style={{
                width: 40,
                height: 40,
                borderRadius: Sizes.fixPadding * 0.5,
              }}
            />
            <View
              style={{
                marginTop: Sizes.fixPadding - 15.0,
                flex: 1,
                marginLeft: Sizes.fixPadding,
              }}>
              <Text style={{...Fonts.blackColor14SemiBold}}>
                {item.restaurant?.name}
              </Text>
              <Text style={{...Fonts.grayColor11Medium}}>{item.address}</Text>
            </View>
          </View>
          <Text style={{...Fonts.blackColor14SemiBold}}>
            {`₹`}
            {parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.lightGrayColor,
            padding: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.grayColor11Medium}}>ITEMS</Text>
          {item.order_items.map((orderItems, j) => (
            <Text key={j} style={{...Fonts.blackColor12SemiBold}}>
              {orderItems.quantity} X {orderItems.foodName}
            </Text>
          ))}
          <Text
            style={{...Fonts.grayColor11Medium, marginTop: Sizes.fixPadding}}>
            ORDER ON
          </Text>
          <Text style={{...Fonts.blackColor12SemiBold}}>{item.created_at}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: Sizes.fixPadding,
          }}>
          {item.order_status == '-1' ? (
            <Text style={{...Fonts.primaryColor15SemiBold}}>Cancelled</Text>
          ) : (
            <Text style={{...Fonts.grayColor15SemiBold}}>Complete</Text>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons
              name="rotate-left"
              size={18}
              color={Colors.grayColor}
            />
            <Text style={{...Fonts.grayColor12Medium}}>Repeat Order</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={{marginHorizontal: Sizes.fixPadding}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding * 2.0,
            ...Fonts.grayColor16SemiBold,
          }}>
          Past Orders
        </Text>
        <FlatList
          listKey="pastOrders"
          data={completedOrderData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  function ordersInProcessInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('OrderDetail', {orderData: item})}
        style={styles.orderInfoWrapStyle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.lightGrayColor,
            paddingHorizontal: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding,
          }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Image
              source={{uri: img_url + item.image}}
              style={{
                width: 40,
                height: 40,
                borderRadius: Sizes.fixPadding * 0.5,
              }}
            />
            <View
              style={{
                marginTop: Sizes.fixPadding - 15.0,
                flex: 1,
                marginLeft: Sizes.fixPadding,
              }}>
              <Text style={{...Fonts.blackColor14SemiBold}}>
                {item.restaurant?.name}
              </Text>
              <Text style={{...Fonts.grayColor11Medium}}>{item.address}</Text>
            </View>
          </View>
          <Text style={{...Fonts.blackColor14SemiBold}}>
            {`₹`}
            {parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.lightGrayColor,
            padding: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.grayColor11Medium}}>ITEMS</Text>
          {item.order_items.map((orderItems, j) => (
            <Text key={j} style={{...Fonts.blackColor12SemiBold}}>
              {orderItems.quantity} X {orderItems.foodName}
            </Text>
          ))}

          <Text
            style={{...Fonts.grayColor11Medium, marginTop: Sizes.fixPadding}}>
            ORDER ON
          </Text>
          <Text style={{...Fonts.blackColor12SemiBold}}>
            {moment(item.created_at).format('Do MMM YYYY hh:mm A')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: Sizes.fixPadding,
          }}>
          {item.order_status == '0' || item.order_status == '1' ? (
            <Text style={{...Fonts.primaryColor15SemiBold}}>Preparing</Text>
          ) : (
            <Text style={{...Fonts.greenColor15SemiBold}}>Dispatch{item.order_status}</Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons
              name="rotate-left"
              size={18}
              color={Colors.grayColor}
            />
            <Text style={{...Fonts.grayColor12Medium}}>Repeat Order</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={{marginHorizontal: Sizes.fixPadding}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding * 2.0,
            ...Fonts.grayColor16SemiBold,
          }}>
          Orders in process
        </Text>
        <FlatList
          listKey="processOrders"
          data={currentOrderData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
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
          onPress={() => {
            if (typeof route.params?.is_from_order_place != 'undefined') {
              navigation.push('BottomTabBar');
            } else {
              navigation.pop();
            }
          }}
        />
        <Text
          style={{
            flex: 0.99,
            textAlign: 'center',
            ...Fonts.blackColor16SemiBold,
          }}>
          Your Orders
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
  orderStatusWrapStyle: {
    paddingHorizontal: Sizes.fixPadding + 5.0,
    alignSelf: 'flex-end',
    paddingVertical: Sizes.fixPadding - 3.0,
    borderRadius: Sizes.fixPadding * 2.0,
  },
  orderInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 1.0,
    borderRadius: Sizes.fixPadding * 0.3,
    paddingTop: Sizes.fixPadding + 3.0,
    paddingBottom: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
});

const mapStateToProps = state => ({
  forCartData: state.cart.forCartData,
  customerData: state.customer.customerData,
});

export default connect(mapStateToProps, null)(OrdersScreen);
