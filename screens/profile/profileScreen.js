import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
  Platform,
  Alert,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SharedElement } from "react-navigation-shared-element";
import Dialog from "react-native-dialog";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ProfileScreen = ({ navigation, changeIndex, customerData }) => {
  const [state, setState] = useState({
    showLogoutDialog: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { showLogoutDialog } = state;

  const _logout = async()=>{
    await AsyncStorage.clear();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Signin'}]
      })
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.grayColor1 }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
       
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 7.0 }}
        >
          {header()}
          {profileInfo()}
          {optionalButtons()}
          {ratingView()}
          {profileOptions()}
          {couponsOptions()}
          {awardOptions()}
          {goldOptions()}
          {diningOptions()}
          {moneyOptions()}
          {moreOptions()}
          {/* {logoutOption()} */}
        </ScrollView>
        {/* {logoutDialog()} */}
      </View>
    </SafeAreaView>
  );

  function logoutDialog() {
    return (
      <Dialog.Container
        visible={showLogoutDialog}
        contentStyle={styles.dialogContainerStyle}
        headerStyle={{ margin: 0.0, padding: 0 }}
        onRequestClose={() => updateState({ showLogoutDialog: false })}
      >
        <View style={styles.dialogContentStyle}>
          <Text style={{ textAlign: "center", ...Fonts.blackColor16SemiBold }}>
            Are you sure want to logout?
          </Text>
          <View
            style={{
              marginTop: Sizes.fixPadding * 2.5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => updateState({ showLogoutDialog: false })}
              style={styles.cancelButtonStyle}
            >
              <Text style={{ ...Fonts.primaryColor15SemiBold }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                updateState({ showLogoutDialog: false });
                navigation.push("Signin");
              }}
              style={styles.logoutButtonStyle}
            >
              <Text style={{ ...Fonts.whiteColor15SemiBold }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function logoutOption() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => updateState({ showLogoutDialog: true })}
        style={{ ...styles.profileOptionsWrapStyle }}
      >
        <View style={styles.profileOptionWrapStyle}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../assets/images/icons/logout.png")}
              style={{
                width: 20.0,
                height: 20.0,
                resizeMode: "contain",
                tintColor: Colors.primaryColor,
              }}
            />
            <Text
              style={{
                flex: 1,
                marginLeft: Sizes.fixPadding + 5.0,
                ...Fonts.primaryColor16SemiBold,
              }}
            >
              Logout
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            color={Colors.grayColor}
            size={14}
          />
        </View>
      </TouchableOpacity>
    );
  }

  function profileOptions() {
    return (
      <View>
        {/* <View
          style={{
            ...styles.profileOptionsWrapStyle,
            marginTop: Sizes.fixPadding * 3.0,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.push("PaymentMethods")}
          >
            {profileOptionSort({
              optionIcon: require("../../assets/images/icons/payment_method.png"),
              option: "Payment Methods",
            })}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.push("Address")}
          >
            {profileOptionSort({
              optionIcon: require("../../assets/images/icons/location.png"),
              option: "Address",
            })}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.push("ShareAndEarn")}
          >
            {profileOptionSort({
              optionIcon: require("../../assets/images/icons/share.png"),
              option: "Share and Earn",
            })}
          </TouchableOpacity>
        </View> */}

        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
            elevation: 8.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            borderRadius: Sizes.fixPadding,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <View
            style={{
              padding: Sizes.fixPadding * 0.5,
              borderLeftWidth: 2,
              marginTop: Sizes.fixPadding,
              borderLeftColor: Colors.primaryColor,
            }}
          >
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Food Orders</Text>
          </View>

          <View
            style={{
              ...styles.profileOptionsWrapStyle,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push('orderScreen')}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/my_order.png"),
                option: "Your Orders",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Favorites")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/favorite.png"),
                option: "Favorite Orders",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Address")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Address Book",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Notifications")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Hidden Restaurants",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Notifications")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Food Ordering help",
              })}
            </TouchableOpacity>
            {/* <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Notifications")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Notifications",
              })}
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Settings")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/settings.png"),
                option: "Settings",
              })}
            </TouchableOpacity> */}
            {/* {profileOptionSort({
              optionIcon: require("../../assets/images/icons/support.png"),
              option: "Support",
            })} */}
          </View>
        </View>
      </View>
    );
  }

  function diningOptions() {
    return (
      <View>
        <View
          style={{
            marginBottom: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
            elevation: 8.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            borderRadius: Sizes.fixPadding,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <View
            style={{
              padding: Sizes.fixPadding * 0.5,
              borderLeftWidth: 2,
              marginTop: Sizes.fixPadding,
              borderLeftColor: Colors.primaryColor,
            }}
          >
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Dining</Text>
          </View>

          <View
            style={{
              ...styles.profileOptionsWrapStyle,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              // onPress={() => changeIndex({ index: 3 })}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/my_order.png"),
                option: "Your deals & transactions",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Favorites")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/favorite.png"),
                option: "Your dining rewards",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate("diningHistory")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Your table bookings",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Notifications")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Table booking help",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Notifications")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Frequently asked questions",
              })}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function goldOptions() {
    return (
      <View>
        <View
          style={{
            marginBottom: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
            elevation: 8.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            borderRadius: Sizes.fixPadding,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <View
            style={{
              padding: Sizes.fixPadding * 0.5,
              borderLeftWidth: 2,
              marginTop: Sizes.fixPadding,
              borderLeftColor: Colors.primaryColor,
            }}
          >
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Doj Gold</Text>
          </View>

          <View
            style={{
              ...styles.profileOptionsWrapStyle,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              // onPress={() => changeIndex({ index: 3 })}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/my_order.png"),
                option: "Join Gold",
              })}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function awardOptions() {
    return (
      <View>
        <View
          style={{
            marginBottom: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
            elevation: 8.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            borderRadius: Sizes.fixPadding,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <View
            style={{
              padding: Sizes.fixPadding * 0.5,
              borderLeftWidth: 2,
              marginTop: Sizes.fixPadding,
              borderLeftColor: Colors.primaryColor,
            }}
          >
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Restaurant Awards 2023</Text>
          </View>

          <View
            style={{
              ...styles.profileOptionsWrapStyle,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              // onPress={() => changeIndex({ index: 3 })}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/my_order.png"),
                option: "Winning restaurants",
              })}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function couponsOptions() {
    return (
      <View>
        <View
          style={{
            marginBottom: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
            elevation: 8.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            borderRadius: Sizes.fixPadding,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <View
            style={{
              padding: Sizes.fixPadding * 0.5,
              borderLeftWidth: 2,
              marginTop: Sizes.fixPadding,
              borderLeftColor: Colors.primaryColor,
            }}
          >
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Coupons</Text>
          </View>

          <View
            style={{
              ...styles.profileOptionsWrapStyle,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              // onPress={() => changeIndex({ index: 3 })}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/my_order.png"),
                option: "Collected coupons",
              })}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function moreOptions() {
    return (
      <View>
        <View
          style={{
            marginBottom: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
            elevation: 8.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            borderRadius: Sizes.fixPadding,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <View
            style={{
              padding: Sizes.fixPadding * 0.5,
              borderLeftWidth: 2,
              marginTop: Sizes.fixPadding,
              borderLeftColor: Colors.primaryColor,
            }}
          >
            <Text style={{ ...Fonts.blackColor14SemiBold }}>More</Text>
          </View>

          <View
            style={{
              ...styles.profileOptionsWrapStyle,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              // onPress={() => changeIndex({ index: 3 })}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/my_order.png"),
                option: "Choose language",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Favorites")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/favorite.png"),
                option: "About",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Address")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Send feedback",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Notifications")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Get Feeding India receipt",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Notifications")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Report a safety emergency",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => Alert.alert('Alert!', 'Are you sure to want to log out?',[
                {text: 'No', style: 'cancel'},
                {text: 'Yes', style: 'destructive', onPress: ()=>_logout()}
              ])}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Log out",
              })}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function moneyOptions() {
    return (
      <View>
        <View
          style={{
            marginBottom: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
            elevation: 8.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            borderRadius: Sizes.fixPadding,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <View
            style={{
              padding: Sizes.fixPadding * 0.5,
              borderLeftWidth: 2,
              marginTop: Sizes.fixPadding,
              borderLeftColor: Colors.primaryColor,
            }}
          >
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Money</Text>
          </View>

          <View
            style={{
              ...styles.profileOptionsWrapStyle,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              // onPress={() => changeIndex({ index: 3 })}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/my_order.png"),
                option: "Buy Gift Card",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Favorites")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/favorite.png"),
                option: "Claim Gift Card",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Address")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Gift Card order history",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Notifications")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Zomato Credits",
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.push("Notifications")}
            >
              {profileOptionSort({
                optionIcon: require("../../assets/images/icons/notification.png"),
                option: "Gift Card help",
              })}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function profileOptionSort({ optionIcon, option }) {
    return (
      <View style={styles.profileOptionWrapStyle}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              marginRight: Sizes.fixPadding,
              backgroundColor: Colors.grayColor1,
            }}
          >
            <MaterialIcons
              name="star-outline"
              color={Colors.primaryColor}
              size={20}
            />
          </View>
          <Text
            style={{
              flex: 1,
              // marginLeft: Sizes.fixPadding + 5.0,
              ...Fonts.blackColor13Medium,
            }}
          >
            {option}
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          color={Colors.grayColor}
          size={14}
        />
      </View>
    );
  }

  function ratingView() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate('rating')}
        style={{
          ...styles.profileOptionsWrapStyle,
          backgroundColor: Colors.whiteColor,
          elevation: 8.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
          borderRadius: Sizes.fixPadding,
          shadowColor: Colors.lightGrayColor,
        }}
      >
        <View style={styles.profileOptionWrapStyle}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                marginRight: Sizes.fixPadding,
                backgroundColor: Colors.grayColor1,
              }}
            >
              <MaterialIcons
                name="star-outline"
                color={Colors.primaryColor}
                size={20}
              />
            </View>
            <Text
              style={{
                flex: 1,
                marginLeft: Sizes.fixPadding + 5.0,
                ...Fonts.blackColor13Medium,
              }}
            >
              Your Rating
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.primaryColor,
              paddingHorizontal: Sizes.fixPadding * 0.5,
              borderRadius: 1000,
              marginRight: Sizes.fixPadding,
            }}
          >
            <MaterialIcons name="star" color={"#fca311"} size={14} />
            <Text
              style={{
                marginRight: Sizes.fixPadding - 5.0,
                ...Fonts.whiteColor12SemiBold,
              }}
            >
              5.0
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            color={Colors.grayColor}
            size={14}
          />
        </View>
      </TouchableOpacity>
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
          onPress={()=>navigation.navigate('likedRestaurant')}
          style={{
            width: width * 0.25,
            height: width * 0.25,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding,
            elevation: 8,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <Ionicons
            name="heart-outline"
            color={Colors.grayColor}
            size={width * 0.1}
          />
          <Text
            style={{ ...Fonts.blackColor13Medium, marginTop: Sizes.fixPadding }}
          >
            Likes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: width * 0.25,
            height: width * 0.25,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding,
            elevation: 8,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <Ionicons
            name="wallet-outline"
            color={Colors.grayColor}
            size={width * 0.1}
          />
          <Text
            style={{ ...Fonts.blackColor13Medium, marginTop: Sizes.fixPadding }}
          >
            Payments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: width * 0.25,
            height: width * 0.25,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding,
            elevation: 8,
            shadowColor: Colors.lightGrayColor,
          }}
        >
          <Ionicons
            name="settings-outline"
            color={Colors.grayColor}
            size={width * 0.1}
          />
          <Text
            style={{ ...Fonts.blackColor13Medium, marginTop: Sizes.fixPadding }}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function profileInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.push("EditProfile", { id: "photo" })}
        style={styles.profileInfoWrapStyle}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
            <Text
              style={{
                ...Fonts.blackColor16SemiBold,
                marginBottom: Sizes.fixPadding * 0.2,
              }}
            >
              {customerData && customerData.name}
            </Text>
            <Text
              style={{
                ...Fonts.grayColor12Medium,
                marginBottom: Sizes.fixPadding,
              }}
            >
              {customerData && customerData.email != null ? customerData.email : 'example@gmail.com'}
            </Text>
            <TouchableOpacity
             onPress={() => navigation.push("profileActivity", { id: "photo" })}
              style={{
                backgroundColor: Colors.primaryColor,
                alignSelf: "flex-start",
                paddingVertical: Sizes.fixPadding * 0.2,
                paddingHorizontal: Sizes.fixPadding,
                borderRadius: Sizes.fixPadding * 5,
                marginTop: Sizes.fixPadding,
              }}
            >
              <Text style={{ ...Fonts.whiteColor12SemiBold }}>
                View Activity
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <SharedElement id={"photo"}>
          <View
            style={{
              width: 65.0,
              height: 65.0,
              borderRadius: Sizes.fixPadding * 5,
              borderWidth: 2,
              overflow: "hidden",
              borderColor: Colors.primaryColor,
            }}
          >
            <Image
              source={{uri: customerData?.profile_photo_url}}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>
        </SharedElement>
      </TouchableOpacity>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={22}
          onPress={() => navigation.pop()}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  profileInfoWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    elevation: 8,
    shadowColor: Colors.lightGrayColor,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 2,
  },
  headerWrapStyle: {
    margin: Sizes.fixPadding * 2.0,
  },
  profileOptionsWrapStyle: {
    paddingHorizontal: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding + 5.0,
  },
  profileOptionWrapStyle: {
    marginBottom: Sizes.fixPadding + 5.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    marginLeft: Sizes.fixPadding,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    flex: 1,
  },
  cancelButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: Sizes.fixPadding,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 100,
    backgroundColor: Colors.whiteColor,
  },
  dialogContentStyle: {
    paddingVertical:
      Platform.OS == "ios" ? Sizes.fixPadding * 2.0 : Sizes.fixPadding - 5.0,
    paddingHorizontal:
      Platform.OS == "ios" ? Sizes.fixPadding * 2.0 : Sizes.fixPadding - 5.0,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
  },
});

const mapStateToProps = state =>({
  customerData: state.customer.customerData
})

export default connect(mapStateToProps, null)(ProfileScreen);
