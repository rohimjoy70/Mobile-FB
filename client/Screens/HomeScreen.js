import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";

// tab navigator
import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

// import component
import CreatePostScreen from "./CreatePostScreen";
import BookScreen from "./BookScreen";
import ProfileScreen from "./ProfileScreen";
import SearchUserScreen from "./SearchUserScreen";
import { AuthContex } from "../helpers/authContex";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
   const { setUsernameLogin } = useContext(AuthContex);

   const getUsernameLogin = async () => {
      try {
         const username = await SecureStore.getItemAsync("username");
         console.log(username);
         setUsernameLogin(username);
      } catch (error) {
         console.log(error);
      }
   };

   React.useEffect(() => {
      getUsernameLogin();
   }, []);

   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
               let iconName;

               if (route.name === "HomePage") {
                  iconName = focused ? "home" : "home-outline";
               } else if (route.name === "Profile") {
                  iconName = focused ? "person" : "person-outline";
               } else if (route.name === "Create Post") {
                  iconName = focused ? "add" : "add-outline";
               } else if (route.name === "Search") {
                  iconName = focused ? "search" : "search-outline";
               }

               // You can return any component that you like here!
               return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#329ea8",
            tabBarInactiveTintColor: "#293b42",
            headerShown: false,
            tabBarBackground: () => {
               return (
                  <View
                     style={{
                        backgroundColor: "white",
                        width: "100%",
                        height: "100%",
                     }}
                  ></View>
               );
            },
         })}
      >
         <Tab.Screen name="HomePage" component={BookScreen} />
         <Tab.Screen name="Search" component={SearchUserScreen} />
         <Tab.Screen name="Create Post" component={CreatePostScreen} />
         <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
   );
}
