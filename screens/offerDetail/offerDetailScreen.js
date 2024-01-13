import React, { useState } from "react";
import { SafeAreaView, View, Dimensions, Image, ScrollView, TouchableOpacity, TextInput, StatusBar, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SharedElement } from 'react-navigation-shared-element';

const { height } = Dimensions.get('window');

const OfferDetailScreen = ({ navigation, route }) => {

    const item = route.params.item;

    const [state, setState] = useState({
        note: null,
        currentItemCount: 1,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        note,
        currentItemCount,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent backgroundColor={'transparent'} />
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}
                >
                    {header()}
                    {foodInfo()}
                    {offersInfo()}
                </ScrollView>
                {addToOrderButtonAndItemCountInfo()}
            </View>
        </SafeAreaView>
    )

    function addToOrderButtonAndItemCountInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center' }}>
                {itemCountInfo()}
                {addToOrderButton()}
            </View>
        )
    }

    function addToOrderButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.addToOrderButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18Bold }}>
                    Add to Order
                </Text>
            </TouchableOpacity>
        )
    }

    function itemCountInfo() {
        return (
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        currentItemCount > 0
                            ?
                            updateState({ currentItemCount: currentItemCount - 1 })
                            :
                            null
                    }}
                    style={styles.addRemoveIconWrapStyle}
                >
                    <MaterialIcons
                        name="remove"
                        color={Colors.whiteColor}
                        size={15}
                    />
                </TouchableOpacity>
                <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.blackColor16SemiBold }}>
                    {currentItemCount}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => updateState({ currentItemCount: currentItemCount + 1 })}
                    style={styles.addRemoveIconWrapStyle}
                >
                    <MaterialIcons
                        name="add"
                        color={Colors.whiteColor}
                        size={15}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function offersInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding + 5.0, ...Fonts.blackColor16SemiBold }}>
                    Offers
                </Text>
                <Text style={{ ...Fonts.grayColor12Regular }}>
                    Buy 2 pizza and get 1 medium size burger free with free home delivery!!
                </Text>
                <TextInput
                    value={note}
                    onChangeText={(text) => updateState({ note: text })}
                    placeholder="Add a note (Extra souce,no olive oil etc...)"
                    placeholderTextColor={Colors.blackColor}
                    style={styles.noteFieldStyle}
                    selectionColor={Colors.primaryColor}
                />
            </View>
        )
    }

    function foodInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, }}>
                <View style={{ flexDirection: 'row', }}>
                    <Text numberOfLines={2} style={{ flex: 1, ...Fonts.blackColor16SemiBold }}>
                        {
                            item.foodName ?
                                item.foodName
                                :
                                'Chicken italian cheezy periperi pizza'
                        }
                    </Text>
                    <View style={{ flex: 0.5, alignItems: 'flex-end', alignSelf: 'center' }}>
                        <View style={{ borderColor: Colors.redColor, ...styles.vegOrnonVegIconOuterStyle }}>
                            <View style={{ ...styles.vegOrnonVegIconInnerStyle, backgroundColor: Colors.redColor }} />
                        </View>
                    </View>
                </View>
                <Text style={{ marginTop: Sizes.fixPadding + 5.0, ...Fonts.grayColor12Regular }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={{ height: height / 5.0, }}>
                <SharedElement id={item.id}>
                    <Image
                        source={
                            item.foodImage
                                ?
                                item.foodImage
                                :
                                require('../../assets/images/food/food11.png')
                        }
                        style={{ width: '100%', height: '100%', }}
                    />
                </SharedElement>
                <View style={styles.headerWrapStyle}>
                    <MaterialIcons
                        name="arrow-back-ios"
                        color={Colors.whiteColor}
                        size={22}
                        onPress={() => navigation.pop()}
                    />
                    <Text style={{ alignSelf: 'flex-end', ...Fonts.whiteColor18Bold }}>
                        14.99$
                    </Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    headerWrapStyle: {
        justifyContent: 'space-between',
        position: 'absolute',
        right: 20.0,
        left: 20.0,
        bottom: 20.0,
        top: StatusBar.currentHeight + Sizes.fixPadding * 2.0,
    },
    vegOrnonVegIconOuterStyle: {
        width: 15.0,
        height: 15.0,
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    vegOrnonVegIconInnerStyle: {
        width: 8.0,
        height: 8.0,
        borderRadius: 4.0,
    },
    noteFieldStyle: {
        ...Fonts.blackColor13Medium,
        borderBottomColor: Colors.grayColor,
        borderBottomWidth: 1.0,
        marginVertical: Sizes.fixPadding,
    },
    addRemoveIconWrapStyle: {
        width: 22.0,
        height: 22.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
    },
    addToOrderButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 2.0,
        marginLeft: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderColor: 'rgba(255, 66, 0, 0.3)',
        borderWidth: 1.0,
        elevation: 1.0,
        shadowColor: Colors.primaryColor,
    }
});

export default OfferDetailScreen;