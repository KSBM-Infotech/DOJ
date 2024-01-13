import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, SafeAreaView, StatusBar } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { Fonts, Colors, Sizes, } from "../../constants/styles";

const messagesData = [
    {
        id: '1',
        message: 'Hello',
        isSender: true,
    },
    {
        id: '2',
        message: `How much time?`,
        isSender: true,
    },
    {
        id: '3',
        message: `On my way ma'm\nWill reach in 10 mins.`,
        isSender: false,
    },
]

const MessageScreen = ({ navigation }) => {

    const [messagesList, setMessagesList] = useState(messagesData);

    function messages() {

        const renderItem = ({ item }) => {
            return (
                <View style={{
                    alignItems: item.isSender == true ? 'flex-end' : 'flex-start',
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    marginVertical: Sizes.fixPadding,
                }}>
                    <View style={{
                        ...styles.messageWrapStyle,
                        backgroundColor: item.isSender == true ? Colors.whiteColor : '#DEE2EB',
                    }}>
                        <Text style={{
                            textAlign: item.isSender == true ? 'right' : 'left',
                            ...Fonts.blackColor13Medium
                        }}>
                            {item.message}
                        </Text>
                    </View>
                </View>
            )
        }

        return (
            <FlatList
                inverted
                data={messagesList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingVertical: Sizes.fixPadding * 2.0,
                    flexDirection: 'column-reverse'
                }}
            />
        )
    }

    function addMessage({ message }) {

        const oldMessages = messagesList;

        const newMessage = {
            id: messagesList.length + 1,
            message: message,
            isSender: true,
        }

        oldMessages.push(newMessage);
        setMessagesList(oldMessages);
    }

    function typeMessage() {
        const [message, setMessage] = useState('');
        return (
            <View style={styles.bottomContainerStyle}>
                <MaterialIcons
                    name="add"
                    color={Colors.blueColor}
                    size={18}
                    style={{ marginRight: Sizes.fixPadding - 5.0, }}
                />
                <MaterialCommunityIcons
                    name="camera-outline"
                    color={Colors.grayColor}
                    size={15}
                />
                <TextInput
                    selectionColor={Colors.primaryColor}
                    value={message}
                    onChangeText={setMessage}
                    style={styles.textFieldWrapStyle}
                    placeholder="Type Message..."
                />
                <Feather
                    name="send"
                    size={14}
                    color={Colors.blueColor}
                    onPress={() => {
                        if (message != '') {
                            addMessage({ message: message })
                            setMessage('');
                        }
                    }}
                />
                <MaterialIcons
                    name="mic"
                    color={Colors.grayColor}
                    size={16}
                    style={{ marginLeft: Sizes.fixPadding - 5.0, }}
                />
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <View style={{ flex: 1, }}>
                    {messages()}
                    {typeMessage()}
                </View>
            </View>
        </SafeAreaView>
    )

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={22}
                    color={Colors.blackColor}
                    onPress={() => navigation.pop()}
                />
                <View style={{ flex: 1, marginLeft: Sizes.fixPadding - 5.0, }}>
                    <Text style={{ ...Fonts.blackColor18SemiBold, }}>
                        George Anderson
                    </Text>
                    <Text style={{ ...Fonts.grayColor12Medium }}>
                        Delivery man
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: Sizes.fixPadding * 2.0,
    },
    messageWrapStyle: {
        paddingHorizontal: Sizes.fixPadding + 10.0,
        paddingVertical: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        elevation: 1.0,
    },
    bottomContainerStyle: {
        flexDirection: 'row',
        marginBottom: Sizes.fixPadding,
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    textFieldWrapStyle: {
        ...Fonts.blackColor15Medium,
        flex: 1,
        borderRadius: Sizes.fixPadding - 5.0,
        borderColor: '#CECECE',
        borderWidth: 1.0,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding - 2.0,
        paddingHorizontal: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
    },
})

export default MessageScreen;