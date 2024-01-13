import React from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Colors, Fonts, Sizes } from "../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const Rating = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {giftImage()}
          {shareBenifits()}
          {leftImageContainer()}
          {rightImageContainer()}
          {/* {shareYourInvireCodeInfo()} */}
        </ScrollView>
      </View>
      {shareButton()}
    </SafeAreaView>
  );

  function shareButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.pop()}
        style={styles.shareButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor15Medium }}>Okay</Text>
      </TouchableOpacity>
    );
  }

  function shareYourInvireCodeInfo() {
    return (
      <View>
        <Text
          style={{
            marginVertical: Sizes.fixPadding + 5.0,
            textAlign: "center",
            ...Fonts.blackColor16SemiBold,
          }}
        >
          Share Your Invite Code
        </Text>
        <View style={styles.inviteCodeWrapStyle}>
          <Text style={{ ...Fonts.blackColor15Medium }}>4CGTY56PO</Text>
          <MaterialIcons
            name="content-copy"
            color={Colors.primaryColor}
            size={18}
          />
        </View>
      </View>
    );
  }

  function shareBenifits() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          marginTop: Sizes.fixPadding,
          alignItems: "center",
          paddingVertical: Sizes.fixPadding,
        }}
      >
        <Text style={{ ...Fonts.blackColor16SemiBold }}>
          Understanding your rating
        </Text>
        <Text style={styles.shareBenifitsWrapStyle}>
          share your code with your friends to give them 2 free deliveries,
          valid for 14 days on order above $25.00.When they place their first
          order, you'll get $10.00 off products.
        </Text>
      </View>
    );
  }

  function leftImageContainer() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: "row",
          backgroundColor: "#fff3f3",
          // marginVertical: Sizes.fixPadding,
          padding: Sizes.fixPadding,
        }}
      >
        <Image
          source={require("../assets/images/rating_left.png")}
          style={{ width: 80, height: 100, resizeMode: "contain" }}
        />
        <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor16SemiBold }}>
            Short wait times
          </Text>
          <Text style={{ ...Fonts.grayColor13Medium }}>
            share your code with your friends to give them 2 free deliveries,
            valid for 14 days on order above $25.00.When they place their first
            order
          </Text>
        </View>
      </View>
    );
  }

  function rightImageContainer() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: "row",
          backgroundColor: Colors.grayColor1,
          // marginVertical: Sizes.fixPadding,
          padding: Sizes.fixPadding,
        }}
      >
        <View style={{ flex: 1, marginRight: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor16SemiBold }}>
            Courtesy
          </Text>
          <Text style={{ ...Fonts.grayColor13Medium }}>
            share your code with your friends to give them 2 free deliveries,
            valid for 14 days on order above $25.00.When they place their first
            order
          </Text>
        </View>
        <Image
          source={require("../assets/images/rating-right.png")}
          style={{ width: 80, height: 100, resizeMode: "contain" }}
        />
      </View>
    );
  }

  function giftImage() {
    return (
      <Image
        source={require("../assets/images/rating_banner.png")}
        style={styles.giftImageStyle}
      />
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
        <Text
          style={{
            // marginLeft: Sizes.fixPadding - 5.0,
            flex: 1,
            textAlign: "center",
            ...Fonts.blackColor16SemiBold,
          }}
        >
          Your Rating
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    margin: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
  },
  inviteCodeWrapStyle: {
    backgroundColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
  },
  shareButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding*0.5,
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "rgba(255, 66, 0, 0.3)",
    // borderWidth: 1.0,
    // elevation: 1.0,
    // shadowColor: Colors.primaryColor,
  },
  shareBenifitsWrapStyle: {
    marginVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding * 2,
    // textAlign: "center",
    ...Fonts.grayColor13Medium,
  },
  giftImageStyle: {
    width: 220.0,
    height: 180.0,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: Sizes.fixPadding * 2.0,
  },
});

export default Rating;
