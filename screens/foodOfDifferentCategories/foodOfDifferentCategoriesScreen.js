import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Dimensions,
  StatusBar,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Dialog from 'react-native-dialog';
import axios from 'axios';
import {api_url, restaurant_user_food} from '../../constants/api';
import Loader from '../../components/Loader';
import {connect} from 'react-redux';
import * as CartActions from '../../redux/actions/CartActions';

const {width} = Dimensions.get('window');

const categoriesList = ['Fast food', 'Starter', 'Main Course', 'Dessert'];

const availableFoodList = [
  {
    id: '1',
    foodImage: require('../../assets/images/food/food12.png'),
    foodName: 'Veg Sandwich',
    amount: 6.0,
    customizable: true,
  },
  {
    id: '2',
    foodImage: require('../../assets/images/food/food16.png'),
    foodName: 'Veg Frankie',
    amount: 10.0,
    customizable: false,
  },
  {
    id: '3',
    foodImage: require('../../assets/images/food/food17.png'),
    foodName: 'Margherite Pizza',
    amount: 12.0,
    customizable: true,
  },
  {
    id: '4',
    foodImage: require('../../assets/images/food/food13.png'),
    foodName: 'Burger',
    amount: 12.0,
    customizable: false,
  },
  {
    id: '5',
    foodImage: require('../../assets/images/food/food18.png'),
    foodName: 'Veg Cheese Sandwich',
    amount: 10.0,
    customizable: true,
  },
  {
    id: '6',
    foodImage: require('../../assets/images/food/food19.png'),
    foodName: 'Crust Gourmet Pizza',
    amount: 15.0,
    customizable: true,
  },
];

const otherAvailableFoodList = [
  {
    id: '1',
    foodImage: require('../../assets/images/food/food13.png'),
    foodName: 'Burger',
    amount: 12.0,
    customizable: false,
  },
  {
    id: '2',
    foodImage: require('../../assets/images/food/food18.png'),
    foodName: 'Veg Cheese Sandwich',
    amount: 10.0,
    customizable: true,
  },
  {
    id: '3',
    foodImage: require('../../assets/images/food/food19.png'),
    foodName: 'Crust Gourmet Pizza',
    amount: 15.0,
    customizable: true,
  },
];

const customiseOptionsList = [
  {
    id: '1',
    option: 'Extra Cheese',
    amount: 3.0,
    isSelected: false,
  },
  {
    id: '2',
    option: 'Extra Mayonnaise',
    amount: 2.0,
    isSelected: false,
  },
  {
    id: '3',
    option: 'Extra Veggies',
    amount: 1.5,
    isSelected: false,
  },
];

