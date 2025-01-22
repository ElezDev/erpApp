import React from "react";
import {
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationProp } from "@react-navigation/native";
import Header from "../navigations/Header";
import Search from "../utils/Search";
import BannerERP from "./BannerERP";
import GraficosResumen from "../graficos/GraficosResumen";

const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const headerAnim = React.useRef(new Animated.Value(0)).current;
  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: async () => {
            await AsyncStorage.removeItem("access_token");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" as never }],
            });
          },
        },
      ],
      { cancelable: false }
    );
  };
  React.useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        <Header navigation={navigation} />
      </Animated.View>
      <Search />
      <BannerERP />
      <GraficosResumen />
      <TouchableOpacity style={styles.followButton} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      {/* <Doctor /> */}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 11,
    paddingTop: 10,
  },
  followButton: {
    backgroundColor: "#FF6699",
    padding: 15,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});
