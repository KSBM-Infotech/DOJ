import {
  View,
  Text,
  StatusBar,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from './config/screen';
import Entypo from 'react-native-vector-icons/Entypo';
import {getpromocode} from '../constants/api';
import {Modal, Portal} from 'react-native-paper';

const coupan = [
  {
    id: 1,
    coupanName: 'SMASH',
    coupanOffer: 'Save 50% on this order',
    coupanDesc: 'Use Code SMASH and get Flat 50% off on order above ₹199 ',
    desc: [
      'Offer is valid only on select restauratnts',
      'Coupan code can be applied only once in 2hrs',
      'Other T&Cs may apply',
      'Offer vald till Dec 10 2023 11:59 PM',
    ],
  },
  {
    id: 2,
    coupanName: 'SMASH',
    coupanOffer: 'Save 50% on this order',
    coupanDesc: 'Use Code SMASH and get Flat 50% off on order above ₹199 ',
    desc: [
      'Offer is valid only on select restauratnts',
      'Coupan code can be applied only once in 2hrs',
      'Other T&Cs may apply',
      'Offer vald till Dec 10 2023 11:59 PM',
    ],
  },
  {
    id: 3,
    coupanName: 'SMASH',
    coupanOffer: 'Save 50% on this order',
    coupanDesc: 'Use Code SMASH and get Flat 50% off on order above ₹199 ',
    desc: [
      'Offer is valid only on select restauratnts',
      'Coupan code can be applied only once in 2hrs',
      'Other T&Cs may apply',
      'Offer vald till Dec 10 2023 11:59 PM',
    ],
  },
  {
    id: 4,
    coupanName: 'SMASH',
    coupanOffer: 'Save 50% on this order',
    coupanDesc: 'Use Code SMASH and get Flat 50% off on order above ₹199 ',
    desc: [
      'Offer is valid only on select restauratnts',
      'Coupan code can be applied only once in 2hrs',
      'Other T&Cs may apply',
      'Offer vald till Dec 10 2023 11:59 PM',
    ],
  },
  {
    id: 5,
    coupanName: 'SMASH',
    coupanOffer: 'Save 50% on this order',
    coupanDesc: 'Use Code SMASH and get Flat 50% off on order above ₹199 ',
    desc: [
      'Offer is valid only on select restauratnts',
      'Coupan code can be applied only once in 2hrs',
      'Other T&Cs may apply',
      'Offer vald till Dec 10 2023 11:59 PM',
    ],
  },
];

const get_promocode = async () => {
  await axios({
    method: 'post',
    url: api + getpromocode,
    data: {},
  })
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    });
};

