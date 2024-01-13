import {View, Text, FlatList, StatusBar} from 'react-native';
import React, { useEffect } from 'react';
import {Colors, Fonts, Sizes} from '../constants/styles';
import {Image} from 'react-native';
import {connect} from 'react-redux';
import * as SearchActions from '../redux/actions/SearchActions';

const searchedData = [
  {
    id: 1,
    image: require('../assets/images/food/food1.png'),
    title: 'This & That Cage',
    type: 'Dish',
  },
  {
    id: 2,
    image: require('../assets/images/food/food2.png'),
    title: 'This & That Cage',
    type: 'Dish',
  },
  {
    id: 3,
    image: require('../assets/images/food/food3.png'),
    title: 'This & That Cage',
    type: 'Mayur Vihar Phase 1',
  },
  {
    id: 4,
    image: require('../assets/images/food/food4.png'),
    title: 'This & That Cage',
    type: 'Mayur Vihar Phase 1',
  },
];

const DeliverySearch = ({navigation, deliverySearchData, dispatch}) => {
    useEffect(() => {
        navigation.addListener('focus', () => {
          dispatch(SearchActions.setSearchType('delivery'));
        });
        return ()=>{

        }
      }, [deliverySearchData]);
  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <StatusBar
        backgroundColor={Colors.primaryColor}
        barStyle={'light-content'}
      />
      <FlatList
        ListHeaderComponent={<>{showSearched()}</>}
        contentContainerStyle={{padding: Sizes.fixPadding * 2}}
      />
    </View>
  );
  function showSearched() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Sizes.fixPadding * 2,
          }}>
          <Image
            source={{uri: item.food_img}}
            style={{width: 55, height: 55, borderRadius: Sizes.fixPadding}}
          />
          <View style={{marginLeft: Sizes.fixPadding}}>
            <Text style={{...Fonts.blackColor15Medium}}>{item.name}</Text>
            <Text
              style={{
                ...Fonts.grayColor13Medium,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              {item.type}
            </Text>
          </View>
        </View>
      );
    };
    return (
      <>
        {deliverySearchData && (
          <FlatList
            data={deliverySearchData}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}`}
          />
        )}
      </>
    );
  }
};

const mapStateToProps = state => ({
  deliverySearchData: state.search.deliverySearchData,
});

const mapDispatchToProps = dispatch =>({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(DeliverySearch);
