import React from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import color from "src/constant/color";

interface CustomHeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  onBackPress,
  showBackButton = false,
  onMenuPress,
}) => {
  const navigation = useNavigation<any>();

  const handleNotificationsPress = () => {
    navigation.navigate('Notification');
  };
  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={handleNotificationsPress} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: color.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    elevation: 4,
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 12,
  },
});

export default CustomHeader;
