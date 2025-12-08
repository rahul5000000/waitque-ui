import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useCompanyTheme } from "../hooks/useCompanyTheme";
import Logo from "../components/Logo";
import { WarningButton } from "../components/Buttons";
import { logoutUser } from "../services/authService";
import { useAuth } from "../hooks/AuthContext";

export default function SettingsScreen({navigation}) {
  const {colors} = useCompanyTheme();
  const {mode, logout} = useAuth();

  const handleGoBack = async () => {
    navigation.goBack();
  };

  const handleLogout = async () => {
    await logoutUser(mode, logout);
    navigation.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  }

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className="flex-1">
        <View className="p-8">
          <Header icon="arrow-back-outline" iconOnPress={() => handleGoBack()}>Settings</Header>
          <WarningButton onPress={handleLogout}>Logout</WarningButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}