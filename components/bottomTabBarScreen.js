import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  BackHandler,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../constants/styles';
import ProfileScreen from '../screens/profile/profileScreen';
import HomeScreen from '../screens/home/homeScreen';
import CartScreen from '../screens/cart/cartScreen';
import OrdersScreen from '../screens/orders/ordersScreen';
import {useFocusEffect} from '@react-navigation/native';
import Dining from '../screens/Dining';
import Money from '../screens/Money';
import Scanner from '../screens/Scanner';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/CustomerActions';

const {width} = Dimensions.get('window');

const BottomTabBarScreen = ({navigation, route, dispatch, isSelfPickup}) => {
  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [backAction, isSelfPickup]),
  );

  function _spring() {
    updateState({backClickCount: 1});
    setTimeout(() => {
      updateState({backClickCount: 0});
    }, 1000);
  }

  const [state, setState] = useState({
    currentIndex: route.params ? route.params.index : 1,
    backClickCount: 0,
  });

  const updateState = data => setState(state => ({...state, ...data}));

  const {currentIndex, backClickCount} = state;

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
        {currentIndex == 1 ? (
          <HomeScreen navigation={navigation} selfPickup={false} />
        ) : currentIndex == 2 ? (
          <Dining navigation={navigation} />
        ) : currentIndex == 3 ? (
          <HomeScreen navigation={navigation} selfPickup={true} />
        ) : currentIndex == 4 ? (
          <Money navigation={navigation} />
        ) : (
          <Scanner navigation={navigation} changeIndex={changeIndex} />
        )}
        <View style={styles.bottomTabBarStyle}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {bottomTabBarItem({
              index: 1,
              icon: require('../assets/images/icons/delivery.png'),
              tabName: 'Delivey',
            })}
            {bottomTabBarItem({
              index: 2,
              icon: require('../assets/images/icons/Dining.png'),
              tabName: 'Dining',
            })}

            {bottomTabBarItem({
              index: 3,
              icon: require('../assets/images/icons/delivery.png'),
              tabName: 'Self Pickup',
            })}
            {bottomTabBarItem({
              index: 4,
              icon: require('../assets/images/icons/Money.png'),
              tabName: 'Money',
            })}
            {bottomTabBarItem({
              index: 5,
              icon: require('../assets/images/icons/qrcode.png'),
              tabName: 'QR Code',
            })}
          </ScrollView>
        </View>
      </View>

      {backClickCount == 1 ? (
        <View style={[styles.animatedView]}>
          <Text style={{...Fonts.whiteColor12SemiBold}}>
            Press Back Once Again to Exit
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );

  function changeIndex({index}) {
    updateState({currentIndex: index});
  }

  function bottomTabBarItem({index, icon, tabName}) {

    const handleTab = () => {
      changeIndex({index: index});
    };
    return (
      <>
        {currentIndex == index ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleTab()}
            style={styles.selectedTabStyle}>
            <Image
              source={icon}
              style={{width: 25.0, height: 25.0, resizeMode: 'contain'}}
              tintColor={
                currentIndex == index ? Colors.primaryColor : Colors.grayColor
              }
            />
            <Text
              style={{
                marginLeft: Sizes.fixPadding - 5.0,
                ...Fonts.primaryColor12SemiBold,
              }}>
              {tabName}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => updateState({currentIndex: index})}
            style={styles.selectedTabStyle}>
            <Image
              source={icon}
              style={{width: 25.0, height: 25.0, resizeMode: 'contain'}}
            />
            <Text
              style={{
                marginLeft: Sizes.fixPadding - 5.0,
                ...Fonts.primaryColor12Regular,
              }}>
              {tabName}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  }
};

const styles = StyleSheet.create({
  bottomTabBarStyle: {
    position: 'absolute',
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
    height: 50.0,
    backgroundColor: Colors.whiteColor,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // paddingHorizontal: Sizes.fixPadding * 2.0,
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1.0,
    elevation: 2.0,
  },
  selectedTabStyle: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    // flexDirection: 'row',
    // backgroundColor: '#FFD9CC',
    borderRadius: Sizes.fixPadding * 3.0,
    // paddingVertical: Sizes.fixPadding + 2.0,
    // paddingLeft: Sizes.fixPadding*3,
    // paddingHorizontal: Sizes.fixPadding * 2,
    width: width / 4,
  },
  animatedView: {
    backgroundColor: Colors.blackColor,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapDispatchToProps = dispatch => ({dispatch});

const mapStateToProps = state=>({
  isSelfPickup: state.customer.isSelfPickup
})

export default connect(mapStateToProps, mapDispatchToProps)(BottomTabBarScreen);
