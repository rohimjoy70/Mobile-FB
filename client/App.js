import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import * as SecureStore from "expo-secure-store";

// import screen
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import HomeScreen from "./Screens/HomeScreen";
import DetailPostScreen from "./Screens/DetailPostScreen";

// import apolloContex
import { AuthContex } from "./helpers/authContex";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usernameLogin, setUsernameLogin] = useState("");

  const checkHasLogin = async () => {
    try {
      let token = await SecureStore.getItemAsync("access_token");
      if (token) {
        setIsLogin(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHasLogin();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: "#293b42",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Please wait...</Text>
      </View>
    );
  }

  return (
    <AuthContex.Provider
      value={{ isLogin, setIsLogin, usernameLogin, setUsernameLogin }}
    >
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLogin ? (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen
                  name="Detail Post"
                  component={DetailPostScreen}
                  options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: "#293b42" },
                    headerTintColor: "white",
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </AuthContex.Provider>
  );
}
