import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  Platform,
} from "react-native";
import { Colors, Fonts, Sizes } from "../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SharedElement } from "react-navigation-shared-element";
import { Snackbar } from "react-native-paper";
import { connect } from "react-redux";

const { width } = Dimensions.get("window");

const ProfileActivity = ({ navigation, route, customerData }) => {
  const id = route.params.id;

  const [isFavorite, setisFavorite] = useState(false);

  const [showSnackBar, setshowSnackBar] = useState(false);

  const [reviewORPhoto, setReviewORPhoto] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            {
              // paddingTop: StatusBar.currentHeight + Sizes.fixPadding * (Platform.OS=='android'?2.0: 3.0),
            }
          }
        >
          {header()}
          {profilePhoto()}
          <View style={{ top: -30 }}>
            {followerFollowing()}
            {stateLocation()}
            {optionalButtons()}
            {bookingButton()}
            {reviewPhoto()}
            {
                reviewORPhoto ? reviewRender() :renderPhoto()
            }
            {orderFoodNowButton()}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  function orderFoodNowButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push("FoodOfDifferentCategories")}
        style={styles.orderFoodNowButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor15Medium }}>Add Review</Text>
      </TouchableOpacity>
    );
  }

  function reviewPhoto() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}
      >
        <TouchableOpacity
          onPress={() => setReviewORPhoto(true)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: !reviewORPhoto
              ? Colors.whiteColor
              : Colors.primaryColor,
            marginRight: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor13Medium }}>Review</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setReviewORPhoto(false)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: reviewORPhoto
              ? Colors.whiteColor
              : Colors.primaryColor,
            marginRight: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor13Medium }}>Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderPhoto(){
    return(
        <View style={{marginHorizontal: Sizes.fixPadding*2, marginBottom: Sizes.fixPadding*2}}>
            <Text style={{...Fonts.grayColor13Medium}}>You haven't upload photo yet.</Text>
        </View>
    )
  }

  function reviewRender(){
    return(
        <View style={{marginHorizontal: Sizes.fixPadding*2, marginBottom: Sizes.fixPadding*2}}>
            <Text style={{...Fonts.grayColor13Medium}}>You haven't written review yet.</Text>
        </View>
    )
  }

  function profilePhoto() {
    return (
      <View style={styles.profilePhotoWrapStyle}>
        <TouchableOpacity
          activeOpacity={1}
        //   onPress={() => setIsBottomSheet(true)}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <SharedElement id={id}>
            <View style={styles.profilePhotoStyle}>
              <Image
                source={{uri:customerData?.profile_photo_url}}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          </SharedElement>
          {/* <View style={styles.addPhotoWrapStyle}>
            <MaterialIcons name="add" size={18} color={Colors.whiteColor} />
          </View> */}
        </TouchableOpacity>
      </View>
    );
  }

  function bookingButton() {
    return (
      <View
        style={{
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: width * 0.13,
            height: width * 0.13,
            backgroundColor: Colors.primaryColor,
            borderRadius: Sizes.fixPadding * 0.3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/icons/Dining.png")}
            style={{
              width: "80%",
              height: "80%",
              tintColor: Colors.whiteColor,
            }}
          />
        </View>
        <Text
          style={{
            ...Fonts.blackColor13Medium,
            marginTop: Sizes.fixPadding * 0.5,
          }}
        >
          My Booking
        </Text>
      </View>
    );
  }

  function stateLocation() {
    return (
      <View style={{ alignSelf: "center", marginTop: Sizes.fixPadding * 2 }}>
        <Text style={{ ...Fonts.blackColor13Medium }}>
          <Ionicons name="location-outline" size={16} /> Delhi
        </Text>
      </View>
    );
  }

  function optionalButtons() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: Sizes.fixPadding * 2,
        }}
      >
        <TouchableOpacity
          style={{
            width: width * 0.25,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding * 0.5,
            borderWidth: 0.5,
            borderColor: Colors.grayColor,
            paddingVertical: Sizes.fixPadding * 0.3,
          }}
        >
          <Text style={{ ...Fonts.blackColor13Medium }}>Add Review</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: width * 0.25,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding * 0.5,
            borderWidth: 0.5,
            borderColor: Colors.grayColor,
            paddingVertical: Sizes.fixPadding * 0.3,
          }}
        >
          <Text style={{ ...Fonts.blackColor13Medium }}>Add Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: width * 0.25,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding * 0.5,
            borderWidth: 0.5,
            borderColor: Colors.grayColor,
            paddingVertical: Sizes.fixPadding * 0.3,
          }}
        >
          <Text style={{ ...Fonts.blackColor13Medium }}>Edit profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function followerFollowing() {
    return (
      <View>
        <Text
          style={{
            ...Fonts.blackColor13Medium,
            textAlign: "center",
            marginBottom: Sizes.fixPadding,
          }}
        >
          {customerData && customerData?.name}
        </Text>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding * 0.1,
              borderRadius: 1000,
              borderWidth: 1,
              borderColor: Colors.grayColor,
              marginRight: Sizes.fixPadding,
            }}
          >
            <Text style={{ ...Fonts.blackColor13Medium }}>0 Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding * 0.1,
              borderRadius: 1000,
              borderWidth: 1,
              borderColor: Colors.grayColor,
            }}
          >
            <Text style={{ ...Fonts.blackColor13Medium }}>0 Following</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          height: 250.0,
          width: "100%",
          flex: 1,
          borderBottomLeftRadius: Sizes.fixPadding * 1.5,
          borderBottomRightRadius: Sizes.fixPadding * 1.5,
          overflow: "hidden",
        }}
      >
        <ImageBackground
          source={require("../assets/images/food/food15.png")}
          style={{ height: "100%", width: "100%", flex: 1 }}
        >
          <View style={styles.headerWrapStyle}>
            <MaterialIcons
              name="arrow-back"
              color={Colors.whiteColor}
              size={22}
              onPress={() => navigation.pop()}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <MaterialIcons
                name={isFavorite ? "favorite" : "favorite-border"}
                color={Colors.whiteColor}
                size={22}
                style={{ marginRight: Sizes.fixPadding + 10.0 }}
                onPress={() => {
                  setisFavorite(!isFavorite), setshowSnackBar(true);
                }}
              /> */}
              <Ionicons name="arrow-redo-outline" color={Colors.whiteColor} size={22} />
            </View>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              position: "absolute",
              bottom: 0,
              right: 1,
              margin: Sizes.fixPadding * 2,
              backgroundColor: Colors.blueColor,
              paddingHorizontal: Sizes.fixPadding * 0.7,
              borderRadius: Sizes.fixPadding * 6,
              paddingVertical: Sizes.fixPadding * 0.2,
              borderWidth: 1,
              borderColor: Colors.whiteColor,
            }}
          >
            <Text style={{ ...Fonts.whiteColor12SemiBold }}>
              <Ionicons name="camera" color={Colors.whiteColor} size={16} />{" "}
              Edit
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }

};

