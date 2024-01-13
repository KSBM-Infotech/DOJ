import React, { useState, useRef } from "react";
import { SafeAreaView, View, Dimensions, StatusBar, Image, Animated, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Snackbar } from 'react-native-paper';

const { width } = Dimensions.get('window');

const notificationList = [
    {
        key: '1',
        notificationImage: require('../../assets/images/notification/notification1.png'),
        title: `Your order is almost here...`,
        description: `Meet your deliver valet at the door and collect your order...`,
        date: '22 mar',
    },
    {
        key: '2',
        notificationImage: require('../../assets/images/notification/notification1.png'),
        title: `Shivansh is your pizza hut valet today!`,
        description: `He is on his way to delivery your order.`,
        date: '22 mar',
    },
    {
        key: '3',
        notificationImage: require('../../assets/images/notification/notification2.png'),
        title: `Slow and stedy wins nothing!`,
        description: `That's why W delivered your order in 15 mins Enjoy...`,
        date: '21 mar',
    },
    {
        key: '4',
        notificationImage: require('../../assets/images/notification/notification3.png'),
        title: `Your order is almost here...`,
        description: `Meet your deliver valet at the door and collect your order...`,
        date: '19 mar',
    },
    {
        key: '5',
        notificationImage: require('../../assets/images/notification/notification4.png'),
        title: `Shivansh is your MC donald's valet today!`,
        description: `He is on his way to delivery your order.`,
        date: '15 mar',
    },
    {
        key: '6',
        notificationImage: require('../../assets/images/notification/notification2.png'),
        title: `Slow and stedy wins nothing!`,
        description: `That's why W delivered your order in 15 mins Enjoy...`,
        date: '12 mar',
    },
];

const rowTranslateAnimatedValues = {};

const NotificationsScreen = ({ navigation }) => {

    const [showSnackBar, setShowSnackBar] = useState(false);

    const [snackBarMsg, setSnackBarMsg] = useState('');

    const [listData, setListData] = useState(notificationList);

    Array(listData.length + 1)
        .fill('')
        .forEach((_, i) => {
            rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
        });

    const animationIsRunning = useRef(false);

    const onSwipeValueChange = swipeData => {

        const { key, value } = swipeData;

        if ((value < -width || value > width) && !animationIsRunning.current) {
            animationIsRunning.current = true;
            Animated.timing(rowTranslateAnimatedValues[key], {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {

                const newData = [...listData];
                const prevIndex = listData.findIndex(item => item.key === key);
                newData.splice(prevIndex, 1);
                const removedItem = listData.find(item => item.key === key);

                setSnackBarMsg(`${removedItem.title} dismissed`);

                setListData(newData);

                setShowSnackBar(true);

                animationIsRunning.current = false;
            });
        }
    };

    const renderItem = data => (
        <View>
            <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                <View style={styles.notificationWrapStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={data.item.notificationImage}
                            style={{ width: 55.0, height: 55.0, borderRadius: Sizes.fixPadding, }}
                        />
                        <View style={{ marginLeft: Sizes.fixPadding, flex: 1, }}>
                            <Text numberOfLines={1} style={{ ...Fonts.blackColor11Regular }}>
                                {data.item.title}
                            </Text>
                            <Text numberOfLines={2} style={{ ...Fonts.blackColor11Regular }}>
                                {data.item.description}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.notificationDateWrapStyle}>
                        {data.item.date}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderHiddenItem = () => (
        <View style={styles.rowBack} />
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}                
                <View style={{ backgroundColor: Colors.bodyBackColor, flex: 1, }}>
                    {listData.length == 0 ?
                        noNotification()
                        :
                        <SwipeListView
                            data={listData}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            rightOpenValue={-width}
                            leftOpenValue={width}
                            onSwipeValueChange={onSwipeValueChange}
                            useNativeDriver={false}                           
                            contentContainerStyle={{ paddingTop: Sizes.fixPadding - 8.0, paddingBottom: Sizes.fixPadding, }}
                            showsVerticalScrollIndicator={false}
                        />
                    }
                    <Snackbar
                        style={styles.snackBarStyle}
                        visible={showSnackBar}
                        onDismiss={() => setShowSnackBar(false)}
                    >
                        {snackBarMsg}
                    </Snackbar>
                </View>
            </View>
         </SafeAreaView>
    );

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
                    Notifications
                </Text>
            </View>
        )
    }

    function noNotification() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <MaterialIcons
                    name="notifications-off"
                    size={50}
                    color={Colors.grayColor}
                />
                <Text style={{ ...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding }}>
                    No new notification
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
    notificationDateWrapStyle: {
        position: 'absolute',
        bottom: 2.0,
        right: 10.0,
        alignSelf: 'flex-end',
        fontStyle: 'italic',
        ...Fonts.primaryColor12Regular,
    },
    notificationWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        flex: 1,
        marginBottom: Sizes.fixPadding + 10.0,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: -10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333'
    },
});

export default NotificationsScreen;