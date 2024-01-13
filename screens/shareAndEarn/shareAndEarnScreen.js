import React from "react";
import { SafeAreaView, View, StatusBar, ScrollView, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ShareAndEarnScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {giftImage()}
                    {shareBenifits()}
                    {shareYourInvireCodeInfo()}
                </ScrollView>
            </View>
            {shareButton()}
        </SafeAreaView>
    )

    function shareButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.pop()}
                style={styles.shareButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18Bold }}>
                    Share
                </Text>
            </TouchableOpacity>
        )
    }

    function shareYourInvireCodeInfo() {
        return (
            <View>
                <Text style={{ marginVertical: Sizes.fixPadding + 5.0, textAlign: 'center', ...Fonts.blackColor16SemiBold }}>
                    Share Your Invite Code
                </Text>
                <View style={styles.inviteCodeWrapStyle}>
                    <Text style={{ ...Fonts.blackColor15Medium }}>
                        4CGTY56PO
                    </Text>
                    <MaterialIcons
                        name="content-copy"
                        color={Colors.primaryColor}
                        size={18}
                    />
                </View>
            </View>
        )
    }

    function shareBenifits() {
        return (
            <Text style={styles.shareBenifitsWrapStyle}>
                share your code with your friends to give them 2 free deliveries, valid for 14 days on order above $25.00.When they place their first order, you'll get $10.00 off products, valid for 14 days on orders above $25.00.
            </Text>
        )
    }

    function giftImage() {
        return (
            <Image
                source={require('../../assets/images/gift.png')}
                style={styles.giftImageStyle}
            />
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
                    Share & Earn
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
    inviteCodeWrapStyle: {
        backgroundColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Sizes.fixPadding + 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
    },
    shareButtonStyle: {
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
    shareBenifitsWrapStyle: {
        marginVertical: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        textAlign: 'center',
        ...Fonts.grayColor11Medium
    },
    giftImageStyle: {
        width: 110.0,
        height: 110.0,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: Sizes.fixPadding * 2.0,
    }
});

export default ShareAndEarnScreen;