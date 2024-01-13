import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../constants/styles';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DeliverySearch from '../screens/DeliverySearch';
import DiningSearch from '../screens/DiningSearch';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  api_url,
  customer_food_search,
  customer_search_dine,
} from '../constants/api';
import {Input, Icon} from '@rneui/themed';
import axios from 'axios';
import {connect} from 'react-redux';
import * as SearchActions from '../redux/actions/SearchActions';

const {width} = Dimensions.get('window');

const Tab = createMaterialTopTabNavigator();

const HomeSearch = ({navigation, searchType, dispatch, route}) => {
  const [state, setState] = useState({
    search: '',
    showCustomDialog: false,
    selectedCustomProductName: null,
    selectedCustomProductAmount: 0,
    isLoading: false,
    searchedData: null,
  });

  useEffect(() => {
    if (typeof route?.params?.voice_value != 'undefined') {
      updateState({search: route?.params?.voice_value});
      search_items(route?.params?.voice_value);
    }
  }, []);
  let searchTimeout;

  const updateState = data => setState(state => ({...state, ...data}));

  const search_items = async text => {
    updateState({isLoading: true});
    updateState({search: text});
    await axios({
      method: 'post',
      url: api_url + customer_food_search,
      data: {
        search: text,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          dispatch(SearchActions.setDeliverySearch(res.data.data));
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const dining_search = async text => {
    updateState({isLoading: true});
    updateState({search: text});
    await axios({
      method: 'post',
      url: api_url + customer_search_dine,
      data: {
        search: text,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          dispatch(SearchActions.setDiningSearch(res.data.data));
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const handleTextChange = text => {
    // updateState({search: text})
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (searchType == 'delivery') {
        search_items(text);
      } else {
        dining_search(text);
      }
    }, 3000);
  };

  const {
    search,
    showCustomDialog,
    // customiseOptions,
    selectedCustomProductName,
    selectedCustomProductAmount,
    isLoading,
    searchedData,
  } = state;
  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      {header()}
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            ...Fonts.blackColor13Medium,
            textTransform: 'capitalize',
          },
          tabBarScrollEnabled: false,
          tabBarIndicatorStyle: {
            backgroundColor: Colors.primaryColor,
            height: 2,
            width: '10%',
            marginHorizontal: '12%',
          },
          tabBarStyle: {
            elevation: 1,
            shadowColor: Colors.grayColor,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.grayColor,
          },
        }}>
        <Tab.Screen
          name="deliverySearch"
          component={DeliverySearch}
          options={{tabBarLabel: 'Delivery'}}
        />
        <Tab.Screen
          name="diningSearch"
          component={DiningSearch}
          options={{tabBarLabel: 'Dining'}}
        />
      </Tab.Navigator>
    </View>
  );
  function header() {
    let myRef = createRef();
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Sizes.fixPadding,
        }}>
        <Input
          // value={search}
          ref={myRef}
          onChangeText={text => handleTextChange(text)}
          placeholder="Search Restaurant, Disesh..."
          placeholderTextColor={Colors.grayColor}
          selectionColor={Colors.primaryColor}
          leftIcon={
            <Icon
              name="arrow-back"
              size={18}
              color={Colors.primaryColor}
              onPress={() => navigation.goBack()}
            />
          }
          rightIcon={
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {search.length != 0 && (
                <Icon
                  name="close"
                  size={18}
                  color={Colors.grayColor}
                  onPress={() => {
                    dispatch(SearchActions.setDeliverySearch(null));
                    dispatch(SearchActions.setDiningSearch(null));
                    updateState({search: ''});
                    myRef.current.clear();
                  }}
                />
              )}

              <View
                style={{
                  height: '100%',
                  width: 1,
                  backgroundColor: Colors.grayColor,
                  marginHorizontal: Sizes.fixPadding * 0.5,
                }}
              />

              {isLoading ? (
                <ActivityIndicator color={Colors.primaryColor} />
              ) : (
                <Icon
                  name="keyboard-voice"
                  size={18}
                  color={Colors.primaryColor}
                  onPress={() => navigation.goBack()}
                />
              )}
            </View>
          }
          style={{...Fonts.blackColor13Medium}}
          inputStyle={{marginLeft: Sizes.fixPadding}}
          inputContainerStyle={{borderBottomWidth: 0.0, height: 50.0}}
          containerStyle={styles.searchFieldStyle}
        >{search}</Input>
        {/* <Text style={{...Fonts.grayColor10Medium}}>
          (ex. pizza,abc restro, etc...)
        </Text> */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  searchFieldStyle: {
    height: 50.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding * 0.5,
    elevation: 5.0,
    shadowColor: Colors.grayColor,
  },
  popularItemsWrapStyle: {
    borderRadius: Sizes.fixPadding,
    elevation: 2.0,
    padding: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizes.fixPadding + 10.0,
  },
  addButtonStyle: {
    alignItems: 'center',
    paddingHorizontal: Sizes.fixPadding + 10.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    borderRadius: Sizes.fixPadding,
    alignSelf: 'flex-end',
  },
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 80,
    padding: 0.0,
    backgroundColor: Colors.bodyBackColor,
  },
  checkBoxStyle: {
    width: 20.0,
    height: 20.0,
    borderRadius: Sizes.fixPadding - 8.0,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
  },
  customiseOptionWrapStyle: {
    flexDirection: 'row',
    marginBottom: Sizes.fixPadding + 10.0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customProductInfoWrapStyle: {
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    backgroundColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => ({
  searchType: state.search.searchType,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(HomeSearch);
