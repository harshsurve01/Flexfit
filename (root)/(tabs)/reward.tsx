// reward.tsx

import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useGlobalContext } from "@/lib/global_provider";
import icons from "@/constants/icons";

const RewardPage = () => {
  const { user, loading } = useGlobalContext();

  // For demonstration, we assume user.flexPoints is available.
  // Otherwise, you can set a local variable, e.g., const userFlexPoints = 300;
  const userFlexPoints = user?.flexPoints || 300;

  // Voucher data now includes a pointsRequired field between 100 and 500.
  const vouchers = [
    {
      id: "1",
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Starbucks-Logo.png",
      title: "Claim Voucher",
      pointsRequired: 200,
    },
    {
      id: "2",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Stripe_logo%2C_revised_2016.svg",
      title: "Claim Voucher",
      pointsRequired: 400,
    },
    {
      id: "3",
      logo: "https://via.placeholder.com/100",
      title: "Claim Voucher",
      pointsRequired: 500,
    },
    {
      id: "4",
      logo: "https://via.placeholder.com/100",
      title: "Claim Voucher",
      pointsRequired: 150,
    },
  ];

  const rewards = [
    {
      id: "1",
      image: "https://source.unsplash.com/100x100/?headphones",
      points: "5999 pts",
    },
    {
      id: "2",
      image: "https://source.unsplash.com/100x100/?headphones",
      points: "5999 pts",
    },
    {
      id: "3",
      image: "https://source.unsplash.com/100x100/?headphones",
      points: "5000 pts",
    },
    {
      id: "4",
      image: "https://source.unsplash.com/100x100/?headphones",
      points: "5000 pts",
    },
  ];

  // Handler when voucher is tapped
  const handleVoucherPress = (voucherPoints: number) => {
    if (userFlexPoints < voucherPoints) {
      Alert.alert("Insufficient Flex Points", "You don't have enough flex points");
    } else {
      Alert.alert("Voucher Claimed", "You have claimed the voucher successfully!");
    }
  };

  return (
    <View className="flex-1 bg-[#161626]">
      {/* Common Header */}
      <View className="flex-row justify-between items-center bg-[#6a0dad] p-4 rounded-lg m-4">
        <View className="flex-row items-center">
          <Image
            source={{
              uri: user?.avatar || "https://via.placeholder.com/50",
            }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <Text className="text-lg font-bold text-white">
            👤 Hi, {loading ? "Loading..." : user?.name || "Guest"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Notifications", "No new notifications")
          }
          className="relative"
        >
          <Image
            source={icons.bell}
            style={{ tintColor: "white", width: 24, height: 24 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="p-4">
        {/* Flex Points Display */}
        <Text className="text-orange-500 font-bold text-lg my-2">
          Flex Points: {userFlexPoints}
        </Text>

        {/* Get Rewarded Section */}
        <View className="flex-row justify-between items-center my-3">
          <Text className="text-white font-bold text-lg">Get Rewarded</Text>
          <Text className="text-gray-400 text-sm">See all</Text>
        </View>

        {/* Horizontally Scrollable Vouchers */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {vouchers.map((voucher) => (
            <TouchableOpacity
              key={voucher.id}
              onPress={() => handleVoucherPress(voucher.pointsRequired)}
              className="bg-white p-4 rounded-lg flex-row items-center mr-3"
            >
              <Image
                source={{ uri: voucher.logo }}
                className="w-10 h-10 mr-2"
              />
              <View>
                <Text className="text-orange-500 font-bold text-sm">
                  {voucher.title}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {voucher.pointsRequired} pts
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mega Reward Section */}
        <Text className="text-white font-bold text-lg my-4">Mega Reward</Text>

        <FlatList
          data={rewards}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <View className="bg-white p-3 rounded-lg items-center mb-4">
              <Image source={{ uri: item.image }} className="w-24 h-24" />
              <Text className="text-red-500 font-bold mt-2">{item.points}</Text>
              <TouchableOpacity className="bg-black px-4 py-2 rounded-md mt-2">
                <Text className="text-white">Add to Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default RewardPage;
