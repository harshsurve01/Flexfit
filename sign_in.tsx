import React from 'react';
import { SafeAreaView, ScrollView, Image, View, Text, TouchableOpacity, Alert } from 'react-native';
import images from '@/constants/images';
import icons from '@/constants/icons';
import { login } from "@/lib/appwrite";
import { useGlobalContext } from '@/lib/global_provider';
import { Redirect } from 'expo-router';

const SignIn = () => {
  const {refetch, loading, isLoggedIn}= useGlobalContext();
    if(!loading && isLoggedIn)return<Redirect href="/"/>
  const handleLogin = async () => {
    try {
      const result = await login();
      if (result) {
        refetch();
      } else {
        Alert.alert('Error', 'Failed to Login');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Something went wrong during login.');
    }
  };

  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="relative h-full">
          <Image source={images.onboarding} className="w-full h-full" resizeMode="cover" />
          <View className="absolute inset-0 justify-center items-center px-10">
            <Text className="text-yellow-200 text-base text-center uppercase font-rubik-bold">
              Welcome to
            </Text>
            <Text className="text-5xl font-rubik-bold text-white mt-2">
              FlexFit
            </Text>
            <Text className="text-3xl font-rubik-bold text-yellow-200 mt-5 text-center uppercase">
              Start your journey towards a more active lifestyle
            </Text>
            <Text className="text-lg font-rubik text-white text-center mt-12">
              Login with Google
            </Text>
            <TouchableOpacity 
              onPress={handleLogin} 
              className="bg-transparent shadow-md border-white border-2 rounded-full w-full py-4 mt-4"
            >
              <View className="flex flex-row items-center justify-center">
                <Image 
                  source={icons.google} 
                  className="w-5 h-5" 
                  resizeMode="contain" 
                />
                <Text className="font-rubik-medium text-2xl text-white text-center ml-2 mt-2">
                  Google
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
