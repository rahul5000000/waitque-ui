import React, { use, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import { companyService } from "../../services/backend/companyService";
import { useAppContext } from "../../hooks/AppContext";
import Spinner from "../../components/Spinner";
import { PrimaryButton, WarningButton } from "../../components/Buttons";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import Toast from "react-native-toast-message";

export default function UserDetailPage({navigation, route}) {
  const { userDetail, refreshCallback } = route.params;
  const {user} = useAppContext();
  const {alertBackgroundStyle} = useCompanyTheme();
  const [isSaving, setIsSaving] = React.useState(false);

  const toFriendlyRoleName = (role: string) => {
    switch(role) {
      case "ADMIN":
        return "Admin";
      case "FIELD_USER":
        return "Field User";
      default:
        return role;
    }
  }

  const handleEnableUser = () => {
    setIsSaving(true);
    companyService.updateUserStatus(userDetail.userId, true, user.role).then((response) => {
      setIsSaving(false);
      Toast.show({
        text1: "User enabled successfully",
        type: "success",
      });

      if(refreshCallback) {
        refreshCallback();
      }

      navigation.goBack();
    }).catch((error) => {
      console.log("Error enabling user:", error);
      Toast.show({
        text1: "Error enabling user",
        text2: "Please try again later",
        type: "error",
      });
    }).finally(() => {
      setIsSaving(false);
    });
  }

  const handleDisableUser = () => {
    setIsSaving(true);
    companyService.updateUserStatus(userDetail.userId, false, user.role).then((response) => {
      setIsSaving(false);
      Toast.show({
        text1: "User disabled successfully",
        type: "success",
      });

      if(refreshCallback) {
        refreshCallback();
      }

      navigation.goBack();
    }).catch((error) => {
      console.log("Error disabling user:", error);
      Toast.show({
        text1: "Error disabling user",
        text2: "Please try again later",
        type: "error",
      });
    }).finally(() => {
      setIsSaving(false);
    });
  }

  const handleDeleteUser = () => {
    setIsSaving(true);
    companyService.deleteUser(userDetail.userId, user.role).then((response) => {
      setIsSaving(false);
      Toast.show({
        text1: "User deleted successfully",
        type: "success",
      });

      if(refreshCallback) {
        refreshCallback();
      }
      
      navigation.goBack();
    }).catch((error) => {
      console.log("Error deleting user:", error);
      Toast.show({
        text1: "Error deleting user",
        text2: "Please try again later",
        type: "error",
      });
    }).finally(() => {
      setIsSaving(false);
    });
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className="flex-1 p-8">
        <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>{userDetail.firstName} {userDetail.lastName}'s Details</Header>
        <ScrollView className="my-6 rounded-xl p-4" style={alertBackgroundStyle}>
          <View className="mb-4">
            <Text className="text-base font-semibold">Username:</Text>
            <Text selectable={true} className="text-base">{userDetail.username}</Text>
          </View>
          <View className="mb-4">
            <Text className="text-base font-semibold">Email:</Text>
            <Text selectable={true} className="text-base">{userDetail.email}</Text>
          </View>
          <View className="mb-4">
            <Text className="text-base font-semibold">Role:</Text>
            <View className="bg-blue-100 rounded-full px-4 py-1 mt-1 self-start">
              <Text className="text-xs font-semibold text-blue-700">{toFriendlyRoleName(userDetail.role)}</Text>
            </View>
          </View>
          <View className="mb-4">
            <Text className="text-base font-semibold">Status:</Text>
            {userDetail.status === "ENABLED" ? (
              <View className="bg-green-100 rounded-full px-4 py-1 mt-1 self-start">
                <Text className="text-xs font-semibold text-green-700">Enabled</Text>
              </View>
            ) : (
              <View className="bg-red-100 rounded-full px-4 py-1 mt-1 self-start">
                <Text className="text-xs font-semibold text-red-700">Disabled</Text>
              </View>
            )}
          </View>
        </ScrollView>
        {userDetail.role === "ADMIN" ? (null) :
        userDetail.status === "ENABLED" ? (
          <WarningButton onPress={handleDisableUser} isWorking={isSaving}>Disable User</WarningButton>
        ) : (
          <>
            <PrimaryButton onPress={handleEnableUser} isWorking={isSaving}>Enable User</PrimaryButton>
            <WarningButton onPress={handleDeleteUser} isWorking={isSaving}>Delete User</WarningButton>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}