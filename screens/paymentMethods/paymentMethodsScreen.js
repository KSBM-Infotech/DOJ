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
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {api_url, phonepe_payment} from '../../constants/api';

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
    paymentMethod: 'Cash on delivery',
    paymentMethodIcon: require('../../assets/images/paymentMethod/cash.png'),
  },
  {
    id: '4',
    paymentMethod: 'Paypal',
    paymentMethodIcon: require('../../assets/images/paymentMethod/paypal.png'),
  },
  {
    id: '5',
    paymentMethod: 'PayUmoney',
    paymentMethodIcon: require('../../assets/images/paymentMethod/payUmoney.png'),
  },
];

const PaymentMethodsScreen = ({navigation}) => {
  const [state, setState] = useState({
    selectedPaymentMethodId: paymentMethodsList[1].id,
  });

  const updateState = data => setState(state => ({...state, ...data}));

  const on_phone_pe = async () => {
    await axios({
      method: 'post',
      url: api_url + phonepe_payment,
      data: {
        merchantUserId: 'U123456789',
        amount: 100,
        mobileNumber: 8578805451,
        email: 'test@gmail.com',
        shortName: 'pritam',
        currency: 'inr',
      },
    }).then(res=>{
        console.log(res.data)
    }).catch(err=>{
        console.log(err)
    });
  };

  const {selectedPaymentMethodId} = state;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={<>{paymentMethodInfo()}</>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 2.0}}
        />
      </View>
      <View style={{backgroundColor: Colors.bodyBackColor}}>
        {addNewPaymentMethodButton()}
      </View>
    </SafeAreaView>
  );

  function addNewPaymentMethodButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('AddNewPaymentMethod')}
        style={styles.addNewPaymentMethodButtonStyle}>
        <Text style={{...Fonts.whiteColor18Bold}}>Add New Payment Method</Text>
      </TouchableOpacity>
    );
  }

  function paymentMethodInfo() {
    const renderItem = ({item, index}) => (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
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
          name="arrow-back-ios"
          color={Colors.blackColor}
          size={22}
          onPress={() => navigation.pop()}
        />
        <Text
          style={{
            marginLeft: Sizes.fixPadding - 5.0,
            flex: 1,
            ...Fonts.blackColor18SemiBold,
          }}>
          Payment Method
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
  addNewPaymentMethodButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255, 66, 0, 0.3)',
    borderWidth: 1.0,
    elevation: 1.0,
    shadowColor: Colors.primaryColor,
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

export default PaymentMethodsScreen;
