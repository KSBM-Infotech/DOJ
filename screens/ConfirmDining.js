import {View, Text, StatusBar, FlatList, TouchableOpacity, BackHandler} from 'react-native';
import React, { useEffect } from 'react';
import {Colors, Sizes} from '../constants/styles';
import {Fonts} from '../constants/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather'
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { connect } from 'react-redux';

const ConfirmDining = ({navigation, route, customerData}) => {
    console.log(customerData)
    useEffect(() => {
        const backAction = () => {
         home()
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
      }, []);
    
      const home = ()=>{
        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'BottomTabBar'}],
            }),
          );
      }

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar
        backgroundColor={Colors.greenColor}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        <FlatList
            showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {header()}
              {paybillAlert()}
              {resevationInfo()}
              {customerInfo()}
              {restaurantDetailsInfo()}
              {transactionInfo()}
            </>
          }
          contentContainerStyle={{paddingBottom: Sizes.fixPadding}}
        />
        
      </View>
    </View>
  );

  function transactionInfo(){
    return (
        <View style={{flex: 0, marginHorizontal: Sizes.fixPadding}}>
          <Text
            style={{
              ...Fonts.grayColor15Medium,
              textAlign: 'center',
              marginVertical: Sizes.fixPadding,
              letterSpacing: 1
            }}>
            TRANSACTION DETAILS
          </Text>
          <View
            style={{
              flex: 0,
              backgroundColor: Colors.whiteColor,
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding * 1.5,
            }}>
                 <Text
                style={{
                  ...Fonts.blackColor15Medium,
                }}>
                Transaction ID: 94324234
              </Text>
              <Text
                style={{
                  ...Fonts.grayColor13Medium,
                }}>
                Transaction Date: August 14, 2023 4:41 PM
              </Text>
          </View>
        </View>
      );
  }

  function restaurantDetailsInfo(){
    return (
        <View style={{flex: 0, margin: Sizes.fixPadding}}>
          <Text
            style={{
              ...Fonts.grayColor16Medium,
              textAlign: 'center',
              marginVertical: Sizes.fixPadding,
              letterSpacing: 1
            }}>
            RESTATURANTS DETAILS
          </Text>
          <View
            style={{
              flex: 0,
              backgroundColor: Colors.whiteColor,
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding * 1.5,
            }}>
                 <Text
                style={{
                  ...Fonts.blackColor15Medium,
                }}>
                {route?.params?.restaurantData?.name}
              </Text>
              <Text
                style={{
                  ...Fonts.grayColor13Medium,
                }}>
                   {route?.params?.restaurantData?.address}
              </Text>
              <View
            style={{
              flex: 0,
              borderTopWidth: 0.8,
              marginTop: Sizes.fixPadding,
              borderTopColor: Colors.lightGrayColor,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 0,
                width: '75%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                borderRightWidth: 0.8,
                paddingVertical: Sizes.fixPadding * 0.8,
                borderRightColor: Colors.lightGrayColor,
              }}>
              <View
                style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    
                <Text
                  style={{
                    ...Fonts.blackColor13Medium,
                    marginLeft: Sizes.fixPadding,
                  }}>
                  View restaurant
                </Text>
              </View>
              <TouchableOpacity style={{}}>
                <MaterialIcons
                  name="directions"
                  color={Colors.primaryColor}
                  size={22}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                width: '25%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather
                name="phone-call"
                color={Colors.primaryColor}
                size={18}
              />
            </TouchableOpacity>
          </View>
          </View>
        </View>
      );
  }

  function customerInfo(){
    return (
        <View style={{flex: 0, marginHorizontal: Sizes.fixPadding}}>
          <Text
            style={{
              ...Fonts.grayColor16Medium,
              textAlign: 'center',
              marginVertical: Sizes.fixPadding,
              letterSpacing: 1
            }}>
            YOUR DETAILS
          </Text>
          <View
            style={{
              flex: 0,
              backgroundColor: Colors.whiteColor,
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding * 1.5,
            }}>
                 <Text
                style={{
                  ...Fonts.blackColor15Medium,
                }}>
                {customerData?.name}
              </Text>
              <Text
                style={{
                  ...Fonts.grayColor13Medium,
                }}>
                {customerData?.mobile_number}
              </Text>
          </View>
        </View>
      );
  }

  function resevationInfo() {
    return (
      <View style={{flex: 0, marginHorizontal: Sizes.fixPadding}}>
        <Text
          style={{
            ...Fonts.grayColor16Medium,
            textAlign: 'center',
            marginVertical: Sizes.fixPadding,
            letterSpacing: 1
          }}>
          RESERVATION DETAILS
        </Text>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.blueColor + '20',
            paddingHorizontal: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 4,
            borderRadius: Sizes.fixPadding * 1.5,
          }}>
          <MaterialIcons
            name="access-time-filled"
            color={Colors.yellowColor_a}
            size={20}
          />
          <Text
            style={{
              ...Fonts.blackColor11SemiBold,
              marginLeft: Sizes.fixPadding,
              flex: 1,
            }}>
            Reach the restaurant 15 mins before your slot
          </Text>
        </View>
        <View
          style={{
            flex: 0,
            backgroundColor: Colors.whiteColor,
            paddingHorizontal: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 3,
            borderRadius: Sizes.fixPadding * 1.5,
            position: 'relative',
            top: -Sizes.fixPadding * 3,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: Sizes.fixPadding * 0.5,
            }}>
            <MaterialIcons name="person" color={Colors.blackColor} size={20} />
            <Text
              style={{
                ...Fonts.blackColor11SemiBold,
                marginLeft: Sizes.fixPadding,
                flex: 1,
              }}>
              Number of guests: {route.params?.selectedSeat}
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
              name="calendar-month"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor11SemiBold,
                marginLeft: Sizes.fixPadding,
                flex: 1,
              }}>
              {moment(route.params?.selectedDate).format('Do MMM YYYY')}
            </Text>
          </View>
          <TouchableOpacity style={{marginLeft: Sizes.fixPadding * 3}}>
            <Text style={{...Fonts.primaryColor12SemiBold}}>
              Cancel booking
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 0,
              height: 1,
              backgroundColor: Colors.grayColor + '50',
              marginVertical: Sizes.fixPadding * 2,
            }}
          />
          <TouchableOpacity
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
                <Ionicons
              name="share"
              color={Colors.primaryColor}
              size={20}
            />
            <Text style={{...Fonts.blackColor13Medium, marginLeft: Sizes.fixPadding*0.5}}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function paybillAlert() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: Sizes.fixPadding,
          padding: Sizes.fixPadding,
          backgroundColor: Colors.yellowColor_a,
          marginVertical: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding * 1.5,
        }}>
        <View
          style={{
            flex: 0,
            alignSelf: 'flex-start',
            borderRadius: 1000,
            backgroundColor: Colors.whiteColor,
            padding: Sizes.fixPadding * 0.2,
          }}>
          <MaterialIcons
            name="access-time-filled"
            color={Colors.blueColor}
            size={35}
          />
        </View>
        <Text
          style={{
            ...Fonts.blackColor11SemiBold,
            marginLeft: Sizes.fixPadding,
            flex: 1,
          }}>
          Pay your final bill through Doj app between 5:30 PM, 14 Aug - 9:30 PM,
          14 Aug to avail this discount
        </Text>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          flex: 0,
          backgroundColor: Colors.greenColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: Sizes.fixPadding * 1.5,
        }}>
        <View style={{flex: 0, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{...Fonts.whiteColor12SemiBold}}>{route?.params?.restaurantData?.name}</Text>
          <Text style={{...Fonts.whiteColor14Bold, textAlign: 'center',marginHorizontal:Sizes.fixPadding}}>
            {route?.params?.restaurantData?.address}
          </Text>
        </View>
        <View
          style={{
            alignSelf: 'center',
            borderRadius: 1000,
            borderWidth: 2,
            marginVertical: Sizes.fixPadding * 1.5,
            borderColor: '#00f078',
          }}>
          <Ionicons
            name="checkmark-circle"
            color={Colors.whiteColor}
            size={40}
          />
        </View>
        <Text style={{...Fonts.whiteColor20Bold}}>Booking confirmed</Text>
        <TouchableOpacity
          onPress={() => home()}
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            padding: Sizes.fixPadding,
          }}>
          <MaterialIcons name="close" color={Colors.whiteColor} size={20} />
        </TouchableOpacity>
      </View>
    );
  }
};

const mapStateToProps = state => ({
    customerData: state.customer.customerData,
  });
  

export default connect(mapStateToProps, null)(ConfirmDining);
