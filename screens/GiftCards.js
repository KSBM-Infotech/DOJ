import {
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors, Fonts, Sizes} from '../constants/styles';
import {RawButton, ScrollView} from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {api_url, get_gift} from '../constants/api';

const PAGE_WIDTH = Dimensions.get('window').width;

const {width, height} = Dimensions.get('window');

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const filterData = [
  {id: 1, name: 'All'},
  {id: 2, name: 'Independence day'},
  {id: 3, name: 'Birthday'},
  {id: 4, name: 'Aniversary'},
  {id: 5, name: 'Party'},
];

const bannerData = [
  {id: 1, image: require('../assets/images/food/food1.png')},
  {id: 2, image: require('../assets/images/food/food2.png')},
  {id: 3, image: require('../assets/images/food/food3.png')},
  {id: 4, image: require('../assets/images/food/food4.png')},
];

const offerData = [
  {
    id: 1,
    amount: '1000',
    popular: false,
    is_off: false,
    off_percentage: '0',
  },
  {
    id: 2,
    amount: '2000',
    popular: true,
    is_off: false,
    off_percentage: '0',
  },
  {
    id: 3,
    amount: '5000',
    popular: false,
    is_off: true,
    off_percentage: '3% OFF',
  },
  {
    id: 4,
    amount: '0',
    popular: false,
    is_off: false,
    off_percentage: '0',
  },
];

