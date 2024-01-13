import React, { useState } from "react";
import {
  Dimensions,
  Text,
  View,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Fonts, Colors, Sizes } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BottomSheet, CheckBox } from "@rneui/themed";
import Dialog from "react-native-dialog";
import { SharedElement } from "react-navigation-shared-element";
import * as ImagePicker from 'react-native-image-picker';
import { actions } from "../../constants/data";
import axios from "axios";
import {
  api_url,
  get_profile,
  update_profile,
  update_profile_images,
} from "../../constants/api";
import { connect } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import * as UserActions from "../../redux/actions/CustomerActions";
import { showToastWithGravity } from "../../components/toastMessages";
import Loader from "../../components/Loader";

const { width } = Dimensions.get("screen");

const EditProfileScreen = ({ navigation, route, customerData, dispatch }) => {
  const id = route.params.id;

  const [fullNameDialog, setFullnameDialog] = useState(false);
  const [fullName, setFullName] = useState(customerData?.name);
  const [changeText, setChangeText] = useState(fullName);

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [password, setPassword] = useState("123456");
  const [changePassword, setChangePassword] = useState(password);

  const [phoneDialog, setPhoneDialog] = useState(false);
  const [phone, setPhone] = useState(customerData?.mobile_number);
  const [changePhone, setChangePhone] = useState(phone);

  const [emialDialog, setEmailDialog] = useState(false);
  const [email, setEmail] = useState(customerData?.email);
  const [changeEmail, setChangeEmail] = useState(email);

  const [dob, setDob] = useState(customerData?.dob);
  const [dateVisible, setDateVisible] = useState(false);

  const [gender, setGender] = useState(customerData?.gender);
  const [genderDialog, setGenderDialog] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isBottomSheet, setIsBottomSheet] = useState(false);

  const upload_image = async (uri) => {
    console.log(uri);
    setIsLoading(true);
    let data = new FormData();
    data.append("id", customerData?.id.toString());
    data.append("profile_image", {
      uri: uri,
      name: "image.jpg",
      type: "image/jpg",
    });
    await axios({
      method: "post",
      url: api_url + update_profile_images,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: data,
    })
      .then((res) => {
        setIsLoading(false);
        console.log(res.data);
        get_profile_data()
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const pickImage = async (type) => {
    setIsBottomSheet(false);
    if (type == "Camera") {
      let result = await ImagePicker.launchCamera({
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 0.5,
      });
      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        upload_image(result.assets[0].uri);
      }
    } else {
      let result = await ImagePicker.launchImageLibrary({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        upload_image(result.assets[0].uri);
      }
    }
  };

  const profile_update = async () => {
    setIsLoading(true);
    await axios({
      method: "post",
      url: api_url + update_profile,
      data: {
        id: customerData?.id,
        mobile_number: phone,
        name: fullName,
        email: email,
        gender: gender,
        dob: dob == null ? dob : moment(dob).format("YYYY-MM-DD hh:mm:ss"),
      },
    })
      .then((res) => {
        setIsLoading(false);
        console.log(res.data);
        get_profile_data();
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_profile_data = async () => {
    await axios({
      method: "post",
      url: api_url + get_profile,
      data: {
        id: customerData?.id,
      },
    })
      .then(async (res) => {
        if (res.data.status) {
          dispatch(UserActions.setCustomerData(res.data.profile));
          showToastWithGravity("Profile Update Successfully");
          navigation.pop();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.grayColor1 }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Loader visible={isLoading} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
        >
          <View
            style={{
              marginHorizontal: Sizes.fixPadding,
              backgroundColor: Colors.whiteColor,
              borderRadius: Sizes.fixPadding,
              marginTop: Sizes.fixPadding * 8,
              paddingTop: Sizes.fixPadding * 8,
            }}
          >
            {profilePhoto()}
            {personalBusinessButton()}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setFullnameDialog(true);
                setChangeText(fullName);
              }}
            >
              {formData({ title: "Name", value: fullName })}
            </TouchableOpacity>
            {/* <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setPasswordDialog(true);
                setChangePassword(password);
              }}
            >
              {formData({ title: "Password", value: "******" })}
            </TouchableOpacity> */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setChangePhone(phone);
                setPhoneDialog(true);
              }}
            >
              {formData({ title: "Phone", value: phone })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setChangeEmail(email);
                setEmailDialog(true);
              }}
            >
              {formData({
                title: "Email Id",
                value: email == null ? "example@gmail.com" : email,
              })}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setDateVisible(true)}
            >
              {formData({
                title: "Date of Birth",
                value:
                  dob == null
                    ? "dd/mm/yyyy"
                    : moment(dob).format("DD/MMM/YYYY"),
              })}
            </TouchableOpacity>
            {dateVisible && (
              <DateTimePicker
                value={dob == null ? new Date() : dob}
                display="calendar"
                mode="date"
                maximumDate={
                  new Date(
                    new Date().getFullYear() - 8,
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                }
                onChange={(d, date) => {
                  if (d.type === "set") {
                    setDob(date);
                    setDateVisible(false);
                  } else {
                    setDateVisible(false);
                  }
                }}
              />
            )}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                // setChangeEmail(email);
                setGenderDialog(true);
              }}
            >
              {formData({
                title: "Choose gender",
                value: gender == null ? "Select gender" : gender,
              })}
            </TouchableOpacity>
            {saveButton()}
          </View>
        </ScrollView>
      </View>
      {editGenderDialog()}
      {editFullNameDialog()}
      {editPasswordDialog()}
      {editPhoneDialog()}
      {editEmailDialog()}
      {showBottomSheet()}
    </SafeAreaView>
  );

  function editGenderDialog() {
    return (
      <Dialog.Container
        visible={genderDialog}
        contentStyle={styles.dialogContainerStyle}
        onRequestClose={() => setGenderDialog(false)}
        headerStyle={{ padding: 0.0, margin: 0.0 }}
      >
        <Text
          style={{
            textAlign: "center",
            ...Fonts.blackColor14SemiBold,
            paddingBottom: Sizes.fixPadding + 3.0,
          }}
        >
          Change Gender
        </Text>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CheckBox
            center
            size={25}
            title={"Male"}
            checked={gender == "Male"}
            onPress={() => setGender("Male")}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            uncheckedColor={Colors.grayColor}
            textStyle={{ ...Fonts.blackColor13Medium }}
            checkedColor={Colors.primaryColor}
          />
          <CheckBox
            center
            size={25}
            title={"Female"}
            checked={gender == "Female"}
            onPress={() => setGender("Female")}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            textStyle={{ ...Fonts.blackColor13Medium }}
            uncheckedIcon="checkbox-blank-outline"
            checkedColor={Colors.primaryColor}
          />
        </View>
        <View style={styles.cancelAndSaveButtonWrapStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setGenderDialog(false);
              setGender(customerData?.gender);
            }}
            style={styles.cancelButtonStyle}
          >
            <Text style={{ ...Fonts.primaryColor15SemiBold }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setGenderDialog(false);
            }}
            style={styles.dialogSaveButtonStyle}
          >
            <Text style={{ ...Fonts.whiteColor15SemiBold }}>Save</Text>
          </TouchableOpacity>
        </View>
      </Dialog.Container>
    );
  }

  function editFullNameDialog() {
    return (
      <Dialog.Container
        visible={fullNameDialog}
        contentStyle={styles.dialogContainerStyle}
        onRequestClose={() => setFullnameDialog(false)}
        headerStyle={{ padding: 0.0, margin: 0.0 }}
      >
        <Text
          style={{
            textAlign: "center",
            ...Fonts.blackColor14SemiBold,
            paddingBottom: Sizes.fixPadding + 3.0,
          }}
        >
          Change full name
        </Text>
        <TextInput
          value={changeText}
          onChangeText={(value) => setChangeText(value)}
          selectionColor={Colors.primaryColor}
          style={{
            ...Fonts.grayColor14Medium,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.grayColor,
          }}
        />
        <View style={styles.cancelAndSaveButtonWrapStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setFullnameDialog(false)}
            style={styles.cancelButtonStyle}
          >
            <Text style={{ ...Fonts.primaryColor15SemiBold }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (changeText.length == 0) {
                showToastWithGravity("Name can not be empty.");
              } else {
                setFullnameDialog(false);
                setFullName(changeText);
              }
            }}
            style={styles.dialogSaveButtonStyle}
          >
            <Text style={{ ...Fonts.whiteColor15SemiBold }}>Save</Text>
          </TouchableOpacity>
        </View>
      </Dialog.Container>
    );
  }

  function editPasswordDialog() {
    return (
      <Dialog.Container
        visible={passwordDialog}
        contentStyle={styles.dialogContainerStyle}
        headerStyle={{ padding: 0.0, margin: 0.0 }}
        onRequestClose={() => setPasswordDialog(false)}
      >
        <Text
          style={{
            textAlign: "center",
            ...Fonts.blackColor14SemiBold,
            paddingBottom: Sizes.fixPadding + 3.0,
          }}
        >
          Change Password
        </Text>
        <TextInput
          style={{
            borderBottomColor: Colors.grayColor,
            borderBottomWidth: 0.5,
            ...Fonts.grayColor14Medium,
          }}
          placeholder="Old Password"
          secureTextEntry={true}
          selectionColor={Colors.primaryColor}
        />
        <TextInput
          onChangeText={(value) => setChangePassword(value)}
          style={{
            marginVertical: Sizes.fixPadding,
            ...Fonts.grayColor14Medium,
            borderBottomColor: Colors.grayColor,
            borderBottomWidth: 0.5,
          }}
          placeholder="New Password"
          secureTextEntry={true}
          selectionColor={Colors.primaryColor}
        />
        <TextInput
          style={{
            ...Fonts.grayColor14Medium,
            borderBottomColor: Colors.grayColor,
            borderBottomWidth: 0.5,
          }}
          placeholder="Confirm New Password"
          secureTextEntry={true}
          selectionColor={Colors.primaryColor}
        />
        <View style={styles.cancelAndSaveButtonWrapStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setPasswordDialog(false)}
            style={styles.cancelButtonStyle}
          >
            <Text style={{ ...Fonts.primaryColor15SemiBold }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setPasswordDialog(false);
              setPassword(changePassword);
            }}
            style={styles.dialogSaveButtonStyle}
          >
            <Text style={{ ...Fonts.whiteColor15SemiBold }}>Save</Text>
          </TouchableOpacity>
        </View>
      </Dialog.Container>
    );
  }

  function editPhoneDialog() {
    return (
      <Dialog.Container
        visible={phoneDialog}
        contentStyle={styles.dialogContainerStyle}
        headerStyle={{ padding: 0.0, margin: 0.0 }}
        onRequestClose={() => setPhoneDialog(false)}
      >
        <Text
          style={{
            textAlign: "center",
            ...Fonts.blackColor14SemiBold,
            paddingBottom: Sizes.fixPadding + 3.0,
          }}
        >
          Change Phone Number
        </Text>
        <TextInput
          selectionColor={Colors.primaryColor}
          value={changePhone}
          onChangeText={(value) => setChangePhone(value)}
          style={{
            borderBottomColor: Colors.grayColor,
            borderBottomWidth: 0.5,
            ...Fonts.grayColor14Medium,
          }}
          keyboardType="numeric"
        />
        <View style={styles.cancelAndSaveButtonWrapStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setPhoneDialog(false)}
            style={styles.cancelButtonStyle}
          >
            <Text style={{ ...Fonts.primaryColor15SemiBold }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setPhoneDialog(false);
              setPhone(changePhone);
            }}
            style={styles.dialogSaveButtonStyle}
          >
            <Text style={{ ...Fonts.whiteColor15SemiBold }}>Save</Text>
          </TouchableOpacity>
        </View>
      </Dialog.Container>
    );
  }

  function editEmailDialog() {
    return (
      <Dialog.Container
        visible={emialDialog}
        contentStyle={styles.dialogContainerStyle}
        headerStyle={{ padding: 0.0, margin: 0.0 }}
        onRequestClose={() => setEmailDialog(false)}
      >
        <Text
          style={{
            textAlign: "center",
            ...Fonts.blackColor14SemiBold,
            paddingBottom: Sizes.fixPadding + 3.0,
          }}
        >
          Change Email
        </Text>
        <TextInput
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
          value={changeEmail}
          onChangeText={(value) => setChangeEmail(value)}
          style={{
            borderBottomColor: Colors.grayColor,
            borderBottomWidth: 0.5,
            ...Fonts.grayColor14Medium,
          }}
        />
        <View style={styles.cancelAndSaveButtonWrapStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setEmailDialog(false)}
            style={styles.cancelButtonStyle}
          >
            <Text style={{ ...Fonts.primaryColor15SemiBold }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setEmailDialog(false);
              setEmail(changeEmail);
            }}
            style={styles.dialogSaveButtonStyle}
          >
            <Text style={{ ...Fonts.whiteColor15SemiBold }}>Save</Text>
          </TouchableOpacity>
        </View>
      </Dialog.Container>
    );
  }

  function saveButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={profile_update}
        style={styles.saveButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor15SemiBold }}>Update Profile</Text>
      </TouchableOpacity>
    );
  }

  function showBottomSheet() {
    return (
      <BottomSheet
        isVisible={isBottomSheet}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
        onBackdropPress={() => setIsBottomSheet(false)}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsBottomSheet(false)}
          style={styles.bottomSheetStyle}
        >
          <Text
            style={{
              ...Fonts.blackColor14SemiBold,
              textAlign: "center",
              marginBottom: Sizes.fixPadding * 2.0,
            }}
          >
            Choose Option
          </Text>
          {actions.map((item, index) => (
            <TouchableOpacity
              onPress={() => pickImage(item.title)}
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: Sizes.fixPadding,
              }}
            >
              <MaterialIcons
                name={item.type}
                size={18}
                color={Colors.blackColor}
              />
              <Text
                style={{
                  ...Fonts.blackColor13SemiBold,
                  marginLeft: Sizes.fixPadding,
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </BottomSheet>
    );
  }

  function formData({ title, value }) {
    return (
      <View style={styles.formDataWrapStyle}>
        <View style={{ width: width / 3.0 }}>
          <Text style={{ ...Fonts.grayColor14SemiBold }}>{title}</Text>
        </View>
        <View style={styles.formValueAndForwardButtonWrapStyle}>
          <Text
            numberOfLines={1}
            style={{ flex: 1, ...Fonts.blackColor14SemiBold }}
          >
            {value}
          </Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={14}
            color={Colors.grayColor}
          />
        </View>
      </View>
    );
  }

  function personalBusinessButton() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: Sizes.fixPadding,
            paddingVertical: Sizes.fixPadding * 0.1,
            borderRadius: 1000,
            borderWidth: 1,
            borderColor: Colors.primaryColor,
            marginRight: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor13Medium }}>Personal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: Sizes.fixPadding,
            paddingVertical: Sizes.fixPadding * 0.1,
            borderRadius: 1000,
            borderWidth: 1,
            borderColor: Colors.grayColor,
          }}
        >
          <Text style={{ ...Fonts.blackColor13Medium }}>Business</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function profilePhoto() {
    return (
      <View style={styles.profilePhotoWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsBottomSheet(true)}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <SharedElement id={id}>
            <View style={styles.profilePhotoStyle}>
              <Image
                source={{ uri: customerData?.profile_photo_url }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          </SharedElement>
          {/* <View style={styles.addPhotoWrapStyle}>
            <MaterialIcons name="add" size={18} color={Colors.whiteColor} />
          </View> */}
        </TouchableOpacity>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back-ios"
          size={24}
          color={Colors.blackColor}
          onPress={() => navigation.pop()}
          style={{ flex: 0 }}
        />
        <View style={{ flex: 0.9 }}>
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
            Your Profile
          </Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    margin: Sizes.fixPadding * 2.0,
  },
  addPhotoWrapStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    height: 20.0,
    width: 20.0,
    borderRadius: 10.0,
    position: "absolute",
    bottom: 5.0,
    right: 0.0,
  },
  profilePhotoWrapStyle: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    top: -Sizes.fixPadding * 5,
    backgroundColor: Colors.whiteColor,
    padding: Sizes.fixPadding * 1.5,
    borderRadius: 10000,
  },
  formDataWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding * 0.5,
    paddingVertical: Sizes.fixPadding + 3.0,
    borderColor: "#F4F5F8",
    elevation: 5,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding,
    marginTop: Sizes.fixPadding + 10.0,
    // borderWidth: 1.0,
    shadowColor: Colors.grayColor,
  },
  formValueAndForwardButtonWrapStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width / 1.9,
    flex: 1,
    alignItems: "center",
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 100,
    backgroundColor: Colors.whiteColor,
    padding: Sizes.fixPadding * 2.0,
  },
  cancelButtonStyle: {
    flex: 1,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    marginRight: Sizes.fixPadding,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
  },
  dialogSaveButtonStyle: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    marginLeft: Sizes.fixPadding,
  },
  bottomSheetStyle: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 2.0,
    paddingTop: Sizes.fixPadding + 5.0,
  },
  profilePhotoStyle: {
    height: 90.0,
    width: 90.0,
    borderRadius: 50.0,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.primaryColor,
  },
  saveButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 0.5,
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "rgba(255, 66, 0, 0.3)",
    // borderWidth: 1.0,
    elevation: 1.0,
    shadowColor: Colors.primaryColor,
  },
  cancelAndSaveButtonWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 3.0,
  },
});

const mapStateToProps = (state) => ({
  customerData: state.customer.customerData,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
