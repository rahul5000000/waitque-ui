import React, { use, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import { companyService } from "../../services/backend/companyService";
import { useAppContext } from "../../hooks/AppContext";
import Spinner from "../../components/Spinner";
import { PrimaryButton } from "../../components/Buttons";

export default function UserSearchPage({navigation}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState<any[]>([]);
  const {user} = useAppContext();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await companyService.getUsers(user.role);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <SafeAreaView className='flex-1'>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner message="Loading..."/>
        </View>
      ) : (
      <View className="flex-1 p-8">
        <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>Manage Users</Header>
        <ScrollView className="flex-1 mt-2">
          {users.map((u, index) => (
            <TouchableOpacity key={index} className="py-4 border-b border-gray-300" onPress={() => navigation.navigate("UserDetailPage", {userDetail: u, refreshCallback: fetchUsers})}>
              <View className="flex-row items-center">
                <Text className="text-lg flex-1">{u.firstName} {u.lastName}</Text>
                <View className="bg-blue-100 rounded-full px-4 py-1 self-start">
                  <Text className="text-xs font-semibold text-blue-700">{toFriendlyRoleName(u.role)}</Text>
                </View>
                {u.status === "DISABLED" && (
                  <View className="bg-red-100 rounded-full px-4 py-1 self-start ml-2">
                    <Text className="text-xs font-semibold text-red-700">Disabled</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <PrimaryButton onPress={() => navigation.navigate("CreateUserPage", { refreshCallback: fetchUsers })}>Create New User</PrimaryButton>
      </View>
      )}
    </SafeAreaView>
  )
}