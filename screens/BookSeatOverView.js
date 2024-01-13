import {
  View,
  Text,
  StatusBar,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {Image} from 'react-native';
import axios from 'axios';
import {api_url, customer_book_dinner} from '../constants/api';
import {connect} from 'react-redux';
import CircleLoader from '../components/CircleLoader';
import {showToastWithGravity} from '../components/toastMessages';
import {CommonActions} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

const BookSeatOverView = ({navigation, route, customerData}) => {
  const [state, setState] = useState({
    dateData: [],
    seatData: Array.from({length: 7}, (_, index) => index + 1),
    timeData: [],
    selectedDate: route.params.selectedDate,
    selectedSeat: route.params.selectedSeat,
    selectedTime: route.params.selectedTime,
    isLoading: false,
    restaurantData: route.params.restaruantData,
  });

  const updateState = data => setState(state => ({...state, ...data}));

  useEffect(() => {
    // get_dates();
  }, []);

  const dining_order = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + customer_book_dinner,
      data: {
        restaurant_id: restaurantData?.id,
        customer_id: customerData?.id,
        book_date: selectedDate,
        book_time: selectedTime,
        number_of_guests: selectedSeat,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        console.log(res.data);
        if (res.data.status) {
          showToastWithGravity('Booking successfull');
          navigation.navigate('confirmDining', {
            restaurantData: restaurantData,
            selectedDate: selectedDate,
            selectedSeat: selectedSeat,
            selectedTime: selectedTime,
          });
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const {
    dateData,
    seatData,
    timeData,
    selectedDate,
    selectedSeat,
    selectedTime,
    isLoading,
    restaurantData,
  } = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar
        backgroundColor={Colors.primaryColor}
        barStyle={'light-content'}
      />
      <CircleLoader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {showExtraOffers()}
              {showResevationDetails()}
              {showCoupan()}
              {showGoldBenifits()}
              {showCorner()}
              {/* {showOffers()} */}
            </>
          }
        />
      </View>
      {bottomButton()}
    </View>
  );

  function bottomButton() {
    return (
      <TouchableOpacity
        onPress={dining_order}
        style={{
          flex: 0,
          marginHorizontal: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.primaryColor,
          marginBottom: Sizes.fixPadding,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: Sizes.fixPadding * 0.5,
          borderRadius: Sizes.fixPadding * 0.5,
        }}>
        <Text style={{...Fonts.whiteColor14Bold}}>
          Book {selectedSeat} Seat for Rs 200
        </Text>
        <Text style={{...Fonts.whiteColor12SemiBold}}>
          Booking fee to be adjusted in final bill
        </Text>
      </TouchableOpacity>
    );
  }

  function showOffers() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 1.5}}>
        <View
          style={{
            flex: 0,
            backgroundColor: Colors.lightGrayColor,
            paddingVertical: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding * 0.6,
          }}>
          <Text style={{...Fonts.blackColor15Medium, textAlign: 'center'}}>
            DINING OFFERS
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.blackColor13Medium,
            marginVertical: Sizes.fixPadding * 1.5,
          }}>
          All available offers
        </Text>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: Sizes.fixPadding,
            borderWidth: 1,
            borderColor: Colors.primaryColor + '50',
            backgroundColor: Colors.primaryColor + '10',
            borderRadius: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
          }}>
          <Image
            source={require('../assets/images/icons/cart.png')}
            style={{width: 25, height: 25}}
          />
          <View style={{marginLeft: Sizes.fixPadding}}>
            <Text style={{...Fonts.grayColor16Medium}}>
              Carnival offer 50% flat OFF on bill
            </Text>
            <Text style={{...Fonts.primaryColor14Medium}}>
              Booking fee: Rs 30 per person
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: Sizes.fixPadding,
            // borderWidth: 1,
            // borderColor: Colors.primaryColor + '50',
            // backgroundColor: Colors.primaryColor + '10',
            // borderRadius: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
          }}>
          <Image
            source={require('../assets/images/icons/cart.png')}
            style={{width: 25, height: 25}}
          />
          <View style={{marginLeft: Sizes.fixPadding}}>
            <Text style={{...Fonts.grayColor16Medium}}>
              Gold offer 20% OFF on bill
            </Text>
            <Text style={{...Fonts.blackColor13Medium}}>
              Booking fee: Rs 30 per person
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function showCorner() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          // marginVertical: Sizes.fixPadding * 2,
        }}>
        <View
          style={{
            flex: 0,
            backgroundColor: Colors.whiteColor,
            paddingVertical: Sizes.fixPadding * 2,
            paddingHorizontal: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowColor: Colors.lightGrayColor,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: Sizes.fixPadding,
            }}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialIcons name="add" color={Colors.blackColor} size={20} />
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                  marginLeft: Sizes.fixPadding,
                }}>
                Apply Coupon
              </Text>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              color={Colors.blackColor}
              size={16}
            />
          </View>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialIcons
                name="edit-square"
                color={Colors.blackColor}
                size={20}
              />
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                  marginLeft: Sizes.fixPadding,
                }}>
                Special request
              </Text>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              color={Colors.blackColor}
              size={16}
            />
          </View>
        </View>
      </View>
    );
  }

  function showGoldBenifits() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginVertical: Sizes.fixPadding * 2,
        }}>
        <Text
          style={{
            ...Fonts.blackColor18Medium,
            textAlign: 'center',
            marginBottom: Sizes.fixPadding * 2,
          }}>
          EXCLUSIVE GOLD BENIFITS
        </Text>
        <View
          style={{
            flex: 0,
            backgroundColor: Colors.primaryColor + '10',
            paddingVertical: Sizes.fixPadding * 2,
            paddingHorizontal: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowColor: Colors.lightGrayColor,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              // alignItems: 'center',
              marginBottom: Sizes.fixPadding * 0.5,
            }}>
            <Image
              source={require('../assets/images/gold_offer.png')}
              style={{width: 30, height: 30}}
            />
            <Text
              style={{
                flex: 1,
                ...Fonts.blackColor11SemiBold,
                marginLeft: Sizes.fixPadding,
              }}>
              Get 30 days gold membership at just Rs 100 on bill payment at the
              restaurant{'\n\n'}Complete your slot booking to become eligible
              for a 30 days gold membership at just Rs 100
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function showCoupan() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          // marginVertical: Sizes.fixPadding * 2,
        }}>
        <View
          style={{
            flex: 0,
            backgroundColor: Colors.whiteColor,
            paddingVertical: Sizes.fixPadding * 2,
            paddingHorizontal: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowColor: Colors.lightGrayColor,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: Sizes.fixPadding,
            }}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialIcons name="add" color={Colors.blackColor} size={20} />
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                  marginLeft: Sizes.fixPadding,
                }}>
                Apply Coupon
              </Text>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              color={Colors.blackColor}
              size={16}
            />
          </View>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialIcons
                name="edit-square"
                color={Colors.blackColor}
                size={20}
              />
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                  marginLeft: Sizes.fixPadding,
                }}>
                Special request
              </Text>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              color={Colors.blackColor}
              size={16}
            />
          </View>
        </View>
      </View>
    );
  }

  function showResevationDetails() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginVertical: Sizes.fixPadding * 2,
        }}>
        <Text
          style={{
            ...Fonts.blackColor18Medium,
            textAlign: 'center',
            marginBottom: Sizes.fixPadding * 2,
          }}>
          RESERVATION DETAILS
        </Text>
        <View
          style={{
            flex: 0,
            backgroundColor: Colors.whiteColor,
            paddingVertical: Sizes.fixPadding * 2,
            paddingHorizontal: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowColor: Colors.lightGrayColor,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: Sizes.fixPadding * 0.5,
            }}>
            <MaterialIcons
              name="calendar-month"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor15Medium,
                marginLeft: Sizes.fixPadding,
              }}>
              {moment(selectedDate).format('Do MMM YYYY')} at {selectedTime}
            </Text>
          </View>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: Sizes.fixPadding * 0.5,
            }}>
            <MaterialIcons
              name="person-pin"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor15Medium,
                marginLeft: Sizes.fixPadding,
              }}>
              Number of Guest: {selectedSeat}
            </Text>
          </View>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: Sizes.fixPadding * 0.5,
            }}>
            <MaterialIcons
              name="location-pin"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor15Medium,
                marginLeft: Sizes.fixPadding,
              }}>
              {restaurantData?.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{marginLeft: Sizes.fixPadding * 3}}>
            <Text style={{...Fonts.primaryColor14SemiBold}}>Edit slot</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function showExtraOffers() {
    return (
      <View style={styles.carnivalOfferMainContainer}>
        <View
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.whiteColor,
            borderRadius: 1000,
            elevation: 5,
            shadowColor: Colors.grayColor,
          }}>
          <Image
            source={require('../assets/images/icons/Money.png')}
            style={{width: 25, height: 25}}
          />
        </View>

        <Text
          style={{
            ...Fonts.grayColor12Medium,
            marginLeft: Sizes.fixPadding,
            flex: 1,
          }}>
          Booking free worth Rs 100 will be adjusted in your final bill payment
          at restaurant
        </Text>
      </View>
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
            flex: 0.9,
            textAlign: 'center',
            marginLeft: Sizes.fixPadding,
            ...Fonts.blackColor16SemiBold,
          }}>
          Book a Seat
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
});

export default connect(mapStateToProps, null)(BookSeatOverView);

const styles = StyleSheet.create({
  carnivalOfferMainContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.fixPadding,
    backgroundColor: Colors.primaryColor + '10',
    marginHorizontal: Sizes.fixPadding * 1.5,
    borderRadius: Sizes.fixPadding,
  },
  carnivalOfferContainer: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding * 0.8,
  },
  carnivalOfferChildContainer: {
    width: '80%',
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding * 0.3,
    borderBottomLeftRadius: Sizes.fixPadding * 2,
    borderBottomRightRadius: Sizes.fixPadding * 2,
    elevation: 5,
    shadowColor: Colors.blackColor,
  },

  dateContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    width: width * 0.28,
    height: width * 0.2,
    marginLeft: Sizes.fixPadding,
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: Sizes.fixPadding,
  },
});
