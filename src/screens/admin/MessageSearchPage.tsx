import React, { useEffect } from 'react';
import { customerService } from '../../services/backend/customerService';
import { useAppContext } from '../../hooks/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text } from 'react-native';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import MessageResultWidget from '../../components/admin/message-search/MessageResultWidget';

export default function MessageSearchPage({ navigation, route }) {
  const { dashboardRefreshCallback } = route.params;
  const [messages, setMessages] = React.useState([]);
  const {user} = useAppContext();
  const [isSearching, setIsSearching] = React.useState(false);
  const [messageStatuses, setMessageStatuses] = React.useState(['UNREAD', 'FOLLOW_UP', 'READ']);

    const searchMessages = () => {
      setIsSearching(true);
      // TODO deal with pagination / infinite scroll
      customerService.searchMessages(messageStatuses, user.role, 100).then((response) => {
        console.log("Fetched messages:", response.data);
        setMessages(response.data.messages || []);
      }).catch((error) => {
        console.log("Failed to fetch messages:", error);
      }).finally(() => {
        setIsSearching(false);
      });
    };

  useEffect(() => {
    searchMessages();
  }, [messageStatuses]);

  const messageUpdatedCallback = () => {
    searchMessages();
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
            Manage Messages
          </Header>
        </View>
        {isSearching && 
          <View className="pt-4" >
            <Spinner message="Searching..."/>
          </View>
        }
        <ScrollView className="flex-1 px-8 mt-6">
          {!isSearching && messages.length === 0 && (
            <Text className="py-4">No results found.</Text>
          )}

          {messages.map((m, index) => (
            <MessageResultWidget message={m} key={index} onPress={() => navigation.navigate("MessageDetailPage", {messageMetadata: m, messageUpdatedCallback})}/>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}