const FoodOfDifferentCategoriesScreen = ({
  navigation,
  route,
  dispatch,
  forCartData,
}) => {
  const [state, setState] = useState({
    selectedCategory: categoriesList[0],
    showCustomDialog: false,
    customiseOptions: customiseOptionsList,
    selectedCustomProductName: null,
    selectedCustomProductAmount: 0,
    isLoading: false,
    restaurant: route.params.restaurant,
    restaurantData: null,
    selcetedData: [],
  });

  useEffect(() => {
    get_product_items();
  }, []);

  const updateState = data => setState(state => ({...state, ...data}));

  const get_product_items = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + restaurant_user_food,
      data: {
        restaurant_id: restaurant?.id,
      },
    })
      .then(res => {
        console.log(res.data)
        updateState({isLoading: false, restaurantData: res.data});
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(Error);
      });
  };

  const {
    selectedCategory,
    showCustomDialog,
    customiseOptions,
    selectedCustomProductName,
    selectedCustomProductAmount,
    isLoading,
    restaurant,
    restaurantData,
    selcetedData,
  } = state;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        {/* {categoriesListInfo()} */}
        {restaurantData && availableFoods()}
        {viewCartButton()}
      </View>
      {customDialog()}
    </SafeAreaView>
  );

  function viewCartButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={selcetedData.length == 0}
        onPress={() =>
          navigation.navigate('Products', {restaurant: restaurant, selcetedData: selcetedData})
        }
        style={styles.viewCartButtonStyle}>
        <Text style={{...Fonts.whiteColor15Medium}}>Next</Text>
      </TouchableOpacity>
    );
  }

  function availableFoods() {
    const renderItem = ({item}) => (
      <View style={styles.foodInfoWrapStyle}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: item.food_image}}
            style={{
              width: width * 0.2,
              height: width * 0.2,
              borderRadius: Sizes.fixPadding - 5.0,
            }}
          />
          <View style={{flex: 1, marginLeft: Sizes.fixPadding}}>
            <Text style={{...Fonts.blackColor14SemiBold}}>{item.name}</Text>
            <Text
              style={{
                marginVertical: Sizes.fixPadding - 7.0,
                ...Fonts.blackColor12SemiBold,
              }}>
              {`₹`}
              {
                parseFloat(item.discount).toFixed(2)}{' '}
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  ...Fonts.grayColor12Medium,
                }}>
                {`₹`}
                {parseFloat(item.price).toFixed(2)}
              </Text>
              
            </Text>
            <Text style={{color: '#26c223'}}>
                  {100 -
                    parseFloat(
                      (parseFloat(item.discount) /
                        parseFloat(item.price)) *
                        100,
                    ).toFixed(2)}
                  % OFF
                </Text>
            {item.customizable ? (
              <Text style={{...Fonts.primaryColor14Medium}}>Customise</Text>
            ) : null}
          </View>
        </View>
        {selcetedData.filter(i => i.id == item.id).length != 0 ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              let arr = selcetedData.filter(i => i.id != item.id);
              console.log(arr);
              updateState({selcetedData: arr})
              dispatch(CartActions.setForCart(arr));
            }}
            style={{...styles.addButtonStyle, backgroundColor: '#FFECE5'}}>
            <Text style={{...Fonts.primaryColor16Medium}}>Remove</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              // item.customizable
              //   ? updateState({
              //       selectedCustomProductName: item.foodName,
              //       selectedCustomProductAmount: item.amount,
              //       showCustomDialog: true,
              //     })
              //   : navigation.push('Products');
              dispatch(
                CartActions.setForCart([
                  ...forCartData,
                  {
                    id: item.id,
                    foodName: item.name,
                    price: item.price,
                    discount: item.discount,
                    itemCount: 1,
                    foodImage: item.food_image,
                    size: 'Medium',
                    restaurant_id: restaurant?.id.toString(),
                  },
                ]),
              );
              updateState({
                selcetedData: [
                  ...selcetedData,
                  {
                    id: item.id,
                    foodName: item.name,
                    price: item.price,
                    discount: item.discount,
                    itemCount: 1,
                    foodImage: item.food_image,
                    size: 'Medium',
                    restaurant_id: restaurant?.id.toString(),
                  },
                ],
              });
            }}
            style={{...styles.addButtonStyle, backgroundColor: '#FFECE5'}}>
            <Text style={{...Fonts.primaryColor16Medium}}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
    return (
      <View style={{flex: 1}}>
        <FlatList
          //   data={selectedCategory == 'Fast food' ? otherAvailableFoodList : selectedCategory == 'Starter' ? availableFoodList : selectedCategory == 'Main Course' ? otherAvailableFoodList : availableFoodList}
          data={restaurantData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: Sizes.fixPadding * 2.0}}
        />
      </View>
    );
  }

  function updateProductCustomise({id}) {
    const newList = customiseOptions.map(item => {
      if (item.id === id) {
        const updatedItem = {...item, isSelected: !item.isSelected};
        return updatedItem;
      }
      return item;
    });
    updateState({customiseOptions: newList});
  }

  function customDialog() {
    return (
      <Dialog.Container
        visible={showCustomDialog}
        contentStyle={styles.dialogWrapStyle}
        headerStyle={{margin: 0.0, padding: 0.0}}
        onBackdropPress={() => {
          updateState({showCustomDialog: false});
        }}>
        <View style={styles.customProductInfoWrapStyle}>
          <View style={{flex: 1}}>
            <Text style={{...Fonts.blackColor14SemiBold}}>
              {selectedCustomProductName}
            </Text>
            <Text
              style={{
                marginTop: Sizes.fixPadding - 5.0,
                ...Fonts.blackColor13Medium,
              }}>
              {`$`}
              {selectedCustomProductAmount.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              updateState({showCustomDialog: false});
              navigation.navigate('Products');
            }}
            style={{
              ...styles.addButtonStyle,
              backgroundColor: '#EEDBD4',
            }}>
            <Text style={{...Fonts.primaryColor16Medium}}>Add</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingTop: Sizes.fixPadding * 2.0,
            paddingHorizontal: Sizes.fixPadding * 2.0,
          }}>
          {customiseOptions.map(item => (
            <View key={`${item.id}`} style={styles.customiseOptionWrapStyle}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => updateProductCustomise({id: item.id})}
                  style={{
                    ...styles.checkBoxStyle,
                    backgroundColor: item.isSelected
                      ? Colors.primaryColor
                      : Colors.bodyBackColor,
                  }}>
                  {item.isSelected ? (
                    <MaterialIcons
                      name="check"
                      color={Colors.whiteColor}
                      size={17}
                    />
                  ) : null}
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 1,
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.blackColor14SemiBold,
                  }}>
                  {item.option}
                </Text>
              </View>
              <Text style={{...Fonts.blackColor14SemiBold}}>
                {`$`}
                {item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </Dialog.Container>
    );
  }

  function categoriesListInfo() {
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: Sizes.fixPadding * 2.0,
            paddingLeft: Sizes.fixPadding * 2.0,
          }}>
          {categoriesList.map((item, index) => (
            <View
              key={`${index}`}
              style={{
                marginRight: Sizes.fixPadding * 2.0,
                alignItems: 'center',
              }}>
              {selectedCategory == item ? (
                <View style={styles.selectedCategoryWrapStyle}>
                  <Text style={{...Fonts.blackColor14SemiBold}}>{item}</Text>
                </View>
              ) : (
                <Text
                  onPress={() => updateState({selectedCategory: item})}
                  style={{...Fonts.grayColor14Medium}}>
                  {item}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <MaterialIcons
            name="arrow-back"
            color={Colors.blackColor}
            size={22}
            onPress={() => navigation.pop()}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: Sizes.fixPadding - 5.0,
              flex: 1,
              ...Fonts.blackColor15Medium,
            }}>
            {restaurant?.name}
          </Text>
        </View>
        {/* <MaterialIcons
                    name="search"
                    color={Colors.blackColor}
                    size={22}
                /> */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    margin: Sizes.fixPadding * 2.0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCategoryWrapStyle: {
    backgroundColor: '#DEE2EB',
    borderRadius: Sizes.fixPadding * 1.5,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 3.0,
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
  foodInfoWrapStyle: {
    borderRadius: Sizes.fixPadding,
    elevation: 2.0,
    padding: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizes.fixPadding + 10.0,
  },
  viewCartButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  forCartData: state.cart.forCartData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FoodOfDifferentCategoriesScreen);
