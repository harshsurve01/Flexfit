import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global_provider";

import icons from "@/constants/icons";
import { settings } from "@/constants/data"; // Ensure you have this data or replace it with static options

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  iconStyle?: object;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle = "",
  iconStyle = {},
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} style={[{ tintColor: "white" }, iconStyle]} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-white ${textStyle}`}>{title}</Text>
    </View>

    {showArrow && (
      <Image source={icons.rightArrow} style={{ tintColor: "white" }} className="size-5" />
    )}
  </TouchableOpacity>
);

const Profile = () => {
  const { user, refetch } = useGlobalContext();

  const handleLogout = async () => {
    const result = await Logout();
    if (result) {
      Alert.alert("Success", "Logged out successfully");
      refetch();
    } else {
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <SafeAreaView className="h-full bg-[#161626]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        {/* Header Section */}
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold text-white">Profile</Text>
          <TouchableOpacity onPress={() => Alert.alert("Notifications", "No new notifications")}>
            <Image source={icons.bell} style={{ tintColor: "white" }} className="size-5" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={{ uri: user?.avatar || "https://via.placeholder.com/150" }}
              className="size-44 relative rounded-full"
            />
            <TouchableOpacity
              className="absolute bottom-11 right-2"
              onPress={() => Alert.alert("Edit Profile", "Edit profile feature coming soon!")}
            >
              <Image source={icons.edit} style={{ tintColor: "white" }} className="size-9" />
            </TouchableOpacity>
            <Text className="text-2xl font-rubik-bold text-white mt-2">
              {user?.name || "Guest User"}
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <View className="flex flex-col mt-10">
          <SettingsItem
            icon={icons.calendar}
            title="Calendar"
            onPress={() => Alert.alert("Calendar", "Calendar feature coming soon!")}
          />
          <SettingsItem
            icon={icons.wallet}
            title="Payments"
            onPress={() => Alert.alert("Payments", "Payment feature coming soon!")}
          />
        </View>

        {/* Additional Settings */}
        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem
              key={index}
              {...item}
              textStyle="text-white"
              iconStyle={{ tintColor: "white" }}
            />
          ))}
        </View>

        {/* Logout Section */}
        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-red-500"
            iconStyle={{ tintColor: "red" }}
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
