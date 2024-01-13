import React, { useState } from "react";
import {
  SafeAreaView,
  Dimensions,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Dialog from "react-native-dialog";
import { CircleFade } from "react-native-animated-spinkit";
import OTPTextView from "react-native-otp-textinput";
import {
  api_url,
  get_profile,
  send_otp_api,
  verify_otp,
} from "../../constants/api";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import Loader from "../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import * as UserActions from "../../redux/actions/CustomerActions";

const { width } = Dimensions.get("screen");

const VerificationScreen = ({ navigation, route, dispatch }) => {
  const [otpInput, setotpInput] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [otp, setOtp] = useState(route.params.otp);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState("");

  const validation = () => {
    if (otpInput.length == 0) {
      setErrorMessage("Enter otp");
      setErrorVisible(false);
      return false;
    } else if (otpInput.toString() != otp.toString()) {
      console.log(otpInput);
      console.log(otp);
      setErrorMessage("Enter correct otp");
      setErrorVisible(false);
    } else {
      return true;
    }
  };

  const _verify_otp = async () => {
    if (validation()) {
      setisLoading(true);
      let fcm_token = await messaging().getToken();
      await axios({
        method: "post",
        url: api_url + verify_otp,
        data: {
          mobile_number: route.params.phone_number,
          fcm_token: fcm_token,
          otp: otpInput,
        },
      })
        .then((res) => {
          setisLoading(false);
          get_profile_data(res.data.user.id);
        })
        .catch((err) => {
          setisLoading(false);
          console.log(err);
        });
    }
  };

  const get_profile_data = async (id) => {
    setisLoading(true);
    await axios({
      method: "post",
      url: api_url + get_profile,
      data: {
        id: id,
      },
    })
      .then(async (res) => {
        console.log(res.data)
        setisLoading(false);
        if (res.data.status) {
          if (res.data.profile.name == null || res.data.profile.name == "") {
            navigation.navigate("updateName", { id: res.data.profile.id });
          } else {
            await AsyncStorage.setItem(
              "userData",
              JSON.stringify(res.data.profile)
            );
            dispatch(UserActions.setCustomerData(res.data.profile));
            navigation.push('BottomTabBar')
          }
        }
        console.log(res.data);
      })
      .catch((err) => {
        setisLoading(false);
        console.log(err);
      });
  };

  const ressend_otp = async () => {
    if (validation()) {
      setisLoading(true);
      await axios({
        method: "post",
        url: api_url + send_otp_api,
        data: {
          mobile_number: route.params.phone_number,
          fcm_token: "dsfdsvfndfd",
        },
      })
        .then((res) => {
          setisLoading(false);
          setOtp(res.data.otp);
        })
        .catch((err) => {
          setisLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Loader visible={isLoading} />
      <View style={{ flex: 1 }}>
        {header()}
        {foodLogo()}
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.whiteColor,
            marginTop: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 15,
          }}
        >
          {verifyTitle()}
          {verificationDetail()}
          {otpFields()}
          {errorMessageText()}
          {verifyButton()}
        </View>
      </View>
    </SafeAreaView>
  );

  function verifyButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={_verify_otp}
        style={styles.verifyNowButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor15Medium }}>Verify Now</Text>
      </TouchableOpacity>
    );
  }

  function otpFields() {
    return (
      <OTPTextView
        containerStyle={{
          marginTop: Sizes.fixPadding * 4.0,
          marginHorizontal: Sizes.fixPadding * 4.0,
        }}
        handleTextChange={(text) => {
          setErrorMessage("");
          setotpInput(text);
          // if (text.length === 4) {
          //   _verify_otp()
          // }
        }}
        inputCount={4}
        autoFocus={true}
        keyboardType="numeric"
        tintColor={Colors.primaryColor}
        offTintColor={"transparent"}
        textInputStyle={{ ...styles.textFieldStyle }}
        // navigation.push("BottomTabBar");
      />
    );
  }

  function foodLogo() {
    return (
      <Image
        source={require("../../assets/images/bg1.png")}
        style={styles.foodLogoStyle}
        resizeMode="contain"
      />
    );
  }

  function verificationDetail() {
    return (
      <View style={{ marginTop: Sizes.fixPadding * 0.2 }}>
        <Text
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            ...Fonts.grayColor11Medium,
          }}
        >
          {`We have sent a verification code to\n\n(+91) ${route.params.phone_number}`}
        </Text>
      </View>
    );
  }

  function errorMessageText() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          marginHorizontal: Sizes.fixPadding * 4.0,
        }}
      >
        <Text style={{ ...Fonts.blackColor13Medium }}>{errorMessage}</Text>
      </View>
    );
  }

  function verifyTitle() {
    return (
      <Text style={{ ...Fonts.primaryColor16SemiBold }}>Otp Verification</Text>
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
  headerWrapStyle: {
    margin: Sizes.fixPadding * 2.0,
  },
  foodLogoStyle: {
    width: 100,
    height: 100,
    bottom: 0.0,
    left: 0.0,
    alignSelf: "center",
  },
  textFieldStyle: {
    borderBottomWidth: null,
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.whiteColor,
    borderColor: "rgba(255, 66, 0, 0.8)",
    borderWidth: 1.0,
    ...Fonts.blackColor18SemiBold,
    elevation: 8,
    shadowColor: Colors.grayColor,
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding - 5.0,
    width: width - 100,
  },
  verifyNowButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding * 4.0,
    borderRadius: Sizes.fixPadding * 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(null, mapDispatchToProps)(VerificationScreen);
