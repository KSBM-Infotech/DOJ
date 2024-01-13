import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  StyleSheet,
  Text,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Snackbar} from 'react-native-paper';

const favoritesList = [
  {
    key: '1',
    isRestaurant: true,
    restaurantLogo: require('../../assets/images/restaurants_logo/logo1.png'),
    restaurantName: 'Marine Rise Restaurant',
    restaurantAddress: '1124, Chruch Street, New york, USA',
    rating: 4.3,
    distance: '2.5 km',
    foodCategories: 'Fast food,Italian,Chinese',
  },
  {
    key: '2',
    isRestaurant: false,
    foodImage: require('../../assets/images/food/food12.png'),
    foodName: 'Veg Sandwich',
    cusomization: 'Sauce tomato,mozzarella etc.',
    amount: 6.0,
  },
  {
    key: '3',
    isRestaurant: false,
    foodImage: require('../../assets/images/food/food21.png'),
    foodName: 'Veg Frankie',
    cusomization: 'Sauce tomato,mozzarella etc.',
    amount: 10.0,
  },
  {
    key: '4',
    isRestaurant: false,
    foodImage: require('../../assets/images/food/food11.png'),
    foodName: 'Margherite Pizza',
    cusomization: 'Sauce tomato,mozzarella etc.',
    amount: 12.0,
  },
  {
    key: '5',
    isRestaurant: true,
    restaurantLogo: require('../../assets/images/restaurants_logo/logo3.png'),
    restaurantName: 'Seven Star Restaurant',
    restaurantAddress: '1124, Chruch Street, New york, USA',
    rating: 4.0,
    distance: '3.50 km',
    foodCategories: 'Fast food,Italian,Chinese',
  },
];

const rowSwipeAnimatedValues = {};

Array(favoritesList.length + 1)
  .fill('')
  .forEach((_, i) => {
    rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
  });

const FavoritesScreen = ({navigation}) => {
  const [showSnackBar, setShowSnackBar] = useState(false);

  const [listData, setListData] = useState(favoritesList);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setShowSnackBar(true);
    setListData(newData);
  };

  const onSwipeValueChange = swipeData => {
    const {key, value} = swipeData;
    rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  };

  const renderItem = data => (
    <TouchableHighlight
      style={{backgroundColor: Colors.bodyBackColor}}
      activeOpacity={0.9}>
      {data.item.isRestaurant ? (
        <View style={styles.favoriteRestaurantWrapStyle}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={data.item.restaurantLogo}
                style={{
                  width: 40.0,
                  height: 40.0,
                  borderRadius: Sizes.fixPadding - 5.0,
                }}
              />
              <View style={{flex: 1, marginLeft: Sizes.fixPadding}}>
                <Text numberOfLines={1} style={{...Fonts.blackColor14SemiBold}}>
                  {data.item.restaurantName}
                </Text>
                <Text numberOfLines={1} style={{...Fonts.grayColor14Medium}}>
                  {data.item.foodCategories}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginRight: Sizes.fixPadding - 5.0,
                  ...Fonts.primaryColor12SemiBold,
                }}>
                {data.item.rating.toFixed(1)}
              </Text>
              <MaterialIcons
                name="star"
                color={Colors.primaryColor}
                size={14}
              />
            </View>
          </View>
          <View
            style={{
              marginLeft: Sizes.fixPadding - 3.0,
              marginTop: Sizes.fixPadding - 5.0,
              flexDirection: 'row',
            }}>
            <MaterialIcons
              name="location-on"
              color={Colors.primaryColor}
              size={16}
            />
            <Text
              style={{
                flex: 1,
                marginLeft: Sizes.fixPadding - 5.0,
                ...Fonts.grayColor13Medium,
              }}>
              {data.item.distance} | {data.item.restaurantAddress}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.favoriteFoodWrapStyle}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={data.item.foodImage}
              style={{
                width: 40.0,
                height: 40.0,
                borderRadius: Sizes.fixPadding - 5.0,
              }}
            />
            <View style={{flex: 1, marginLeft: Sizes.fixPadding}}>
              <Text numberOfLines={1} style={{...Fonts.blackColor14SemiBold}}>
                {data.item.foodName}
              </Text>
              <Text numberOfLines={1} style={{...Fonts.grayColor14Medium}}>
                {data.item.cusomization}
              </Text>
            </View>
          </View>
          <Text
            style={{
              right: 10.0,
              top: 10.0,
              alignSelf: 'flex-end',
              position: 'absolute',
              ...Fonts.primaryColor13SemiBold,
            }}>
            {`$`}
            {data.item.amount.toFixed(2)}
          </Text>
        </View>
      )}
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={{alignItems: 'center', flex: 1}}>
      <TouchableOpacity
        style={styles.backDeleteContinerStyle}
        onPress={() => deleteRow(rowMap, data.item.key)}>
        <Animated.View
          style={[
            {
              transform: [
                {
                  scale: rowSwipeAnimatedValues[data.item.key].interpolate({
                    inputRange: [50, 100],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}>
          <MaterialIcons
            name="delete"
            size={24}
            color={Colors.whiteColor}
            style={{alignSelf: 'center'}}
          />
          <Text style={{...Fonts.whiteColor12SemiBold}}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{flex: 1}}>
        {header()}
        <View style={{flex: 1}}>
          {listData.length == 0 ? (
            noItemsInfo()
          ) : (
            <View style={{flex: 1}}>
              <SwipeListView
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-110}
                onSwipeValueChange={onSwipeValueChange}
                contentContainerStyle={{
                  paddingTop: Sizes.fixPadding * 2.0,
                }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          <Snackbar
            style={styles.snackBarStyle}
            visible={showSnackBar}
            onDismiss={() => setShowSnackBar(false)}>
            Item Remove from favorite.
          </Snackbar>
        </View>
      </View>
    </SafeAreaView>
  );

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
          Favorites
        </Text>
      </View>
    );
  }

  function noItemsInfo() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <MaterialIcons
          name="favorite-border"
          size={50}
          color={Colors.grayColor}
        />
        <Text style={{...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding}}>
          No items in favourite
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
  favoriteFoodWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 3.0,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 12.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  favoriteRestaurantWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 3.0,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  snackBarStyle: {
    position: 'absolute',
    bottom: -10.0,
    left: -10.0,
    right: -10.0,
    backgroundColor: '#333333',
    elevation: 0.0,
  },
  backDeleteContinerStyle: {
    alignItems: 'center',
    bottom: 20.0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 100,
    backgroundColor: Colors.primaryColor,
    right: 0,
  },
});

export default FavoritesScreen;