const styles = StyleSheet.create({
  profilePhotoWrapStyle: {
    alignItems: "center",
    justifyContent: "center",
    // position: "absolute",
    alignSelf: "center",
  },
  profilePhotoStyle: {
    height: 80.0,
    width: 80.0,
    borderRadius: 50.0,
    // position: 'absolute',
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.blueColor,
    alignSelf: "center",
    top: -42,
    zIndex: 99,
  },
  headerWrapStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: StatusBar.currentHeight + 20.0,
    marginBottom: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aboutRestaurantWrapStyle: {
    borderBottomLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    backgroundColor: "#DEE2EB",
  },
  restaurantLogoStyle: {
    width: 70.0,
    position: "absolute",
    bottom: -5.0,
    height: 70.0,
    borderRadius: Sizes.fixPadding,
  },
  restuarantInfoWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
  },
  restaurantDetailWrapStyle: {
    backgroundColor: "#DEE2EB",
    borderRadius: Sizes.fixPadding,
    margin: Sizes.fixPadding * 2.0,
  },
  popularFoodImageStyle: {
    width: "100%",
    height: "100%",
    flex: 1,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  popularItemsWrapStyle: {
    backgroundColor: "#DEE2EB",
    borderRadius: Sizes.fixPadding,
    width: width / 1.8,
    height: 105.0,
    marginRight: Sizes.fixPadding * 2.0,
    flex: 1,
  },
  reviewsWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    marginBottom: Sizes.fixPadding * 2.0,
    elevation: 0.2,
    borderColor: "#E9EAF0",
    borderWidth: 1.0,
  },
  orderFoodNowButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 0.5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1.0,
    shadowColor: Colors.primaryColor,
  },
});

const mapStateToProps = state =>({
  customerData: state.customer.customerData
})

export default connect(mapStateToProps, null)(ProfileActivity);
