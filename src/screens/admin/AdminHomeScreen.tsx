import React, { use, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanyTheme } from "../../hooks/useCompanyTheme";import SettingsWidget from "../../components/SettingsWidget";
import Logo from "../../components/Logo";
import { useAppContext } from "../../hooks/AppContext";
import ManageCustomerWidget from "../../components/ManageCustomerWidget";
import { customerService } from "../../services/backend/customerService";
import Spinner from "../../components/Spinner";
import ActiveLeadsWidget from "../../components/admin/ActiveLeadsWidget";
import UnreadMessagesWidget from "../../components/admin/UnreadMessagesWidget";
import AlertWidget from "../../components/AlertWidget";
import GenerateQRCodeWidget from "../../components/admin/GenerateQRCodeWidget";

export default function AdminHomeScreen({navigation}) {
  const {colors, widgetButtonTextStyle, alertBackgroundStyle} = useCompanyTheme();
  const {backgroundStyle, textStyle} = useCompanyTheme();
  const {user} = useAppContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [metrics, setMetrics] = React.useState<any>(null);

  const getDashboardMetrics = () => {
    setIsLoading(true);
    customerService.getAdminDasboardMetrics(user.role).then((metrics) => {
      console.log("Fetched admin dashboard metrics:", metrics);
      setMetrics(metrics.data);
    }).catch((error) => {
      console.log("Failed to fetch admin dashboard metrics:", error);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  useEffect(() => {
    getDashboardMetrics();
  }, []);

  const dashboardRefreshCallback = () => {
    getDashboardMetrics();
  };

  const getNewLeadsAlertText = () => {
    if(!metrics) return "";
    const count = metrics.newLeadsCount;
    if(count === 1) {
      return "You have 1 new lead!";
    } else {
      return `You have ${count} new leads!`;
    }
  }

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner message="Loading..."/>
        </View>
      ) : (
      <View style={{ flex: 1, padding: 24 }}>
        <View className='flex-row mb-4 mt-2'>
          <View className='flex-2 items-start justify-center'>
            <Text className="text-2xl font-semibold" style={textStyle}>
              Hi {`${user.firstName} ${user.lastName}`}!
            </Text>
          </View>
          <View className='flex-1 items-end justify-center'>
            <Logo/>
          </View>
        </View>

        {metrics?.newLeadsCount > 0 && <AlertWidget icon="rocket" iconStyle={widgetButtonTextStyle} backgroundStyle={alertBackgroundStyle} uniqKey="new-lead-alert" onPress={() => navigation.navigate('LeadSearchPage', {dashboardRefreshCallback})}>{getNewLeadsAlertText()}</AlertWidget>}

        <View style={{ flex: 1 }}>
          <View className="flex-row flex-wrap justify-center gap-4 mb-8 mt-8">
            <ActiveLeadsWidget navigation={navigation} activeLeadsCount={metrics?.activeLeadsCount} dashboardRefreshCallback={dashboardRefreshCallback}/>
            <UnreadMessagesWidget navigation={navigation} unreadMessagesCount={metrics?.unreadMessages} dashboardRefreshCallback={dashboardRefreshCallback}/>
            <GenerateQRCodeWidget navigation={navigation} />
            <SettingsWidget navigation={navigation} />
            {(3 + 1) % 2 === 1 ? (
              <View className="w-36 h-32 rounded-xl" />
            ) : null}
          </View>
        </View>
      </View>
      )}
    </SafeAreaView>
  )
}