// dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useGlobalContext } from "@/lib/global_provider";
import { Client, Databases, Query } from "react-native-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6782bc1d000ee590075f")
  .setPlatform("com.hpv.flexfit");

const databases = new Databases(client);

interface DailyTotal {
  id: string;
  title: string;
  value: string;
  icon: string;
  count: number;
  flexpoints: number;
  date: string;
}

interface DateItem {
  id: string;
  day: string;
  date: string;
  utcDate: string;
  startUTC: string;
  endUTC: string;
}

const toLocalDateString = (utcDate: string) => {
  const date = new Date(utcDate);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

const Dashboard = () => {
  const { user } = useGlobalContext();
  const [selectedDate, setSelectedDate] = useState("");
  const [dailyTotal, setDailyTotal] = useState<DailyTotal | null>(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState<DateItem[]>([]);

  useEffect(() => {
    const generateWeekDates = () => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      const currentWeekDates: DateItem[] = [];

      for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        const utcYear = date.getUTCFullYear();
        const utcMonth = date.getUTCMonth();
        const utcDate = date.getUTCDate();

        const startUTC = new Date(Date.UTC(utcYear, utcMonth, utcDate)).toISOString();
        const endUTC = new Date(Date.UTC(utcYear, utcMonth, utcDate, 23, 59, 59, 999)).toISOString();

        currentWeekDates.push({
          id: startUTC,
          day: days[date.getDay()],
          date: utcDate.toString(),
          utcDate: startUTC,
          startUTC,
          endUTC
        });
      }

      setDates(currentWeekDates);
      setSelectedDate(new Date().toISOString());
    };

    generateWeekDates();
  }, []);

  useEffect(() => {
    const fetchDailyTotal = async () => {
      if (!user?.$id || !selectedDate) return;

      try {
        setLoading(true);
        const selectedDateData = dates.find(d => d.id === selectedDate);
        
        if (!selectedDateData) return;

        const response = await databases.listDocuments(
          "67a0fae6002c2c5a3b13",
          "user_stats",
          [
            Query.equal("user_id", user.$id),
            Query.greaterThanEqual("lastUpdated", selectedDateData.startUTC),
            Query.lessThanEqual("lastUpdated", selectedDateData.endUTC)
          ]
        );

        // Calculate daily totals
        const totalPushups = response.documents.reduce((sum, doc) => sum + doc.pushup_count, 0);
        const totalFlexpoints = Math.floor(totalPushups / 10);

        setDailyTotal({
          id: selectedDateData.id,
          title: "Daily Summary",
          value: `${totalPushups} Total Pushups`,
          icon: "bar-chart-outline",
          count: totalPushups,
          flexpoints: totalFlexpoints,
          date: selectedDateData.startUTC
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyTotal();
  }, [user?.$id, selectedDate, dates]);

  const DateItem = ({ item }: { item: DateItem }) => {
    const isSelected = item.id === selectedDate;
    const isToday = new Date(item.startUTC).toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(item.id)}
        className={`px-4 py-2 mx-1 rounded-lg ${
          isSelected ? "bg-blue-500" : "bg-[#1a1a2e]"
        } ${isToday ? "border-2 border-yellow-400" : ""}`}
      >
        <Text className="text-white text-center">{item.date}</Text>
        <Text className="text-gray-400 text-center">{item.day}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#0D0D1A] px-4 pt-5">
      {/* Header */}
      <View className="bg-[#6a0dad] p-4 rounded-lg mb-4">
        <Text className="text-white text-lg font-bold">
          👤 Hi, {user?.name || "Guest"}
        </Text>
      </View>

      {/* Date Selector */}
      <FlatList
        horizontal
        data={dates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DateItem item={item} />}
        className="mt-3"
        showsHorizontalScrollIndicator={false}
      />

      {/* Daily Summary */}
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-8" />
      ) : (
        <ScrollView className="mt-4">
          {dailyTotal ? (
            <View className="bg-[#161625] p-4 rounded-lg mb-3">
              <Text className="text-white text-lg font-bold">{dailyTotal.title}</Text>
              <Text className="text-gray-300 mt-2">{dailyTotal.value}</Text>
              <Text className="text-yellow-400 mt-1">
                FlexPoints: {dailyTotal.flexpoints}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                Date: {toLocalDateString(dailyTotal.date)}
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center mt-4">
              No activity recorded for this day
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Dashboard;