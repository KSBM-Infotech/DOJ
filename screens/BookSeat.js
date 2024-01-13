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

const {width, height} = Dimensions.get('screen');

const BookSeat = ({navigation, route}) => {
  const [restaruantData] = useState(route.params.restaruantData)
  const [state, setState] = useState({
    dateData: [],
    seatData: Array.from({length: 7}, (_, index) => index + 1),
    timeData: [],
    selectedDate: null,
    selectedSeat: '2',
    selectedTime: null,
  });

  const updateState = data => setState(state => ({...state, ...data}));

  useEffect(() => {
    get_dates();
  }, []);

  const get_dates = () => {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date();
    const nextWeekDates = [];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);

      let dayLabel = '';
      if (i === 0) {
        dayLabel = 'today';
      } else if (i === 1) {
        dayLabel = 'tomorrow';
      } else {
        dayLabel = daysOfWeek[nextDay.getDay()];
      }

      nextWeekDates.push({
        day: dayLabel,
        date: nextDay.toISOString(), // or any other format you prefer
      });
    }
    updateState({dateData: nextWeekDates, selectedDate: nextWeekDates[0].date});
    get_dining_time(nextWeekDates[0].date);
  };

  const get_dining_time = targetDateString => {
    const diningTimes = [];
    const targetDate = new Date(targetDateString);
    const now = new Date();

    const startHour =
      targetDate.getDate() === now.getDate() ? now.getHours() + 1 : 16;

    for (let hour = startHour; hour <= 23; hour++) {
      const diningTime = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        hour,
        0,
      );
      const timeString = diningTime.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      diningTimes.push(timeString);
    }
    updateState({timeData: diningTimes, selectedTime: diningTimes[0]});
    console.log(diningTimes);
  };

  const {
    dateData,
    seatData,
    timeData,
    selectedDate,
    selectedSeat,
    selectedTime,
  } = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar
        backgroundColor={Colors.primaryColor}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {showExtraOffers()}
              {showResevationDetails()}
              {showOffers()}
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
        onPress={()=>navigation.navigate('bookSeatOverView', {restaruantData: restaruantData, selectedDate: selectedDate, selectedTime: selectedTime, selectedSeat: selectedSeat})}
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

  function showResevationDetails() {
    const renderDate = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => {
            updateState({selectedDate: item.date});
            get_dining_time(item.date);
          }}
          style={{
            ...styles.dateContainer,
            backgroundColor:
              selectedDate == item.date
                ? Colors.primaryColor + '10'
                : Colors.whiteColor,
            borderColor:
              selectedDate == item.date
                ? Colors.primaryColor + '50'
                : Colors.grayColor,
          }}>
          <Text
            style={{
              ...Fonts.blackColor14SemiBold,
              textTransform: 'capitalize',
              marginBottom: Sizes.fixPadding * 0.5,
            }}>
            {item.day}
          </Text>
          <Text style={{...Fonts.grayColor13Medium}}>
            {moment(item.date).format('DD MMM')}
          </Text>
        </TouchableOpacity>
      );
    };

    const renderSeat = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => updateState({selectedSeat: item})}
          style={{
            ...styles.dateContainer,
            backgroundColor:
              selectedSeat == item
                ? Colors.primaryColor + '10'
                : Colors.whiteColor,
            borderColor:
              selectedSeat == item
                ? Colors.primaryColor + '50'
                : Colors.grayColor,
          }}>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              textTransform: 'capitalize',
            }}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    };

    const renderTime = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => updateState({selectedTime: item})}
          style={{
            ...styles.dateContainer,
            justifyContent: 'flex-start',
            backgroundColor:
              selectedTime == item
                ? Colors.primaryColor + '10'
                : Colors.whiteColor,
            borderColor:
              selectedTime == item
                ? Colors.primaryColor + '50'
                : Colors.grayColor,
          }}>
          <View style={styles.carnivalOfferChildContainer}>
            <Text style={{...Fonts.whiteColor12SemiBold, textAlign: 'center'}}>
              Carnival
            </Text>
          </View>
          <Text
            style={{
              ...Fonts.blackColor15Medium,
              paddingVertical: Sizes.fixPadding,
            }}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    };

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
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowColor: Colors.lightGrayColor,
          }}>
          <Text
            style={{
              ...Fonts.blackColor14SemiBold,
              marginLeft: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding,
            }}>
            What day?
          </Text>
          <FlatList
            data={dateData}
            renderItem={renderDate}
            horizontal
            style={{marginBottom: Sizes.fixPadding * 1.5}}
          />
          <Text
            style={{
              ...Fonts.blackColor14SemiBold,
              marginLeft: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding,
            }}>
            Number of Seat?
          </Text>
          <FlatList
            data={seatData}
            renderItem={renderSeat}
            horizontal
            style={{marginBottom: Sizes.fixPadding * 1.5}}
          />
          <Text
            style={{
              ...Fonts.blackColor14SemiBold,
              marginLeft: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding,
            }}>
            What time?
          </Text>
          <FlatList
            data={timeData}
            renderItem={renderTime}
            horizontal
            // style={{marginBottom: Sizes.fixPadding * 1.5}}
          />
        </View>
      </View>
    );
  }

  function showExtraOffers() {
    return (
      <View style={styles.carnivalOfferMainContainer}>
        <View style={styles.carnivalOfferContainer}>
          <View style={styles.carnivalOfferChildContainer}>
            <Text style={{...Fonts.whiteColor12SemiBold, textAlign: 'center'}}>
              Carnival
            </Text>
          </View>
          <Text
            style={{
              ...Fonts.blackColor15Medium,
              paddingVertical: Sizes.fixPadding * 0.6,
            }}>
            12:55
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.blackColor16SemiBold,
            marginLeft: Sizes.fixPadding,
            flex: 1,
          }}>
          Look for the carnival slot for extra offers
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

export default BookSeat;

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
