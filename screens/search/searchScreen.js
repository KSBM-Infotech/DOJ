import React, {useState} from 'react';
import {
  SafeAreaView,
  Dimensions,
  View,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Input, Icon} from '@rneui/themed';
import Dialog from 'react-native-dialog';
import axios from 'axios';
import {api_url, customer_food_search} from '../../constants/api';

const {width} = Dimensions.get('window');

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

const popularItemsList = [
  {
    id: '1',
    foodImage: require('../../assets/images/food/food12.png'),
    foodName: 'Veg Sandwich',
    amount: 6.0,
    customizable: true,
  },
  {
    id: '2',
    foodImage: require('../../assets/images/food/food12.png'),
    foodName: 'Veg Sandwich',
    amount: 6.0,
    customizable: true,
  },
  {
    id: '3',
    foodImage: require('../../assets/images/food/food12.png'),
    foodName: 'Veg Sandwich',
    amount: 6.0,
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
    foodImage: require('../../assets/images/food/food12.png'),
    foodName: 'Veg Sandwich',
    amount: 6.0,
    customizable: true,
  },
  {
    id: '6',
    foodImage: require('../../assets/images/food/food13.png'),
    foodName: 'Burger',
    amount: 12.0,
    customizable: false,
  },
  {
    id: '7',
    foodImage: require('../../assets/images/food/food13.png'),
    foodName: 'Burger',
    amount: 12.0,
    customizable: false,
  },
];


const SearchScreen = ({navigation}) => {
  const [state, setState] = useState({
    search: null,
    showCustomDialog: false,
    customiseOptions: customiseOptionsList,
    selectedCustomProductName: null,
    selectedCustomProductAmount: 0,
    isLoading: false,
    searchedData: null,
  });

  let searchTimeout;

  const updateState = data => setState(state => ({...state, ...data}));

  const search_items = async text => {
    console.log(text)
    updateState({isLoading: true});
    updateState({search: text})
    await axios({
      method: 'post',
      url: api_url + customer_food_search,
      data: {
        search: text,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        console.log(res.data);
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const handleTextChange = (text)=>{
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(()=>{
        search_items(text)
    }, 5000)
  }
  

  const {
    search,
    showCustomDialog,
    customiseOptions,
    selectedCustomProductName,
    selectedCustomProductAmount,
    isLoading,
    searchedData,
  } = state;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{flex: 1}}>
        {header()}
        {searchField()}
        {popularItemsInfo()}
      </View>
      {customDialog()}
    </SafeAreaView>
  );

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
        onRequestClose={() => {
          updateState({showCustomDialog: false});
        }}
        onBackdropPress={() => updateState({showCustomDialog: false})}>
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
              navigation.push('Products');
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

  function popularItemsInfo() {
    const renderItem = ({item}) => (
      <View style={styles.popularItemsWrapStyle}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={item.foodImage}
            style={{
              width: width * 0.2,
              height: width * 0.2,
              borderRadius: Sizes.fixPadding - 5.0,
            }}
          />
          <View style={{flex: 1, marginLeft: Sizes.fixPadding}}>
            <Text style={{...Fonts.blackColor14SemiBold}}>{item.foodName}</Text>
            <Text
              style={{
                marginVertical: Sizes.fixPadding - 7.0,
                ...Fonts.blackColor12SemiBold,
              }}>
              {`$`}
              {item.amount.toFixed(2)}
            </Text>
            {item.customizable ? (
              <Text style={{...Fonts.primaryColor14Medium}}>Customise</Text>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            item.customizable
              ? updateState({
                  selectedCustomProductName: item.foodName,
                  selectedCustomProductAmount: item.amount,
                  showCustomDialog: true,
                })
              : navigation.push('Products');
          }}
          style={{...styles.addButtonStyle, backgroundColor: '#FFECE5'}}>
          <Text style={{...Fonts.primaryColor16Medium}}>Add</Text>
        </TouchableOpacity>
      </View>
    );
    return (
      <View style={{flex: 1}}>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginVertical: Sizes.fixPadding + 5.0,
            ...Fonts.blackColor16SemiBold,
          }}>
          Popular Items
        </Text>
        <View style={{flex: 1}}>
          {searchedData == null ? (
            <Text style={{...Fonts.blackColor15Medium, textAlign: 'center'}}>Search any thing</Text>
          ) : (
            <FlatList
              data={searchedData}
              keyExtractor={item => `${item.id}`}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: Sizes.fixPadding * 2.0,
              }}
            />
          )}
        </View>
      </View>
    );
  }

  function searchField() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2.0}}>
        <Input
        //   value={search}
          onChangeText={text => handleTextChange(text)}
          placeholder="Fast food..."
          placeholderTextColor={Colors.grayColor}
          selectionColor={Colors.primaryColor}
          leftIcon={<Icon name="search" size={18} color={Colors.grayColor} />}
          style={{...Fonts.blackColor13Medium}}
          inputStyle={{marginLeft: Sizes.fixPadding}}
          inputContainerStyle={{borderBottomWidth: 0.0, height: 50.0}}
          containerStyle={styles.searchFieldStyle}
        />
        <Text style={{...Fonts.grayColor10Medium}}>
          (ex. pizza,abc restro, etc...)
        </Text>
      </View>
    );
  }

  function header() {
    return (
      <MaterialIcons
        name="arrow-back"
        size={22}
        color={Colors.blackColor}
        onPress={() => navigation.goBack()}
        style={{margin: Sizes.fixPadding * 2.0}}
      />
    );
  }
};

const styles = StyleSheet.create({
  searchFieldStyle: {
    height: 50.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    elevation: 8.0,
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

export default SearchScreen;
