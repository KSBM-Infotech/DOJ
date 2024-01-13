import {
  View,
  Text,
  StatusBar,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes} from '../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AddVoucher = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.grayColor1}}>
      <StatusBar
        backgroundColor={Colors.grayColor1}
        barStyle={'dark-content'}
      />
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {inputFieldInfo()}
              {headingInfo()}
              {summaryInfo()}
            </>
          }
        />
      </View>
      {addGiftButton()}
    </View>
  );

  function addGiftButton() {
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.giftCardButton}>
        <Text style={{...Fonts.whiteColor15Medium}}>Add Gift Card</Text>
      </TouchableOpacity>
    );
  }

  function summaryInfo() {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <View style={styles.dot} />
          <Text style={{...Fonts.grayColor12Medium}}>
            Enter the Doj Money 16 digit voucher code that you have recived on
            your register e-mail id / phone number.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.dot} />
          <Text style={{...Fonts.grayColor12Medium}}>
            Once redeemed, you can use it for Food, Instamart, Genie, DineOut
            etc.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.dot} />
          <Text style={{...Fonts.grayColor12Medium}}>
            Any balance in Doj Money account, cannot be transferred to bank
            account or to another Doj Money account as per RBI guidelines.
          </Text>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.dot} />
          <Text style={{...Fonts.grayColor12Medium}}>
            Any balance in Doj Money account, cannot be used to purchase any
            Gift cards.
          </Text>
        </View>
      </View>
    );
  }

  function headingInfo() {
    return (
      <Text
        style={{
          ...Fonts.blackColor13SemiBold,
          marginHorizontal: Sizes.fixPadding * 1.5,
        }}>
        How it works
      </Text>
    );
  }

  function inputFieldInfo() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter 16 digit Code"
          placeholderTextColor={Colors.grayColor}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter PIN"
          placeholderTextColor={Colors.grayColor}
          style={styles.input}
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
          onPress={() => navigation.goBack()}
        />
        <View style={{marginLeft: Sizes.fixPadding}}>
          <Text
            style={{
              ...Fonts.blackColor15Medium,
            }}>
            Add Voucher
          </Text>
          <Text style={{...Fonts.grayColor13Medium}}>Balance ₹200</Text>
        </View>
      </View>
    );
  }
};

export default AddVoucher;

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grayColor + '50',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    marginHorizontal: Sizes.fixPadding * 1.5,
    marginVertical: Sizes.fixPadding,
    padding: Sizes.fixPadding * 1.5,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    elevation: 8,
    shadowColor: Colors.grayColor,
  },

  input: {
    ...Fonts.blackColor13Medium,
    borderWidth: 0.7,
    borderColor: Colors.grayColor,
    height: 45,
    padding: 10,
    borderRadius: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2,
  },
  textContainer: {
    flex: 0,
    flexDirection: 'row',
    marginBottom: Sizes.fixPadding,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 100,
    backgroundColor: Colors.grayColor,
    marginRight: Sizes.fixPadding,
    marginTop: Sizes.fixPadding * 0.6,
  },
  giftCardButton:{
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Sizes.fixPadding*2,
    paddingVertical: Sizes.fixPadding*1.5,
    backgroundColor: Colors.primaryColor+'60',
    borderRadius: Sizes.fixPadding
  }
});
