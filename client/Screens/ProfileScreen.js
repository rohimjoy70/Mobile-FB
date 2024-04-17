import { Text, View, Image, TouchableHighlight, FlatList } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { AuthContex } from "../helpers/authContex";
import { gql, useMutation, useQuery } from "@apollo/client";

const PROFILE = gql`
   query GetUserDataById {
      getUserDataById {
         _id
         name
         username
         email
         follower {
            _id
            followingId
            followerId
            createdAt
            updatedAt
         }
         followerDetail {
            _id
            name
            username
            email
         }
         following {
            _id
            followingId
            followerId
            createdAt
            updatedAt
         }
         followingDetail {
            _id
            name
            username
            email
         }
      }
   }
`;

const UNFOLLOW = gql`
   mutation Mutation($followingId: ID) {
      follow(followingId: $followingId) {
         _id
         followingId
         followerId
         createdAt
         updatedAt
         message
      }
   }
`;

const DEL_FOLLOWER = gql`
   mutation DelFollower($followerId: ID) {
      delFollower(followerId: $followerId) {
         message
      }
   }
`;

export default function ProfileScreen({ route }) {
   const { setIsLogin } = React.useContext(AuthContex);
   const [tabProfile, setTabProfile] = React.useState("following");

   const { loading, error, data, refetch } = useQuery(PROFILE);
   const [unfollowHandler] = useMutation(UNFOLLOW);
   const [delFollowerHandler] = useMutation(DEL_FOLLOWER);

   const unfollowSubmit = async (idUnfollow) => {
      try {
         console.log("Start unfollow process");
         const result = await unfollowHandler({
            variables: { followingId: idUnfollow },
         });
         console.log(result.data.follow.message);
         await refetch();
      } catch (error) {
         console.log(error);
      }
   };

   const delFollowSubmit = async (idDelFollower) => {
      try {
         console.log("Start delete follower");
         const result = await delFollowerHandler({
            variables: { followerId: idDelFollower },
         });
         console.log(result);
         refetch();
      } catch (error) {
         console.log(error);
      }
   };

   React.useEffect(() => {
      refetch();
   }, []);

   if (loading) {
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

   if (error) return <Text>`Error! ${error.message}`</Text>;

   if (route.params && route.params.reload) {
      refetch();
   }

   return (
      <View
         style={{
            flex: 1,
            backgroundColor: "#293b42",
         }}
      >
         <View
            style={{
               flex: 0.4,
               borderBottomWidth: 0.5,
               borderColor: "white",
               alignItems: "center",
               justifyContent: "center",
            }}
         >
            <Image source={require("../assets/mockup.jpeg")} style={{ width: 100, height: 100, borderRadius: 100 }} />
            <View style={{ alignItems: "center" }}>
               <Text style={{ color: "white", marginTop: 20 }}>{data.getUserDataById.name}</Text>
               <Text style={{ color: "white", fontStyle: "italic" }}> (@{data.getUserDataById.username})</Text>
            </View>
         </View>
         <View style={{ flex: 1 }}>
            <View
               style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 10,
               }}
            >
               <TouchableHighlight
                  activeOpacity={0.9}
                  onPress={() => {
                     setTabProfile("following");
                  }}
                  style={{
                     backgroundColor: "#3cecdc",
                     borderRadius: 10,
                     padding: 5,
                  }}
               >
                  <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Following</Text>
               </TouchableHighlight>
               <TouchableHighlight
                  activeOpacity={0.9}
                  onPress={() => {
                     setTabProfile("follower");
                  }}
                  style={{
                     backgroundColor: "#3cecdc",
                     borderRadius: 10,
                     padding: 5,
                  }}
               >
                  <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Follower</Text>
               </TouchableHighlight>
            </View>
            <View style={{ padding: 10 }}>
               {tabProfile == "following" ? (
                  <FlatList
                     data={data.getUserDataById.followingDetail}
                     renderItem={(item) => {
                        return (
                           <View
                              style={{
                                 flexDirection: "row",
                                 justifyContent: "space-between",
                                 marginLeft: 10,
                                 marginRight: 10,
                                 marginBottom: 10,
                                 alignItems: "center",
                              }}
                           >
                              <Image style={{ width: 60, height: 60, borderRadius: 60 }} source={require("../assets/mockup.jpeg")} />
                              <View>
                                 <Text style={{ color: "white" }}>{item.item.name}</Text>
                                 <Text style={{ color: "white", fontStyle: "italic" }}>@{item.item.username}</Text>
                              </View>
                              <TouchableHighlight
                                 onPress={() => {
                                    unfollowSubmit(item.item._id);
                                 }}
                                 style={{
                                    borderBottomWidth: 0.5,
                                    borderColor: "white",
                                    backgroundColor: "#fa0505",
                                    padding: 5,
                                    borderRadius: 5,
                                 }}
                              >
                                 <Text style={{ color: "white", fontWeight: "bold" }}>Unfollow</Text>
                              </TouchableHighlight>
                           </View>
                        );
                     }}
                     keyExtractor={(item) => item._id}
                  />
               ) : (
                  ""
               )}
               {tabProfile == "follower" ? (
                  <FlatList
                     data={data.getUserDataById.followerDetail}
                     renderItem={(item) => {
                        return (
                           <View
                              style={{
                                 flexDirection: "row",
                                 justifyContent: "space-between",
                                 marginLeft: 10,
                                 marginRight: 10,
                                 marginBottom: 10,
                                 alignItems: "center",
                              }}
                           >
                              <Image style={{ width: 60, height: 60, borderRadius: 60 }} source={require("../assets/mockup.jpeg")} />
                              <View>
                                 <Text style={{ color: "white" }}>{item.item.name}</Text>
                                 <Text style={{ color: "white", fontStyle: "italic" }}>@{item.item.username}</Text>
                              </View>
                              <TouchableHighlight
                                 onPress={() => {
                                    delFollowSubmit(item.item._id);
                                 }}
                                 style={{
                                    backgroundColor: "#ff4500",
                                    padding: 5,
                                    borderRadius: 5,
                                 }}
                              >
                                 <Text style={{ color: "white" }}>Delete</Text>
                              </TouchableHighlight>
                           </View>
                        );
                     }}
                     keyExtractor={(item) => item._id}
                  />
               ) : (
                  ""
               )}
            </View>
         </View>
         <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 2, marginRight: 2 }}>
            <TouchableHighlight
               style={{ alignSelf: "flex-end" }}
               onPress={async () => {
                  setIsLogin(false);
                  await SecureStore.deleteItemAsync("access_token");
                  await SecureStore.deleteItemAsync("username");
               }}
            >
               <Image style={{ width: 100, height: 130 }} source={require("../assets/LogoutTrans.png")} />
            </TouchableHighlight>
         </View>
      </View>
   );
}
