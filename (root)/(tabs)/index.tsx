import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global_provider";

// Define the type for the exercise item
interface Exercise {
  id: string;
  title: string;
  sets: string;
  calories?: string;
  image: string;
}

// Sample data with calories for both exercises
const exercises: Exercise[] = [
  {
    id: "1",
    title: "Squat Exercises",
    sets: "2 Sets",
    calories: "105 Kcal", // Added calories for consistency
    image: "https://source.unsplash.com/100x100/?squat,fitness",
  },
  {
    id: "2",
    title: "Push-Ups Exercises",
    sets: "2 Sets",
    calories: "105 Kcal", // Added calories for consistency
    image: "https://source.unsplash.com/100x100/?pushup,workout",
  },
];

const HomeScreen = () => {
  const { user, loading } = useGlobalContext();
  const router = useRouter();

  // Type the exercise parameter here
  const handleCardPress = (exercise: Exercise) => {
    if (exercise.title === "Push-Ups Exercises") {
      router.push("/(root)/screens/pushups"); // Updated to match the actual route
    } else {
      alert(`${exercise.title} screen not implemented yet.`);
    }
  };

  return (
    <View className="flex-1 bg-[#1a1a2e] px-5">
      {/* Header */}
      <View className="flex-row justify-between items-center py-5">
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-lg font-bold text-white bg-[#6a0dad] py-2 px-4 rounded-lg">
            👤 Hi, {user?.name || "Guest"}
          </Text>
        )}

        {/* Notification Bell Icon */}
        <TouchableOpacity className="relative">
          <Image
            source={icons.bell}
            style={{ width: 22, height: 22, tintColor: "#fff" }}
            resizeMode="contain"
          />
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
            <Text className="text-xs text-white font-bold">0</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Flex Points */}
      <Text className="text-xl font-bold text-orange-500 mb-3">
        🔥 Flex Points: 100
      </Text>

      {/* Exercise Cards */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCardPress(item)}
            className="flex-row bg-white rounded-lg my-2 p-4 items-center"
          >
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">⚡ {item.sets}</Text>
              <Text className="text-sm text-gray-500 mt-1">🔥 {item.calories}</Text>
            </View>
            <Image
              source={{ uri: item.image }}
              className="w-20 h-20 rounded-lg"
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      {/* Bottom Navigation is handled by the Tabs Layout */}
    </View>
  );
};

export default HomeScreen;
