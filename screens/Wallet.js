import {View, Text, StatusBar, FlatList} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors, Fonts, Sizes} from '../constants/styles';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native';

const historyData = [
  {
    id: 1,
    date: new Date(),
    type: 0,
    amount: 500,
    transaction_id: '23843HJJB38FBF38',
  },
  {
    id: 2,
    date: new Date(),
    type: 1,
    amount: 500,
    transaction_id: '23843HJJB38FBF38',
  },
  {
    id: 3,
    date: new Date(),
    type: 0,
    amount: 500,
    transaction_id: '23843HJJB38FBF38',
  },
  {
    id: 4,
    date: new Date(),
    type: 1,
    amount: 500,
    transaction_id: '23843HJJB38FBF38',
  },
  {
    id: 5,
    date: new Date(),
    type: 0,
    amount: 500,
    transaction_id: '23843HJJB38FBF38',
  },
];

const Wallet = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <StatusBar backgroundColor={Colors.whiteColor} barStyle="dark-content" />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {walletDetails()}
              {showHistoryData()}
            </>
          }
        />
      </View>
    </View>
  );

  function showHistoryData() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginTop: Sizes.fixPadding * 2,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{...Fonts.blackColor13SemiBold}}>
                Transaction ID
              </Text>
              <Text style={{...Fonts.blackColor13Medium}}>
                {' '}
                {item.transaction_id}
              </Text>
            </View>
            <Text
              style={
                item.type == 1
                  ? {...Fonts.greenColor15SemiBold}
                  : {...Fonts.primaryColor15SemiBold}
              }>
              {item.type == 1 ? `+ ${item.amount}` : `- ${item.amount}`}
            </Text>
          </View>
        </View>
      );
    };
    return (
      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
      />
    );
  }

  function walletDetails() {
    return (
      <LinearGradient
        colors={['#f80759', '#bc4e9c']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: Sizes.fixPadding * 1.5,
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding * 1.5,
          borderRadius: Sizes.fixPadding,
        }}>
        <View>
          <Text style={{...Fonts.whiteColor18Bold}}>₹2000</Text>
          <Text style={{...Fonts.whiteColor12SemiBold}}>available balance</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.blackColor,
            paddingHorizontal: Sizes.fixPadding,
            paddingVertical: Sizes.fixPadding * 0.5,
            borderRadius: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.whiteColor15Medium}}>Add money</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  function header() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding * 1.5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={22}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            flex: 0.9,
            textAlign: 'center',
            marginLeft: Sizes.fixPadding,
            ...Fonts.blackColor16SemiBold,
          }}>
          Wallet
        </Text>
      </View>
    );
  }
};

export default Wallet;
