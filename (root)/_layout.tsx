import { useGlobalContext } from "@/lib/global_provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout () {
    const { loading, isLoggedIn} = useGlobalContext();
        if(loading){
            return (
                <SafeAreaView className="bg-#161626 h-full flex justify-center items-center">
                     <ActivityIndicator className="text-primary-300"
                      size="large" />
                </SafeAreaView>

            )
        }
    if(!isLoggedIn) return <Redirect href='/sign_in'/>
    return <Slot />
}