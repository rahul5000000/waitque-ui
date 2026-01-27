import React, { useEffect } from 'react';
import { customerService } from '../../services/backend/customerService';
import { useAppContext } from '../../hooks/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text } from 'react-native';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import { PrimaryButton } from '../../components/Buttons';
import { useCompanyTheme } from '../../hooks/useCompanyTheme';

export default function MessageDetailPage({ route, navigation }) {
  const {alertBackgroundStyle} = useCompanyTheme();
  const {user} = useAppContext();
  const { messageMetadata, messageUpdatedCallback } = route.params;
  const [messageDetails, setMessageDetails] = React.useState(null);
  const [isSearching, setIsSearching] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    setIsSearching(true);
    customerService.getMessage(messageMetadata.id, user.role).then((response) => {
      setMessageDetails(response.data);
    }).catch((error) => {
      console.log("Failed to fetch message details:", error);
    }).finally(() => {
      setIsSearching(false);
    });
  }, []);

  const toFriendlyDate = (dateStr) => {
    const date = new Date(dateStr + 'Z'); // Ensure it's treated as UTC
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  const handleStatusUpdate = (messageId, newStatus) => {
    setIsSaving(true);
    customerService.updateMessageStatus(messageId, newStatus, user.role).then((response) => {
      console.log("Updated message status:", response.data);
      messageUpdatedCallback();
      navigation.goBack();
    }).catch((error) => {
      console.log("Failed to update message status:", error);
    }).finally(() => {
      setIsSaving(false);
    });
  }
  
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            {messageMetadata.firstName} {messageMetadata.lastName}'s Message
          </Header>
        </View>
        {isSearching && 
          <View className="pt-4" >
            <Spinner message="Loading..."/>
          </View>
        }
        <ScrollView className="flex-1 px-8 mt-6">
          {!isSearching && messageDetails && (
            <View>
              <Text className="mb-2 rounded-3xl p-4" style={alertBackgroundStyle}>{messageDetails.message}</Text>
              <Text className="mb-4 mr-4 text-xs text-end">{toFriendlyDate(messageMetadata.createdDate)}</Text>
              {messageMetadata.status === "UNREAD" && <PrimaryButton onPress={() => handleStatusUpdate(messageMetadata.id, "FOLLOW_UP")} isWorking={isSaving}>Mark for Follow Up</PrimaryButton> }
              {(messageMetadata.status === "FOLLOW_UP" || messageMetadata.status === "UNREAD") && <PrimaryButton onPress={() => handleStatusUpdate(messageMetadata.id, "READ")} isWorking={isSaving}>Mark Read</PrimaryButton>}
              {messageMetadata.status === "READ" && <PrimaryButton onPress={() => handleStatusUpdate(messageMetadata.id, "UNREAD")} isWorking={isSaving}>Mark Unread</PrimaryButton> }
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}