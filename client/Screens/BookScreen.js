import { Text, View, Image, FlatList, TouchableHighlight } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styleHome } from "../style/styleSheet";
import { gql, useMutation, useQuery } from "@apollo/client";
import { formatTime } from "../helpers/formated";

// tab navigator
import * as React from "react";

const GET_POSTS = gql`
   query Query {
      getDataPosts {
         _id
         authorId
         content
         comments {
            postId
            content
            username
            createdAt
            updatedAt
         }
         createdAt
         detailAuthor {
            email
            name
            username
            _id
         }
         imgUrl
         likes {
            username
            createdAt
            updatedAt
         }
         tags
         updatedAt
      }
   }
`;

const LIKE = gql`
   mutation Mutation($postId: ID) {
      like(postId: $postId) {
         message
      }
   }
`;

export default function BookScreen({ navigation, route }) {
   const { loading, error, data, refetch: refreshPost } = useQuery(GET_POSTS);
   const [likeHandler] = useMutation(LIKE);

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

   if (error) {
      return (
         <View
            style={{
               backgroundColor: "#293b42",
               flex: 1,
               justifyContent: "center",
               alignItems: "center",
            }}
         >
            <Text style={{ color: "white" }}>`Error! ${error.message}`</Text>
         </View>
      );
   }

   const likeSubmit = async (postId) => {
      try {
         const result = await likeHandler({ variables: { postId } });
         await refreshPost();
         console.log(result.data.like.message);
      } catch (error) {
         console.log(error);
      }
   };

   if (route.params && route.params.reload) {
      refreshPost();
   }
   // console.log(data);
   return (
      <SafeAreaView style={styleHome.container}>
         <View style={styleHome.header}>
            <Image style={styleHome.logo} source={require("../assets/fb-logo.png")} />
         </View>
         <View style={styleHome.feed}>
            <FlatList
               data={data.getDataPosts}
               renderItem={({ item }) => {
                  return (
                     <View style={styleHome.content}>
                        <View>
                           <Image
                              style={{
                                 height: 50,
                                 width: 50,
                                 borderRadius: 50,
                                 margin: 10,
                              }}
                              source={require("../assets/mockup.jpeg")}
                           />
                        </View>
                        <View style={styleHome.boxContent}>
                           <View
                              style={{
                                 flexDirection: "row",
                                 justifyContent: "space-between",
                                 marginTop: 10,
                              }}
                           >
                              <Text
                                 style={{
                                    color: "white",
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    fontStyle: "italic",
                                 }}
                              >
                                 @{item?.detailAuthor?.username}
                              </Text>
                              <Text
                                 style={{
                                    color: "#a9a9a9",
                                    fontSize: 18,
                                 }}
                              >
                                 ~ {formatTime(item.createdAt)}
                              </Text>
                           </View>
                           <Text
                              style={{
                                 color: "#f0ffff",
                                 fontSize: 18,
                                 marginBottom: 5,
                                 width: 310,
                              }}
                           >
                              {item.content}
                           </Text>
                           <View>
                              {item.tags.map((el) => {
                                 return (
                                    <Text
                                       style={{
                                          color: "#f0ffff",
                                          fontSize: 18,
                                          width: 310,
                                       }}
                                    >
                                       #{el}
                                    </Text>
                                 );
                              })}
                           </View>
                           <Image source={{ uri: item.imgUrl }} style={{ width: 300, height: 200, borderRadius: 20, borderColor: "white", borderWidth: 3 }} />

                           <View style={{ flexDirection: "row", padding: 10, gap: 5 }}>
                              <TouchableHighlight
                                 onPress={() => {
                                    likeSubmit(item._id);
                                 }}
                              >
                                 <Image style={{ width: 28, height: 20 }} source={require("../assets/like.png")} />
                              </TouchableHighlight>
                              <Text style={{ color: "white" }}>{item.likes.length}</Text>
                              <TouchableHighlight
                                 onPress={() => {
                                    navigation.navigate("Detail Post", {
                                       nama: "sayang",
                                       postId: item._id,
                                    });
                                 }}
                              >
                                 <Image style={{ width: 28, height: 24, marginLeft: 5 }} source={require("../assets/comment.png")} />
                              </TouchableHighlight>
                              <Text style={{ color: "white" }}>{item.comments.length}</Text>
                              <TouchableHighlight
                                 onPress={() => {
                                    navigation.navigate("Detail Post", {
                                       postId: item._id,
                                    });
                                 }}
                              >
                                 <Image style={{ width: 36, height: 24, marginLeft: 5 }} source={require("../assets/detail.png")} />
                              </TouchableHighlight>
                           </View>
                        </View>
                     </View>
                  );
               }}
            />
         </View>
      </SafeAreaView>
   );
}
