import { ToastAndroid } from "react-native";

export const showToastWithGravity = (text) => {
    ToastAndroid.showWithGravity(
      text,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };