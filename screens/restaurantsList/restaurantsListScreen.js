import React from "react";
import { SafeAreaView, View, StatusBar, Image, TouchableOpacity, FlatList, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SharedElement } from 'react-navigation-shared-element';

const restaurantsList = [
    {
        id: '1',
        restaurantLogo: require('../../assets/images/restaurants_logo/logo1.png'),
        restaurantName: 'Marine Rise Restaurant',
        restaurantAddress: '1124, Chruch Street, New york, USA',
        rating: 4.3,
        distance: '2.5 km',
        foodCategories: 'Fast food,Italian,Chinese',
    },
    {
        id: '2',
        restaurantLogo: require('../../assets/images/restaurants_logo/logo2.png'),
        restaurantName: 'Food Jusction Restaurant',
        restaurantAddress: '1124, Chruch Street, New york, USA',
        rating: 4.1,
        distance: '2.8 km',
        foodCategories: 'Fast food,Italian,Chinese',
    },
    {
        id: '3',
        restaurantLogo: require('../../assets/images/restaurants_logo/logo3.png'),
        restaurantName: 'Seven Star Restaurant',
        restaurantAddress: '1124, Chruch Street, New york, USA',
        rating: 4.0,
        distance: '3.50 km',
        foodCategories: 'Fast food,Italian,Chinese',
    },
    {
        id: '4',
        restaurantLogo: require('../../assets/images/restaurants_logo/logo4.png'),
        restaurantName: 'Hunger Spot',
        restaurantAddress: '1124, Chruch Street, New york, USA',
        rating: 4.0,
        distance: '3.5 km',
        foodCategories: 'Fast food,Italian,Chinese',
    },
    {
        id: '5',
        restaurantLogo: require('../../assets/images/restaurants_logo/logo5.png'),
        restaurantName: 'Fishchef',
        restaurantAddress: '1124, Chruch Street, New york, USA',
        rating: 3.5,
        distance: '4.0 km',
        foodCategories: 'Sea food',
    },
    {
        id: '6',
        restaurantLogo: require('../../assets/images/restaurants_logo/logo6.png'),
        restaurantName: 'Food by Jesica',
        restaurantAddress: '1124, Chruch Street, New york, USA',
        rating: 3.0,
        distance: '4.5 km',
        foodCategories: 'Fast food,Pizza',
    },
    {
        id: '7',
        restaurantLogo: require('../../assets/images/restaurants_logo/logo7.png'),
        restaurantName: 'King Of Foods',
        restaurantAddress: '1124, Chruch Street, New york, USA',
        rating: 2.0,
        distance: '5.0 km',
        foodCategories: 'Chinese Fast food',
    },
    {
        id: '8',
        restaurantLogo: require('../../assets/images/restaurants_logo/logo3.png'),
        restaurantName: 'Seven Star Restaurant',
        restaurantAddress: '1124, Chruch Street, New york, USA',
        rating: 4.0,
        distance: '3.0 km',
        foodCategories: 'Fast food,Italian,Chinese',
    },
];

const RestaurantsListScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                {restaurants()}
            </View>
        </SafeAreaView>
    )

    function restaurants() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('RestaurantDetail', { id: item.id })}
                style={styles.restaurantsWrapStyle}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <SharedElement id={item.id}>
                            <Image
                                source={item.restaurantLogo}
                                style={{ width: 40.0, height: 40.0, borderRadius: Sizes.fixPadding - 5.0, }}
                            />
                        </SharedElement>
                        <View style={{ flex: 1, marginLeft: Sizes.fixPadding, }}>
                            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
                                {item.restaurantName}
                            </Text>
                            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                                {item.foodCategories}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ marginRight: Sizes.fixPadding - 5.0, ...Fonts.primaryColor12SemiBold }}>
                            {item.rating.toFixed(1)}
                        </Text>
                        <MaterialIcons
                            name='star'
                            color={Colors.primaryColor}
                            size={14}
                        />
                    </View>
                </View>
                <View style={{ marginLeft: Sizes.fixPadding - 3.0, marginTop: Sizes.fixPadding - 5.0, flex: 1, flexDirection: 'row', }}>
                    <MaterialIcons
                        name='location-on'
                        color={Colors.primaryColor}
                        size={16}
                    />
                    <Text style={{ flex: 1, marginLeft: Sizes.fixPadding - 5.0, ...Fonts.grayColor13Medium }}>
                        {item.distance} | {item.restaurantAddress}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={restaurantsList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back-ios"
                    color={Colors.blackColor}
                    size={22}
                    onPress={() => navigation.pop()}
                />
                <MaterialIcons
                    name="search"
                    color={Colors.blackColor}
                    size={22}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    restaurantsWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    headerWrapStyle: {
        margin: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default RestaurantsListScreen;