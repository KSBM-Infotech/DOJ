import React, { useState, createRef, useEffect } from "react";
import { SafeAreaView, Dimensions, View, ScrollView, TouchableOpacity, StatusBar, Image, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Input } from '@rneui/themed';
import Loader from "../../components/Loader";
import { api_url, update_name } from "../../constants/api";
import axios from "axios";

const { width } = Dimensions.get('window');

const UpdateName = ({ navigation, route }) => {
    const input = createRef();
    const [state, setState] = useState({
        fullName: '',
        password: null,
        passwordSecure: true,
        email: null,
        phoneNumber: null,
        errorMessage: "",
        nameValidation: false,
        isLoading: false
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))
    const {
        fullName,
        password,
        passwordSecure,
        email,
        phoneNumber,
    } = state;

    const validation = () => {
        if (state.fullName.length == 0) {
          updateState({ errorMessage: "Full name is required!" });
          input.current.shake();
          return false;
        } else {
          return true;
        }
      };

    const regiser_name = async()=>{
        if (validation()) {
            updateState({ isLoading: true });
            await axios({
              method: "post",
              url: api_url + update_name,
              data: {
                id: route.params.id,
                name: state.fullName
              },
            })
              .then((res) => {
                updateState({ isLoading: false });
                navigation.push("BottomTabBar");
              })
              .catch((err) => {
                updateState({ isLoading: false });
                console.log(err);
              });
          }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <Loader visible={state.isLoading} />
            <View style={{ flex: 1 }}>
                {header()}
               {signinImage()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: Sizes.fixPadding, }}
                >
                    {signupTitle()}
                    {fullNameTextField()}
                    {signupButton()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )

    function signinImage() {
        return (
          <Image
            source={require("../../assets/images/bg1.png")}
            style={styles.foodLogoStyle}
            resizeMode="contain"
          />
        );
      }

    function signupButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={regiser_name}
                style={styles.signupButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor15Medium }}>
                    Done
                </Text>
            </TouchableOpacity>
        )
    }


    function fullNameTextField() {
        return (
            <Input
                ref={input}
                value={fullName}
                onChangeText={(text) => updateState({ fullName: text })}
                selectionColor={Colors.primaryColor}
                placeholder='Full Name'
                placeholderTextColor={Colors.grayColor}
                errorStyle={{ ...Fonts.primaryColor12SemiBold }}
                onFocus={() => updateState({ errorMessage: "" })}
                errorMessage={state.errorMessage}
                leftIcon={{
                    type: 'material',
                    color: Colors.grayColor,
                    name: 'person-outline',
                    size: 20,
                    onPress: () => { input.current.focus() }
                }}
                style={{ ...Fonts.blackColor15Medium, marginLeft: Sizes.fixPadding - 2.0 }}
                inputContainerStyle={{ ...styles.textFieldWrapStyle }}
                containerStyle={{ marginBottom: Sizes.fixPadding * 3.0, marginTop: Sizes.fixPadding * 2.0, ...styles.textFieldStyle }}
            />
        )
    }

    function signupTitle() {
        return (
            <Text style={{ marginVertical: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
                Enter Name
            </Text>
        )
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
        )
    }

}

const styles = StyleSheet.create({
    headerWrapStyle: {
        margin: Sizes.fixPadding * 2.0,
    },
    textFieldStyle: {
        height: 40.0,
        width: width - 25.0,
        alignSelf: 'center',
    },
    textFieldWrapStyle: {
        paddingHorizontal: Sizes.fixPadding,
        elevation: 5.0,
        borderRadius: Sizes.fixPadding*0.5,
        backgroundColor: Colors.whiteColor,
        borderBottomColor: Colors.whiteColor,
        borderBottomWidth: 1.0,
        shadowColor: Colors.grayColor
    },
    signupButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 4.0,
        borderRadius: Sizes.fixPadding*0.5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primaryColor,
    },
    socialMediaOptionsWrapStyle: {
        marginVertical: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    socialMediaIconWrapstStyle: {
        width: 38.0,
        height: 38.0,
        borderRadius: 19.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding - 5.0,
    },
    foodLogoStyle: {
        width: 100,
        height: 100,
        bottom: 0.0,
        left: 0.0,
        alignSelf: "center",
    }
});

export default UpdateName