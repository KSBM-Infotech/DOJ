import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { LogBox } from 'react-native';
import LoadingScreen from "./components/loadingScreen";
import BottomTabBarScreen from "./components/bottomTabBarScreen";
import SearchScreen from "./screens/search/searchScreen";
import ProductsScreen from "./screens/products/productsScreen";
import RestaurantsListScreen from "./screens/restaurantsList/restaurantsListScreen";
import RestaurantDetailScreen from "./screens/restaurantDetail/restaurantDetailScreen";
import FoodOfDifferentCategoriesScreen from "./screens/foodOfDifferentCategories/foodOfDifferentCategoriesScreen";
import OfferDetailScreen from "./screens/offerDetail/offerDetailScreen";
import SelectDeliveryAddressScreen from "./screens/selectDeliveryAddress/selectDeliveryAddressScreen";
import AddNewAddressScreen from "./screens/addNewAddress/addNewAddressScreen";
import SelectPaymentMethodScreen from "./screens/selectPaymentMethod/selectPaymentMethodScreen";
import OrderPlacedInfoScreen from "./screens/orderPlacedInfo/orderPlacedInfoScreen";
import OrderDetailScreen from "./screens/orderDetail/orderDetailScreen";
import TrackOrderScreen from "./screens/trackOrder/trackOrderScreen";
import MessageScreen from "./screens/message/messageScreen";
import EditProfileScreen from "./screens/editProfile/editProfileScreen";
import PaymentMethodsScreen from "./screens/paymentMethods/paymentMethodsScreen";
import AddNewPaymentMathodScreen from "./screens/addNewPaymentMethod/addNewPaymentMathodScreen";
import AddressScreen from "./screens/address/addressScreen";
import ShareAndEarnScreen from "./screens/shareAndEarn/shareAndEarnScreen";
import NotificationsScreen from "./screens/notifications/notificationsScreen";
import FavoritesScreen from "./screens/favorites/favoritesScreen";
import SettingsScreen from "./screens/settings/settingsScreen";
import SplashScreen from "./screens/splashScreen";
import SigninScreen from "./screens/auth/signinScreen";
import SignupScreen from "./screens/auth/signupScreen";
import VerificationScreen from "./screens/auth/verificationScreen";
import SelectAddress from './screens/SelectAddress';
import ProfileScreen from './screens/profile/profileScreen';
import ProfileActivity from './screens/ProfileActivity';
import Dining from './screens/Dining';
import Money from './screens/Money';
import UpdateName from './screens/auth/UpdateName';
import Rating from './screens/Rating';
import SelectLocation from './screens/mapScreen/SelectLocation';
import OrdersScreen from './screens/orders/ordersScreen';
import CartScreen from './screens/cart/cartScreen';
import DiningRestaurant from './screens/DiningRestaurant';
import ApplyPromocode from './screens/ApplyPromocode';
import Notifee, {
  AndroidChannel,
  AndroidImportance,
  Notification,
  EventType,
  Event,
  AuthorizationStatus,
  TimestampTrigger,
  RepeatFrequency,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import BookSeat from './screens/BookSeat';
import BookSeatOverView from './screens/BookSeatOverView';
import HomeSearch from './navigations/HomeSearch';
import ConfirmDining from './screens/ConfirmDining';
import DiningHistory from './screens/DiningHistory';
import Wallet from './screens/Wallet';
import GiftCards from './screens/GiftCards';
import GiftCardPurchase from './screens/GiftCardPurchase';
import LikedRestaurant from './screens/LikedRestaurant';
import AddVoucher from './screens/AddVoucher';

LogBox.ignoreAllLogs();

const Stack = createSharedElementStackNavigator();

const channels: AndroidChannel[] = [
  {
    name: 'High Importance',
    id: 'high',
    importance: AndroidImportance.HIGH,
    // sound: 'hollow',
  },
  {
    name: '🐴 Sound',
    id: 'custom_sound',
    importance: AndroidImportance.HIGH,
    sound: 'horse.mp3',
  },
  {
    name: 'Default Importance',
    id: 'default',

    importance: AndroidImportance.DEFAULT,
  },
  {
    name: 'Low Importance',
    id: 'low',
    importance: AndroidImportance.LOW,
  },
  {
    name: 'Min Importance',
    id: 'min',
    importance: AndroidImportance.MIN,
  },
];

const colors: {[key: string]: string} = {
  custom_sound: '#f449ee',
  high: '#f44336',
  default: '#2196f3',
  low: '#ffb300',
  min: '#9e9e9e',
};

async function onMessage(message: RemoteMessage): Promise<void> {
  console.log('New FCM Message', message.data);
  let notification = message.data;
  if (notification?.type == 'new_order') {
    await Notifee.displayNotification({
      title: notification?.title,
      // subtitle: '3223',
      body: notification?.body,
      android: {
        channelId: 'default',
        tag: 'hello1',
        // actions: [{title: 'View'}],
      },
    });
  } else {
    await Notifee.displayNotification({
      title: notification?.title,
      // subtitle: '3223',
      body: notification?.body,
      android: {channelId: 'default', tag: 'hello1'},
    });
  }
}

async function onBackgroundMessage(message: RemoteMessage): Promise<void> {
  console.log('onBackgroundMessage New FCM Message', message);
  await Notifee.displayNotification({
    title: 'onMessage',
    body: `with message ${message.messageId}`,
    android: {channelId: 'default', tag: 'hello1'},
  });
}

messaging().setBackgroundMessageHandler(onBackgroundMessage);


const App = () => {
  async function init(): Promise<void> {
    messaging().onMessage(onMessage);
    await Promise.all(channels.map($ => Notifee.createChannel($)));
    await Notifee.setNotificationCategories([
      {
        id: 'actions',
        actions: [
          {
            id: 'like',
            title: 'Like Post',
          },
          {
            id: 'dislike',
            title: 'Dislike Post',
          },
        ],
      },
      {
        id: 'stop',
        actions: [
          {
            id: 'stop',
            title: 'Dismiss',
          },
        ],
      },
      {
        id: 'dismiss',
        actions: [
          {
            id: 'dismiss',
            title: 'Dismiss',
          },
        ],
      },
      {
        id: 'communications',
        actions: [
          {
            id: 'communication',
            title: 'test',
            input: true,
          },
        ],
      },
    ]);
  }

  useEffect(() => {
    init().catch(e => console.log(e));
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen name="Signin" component={SigninScreen} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="BottomTabBar" component={BottomTabBarScreen} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="RestaurantsList" component={RestaurantsListScreen} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen}
          sharedElements={(route, otherRoute, showing) => {
            const id = route.params.id;
            return [id];
          }}
        />
        <Stack.Screen name="FoodOfDifferentCategories" component={FoodOfDifferentCategoriesScreen} />
        <Stack.Screen name="OfferDetail" component={OfferDetailScreen}
          sharedElements={(route, otherRoute, showing) => {
            const item = route.params.item;
            return [item.id];
          }}
        />
        <Stack.Screen name="SelectDeliveryAddress" component={SelectDeliveryAddressScreen} />
        <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} />
        <Stack.Screen name="SelectPaymentMethod" component={SelectPaymentMethodScreen} />
        <Stack.Screen name="OrderPlaceInfo" component={OrderPlacedInfoScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
        <Stack.Screen name="Message" component={MessageScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen}
          sharedElements={(route, otherRoute, showing) => {
            const id = route.params.id;
            return [id];
          }}
        />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="AddNewPaymentMethod" component={AddNewPaymentMathodScreen} />
        <Stack.Screen name="Address" component={AddressScreen} />
        <Stack.Screen name="ShareAndEarn" component={ShareAndEarnScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name='selectAddress' component={SelectAddress}  />
        <Stack.Screen name='profile' component={ProfileScreen} />
        <Stack.Screen name='profileActivity' component={ProfileActivity} />
        <Stack.Screen name='dining' component={Dining} />
        <Stack.Screen name='money' component={Money} />
        <Stack.Screen name='updateName' component={UpdateName}  />
        <Stack.Screen name='rating' component={Rating} />
        <Stack.Screen name='selectLocation' component={SelectLocation} />
        <Stack.Screen name='orderScreen' component={OrdersScreen} />
        <Stack.Screen name='cartScreen' component={CartScreen} />
        <Stack.Screen name='diningRestaurant' component={DiningRestaurant} />
        <Stack.Screen name='bookSeat' component={BookSeat} />
        <Stack.Screen name='bookSeatOverView' component={BookSeatOverView} />
        <Stack.Screen name='homeSearch' component={HomeSearch} />
        <Stack.Screen name='confirmDining' component={ConfirmDining} />
        <Stack.Screen name='diningHistory' component={DiningHistory} />
        <Stack.Screen name='wallet' component={Wallet} />
        <Stack.Screen name='giftCards' component={GiftCards} />
        <Stack.Screen name='giftCardPurchase' component={GiftCardPurchase} />
        <Stack.Screen name='likedRestaurant' component={LikedRestaurant} />
        <Stack.Screen name='addVoucher' component={AddVoucher} />
        <Stack.Screen name='applyPromocode' component={ApplyPromocode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;