const GiftCards = ({navigation}) => {
  const [state, setState] = useState({
    selectedAmout: 2,
    amount: '2000',
    isLoading: false,
    amountData: null,
    cardData: null,
    bannerData: null,
    filterId: null,
    description: '',
    selectedBanner: null,
    selectedCard: null
  });
  const progressValue = useSharedValue(0);

  useEffect(() => {
    get_gift_cards();
  }, []);

  const get_gift_cards = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'get',
      url: api_url + get_gift,
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data?.status) {
          updateState({
            cardData: res.data.data.gift_cart,
            amountData: res.data.data.amount,
            bannerData: res.data.data.gift_cart[0].images,
            filterId: res.data.data.gift_cart[0].id,
            description: res.data.data.gift_cart[0].description,
            selectedBanner: res.data.data.gift_cart[0].images[0],
            selectedCard: res.data.data.gift_cart[0]
          });
        }
        // console.log(res.data);
      })
      .catch(err => {
        updateState({isLoading: false});
      });
  };

  const updateState = data => setState({...state, ...data});

  // console.log(cardData)

  const {
    selectedAmout,
    amount,
    isLoading,
    amountData,
    cardData,
    bannerData,
    filterId,
    description,
    selectedBanner,
    selectedCard
  } = state;
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <StatusBar backgroundColor={Colors.whiteColor} barStyle="dark-content" />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {header()}
              {cardData && showFilters()}
              {cardData && showBanners()}
              {cardData && showMessageInfo()}
              {showChooseAmountInfo()}
              {showAddMessageInfo()}
              {showBottomButton()}
            </>
          }
        />
      </View>
    </View>
  );

  function showBottomButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('giftCardPurchase', {
            cardData: selectedCard,
            image: selectedBanner,
            amount:
              offerData[selectedAmout].amount != 0
                ? offerData[selectedAmout].amount
                : amount,
            description: description
          })
        }
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          paddingVertical: Sizes.fixPadding,
          backgroundColor: Colors.primaryColor,
          marginVertical: Sizes.fixPadding * 2,
          borderRadius: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.whiteColor15Medium, textAlign: 'center'}}>
          Continue
        </Text>
      </TouchableOpacity>
    );
  }

  function showAddMessageInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 1.5}}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          <View
            style={{
              width: '20%',
              height: 0.5,
              backgroundColor: Colors.grayColor,
            }}
          />
          <Text style={{...Fonts.grayColor13Medium}}>
            ADD MESSAGE (OPTIONAL)
          </Text>
          <View
            style={{
              width: '20%',
              height: 0.5,
              backgroundColor: Colors.grayColor,
            }}
          />
        </View>
        <TextInput
          placeholder="Happy Independence Day!"
          value={description}
          placeholderTextColor={Colors.blackColor}
          onChangeText={text => updateState({description: text})}
          multiline
          style={{
            textAlignVertical: 'top',
            backgroundColor: Colors.whiteColor,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 2,
            height: 150,
            ...Fonts.blackColor13Medium,
          }}
        />
      </View>
    );
  }

  function showChooseAmountInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            updateState({selectedAmout: index});
          }}
          style={{
            flex: 0,
            width: width * 0.19,
            height: width * 0.16,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            marginRight: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            backgroundColor:
              selectedAmout == index
                ? Colors.blueColor + '20'
                : Colors.whiteColor,
            borderColor:
              selectedAmout == index
                ? Colors.blueColor + '80'
                : Colors.blackColor,
          }}>
          <Text style={{...Fonts.blackColor11SemiBold}}>
            {item.amount != '0' ? `₹${item.amount}` : 'Custome'}
          </Text>
          {item.popular && (
            <LinearGradient
              colors={['#4e54c8', '#ACB6E5']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{position: 'absolute', bottom: 0, width: '100%'}}>
              <Text
                style={{...Fonts.whiteColor10SemiBold, textAlign: 'center'}}>
                POPULAR
              </Text>
            </LinearGradient>
          )}
          {item.is_off && (
            <LinearGradient
              colors={['#74ebd5', '#ACB6E5']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{position: 'absolute', bottom: 0, width: '100%'}}>
              <Text
                style={{...Fonts.whiteColor10SemiBold, textAlign: 'center'}}>
                {item.off_percentage}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginBottom: Sizes.fixPadding * 2,
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          <View
            style={{
              width: '28%',
              height: 0.5,
              backgroundColor: Colors.grayColor,
            }}
          />
          <Text style={{...Fonts.grayColor13Medium}}>CHOOSE AMOUNT</Text>
          <View
            style={{
              width: '28%',
              height: 0.5,
              backgroundColor: Colors.grayColor,
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: Colors.whiteColor,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 2,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.blackColor14SemiBold}}>
              Gift card amount
            </Text>
            <Text style={{...Fonts.blackColor14SemiBold}}>
              ₹
              {offerData[selectedAmout].amount != '0'
                ? offerData[selectedAmout].amount
                : amount}
            </Text>
          </View>
          <Text
            style={{
              ...Fonts.grayColor12Medium,
              marginBottom: Sizes.fixPadding * 1.5,
            }}>
            Up to 3% off above ₹5000
          </Text>
          {selectedAmout != 3 ? (
            <FlatList
              data={offerData}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginBottom: Sizes.fixPadding}}
            />
          ) : (
            <View
              style={{
                flex: 0,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Sizes.fixPadding,
              }}>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                  updateState({selectedAmout: 1});
                }}
                style={{
                  flex: 0,
                  width: width * 0.19,
                  height: width * 0.16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  // marginLeft: Sizes.fixPadding,
                  borderRadius: Sizes.fixPadding,
                  overflow: 'hidden',
                  backgroundColor: Colors.blueColor + '20',
                  borderColor: Colors.blueColor + '80',
                }}>
                <Text style={{...Fonts.blackColor11SemiBold}}>{'Custome'}</Text>
              </TouchableOpacity>
              <View
                style={{
                  flex: 0,
                  width: width * 0.5,
                  height: '100%',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginLeft: Sizes.fixPadding,
                }}>
                <Text style={{...Fonts.grayColor13Medium}}>₹</Text>
                <View style={{width: '90%'}}>
                  <TextInput
                    placeholder="Enter amount"
                    placeholderTextColor={Colors.grayColor}
                    keyboardType="number-pad"
                    onChangeText={text => updateState({amount: text})}
                    style={{
                      width: '100%',
                      height: 20,
                      padding: 0,
                      marginLeft: Sizes.fixPadding * 0.5,
                      ...Fonts.blackColor13Medium,
                      borderBottomWidth: 0.5,
                      borderBottomColor: Colors.grayColor,
                    }}
                  />
                  {parseInt(amount) < 250 || parseInt(amount) > 10000 ? (
                    <View
                      style={{
                        width: '100%',
                        marginTop: Sizes.fixPadding * 0.5,
                      }}>
                      <Text
                        style={{...Fonts.primaryColor11SemiBold, fontSize: 9}}>
                        Amount should be between ₹250 and ₹10,000
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('giftCardPurchase', {
                    cardData: cardData,
                    image: selectedBanner,
                    amount:
                      offerData[selectedAmout].amount != 0
                        ? offerData[selectedAmout].amount
                        : amount,
                    description: description,
                  })
                }
                style={{
                  width: width * 0.19,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{...Fonts.primaryColor14Medium}}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  function showMessageInfo() {
    return (
      <View style={{marginBottom: Sizes.fixPadding * 2}}>
        <Text style={{...Fonts.grayColor13Medium, textAlign: 'center'}}>
          swipe to choose card
        </Text>
      </View>
    );
  }

  function showBanners() {
    // const ref = React.useRef(null);
    const baseOptions = {
      vertical: false,
      width: PAGE_WIDTH,
      height: PAGE_WIDTH / 2,
    };

    const renderItem = ({index}) => {
      return (
        <View
          style={{
            width: width * 0.9,
            height: 200,
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding * 2,
            padding: Sizes.fixPadding * 0.5,
          }}>
          <Image
            source={{uri: bannerData[index].image_path}}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: Sizes.fixPadding * 2,
            }}
          />
        </View>
      );
    };

    return (
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <Carousel
          {...baseOptions}
          loop
          // ref={ref}
          testID={'xxx'}
          style={{width: '100%', marginBottom: Sizes.fixPadding}}
          //   autoPlay={true}
          autoPlayInterval={4000}
          onProgressChange={(_, absoluteProgress) =>
            (progressValue.value = absoluteProgress)
          }
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.8,
            parallaxScrollingOffset: 100,
          }}
          data={bannerData}
          pagingEnabled={true}
          onSnapToItem={index =>
            updateState({selectedBanner: bannerData[index]})
          }
          renderItem={renderItem}
        />
      </SafeAreaView>
    );
  }

  function showFilters() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => {
            updateState({
              bannerData: item.images,
              filterId: item.id,
              description: item.description,
              selectedCard:item,
            });
          }}
          style={{
            marginHorizontal: Sizes.fixPadding,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 100,
            backgroundColor:
              item.id == filterId ? Colors.blackColor : Colors.whiteColor,
          }}>
          <Text
            style={
              item.id == filterId
                ? {...Fonts.whiteColor12SemiBold}
                : {...Fonts.blackColor12SemiBold}
            }>
            {item.title}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <FlatList
          data={cardData}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => `${item.id}`}
          style={{marginVertical: Sizes.fixPadding}}
        />
      </View>
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
          backgroundColor: Colors.whiteColor,
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
          Gift Cards
        </Text>
      </View>
    );
  }
};

export default GiftCards;
