import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { createRef, useRef, useState } from "react";
import { Colors, Fonts, Sizes } from "../constants/styles";
import { Input } from "@rneui/themed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Icon } from "@rneui/themed";
import { SharedElement } from "react-navigation-shared-element";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Image } from "react-native";
import Key from "../constants/key";
import { connect } from "react-redux";
import * as UserActions from "../redux/actions/CustomerActions";

const { width } = Dimensions.get("window");

const nearByRestaurantsList = [
  {
    id: "1",
    restaurantName: "Home",
    ratedPeopleCount: 198,
    restaurantAddress: "1124, Old Chruch Street, New york, USA",
    rating: 4.3,
  },
  {
    id: "2",
    restaurantName: "Office",
    ratedPeopleCount: 170,
    restaurantAddress: "1124, Old Chruch Street, New york, USA",
    rating: 4.0,
  },
];

const SelectAddress = (props) => {
  const [searchText, setSearchText] = useState("");

  const getLocationData = (data, details) => {
    let a = {
      state: data?.terms[data.terms.length - 1]?.value,
      city: data?.terms[data.terms.length - 2]?.value,
      currentLocation: data.description,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }
    props.dispatch(UserActions.isLocationDefined(true));
    props.dispatch(UserActions.setLocation(a))
    props.navigation.goBack()
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      {header()}
      <View style={{ flex: 1, backgroundColor: Colors.grayColor1 }}>
        <FlatList
          ListHeaderComponent={
            <>
              {searchField()}
              {locationButton()}
              {savedAddress()}
              {nearByLocation()}
            </>
          }
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 6.0 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

  function header() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Sizes.fixPadding * 1.5,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 0, flexDirection: "row", alignItems: "center" }}>
          <Icon
            name="chevron-down-outline"
            type="ionicon"
            color={Colors.grayColor}
            size={22}
          />
        </View>
        <View
          style={{ flex: 0.75, flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ ...Fonts.blackColor15Medium }}>Select a Location</Text>
        </View>
      </View>
    );
  }

  function searchField() {
    const myRef = useRef(null);
    return (
      <KeyboardAvoidingView>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            alignItems: "flex-start",
            marginHorizontal: Sizes.fixPadding * 2,
            backgroundColor: Colors.whiteColor,
            elevation: 8,
            shadowColor: Colors.grayColor,
            marginVertical: Sizes.fixPadding,
            justifyContent: 'space-around',
            paddingLeft: Sizes.fixPadding
          }}
        >
          <MaterialIcons name="search" color={Colors.primaryColor} size={18} style={{marginTop: Sizes.fixPadding*1.5}} />
          <GooglePlacesAutocomplete
            ref={myRef}
            placeholder="Enter location, area, city etc."
            styles={{
              container: {
                flex: 1,
                // backgroundColor: 'red',
                margin: 0,
                padding: 0
              },
              textInputContainer: {
                width: "100%",
                alignSelf: "center",
                margin: 0,
                padding: 0
              },
              textInput: {
                ...Fonts.grayColor13Medium,
              },
              poweredContainer: {
                height: 0,
              },
              powered: {
                height: 0,
              },
              separator: {
                backgroundColor: Colors.grayColor,
                height: 1,
              },
              row: {
                // flex: 1,
                // backgroundColor: "#F4F4FE",
                //flexDirection: 'row',
              },
              listView: {
                // marginTop: 30,
              },
            }}
            currentLocation={true}
            currentLocationLabel="Current location"
            enableHighAccuracyLocation={true}
            fetchDetails={true}
            listViewDisplayed="auto"
            nearbyPlacesAPI="GooglePlacesSearch"
            returnKeyType={"default"}
            keyboardShouldPersistTaps="always"
            isRowScrollable={false}
            enablePoweredByContainer={false}
            keepResultsAfterBlur={true}
            onFail={(error) => console.error(error)}
            onPress={(data, details = null) => {
              getLocationData(data, details);
            }}
            textInputProps={() => <Input />}
            renderRow={(rowData) => {
              const title = rowData.structured_formatting.main_text;
              const address = rowData.structured_formatting.secondary_text;
              return (
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      ...Fonts.blackColor13Medium
                    }}
                  >
                    {title}
                  </Text>
                  <Text
                    style={{
                     ...Fonts.grayColor13Medium
                    }}
                  >
                    {address}
                  </Text>
                </View>
              );
            }}
            GooglePlacesDetailsQuery={{ fields: "geometry" }}
            query={{
              key: Key.google_map_key,
              language: "en",
              // location: props?.route?.params?.currentLocation,
              radius: "10",
              region: "in",
              types: "establishment",
            }}
            GooglePlacesSearchQuery={{
              rankby: "distance",
              type: ["car_dealer", "car_wash", "car_repair", "car_rental"],
            }}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  function locationButton() {
    return (
      <View>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
            justifyContent: "space-between",
            paddingBottom: Sizes.fixPadding,
            borderBottomWidth: 1,
            borderBottomColor: Colors.lightGrayColor,
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("selectLocation")}
          >
            <View
              style={{ flex: 0, flexDirection: "row", alignItems: "center" }}
            >
              <Icon
                name="location-searching"
                type="MaterialIcons"
                color={Colors.primaryColor}
                size={22}
              />
              <View style={{ marginHorizontal: 5 }}>
                <Text style={{ ...Fonts.primaryColor14Medium }}>
                  User current location
                </Text>
                <Text style={{ ...Fonts.grayColor12Regular }}>
                  H-91 Sector 63, Noida....
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ flex: 0, flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="chevron-forward-outline"
              type="ionicon"
              color={Colors.grayColor}
              size={18}
            />
          </View>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: Sizes.fixPadding * 2.0,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("AddNewAddress")}
          >
            <View
              style={{ flex: 0, flexDirection: "row", alignItems: "center" }}
            >
              <Icon
                name="add"
                type="Ionicons"
                color={Colors.primaryColor}
                size={22}
              />
              <View style={{ marginHorizontal: 5 }}>
                <Text style={{ ...Fonts.primaryColor14Medium }}>
                  Add Address
                </Text>
                <Text style={{ ...Fonts.grayColor12Regular }}>
                  H-91 Sector 63, Noida....
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ flex: 0, flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="chevron-forward-outline"
              type="ionicon"
              color={Colors.grayColor}
              size={18}
            />
          </View>
        </View>
      </View>
    );
  }

  function savedAddress() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          props.navigation.push("RestaurantDetail", { id: item.id })
        }
        style={styles.nearByRestaurantsWrapStyle}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <View style={{ alignItems: "center" }}>
              <MaterialIcons name="home" color={Colors.grayColor} size={22} />
              <Text style={{ ...Fonts.grayColor11Medium }}>15 km</Text>
            </View>
            <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
              <Text style={{ ...Fonts.blackColor12SemiBold }}>
                {item.restaurantName}
              </Text>
              <Text style={{ ...Fonts.grayColor12Medium }}>
                {item.restaurantAddress}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: Sizes.fixPadding * 3,
            marginTop: Sizes.fixPadding,
          }}
        >
          <View
            style={{
              width: 25,
              height: 25,
              borderRadius: 50,
              borderWidth: 0.5,
              borderColor: Colors.grayColor,
              justifyContent: "center",
              alignItems: "center",
              marginRight: Sizes.fixPadding,
            }}
          >
            <MaterialIcons
              name="more-horiz"
              color={Colors.primaryColor}
              size={20}
            />
          </View>
          <View
            style={{
              width: 25,
              height: 25,
              borderRadius: 50,
              borderWidth: 0.5,
              borderColor: Colors.grayColor,
              justifyContent: "center",
              alignItems: "center",
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
          data={nearByRestaurantsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  function nearByLocation() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          props.navigation.push("RestaurantDetail", { id: item.id })
        }
        style={styles.nearByRestaurantsWrapStyle}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <View style={{ alignItems: "center" }}>
              <MaterialIcons
                name="location-on"
                color={Colors.grayColor}
                size={22}
              />
              <Text style={{ ...Fonts.grayColor11Medium }}>15 km</Text>
            </View>

            <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
              <Text style={{ ...Fonts.blackColor12SemiBold }}>
                {item.restaurantName}
              </Text>
              <Text style={{ ...Fonts.grayColor12Medium }}>
                {item.restaurantAddress}
              </Text>
            </View>
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
          <Text style={{ ...Fonts.blackColor15Medium }}>Nearby Location</Text>
        </View>
        <FlatList
          listKey="nearByRestaurants"
          data={nearByRestaurantsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
};

const mapDispatchToProps = dispatch=>({dispatch})

export default connect(null, mapDispatchToProps)(SelectAddress);

const styles = StyleSheet.create({
  textFieldStyle: {
    height: 40.0,
    width: width - 25.0,
    alignSelf: "center",
  },
  textFieldWrapStyle: {
    paddingHorizontal: Sizes.fixPadding,
    elevation: 8.0,
    borderRadius: Sizes.fixPadding * 0.1,
    backgroundColor: Colors.whiteColor,
    borderBottomColor: Colors.whiteColor,
    // borderBottomWidth: 1.0,
    shadowColor: Colors.grayColor,
  },
  nearByRestaurantsWrapStyle: {
    backgroundColor: Colors.whiteColor,
    // borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayColor1,
    // marginBottom: Sizes.fixPadding * 2.0,
  },
  nearByRestaurantsIconWrapStyle: {
    width: 35.0,
    height: 35.0,
    backgroundColor: "#E6E6E6",
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    padding: Sizes.fixPadding - 6.0,
  },
});