const ApplyPromocode = ({navigation}) => {
  const [state, setState] = useState({
    activeMore: null,
    visible: false,
  });

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {activeMore} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.grayColor1, marginTop: 25}}>
      <StatusBar
        backgroundColor={Colors.grayColor1}
        barStyle={'dark-content'}
      />
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {filter()}
              <View
                style={{
                  width: SCREEN_WIDTH,
                  backgroundColor: Colors.grayLight,
                  borderTopLeftRadius: 100,
                  borderTopRightRadius: 100,
                  marginTop: Sizes.fixPadding * 2.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {promocode()}
                {promoDesc()}
                {/* {foodAlert()} */}
              </View>
            </>
          }
        />
      </View>
    </View>
  );

  function promocode() {
    return (
      <View
        style={{
          backgroundColor: Colors.primaryColor,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          alignSelf: 'center',
          width: SCREEN_WIDTH * 0.5,
          padding: Sizes.fixPadding,
        }}>
        <Text
          style={{
            ...Fonts.blackColor18Medium,
            color: Colors.whiteColor,
            textAlign: 'center',
          }}>
          All Promocodes
        </Text>
      </View>
    );
  }

  function promoDesc() {
    const renderItem = ({item}) => {
      const renderChild = ({item}) => {
        // return(
        //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
        //         <Text style={{...Fonts.blackColor12SemiBold, width: '20%'}}> &#8226; </Text>
        //         <Text style={{...Fonts.blackColor12SemiBold, width: '80%'}}>{item.desc}</Text>
        //     </View>
        // )
      };
      return (
        <>
          <View
            style={{
              width: SCREEN_WIDTH * 0.85,
              backgroundColor: Colors.whiteColor,
              borderRadius: Sizes.fixPadding * 2.5,
              padding: Sizes.fixPadding * 2,
              marginTop: Sizes.fixPadding * 2,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{...Fonts.blackColor22SemiBold}}>
                {item.coupanName}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primaryColor,
                  paddingHorizontal: Sizes.fixPadding * 2,
                  paddingVertical: Sizes.fixPadding,
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    ...Fonts.blackColor12SemiBold,
                    color: Colors.whiteColor,
                  }}>
                  apply
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                ...Fonts.blackColor8SemiBold,
                color: Colors.primaryColor,
                paddingBottom: Sizes.fixPadding * 0.5,
              }}>
              {item.coupanOffer}
            </Text>
            <View
              style={{
                width: SCREEN_WIDTH * 0.75,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: Sizes.fixPadding * 0.75,
              }}>
              <Text style={{...Fonts.blackColor10Medium, width: '85%'}}>
                {item.coupanDesc}
              </Text>
              <TouchableOpacity
                onPress={() => updateState({activeMore: item.id})}
                style={{
                  width: SCREEN_WIDTH * 0.085,
                  height: SCREEN_WIDTH * 0.085,
                  borderRadius: SCREEN_WIDTH * 0.085,
                  top: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 5,
                  shadowColor: Colors.blackColor,
                  backgroundColor: Colors.primaryColor,
                  padding: Sizes.fixPadding * 0.5,
                  marginHorizontal: Sizes.fixPadding * 0.5,
                }}>
                <Text
                  style={{
                    ...Fonts.blackColor10Medium,
                    fontSize: 8,
                    color: Colors.whiteColor,
                  }}>
                  More
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{width: SCREEN_WIDTH * 0.85, zIndex: -1, top: -SCREEN_WIDTH*0.05}}>
            {activeMore === item.id && (
              <View
                style={{
                  width: SCREEN_WIDTH * 0.85,
                  borderBottomLeftRadius: Sizes.fixPadding,
                  borderBottomRightRadius: Sizes.fixPadding,
                  backgroundColor: Colors.grayDark,
                  paddingTop: Sizes.fixPadding * 2.5,
                  padding: Sizes.fixPadding,
                }}>
                <Text style={{...Fonts.blackColor10Medium}}>
                  Terms and Conditions apply
                </Text>
                <Text
                  style={{
                    ...Fonts.grayColor10Medium,
                    color: Colors.grayColor,
                    marginTop: 10,
                  }}>
                  &#8226;{'  '}
                  {item.desc}
                </Text>
              </View>
            )}
          </View>
        </>
      );
    };
    return (
      <FlatList data={coupan} renderItem={renderItem} key={item => item.id} />
    );
  }

  function filter() {
    return (
      <View
        style={{
          width: SCREEN_WIDTH * 0.9,
          paddingHorizontal: 10,
          borderColor: Colors.redColor,
          borderRadius: 15,
          borderWidth: 1,
          marginHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TextInput placeholder="Enter Your Promocode" />
        <TouchableOpacity style={{alignSelf: 'center'}}>
          <Text
            style={{...Fonts.blackColor14SemiBold, color: Colors.grayColor}}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back"
          color={Colors.grayColor}
          size={25}
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            marginLeft: Sizes.fixPadding,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{...Fonts.blackColor18Medium}}>Apply Promocode</Text>
        </View>
      </View>
    );
  }

  //These are the alert for the user when it create order for DojPartner
  // function foodAlert() {
  //   return (
  //     <Portal>
  //       <Modal visible={updateState({visible: false})}>
  //         <View
  //           style={{borderBottomWidth: 1, borderBottomColor: Colors.grayColor}}>
  //           <Text style={{...Fonts.blackColor18Medium}}>Alert</Text>
  //           <TouchableOpacity style={{}}>
  //             <Entypo name="cross" size={25} color={Colors.grayColor} />
  //           </TouchableOpacity>
  //         </View>
  //         <View style={{flexDirection: 'row'}}>
  //           <View style={{width: '75%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>Name of Items</Text>
  //           </View>
  //           <View style={{width: '10%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>Qty</Text>
  //           </View>
  //           <View style={{width: '15%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>Rate</Text>
  //           </View>
  //         </View>
  //         <View style={{flexDirection: 'row'}}>
  //           <View style={{width: '75%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>Chees Cake</Text>
  //           </View>
  //           <View style={{width: '10%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>5x</Text>
  //           </View>
  //           <View style={{width: '15%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>₹100</Text>
  //           </View>
  //         </View>
  //         <View style={{flexDirection: 'row'}}>
  //           <View style={{width: '75%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>
  //               Chicken labbdar
  //             </Text>
  //           </View>
  //           <View style={{width: '10%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>2x</Text>
  //           </View>
  //           <View style={{width: '15%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>₹700</Text>
  //           </View>
  //         </View>
  //         <View style={{flexDirection: 'row'}}>
  //           <View style={{width: '75%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>Chicken Soup</Text>
  //           </View>
  //           <View style={{width: '10%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>1x</Text>
  //           </View>
  //           <View style={{width: '15%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>₹100</Text>
  //           </View>
  //         </View>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             marginBottom: Sizes.fixPadding * 2.5,
  //           }}>
  //           <View style={{width: '75%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>Orange Juice</Text>
  //           </View>
  //           <View style={{width: '10%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>1x</Text>
  //           </View>
  //           <View style={{width: '15%'}}>
  //             <Text style={{...Fonts.blackColor12SemiBold}}>₹150</Text>
  //           </View>
  //         </View>
  //       </Modal>
  //     </Portal>
  //   );
  // }
};

export default ApplyPromocode;

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grayColor + '50',
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantDetailWrapStyle: {
    backgroundColor: '#DEE2EB',
    borderRadius: Sizes.fixPadding,
    margin: Sizes.fixPadding * 2.0,
  },
restuarantInfoWrapStyle: {
  borderRadius: Sizes.fixPadding,
  backgroundColor: Colors.whiteColor,
  paddingHorizontal: Sizes.fixPadding + 5.0,
  paddingVertical: Sizes.fixPadding
},
});
