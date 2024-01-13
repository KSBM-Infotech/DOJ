import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  StyleSheet,
  Text,
  Linking,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import {img_url} from '../../constants/api';

const {width} = Dimensions.get('window');

const orderItemsList = [
  {
    id: '1',
    foodName: 'Veg Sandwich',
    qty: 1,
    totalAmount: 6.0,
  },
  {
    id: '2',
    foodName: 'Veg Frankie',
    qty: 1,
    totalAmount: 10.0,
  },
  {
    id: '3',
    foodName: 'Margherite Pizza',
    qty: 1,
    totalAmount: 12.0,
  },
];

const OrderDetailScreen = ({navigation, route}) => {
  const [orderData] = useState(route.params.orderData);
  const [ordersStatus, setOrderStatus] = useState(null);
  console.log(orderData?.restaurant);

  useEffect(() => {
    get_delivery_boy();
  }, []);
  const get_delivery_boy = () => {
    database()
      .ref(`orders/${orderData?.id}`)
      .on('value', snapshot => {
        setOrderStatus(snapshot.val()?.order_status);
      });
  };

  const openGoogleMapsDirections = () => {
    const destination = `${orderData?.restaurant.latitude},${orderData?.restaurant.longitude}`; // Replace with the actual destination coordinates

    const url = `https://www.google.com/maps/dir/?api=1&travelmode=bicycling&destination=${destination}`;

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{flex: 1}}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 2.0}}>
          {headerTitle()}
          {restaurantNameAddress()}
          {downloadButton()}
          {orderStatus()}
          {/* {orderDetailWithTime()} */}
          {/* {restaurantInfo()} */}
          {orderItemsWithQtyAndAmount()}
          {orderData?.order_type == '0' && showBarCode()}
        </ScrollView>
      </View>

      {ordersStatus != '4' &&
        ordersStatus != '-1' &&
        ordersStatus != null &&
        orderData?.order_type == '1' &&
        trackOrderButton()}
    </SafeAreaView>
  );

  function trackOrderButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('TrackOrder', {orderData: orderData})
        }
        style={styles.trackOrderButtonStyle}>
        <Text style={{...Fonts.whiteColor15Medium}}>Track Order</Text>
      </TouchableOpacity>
    );
  }

  function showBarCode() {
    return (
      <Image
        source={{uri: orderData?.qr_code}}
        style={{
          width: width * 0.6,
          height: width * 0.6,
          marginVertical: Sizes.fixPadding * 3,
          alignSelf: 'center',
        }}
      />
    );
  }

  function orderItemsWithQtyAndAmount() {
    return (
      <View style={styles.orderItemsWithQtyAndAmountWrapStyle}>
        <View style={styles.orderItemsWithQtyAndAmountTitalWrapStyle}>
          <Text style={{width: width / 2.2, ...Fonts.blackColor16SemiBold}}>
            Your Order
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              paddingHorizontal: Sizes.fixPadding * 0.5,
              paddingVertical: Sizes.fixPadding * 0.2,
              borderRadius: 1000,
              borderColor: Colors.primaryColor,
            }}>
            <Text
              style={{
                ...Fonts.primaryColor11SemiBold,
              }}>
              MARK AS FAVORITE
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...styles.orderItemInfoWrapStyle,
            marginTop: Sizes.fixPadding * 0.5,
            marginBottom: Sizes.fixPadding,
          }}>
          <Text
            numberOfLines={1}
            style={{width: width / 2.2, ...Fonts.blackColor13Medium}}>
            Item total
          </Text>
          <Text
            style={{
              width: 70.0,
              textAlign: 'center',
              ...Fonts.blackColor13Medium,
            }}>
            {`₹${orderData?.amount}`}
          </Text>
        </View>
        <View
          style={{
            paddingVertical: Sizes.fixPadding * 0.5,
          }}>
          {orderData?.order_items.map(item => (
            <View
              key={`${item.id}`}
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Sizes.fixPadding * 0.5,
              }}>
              <MaterialCommunityIcons
                name="square-circle"
                color={Colors.greenColor}
                size={Sizes.fixPadding * 1.5}
              />
              <View style={styles.orderItemInfoWrapStyle}>
                <Text
                  numberOfLines={1}
                  style={{width: width / 2.2, ...Fonts.blackColor13Medium}}>
                  {item.foodName}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      width: 70.0,
                      textAlign: 'center',
                      ...Fonts.blackColor13Medium,
                    }}>
                    {`₹`}
                    {parseFloat(item.amount).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.blackColor13Medium}}>TotalAmount</Text>
            <Text
              style={{
                ...Fonts.blackColor13Medium,
                marginRight: Sizes.fixPadding + 3.0,
              }}>
              ₹
              {orderData?.order_items
                .reduce((s, {amount}) => s + parseFloat(amount), 0)
                .toFixed(2)}
            </Text>
          </View>
          <View style={styles.serviceTaxInfoWrapStyle}>
            <Text style={{...Fonts.grayColor11Medium}}>Service Tax:{` `}</Text>
            <Text style={{...Fonts.blackColor11Medium}}>₹2.50</Text>
          </View>
          <View style={styles.deliveryChargeInfoWrapStyle}>
            <Text style={{...Fonts.grayColor11Medium}}>
              Delivery Charge:{` `}
            </Text>
            <Text style={{...Fonts.blackColor11Medium}}>₹1.50</Text>
          </View>
          <View style={styles.paidViaInfoWrapStyle}>
            <Text style={{...Fonts.blackColor11SemiBold}}>
              Paid Via {orderData.payment_type}:{` `}
            </Text>
            <Text style={{...Fonts.primaryColor11SemiBold}}>
              ₹
              {orderData?.order_items
                .reduce((s, {amount}) => s + parseFloat(amount), 0)
                .toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function restaurantInfo() {
    return (
      <View style={styles.restaurantInfoWrapStyle}>
        <Text style={{...Fonts.blackColor14SemiBold}}>
          Marine Rise Restaurant
        </Text>
        <Text style={{...Fonts.grayColor10Medium}}>
          1124, Old Church Street New york, USA
        </Text>
      </View>
    );
  }

  function orderDetailWithTime() {
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingLeft: Sizes.fixPadding * 2.0}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {orderDetailWithTimeSort({
              representedIcon: require('../../assets/images/icons/done.png'),
              title: 'Order Placed',
              value: '4:00 pm',
            })}
            {orderDetailWithTimeSort({
              representedIcon: require('../../assets/images/icons/restaurant_icon.png'),
              title: 'Preparing',
              value: '4:05 pm',
            })}
            {orderDetailWithTimeSort({
              representedIcon: require('../../assets/images/icons/ready.png'),
              title: 'Order Ready',
              value: '4:25 pm',
            })}
            {orderDetailWithTimeSort({
              representedIcon: require('../../assets/images/icons/transist.png'),
              title: 'In Transist',
            })}
            {orderDetailWithTimeSort({
              representedIcon: require('../../assets/images/icons/delivered.png'),
              title: 'Delivered',
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  function orderDetailWithTimeSort({representedIcon, title, value}) {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding,
          marginRight: Sizes.fixPadding + 10.0,
          alignItems: 'center',
        }}>
        <View style={styles.orderDetailRepresentedIconWrapStyle}>
          <Image
            source={representedIcon}
            style={styles.orderDetailRepresentedIconStyle}
          />
        </View>
        <Text
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor9Medium,
          }}>
          {title}
        </Text>
        <Text style={{...Fonts.primaryColor8SemiBold}}>
          {value ? value : '•'}
        </Text>
      </View>
    );
  }

  function orderStatus() {
    return (
      <Text
        style={{
          ...Fonts.blackColor13Medium,
          marginHorizontal: Sizes.fixPadding,
          marginTop: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding * 2,
        }}>
        This order was delivered
      </Text>
    );
  }

  function downloadButton() {
    return (
      <View
        style={{
          flex: 0,
          marginHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.lightGrayColor,
        }}>
        <TouchableOpacity
          style={{
            width: '47%',
            borderWidth: 0.5,
            borderColor: Colors.lightGrayColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Sizes.fixPadding * 0.4,
            borderRadius: Sizes.fixPadding * 0.8,
          }}>
          <MaterialCommunityIcons
            name="file-download"
            color={Colors.primaryColor}
            size={20}
          />
          <Text style={{...Fonts.blackColor11SemiBold}}>Download invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '47%',
            borderWidth: 0.5,
            borderColor: Colors.lightGrayColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Sizes.fixPadding * 0.4,
            borderRadius: Sizes.fixPadding * 0.8,
          }}>
          <MaterialCommunityIcons
            name="file-download"
            color={Colors.primaryColor}
            size={20}
          />
          <Text style={{...Fonts.blackColor11SemiBold}}>Download summary</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function restaurantNameAddress() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginTop: Sizes.fixPadding * 1.5,
        }}>
        <Text
          style={{
            ...Fonts.blackColor18SemiBold,
            marginBottom: Sizes.fixPadding * 0.2,
          }}>
          {orderData?.restaurant?.name}
        </Text>
        <Text style={{...Fonts.blackColor12SemiBold}}>
          {orderData?.restaurant?.address}
        </Text>
      </View>
    );
  }

  function headerTitle() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            ...Fonts.blackColor22SemiBold,
            marginHorizontal: Sizes.fixPadding,
          }}>
          Order Summary
        </Text>
        {orderData?.order_type == '0' && (
          <TouchableOpacity
            onPress={openGoogleMapsDirections}
            style={{padding: Sizes.fixPadding}}>
            <MaterialIcons
              name="directions"
              color={Colors.primaryColor}
              size={22}
            />
          </TouchableOpacity>
        )}
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
            ...Fonts.primaryColor14Medium,
          }}>
          Support
        </Text>
      </View>
    );
  }

};

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding * 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderDetailRepresentedIconWrapStyle: {
    width: 45.0,
    height: 45.0,
    borderRadius: 22.5,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderDetailRepresentedIconStyle: {
    width: 25.0,
    height: 25.0,
    resizeMode: 'contain',
    tintColor: Colors.whiteColor,
  },
  restaurantInfoWrapStyle: {
    marginTop: Sizes.fixPadding * 3.0,
    marginBottom: Sizes.fixPadding * 4.5,
    backgroundColor: '#DEE2EB',
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
  },
  orderItemsWithQtyAndAmountWrapStyle: {
    marginHorizontal: Sizes.fixPadding,
    // borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    // elevation: 1.0,
  },
  orderItemsWithQtyAndAmountTitalWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.fixPadding,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightGrayColor,
  },
  orderItemInfoWrapStyle: {
    // marginBottom: Sizes.fixPadding - 5.0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceTaxInfoWrapStyle: {
    marginBottom: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding + 3.0,
    marginRight: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  paidViaInfoWrapStyle: {
    marginTop: Sizes.fixPadding + 3.0,
    marginRight: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  deliveryChargeInfoWrapStyle: {
    marginRight: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  trackOrderButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'rgba(255, 66, 0, 0.3)',
    // borderWidth: 1.0,
    // elevation: 1.0,
    // shadowColor: Colors.primaryColor,
  },
});

export default OrderDetailScreen;
