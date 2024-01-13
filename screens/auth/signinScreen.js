import React, { useState, createRef, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  Dimensions,
  View,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  StatusBar,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Input } from "@rneui/themed";
import { useFocusEffect } from "@react-navigation/native";
import {
  GoogleSignin,
  GoogleSigninButton,
  NativeModuleError,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import {
  api_url,
  facebook_login_api,
  get_profile,
  google_login_api,
  send_otp_api,
} from "../../constants/api";
import Loader from "../../components/Loader";

const { width } = Dimensions.get("window");

const SigninScreen = ({ navigation }) => {
  const input = createRef();
  const [state, setState] = useState({
    phoneNumber: "",
    password: null,
    passwordSecure: true,
    backClickCount: 0,
    isLoading: false,
    errorMessage: "",
  });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    configure_sign();
    get_current_user();
  }, []);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [backAction])
  );

  const validation = () => {
    if (state.phoneNumber.length == 0) {
      updateState({ errorMessage: "Mobile number is required!" });
      input.current.shake();
      return false;
    } else if (state.phoneNumber.length != 10) {
      updateState({ errorMessage: "Oops! that's not correct." });
      input.current.shake();
      return false;
    } else {
      return true;
    }
  };

  const send_otp = async () => {
    if (validation()) {
      updateState({ isLoading: true });
      let fcm_token = await messaging().getToken();
      await axios({
        method: "post",
        url: api_url + send_otp_api,
        data: {
          mobile_number: phoneNumber,
          fcm_token: "dsfdsvfndfd",
        },
      })
        .then((res) => {
          updateState({ isLoading: false });
          navigation.navigate("Verification", {
            otp: res.data.otp,
            phone_number: state.phoneNumber,
          });
        })
        .catch((err) => {
          updateState({ isLoading: false });
          console.log(err);
        });
    }
  };

  const facebook_login_by_api = async () => {
    updateState({ isLoading: true });
    let fcm_token = await messaging().getToken();
    await axios({
      method: "post",
      url: api_url + facebook_login_api,
      data: {},
    })
      .then((res) => {
        console.log(res.data);
        updateState({ isLoading: false });
      })
      .catch((err) => {
        updateState({ isLoading: false });
        console.log(err);
      });
  };

  const google_login_by_api = async () => {
    updateState({ isLoading: true });
    let fcm_token = await messaging().getToken();
    await axios({
      method: "post",
      url: api_url + google_login_api,
      data: {},
    })
      .then((res) => {
        console.log(res.data);
        updateState({ isLoading: false });
      })
      .catch((err) => {
        updateState({ isLoading: false });
        console.log(err);
      });
  };

  const get_customer_profile = async () => {
    updateState({ isLoading: true });
    await axios({
      method: "post",
      url: api_url + get_profile,
      data: {},
    })
      .then((res) => {
        console.log(res.data);
        updateState({ isLoading: false });
      })
      .catch((err) => {
        updateState({ isLoading: false });
        console.log(err);
      });
  };

  const configure_sign = () => {
    GoogleSignin.configure();
  };

  const get_current_user = async () => {
    try {
      // await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signInSilently();
      console.log(userInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const google_signing = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  function _spring() {
    updateState({ backClickCount: 1 });
    setTimeout(() => {
      updateState({ backClickCount: 0 });
    }, 1000);
  }

  const go_home = () => {
    navigation.push("BottomTabBar");
  };

  const { phoneNumber, password, passwordSecure, backClickCount } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Loader visible={state.isLoading} />
      <View style={{ flex: 1 }}>
        {header()}
        {/* {foodLogo()} */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            // paddingBottom: Sizes.fixPadding,
          }}
        >
          {signinImage()}
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.whiteColor,
              marginTop: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            {signinTitle()}
            {userNameTextField()}
            {continueButton()}
            {facebookButton()}
            {googleButton()}
            {driverButton()}
            {partnerButton()}
          </View>
        </ScrollView>
        {exitInfo()}
      </View>
    </SafeAreaView>
  );

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={[styles.animatedView]}>
        <Text style={{ ...Fonts.whiteColor12SemiBold }}>
          Press Back Once Again to Exit
        </Text>
      </View>
    ) : null;
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={send_otp}
        style={styles.signinButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor15Medium }}>Continue</Text>
      </TouchableOpacity>
    );
  }

  function facebookButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push("Signup")}
        style={{
          ...styles.signinSocialButtonStyle,
          backgroundColor: "#4267B2",
        }}
      >
        <Text style={{ ...Fonts.whiteColor15Medium }}>
          Continue with facebook
        </Text>
      </TouchableOpacity>
    );
  }

  function googleButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={google_signing}
        style={{
          ...styles.signinSocialButtonStyle,
          backgroundColor: Colors.primaryColor,
        }}
      >
        <Text style={{ ...Fonts.whiteColor15Medium }}>
          Continue with google
        </Text>
      </TouchableOpacity>
    );
  }

  function driverButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push("Signup")}
        style={{
          ...styles.signinSocialButtonStyle,
          backgroundColor: Colors.blackColor,
        }}
      >
        <Text style={{ ...Fonts.whiteColor15Medium }}>Driver Login</Text>
      </TouchableOpacity>
    );
  }

  function partnerButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push("Signup")}
        style={{
          ...styles.signinSocialButtonStyle,
          backgroundColor: "#ffb703",
        }}
      >
        <Text style={{ ...Fonts.whiteColor15Medium }}>Partner Login</Text>
      </TouchableOpacity>
    );
  }

  function userNameTextField() {
    return (
      <Input
        ref={input}
        value={phoneNumber}
        onChangeText={(text) => updateState({ phoneNumber: text })}
        selectionColor={Colors.primaryColor}
        keyboardType="phone-pad"
        placeholder="1234567890"
        maxLength={10}
        errorStyle={{ ...Fonts.primaryColor12SemiBold }}
        onFocus={() => updateState({ errorMessage: "" })}
        errorMessage={state.errorMessage}
        placeholderTextColor={Colors.grayColor}
        leftIcon={<Text style={{ ...Fonts.blackColor15Medium }}>+91</Text>}
        style={{
          ...Fonts.blackColor15Medium,
          marginLeft: Sizes.fixPadding - 2.0,
        }}
        inputContainerStyle={{ ...styles.textFieldWrapStyle }}
        containerStyle={{
          marginBottom: Sizes.fixPadding * 3.0,
          marginTop: Sizes.fixPadding * 2.0,
          ...styles.textFieldStyle,
        }}
      />
    );
  }

  function signinImage() {
    return (
      <Image
        source={require("../../assets/images/bg1.png")}
        style={styles.foodLogoStyle}
        resizeMode="contain"
      />
    );
  }

  function signinTitle() {
    return (
      <View>
        <Text
          style={{
            marginVertical: Sizes.fixPadding,
            marginHorizontal: Sizes.fixPadding * 2.0,
            ...Fonts.primaryColor16SemiBold,
          }}
        >
          Login
        </Text>
        <Text
          style={{
            marginVertical: Sizes.fixPadding * 0.01,
            marginHorizontal: Sizes.fixPadding * 2.0,
            ...Fonts.grayColor14Medium,
          }}
        >
          Enter your phone number to proceed
        </Text>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={22}
          onPress={() => navigation.push("Splash")}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: Colors.blackColor,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
  },
  headerWrapStyle: {
    margin: Sizes.fixPadding * 2.0,
  },
  textFieldStyle: {
    height: 40.0,
    width: width - 25.0,
    alignSelf: "center",
  },
  textFieldWrapStyle: {
    paddingHorizontal: Sizes.fixPadding,
    elevation: 5.0,
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    borderBottomColor: Colors.whiteColor,
    borderBottomWidth: 1.0,
    shadowColor: Colors.grayColor,
  },
  forgetPasswordTextStyle: {
    marginTop: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    alignSelf: "flex-end",
    ...Fonts.grayColor11Medium,
  },
  signinButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 0.5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1.0,
    shadowColor: Colors.primaryColor,
  },
  signinSocialButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 0.5,
    marginBottom: Sizes.fixPadding * 1.2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1.0,
    shadowColor: Colors.primaryColor,
  },
  socialMediaOptionsWrapStyle: {
    marginVertical: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialMediaIconWrapstStyle: {
    width: 38.0,
    height: 38.0,
    borderRadius: 19.0,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding - 5.0,
  },
  foodLogoStyle: {
    width: 100,
    height: 100,
    bottom: 0.0,
    left: 0.0,
    alignSelf: "center",
  },
});

export default SigninScreen;
