import { StyleSheet, ImageBackground } from "react-native";

export const styleLogin = StyleSheet.create({
   containerLogin: {
      backgroundColor: "#293b42",
      textAlign: "center",
      height: "100%",
   },
   headerLogin: {
      alignItems: "center",
      height: 200,
   },
   logoLogin: {
      marginTop: 100,
      width: 250,
      height: 150,
   },
   contentLogin: {
      height: 150,
      width: "80%",
      alignSelf: "center",
   },
   quoteLogin: {
      marginTop: 20,
      color: "white",
      textAlign: "center",
      fontSize: 24,
      lineHeight: 45,
      fontWeight: "800",
      marginBottom: 20,
   },
   buttonLogin: {
      alignItems: "center",
      backgroundColor: "#a9a9a9",
      padding: 5,
      width: "20%",
      borderRadius: 10,
      marginTop: 20,
      alignSelf: "flex-end",
      margin: 40,
   },
   buttonLoginText: { fontSize: 15, fontWeight: "900" },
   formInput: {
      flex: 1,
      alignItems: "center",
      height: 200,
   },
   input: {
      height: 55,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: "80%",
      borderBottomWidth: 0.5,
      borderBottomColor: "white",
      marginBottom: -5,
      color: "white",
   },
   footerLogin: {
      flex: 0.5,
   },
   registerLink: {
      color: "#deb887",
      fontWeight: "bold",
      borderRadius: 2,
   },
});

export const styleRegister = StyleSheet.create({
   containerRegister: {
      backgroundColor: "#293b42",
      textAlign: "center",
      height: "100%",
   },
   headerRegister: {
      alignItems: "center",
      height: 180,
   },
   logoRegister: {
      marginTop: 100,
      width: 250,
      height: 50,
   },
   contentRegister: {
      height: 100,
      width: "80%",
      alignSelf: "center",
   },
   quoteRegister: {
      color: "white",
      fontSize: 28,
      lineHeight: 45,
      fontWeight: "800",
      marginBottom: 10,
   },
   formInput: {
      flex: 1,
      alignItems: "center",
      height: 200,
   },
   input: {
      height: 55,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: "80%",
      borderBottomWidth: 0.5,
      borderBottomColor: "white",
      marginBottom: -5,
      color: "white",
   },
   buttonRegister: {
      alignItems: "center",
      backgroundColor: "#a9a9a9",
      padding: 5,
      width: "25%",
      borderRadius: 20,
      marginTop: 20,
      alignSelf: "flex-end",
      marginRight: 40,
   },
   buttonRegisterText: { fontSize: 15, fontWeight: "900" },
   footerRegister: {
      flex: 0.5,
   },
   loginLink: {
      color: "#deb887",
      fontWeight: "bold",
      borderRadius: 2,
   },
});

export const styleHome = StyleSheet.create({
   container: {
      backgroundColor: "#293b42",
      textAlign: "center",
      height: "100%",
   },
   header: {
      alignItems: "center",
      height: 70,
   },
   logo: {
      marginTop: 10,
      width: 250,
      height: 50,
   },
   feed: {
      marginBottom: 70,
   },
   content: {
      flex: 1,
      flexDirection: "row",
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#329ea8",
   },
   boxContent: {},
});

export const createPostStyle = StyleSheet.create({
   containerRegister: {
      backgroundColor: "#293b42",
      textAlign: "center",
      flex: 1,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 15,
   },
   headerExit: {
      fontSize: 24,
      color: "white",
      marginLeft: 20,
      fontWeight: "bold",
   },
   headerPosting: {
      backgroundColor: "#3cecdc",
      padding: 8,
      borderRadius: 20,
      marginRight: 20,
      fontSize: 18,
      color: "white",
      width: 100,
      textAlign: "center",
      fontWeight: "bold",
   },
   input: {
      marginTop: 20,
      alignItems: "center",
   },
   content: {
      width: "90%",
      height: 200,
      borderBottomWidth: 0.2,
      borderColor: "white",
   },
   inptContent: {
      color: "white",
      fontSize: 18,
      padding: 10,
   },
   imgUrl: {
      width: "90%",
      color: "white",
      fontSize: 18,
      padding: 10,
      borderBottomWidth: 0.2,
      borderColor: "white",
   },
   tags: {
      width: "90%",
      color: "white",
      fontSize: 18,
      padding: 10,
      borderBottomWidth: 0.2,
      borderColor: "white",
   },
});
