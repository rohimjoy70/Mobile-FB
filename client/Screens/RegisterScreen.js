import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styleRegister } from "../style/styleSheet";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const REGISTER = gql`
   mutation Mutation($registerData: registerData) {
      register(registerData: $registerData) {
         email
         name
         username
         _id
      }
   }
`;

export default function RegisterScreen({ navigation }) {
   const [registerName, setRegisterName] = useState("");
   const [registerUsername, setRegisterUsername] = useState("");
   const [registerEmail, setRegisterEmail] = useState("");
   const [registerPassword, setRegisterPassword] = useState("");
   const [errMessage, setErrMessage] = useState("");

   const [registerHandler] = useMutation(REGISTER);

   const registerSubmit = async () => {
      try {
         await registerHandler({
            variables: {
               registerData: {
                  name: registerName,
                  email: registerEmail,
                  username: registerUsername,
                  password: registerPassword,
               },
            },
         });
         navigation.navigate("Login");
      } catch (error) {
         console.log(error);
         setErrMessage(error.message);
      }
   };

   return (
      <SafeAreaView style={styleRegister.containerRegister}>
         <View style={styleRegister.headerRegister}>
            <Image style={styleRegister.logoRegister} source={require("../assets/fb-logo.png")} />
         </View>
         <View style={styleRegister.contentRegister}>
            <Text style={styleRegister.quoteRegister}>Sign up for Tobabook to stay in touch with the world..</Text>
         </View>
         <View style={styleRegister.formInput}>
            <TextInput style={styleRegister.input} inputMode="text" placeholder="Full name" placeholderTextColor={"white"} onChangeText={setRegisterName} />
            <TextInput style={styleRegister.input} inputMode="text" placeholder="Username" placeholderTextColor={"white"} onChangeText={setRegisterUsername} />
            <TextInput style={styleRegister.input} inputMode="email" placeholder="Valid email" placeholderTextColor={"white"} onChangeText={setRegisterEmail} />
            <TextInput style={styleRegister.input} placeholder="Password" placeholderTextColor={"white"} secureTextEntry={true} onChangeText={setRegisterPassword} />
            <TouchableOpacity onPress={registerSubmit} style={styleRegister.buttonRegister} activeOpacity={0.4}>
               <View>
                  <Text style={styleRegister.buttonRegisterText}>Register</Text>
               </View>
            </TouchableOpacity>
            <View>
               <Text style={{ color: "red", marginTop: 20 }}>{errMessage}</Text>
            </View>
         </View>
         <View style={styleRegister.footerRegister}>
            <Text style={{ color: "white", textAlign: "center", marginTop: 100 }}>
               Already have account,{" "}
               <Text
                  style={styleRegister.loginLink}
                  onPress={() => {
                     navigation.navigate("Login");
                  }}
               >
                  login
               </Text>{" "}
               now.
            </Text>
         </View>
      </SafeAreaView>
   );
}
