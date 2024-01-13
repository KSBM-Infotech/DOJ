import { View, Text, Dimensions } from "react-native";
import React from "react";
import Dialog from "react-native-dialog";
import { StyleSheet } from "react-native";
import { Colors, Fonts, Sizes } from "../constants/styles";
import { CircleFade } from "react-native-animated-spinkit";
const { width } = Dimensions.get("screen");

const Loader = ({ visible }) => {
  return (
    <Dialog.Container
      visible={visible}
      contentStyle={styles.dialogContainerStyle}
      headerStyle={{ padding: 0, margin: 0 }}
    >
      <View
        style={{
          paddingVertical:
            Platform.OS == "ios"
              ? Sizes.fixPadding * 2.0
              : Sizes.fixPadding - 5.0,
          paddingHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
          alignItems: "center",
        }}
      >
        <CircleFade size={40} color={Colors.primaryColor} />
        <Text
          style={{
            ...Fonts.grayColor16Medium,
            marginTop: Sizes.fixPadding * 2.0,
          }}
        >
          Please wait..
        </Text>
      </View>
    </Dialog.Container>
  );
};

export default Loader;

const styles = StyleSheet.create({
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding - 5.0,
    width: width - 100,
    // backgroundColor:'red',
    // opacity: 0
  },
});
