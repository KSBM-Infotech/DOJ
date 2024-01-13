import {View, Text, FlatList, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {Colors, Fonts, Sizes} from '../constants/styles';
import {Image} from 'react-native';
import * as SearchActions from '../redux/actions/SearchActions';
import {connect} from 'react-redux';


const DiningSearch = ({navigation, dispatch, diningSearchData}) => {
  useEffect(() => {
    navigation.addListener('focus', () => {
      dispatch(SearchActions.setSearchType('dining'));
    });
  }, [diningSearchData]);
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
            source={{uri: item.restaurant_img}}
            style={{width: 55, height: 55, borderRadius: Sizes.fixPadding}}
          />
          <View style={{marginLeft: Sizes.fixPadding}}>
            <Text style={{...Fonts.blackColor15Medium}}>{item.name}</Text>
            <Text
                numberOfLines={1}
              style={{
                ...Fonts.blackColor13Medium,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              {item.description}
            </Text>
          </View>
        </View>
      );
    };
    return (
        <>
        {
            diningSearchData &&  <FlatList
            data={diningSearchData}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}`}
          />
        }
        </>
     
    );
  }
};

const mapStateToProps = state =>({
    diningSearchData: state.search.diningSearchData
})

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(DiningSearch);
