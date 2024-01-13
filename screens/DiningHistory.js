import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../constants/styles';
import {StatusBar} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Image} from 'react-native';
import moment from 'moment';
import CircleLoader from '../components/CircleLoader';
import axios from 'axios';
import {api_url, book_dinner_list, img_url} from '../constants/api';
import {connect} from 'react-redux';

const diningData = [
  {
    id: 1,
    image: require('../assets/images/food/food1.png'),
    restaurant_name: 'Talli Station',
    address: 'Rajender Place',
    customer_name: 'Ranjeet Kumar',
    guest: 3,
    date: new Date(),
  },
  {
    id: 2,
    image: require('../assets/images/food/food1.png'),
    restaurant_name: 'Talli Station',
    address: 'Rajender Place',
    customer_name: 'Ranjeet Kumar',
    guest: 3,
    date: new Date(),
  },
];

const DiningHistory = ({navigation, customerData}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [diningData, setDiningData] = useState(null);

  useEffect(() => {
    get_data();
  }, []);

  const get_data = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + book_dinner_list,
      data: {
        customer_id: customerData?.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        if (res.data.status) {
          setDiningData(res.data.data);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar
        backgroundColor={Colors.whiteColor}
        barStyle={'dark-content'}
      />
      <CircleLoader visible={isLoading} />
      {header()}
      <View style={{flex: 1}}>
        <FlatList ListHeaderComponent={<>{diningHistoryInfo()}</>} />
      </View>
    </View>
  );

  function diningHistoryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('confirmDining', {
              restaurantData: item.restaurant,
              selectedDate: item.booking_date,
              selectedSeat: item.number_of_guests,
              selectedTime: item.booking_time,
            });
          }}
          style={{
            flex: 0,
            backgroundColor: Colors.whiteColor,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 0.5,
            borderWidth: 0.5,
            borderColor: Colors.grayColor,
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: Sizes.fixPadding,
            }}>
            <Image
              source={{uri: img_url + item?.restaurant.profile_image}}
              style={{width: 50, height: 50, borderRadius: Sizes.fixPadding}}
            />
            <View style={{marginLeft: Sizes.fixPadding}}>
              <Text style={{...Fonts.blackColor14SemiBold}}>
                {item.restaurant?.name}
              </Text>
              <Text style={{...Fonts.blackColor12SemiBold}}>
                {item.restaurant?.address}
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingVertical: Sizes.fixPadding,
              borderTopWidth: 0.5,
              borderBottomWidth: 0.5,
              borderColor: Colors.grayColor + '70',
            }}>
            <Text style={{...Fonts.blackColor13Light}}>
              Name: {customerData?.name}
            </Text>
            <Text style={{...Fonts.blackColor13Light}}>
              Guest: {item.number_of_guests}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: Sizes.fixPadding,
              borderBottomWidth: 0.5,
              borderColor: Colors.grayColor + '70',
            }}>
            <Text style={{...Fonts.blackColor13Light}}>
              {moment(item.booking_date).format('Do MMM YYYY, hh:mm A')}
            </Text>
          </View>
          <Text
            style={{
              ...Fonts.blackColor13SemiBold,
              marginTop: Sizes.fixPadding,
              color: Colors.greenColor,
            }}>
            booking confirmed
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{
            ...Fonts.grayColor13Medium,
            letterSpacing: 1,
            textAlign: 'center',
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          HISTORY
        </Text>
        <FlatList
          data={diningData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
        />
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
          backgroundColor: Colors.whiteColor,
          paddingHorizontal: Sizes.fixPadding * 2,
          paddingVertical: Sizes.fixPadding,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            color={Colors.blackColor}
            size={22}
          />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            marginLeft: Sizes.fixPadding,
            ...Fonts.blackColor13Medium,
          }}>
          Your table bookings
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  forCartData: state.cart.forCartData,
  customerData: state.customer.customerData,
});

export default connect(mapStateToProps, null)(DiningHistory);
