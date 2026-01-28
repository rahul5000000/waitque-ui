import React, { useEffect } from 'react';
import { customerService } from '../../services/backend/customerService';
import { useAppContext } from '../../hooks/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text } from 'react-native';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import LeadResultWidget from '../../components/admin/lead-search/LeadResultWidget';

export default function LeadSearchPage({ navigation, route }) {
  const { dashboardRefreshCallback } = route.params;
  const [leads, setLeads] = React.useState([]);
  const {user} = useAppContext();
  const [isSearching, setIsSearching] = React.useState(false);
  const [leadStatuses, setLeadStatuses] = React.useState(['NEW', 'IN_PROGRESS']);

  const searchLeads = () => {
    setIsSearching(true);
    // TODO deal with pagination / infinite scroll
    customerService.searchLeads(leadStatuses, user.role, 100).then((response) => {
      console.log("Fetched leads:", response.data);
      setLeads(response.data.leads || []);
    }).catch((error) => {
      console.log("Failed to fetch leads:", error);
    }).finally(() => {
      setIsSearching(false);
    });
  }

  useEffect(() => {
    searchLeads();
  }, [leadStatuses]);

  const leadUpdatedCallback = () => {
    searchLeads();
    dashboardRefreshCallback();
  };
  
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            Manage Leads
          </Header>
        </View>
        {isSearching && 
          <View className="pt-4" >
            <Spinner message="Searching..."/>
          </View>
        }
        <ScrollView className="flex-1 px-8 mt-6">
          {!isSearching && leads.length === 0 && (
            <Text className="py-4">No results found.</Text>
          )}

          {leads.map((l, index) => (
            <LeadResultWidget lead={l} key={index} onPress={() => navigation.navigate("LeadDetailPage", {leadMetadata: l, leadUpdatedCallback})}/>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}