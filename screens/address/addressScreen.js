import React, { useState } from "react";
import { SafeAreaView, View, StatusBar, FlatList, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const addressesList = [
    {
        id: '1',
        addressType: 'Home',
        address: '444, Grove Avenue, Golden Tower Near City Part, Washington DC,United States Of America',
        mobileNo: '+19 1234567890',
    },
    {
        id: '2',
        addressType: 'Office',
        address: 'B441, Old city town, Leminton street Near City Part, Washington DC,United States Of America',
        mobileNo: '+19 1234567890',
    },
];

const AddressScreen = ({ navigation }) => {

    const [state, setState] = useState({
        selectedAddressId: addressesList[0].id,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))


    const {
        selectedAddressId,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.grayColor1 }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <FlatList
                    ListHeaderComponent={
                        <>
                        {addNewAddressInfo()}
                            {/* {addresses()} */}
                            {savedAddress()}
                            
                        </>
                    }
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding, }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    )

    function addNewAddressInfo() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('AddNewAddress')}
                style={styles.addNewAddressInfoWrapStyle}
            >
                 <View style={styles.addAddressIconWrapStyle}>
                    <MaterialIcons
                        name="add"
                        color={Colors.grayColor}
                        size={22}
                    />
                </View>
                <Text style={{ ...Fonts.blackColor15Medium }}>
                    Add New address
                </Text>
               
            </TouchableOpacity>
        )
    }

    function savedAddress() {
        const renderItem = ({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            // onPress={() => props.navigation.push("RestaurantDetail", { id: item.id })}
            style={styles.nearByRestaurantsWrapStyle}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <View style={{alignItems: 'center'}}>
                    <MaterialIcons name="home" color={Colors.grayColor} size={22} />
                    <Text style={{ ...Fonts.grayColor11Medium }}>
                      15 km
                    </Text>
                    </View>
                <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
                  <Text style={{ ...Fonts.blackColor12SemiBold }}>
                    {item.addressType}
                  </Text>
                  <Text style={{ ...Fonts.grayColor12Medium }}>
                    {item.address}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', marginLeft: Sizes.fixPadding*3, marginTop: Sizes.fixPadding}}> 
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 50,
                  borderWidth: 0.5,
                  borderColor: Colors.grayColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: Sizes.fixPadding,
                  elevation: 5,
                  backgroundColor: Colors.whiteColor,
                  shadowColor: Colors.grayColor
                }}
              >
                <MaterialIcons name="more-horiz" color={Colors.primaryColor} size={20} />
              </View>
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 50,
                  borderWidth: 0.5,
                  borderColor: Colors.grayColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                  backgroundColor: Colors.whiteColor,
                  shadowColor: Colors.grayColor
                }}
              >
                <MaterialIcons name="share" color={Colors.primaryColor} size={20} />
              </View>
            </View>
          </TouchableOpacity>
        );
        return (
          <View>
            <View
              style={{
                marginBottom: Sizes.fixPadding,
                marginTop: Sizes.fixPadding * 2.0,
                marginHorizontal: Sizes.fixPadding * 2.0,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ ...Fonts.blackColor15Medium }}>Saved Address</Text>
            </View>
            <FlatList
              listKey="nearByRestaurants"
              data={addressesList}
              keyExtractor={(item) => `${item.id}`}
              renderItem={renderItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      }

    function addresses() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ selectedAddressId: item.id })}
                style={styles.addressWrapStyle}
            >
                <View style={styles.addressTypeWrapStyle}>
                    <Text style={{ ...Fonts.blackColor16SemiBold }}>
                        {item.addressType}
                    </Text>
                    <View style={styles.radioButtonOuterStyle}>
                        {
                            selectedAddressId == item.id
                                ?
                                <View
                                    style={styles.radioButtonInnerStyle}
                                />
                                :
                                null
                        }
                    </View>
                </View>
                <View style={{ padding: Sizes.fixPadding, }}>
                    <Text style={{ ...Fonts.blackColor13Light }}>
                        {item.address}
                    </Text>
                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.blackColor13SemiBold }}>
                        {item.mobileNo}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <View>
                <FlatList
                    data={addressesList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back-ios"
                    color={Colors.blackColor}
                    size={20}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ ...Fonts.blackColor15Medium,marginTop: Sizes.fixPadding }}>
                    My Address
                </Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    headerWrapStyle: {
        margin: Sizes.fixPadding * 2.0,
        // flexDirection: 'row',
        // alignItems: 'center',
    },
    addressWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    addressTypeWrapStyle: {
        backgroundColor: '#ECECEC',
        padding: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    radioButtonOuterStyle: {
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        width: 16.0,
        height: 16.0,
        borderRadius: 8.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioButtonInnerStyle: {
        width: 10.0,
        height: 10.0,
        borderRadius: 5.0,
        backgroundColor: Colors.primaryColor
    },
    addNewAddressInfoWrapStyle: {
        // backgroundColor: '#E0E1E6',
        // borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding + 5.0,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.grayColor
    },
    addAddressIconWrapStyle: {
        width: 24.0,
        height: 24.0,
        borderRadius: 8.0,
        // backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Sizes.fixPadding
    },
    proceedToCheckoutButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 2.0,
        margin: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(255, 66, 0, 0.3)',
        borderWidth: 1.0,
        elevation: 1.0,
        shadowColor: Colors.primaryColor,
    },
    nearByRestaurantsWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayColor1,
        marginBottom: Sizes.fixPadding * 2.0,
        elevation: 8,
        shadowColor: Colors.grayColor
      },
      nearByRestaurantsIconWrapStyle: {
        width: 35.0,
        height: 35.0,
        backgroundColor: "#E6E6E6",
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: "center",
        justifyContent: "center",
        padding: Sizes.fixPadding - 6.0,
        elevation: 5
      },
});

export default AddressScreen;