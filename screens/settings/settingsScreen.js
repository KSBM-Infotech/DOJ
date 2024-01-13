import React, { useState } from "react";
import { SafeAreaView, View, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const SettingsScreen = ({ navigation }) => {

    const [locationSwitch, setlocationSwitch] = useState(false)
    const [notificationSwitch, setnotificationSwitch] = useState(false)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                {notificationsInfo()}
                {clearCacheText()}
                {locationInfo()}
                {termsOfUseText()}
                {privacyPolicyText()}
            </View>
        </SafeAreaView>
    )

    function privacyPolicyText() {
        return (
            <Text style={{ margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor14SemiBold }}>
                Privacy policy
            </Text>
        )
    }

    function termsOfUseText() {
        return (
            <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor14SemiBold }}>
                Terms of user
            </Text>
        )
    }

    function locationInfo() {
        return (
            <View style={{ marginVertical: Sizes.fixPadding * 2.0, ...styles.settingDetailWrapStyle }}>
                <Text style={{ ...Fonts.blackColor14SemiBold }}>
                    I agree to share my location
                </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => { setlocationSwitch(!locationSwitch) }}
                    style={{
                        ...styles.switchStyle,
                        backgroundColor: locationSwitch ? Colors.primaryColor : '#DDDEE5',
                        alignItems: locationSwitch ? 'flex-end' : 'flex-start'
                    }}>
                    <View style={styles.switchInnerCircleStyle} />
                </TouchableOpacity>
            </View>
        )
    }

    function clearCacheText() {
        return (
            <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor14SemiBold }}>
                Clear Cache
            </Text>
        )
    }

    function notificationsInfo() {
        return (
            <View style={{ ...styles.settingDetailWrapStyle }}>
                <Text style={{ ...Fonts.blackColor14SemiBold }}>
                    Notifications
                </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => { setnotificationSwitch(!notificationSwitch) }}
                    style={{
                        ...styles.switchStyle,
                        backgroundColor: notificationSwitch ? Colors.primaryColor : '#DDDEE5',
                        alignItems: notificationSwitch ? 'flex-end' : 'flex-start'
                    }}>
                    <View style={styles.switchInnerCircleStyle} />
                </TouchableOpacity>
            </View>
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
                <Text style={{ marginLeft: Sizes.fixPadding - 5.0, flex: 1, ...Fonts.blackColor18SemiBold }}>
                    Settings
                </Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    headerWrapStyle: {
        margin: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingDetailWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Sizes.fixPadding + 10.0,
    },
    switchStyle: {
        height: 23.0,
        width: 35.0,
        borderRadius: Sizes.fixPadding * 3.0,
        justifyContent: 'center',
    },
    switchInnerCircleStyle: {
        width: 21.0,
        height: 21.0,
        borderRadius: 10.5,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding - 8.5,
    }
});

export default SettingsScreen;