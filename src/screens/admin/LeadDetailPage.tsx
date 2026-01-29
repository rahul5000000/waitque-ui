import React, { useEffect } from 'react';
import { customerService } from '../../services/backend/customerService';
import { useAppContext } from '../../hooks/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, Linking, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import { PrimaryButton, WarningButton } from '../../components/Buttons';
import { useCompanyTheme } from '../../hooks/useCompanyTheme';
import LeadDetailFieldValue from '../../components/admin/lead-search/LeadDetailFieldValue';
import { formatUSPhone } from '../../services/formatPhone';
import LeadDetailBooleanFieldValue from '../../components/admin/lead-search/LeadDetailBooleanFieldValue';
import LeadDetailTextFieldValue from '../../components/admin/lead-search/LeadDetailTextFieldValue';
import LeadDetailNumberFieldValue from '../../components/admin/lead-search/LeadDetailNumberFieldValue';
import LeadDetailDecimalFieldValue from '../../components/admin/lead-search/LeadDetailDecimalFieldValue';
import LeadDetailImageFieldValue from '../../components/admin/lead-search/LeadDetailImageFieldValue';
import LeadDetailTextAreaFieldValue from '../../components/admin/lead-search/LeadDetailTextAreaFieldValue';

export default function LeadDetailPage({ route, navigation }) {
  const {alertBackgroundStyle} = useCompanyTheme();
  const {user} = useAppContext();
  const { leadMetadata, leadUpdatedCallback } = route.params;
  const [leadDetails, setLeadDetails] = React.useState(null);
  const [isSearching, setIsSearching] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    setIsSearching(true);
    customerService.getLead(leadMetadata.id, user.role).then((response) => {
      setLeadDetails(response.data);
    }).catch((error) => {
      console.log("Failed to fetch lead details:", error);
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

  const getFromName = (leadMetadata) => {
    if(leadMetadata.companyName) {
      return leadMetadata.companyName;
    }
    return `${leadMetadata.firstName} ${leadMetadata.lastName}`;
  }

  const toFriendlyCustomerType = (customerType) => {
    switch(customerType) {
      case 'COMMERCIAL':
        return 'Commercial';
      case 'RESIDENTIAL':
        return 'Residential';
      default:
        return customerType;
    }
  }

  const toFriendlyStatus = (status) => {
    switch (status) {
      case 'NEW':
        return 'New';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'RECONTACT':
        return 'Recontact';
      case 'UNQUALIFIED':
        return 'Unqualified';
      case 'CLOSED_LOST':
        return 'Closed - Lost';
      case 'CLOSED_WON':
        return 'Closed - Won';
      default:
        return status;
    }
  }

  const handlePhoneNumberPress = (phoneNumber) => {
    const telUrl = `tel:${phoneNumber}`;
    Linking.openURL(telUrl).catch((err) => console.error('Failed to open phone dialer:', err));
  }

  const handleStatusUpdate = (leadId, newStatus) => {
    setIsSaving(true);
    customerService.updateLeadStatus(leadId, newStatus, user.role).then((response) => {
      console.log("Updated lead status:", response.data);
      leadUpdatedCallback();
      navigation.goBack();
    }).catch((error) => {
      console.log("Failed to update lead status:", error);
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
            {leadMetadata.leadFlowName} Lead for {getFromName(leadMetadata)}
          </Header>
        </View>
        {isSearching && 
          <View className="pt-4" >
            <Spinner message="Loading..."/>
          </View>
        }
        <ScrollView className="flex-1 px-8 mt-6">
          {!isSearching && leadDetails && (
            <>
            <View className="mb-2 rounded-lg p-4" style={alertBackgroundStyle}>
              <View className='flex-row items-center mb-4'>
                <Text className='font-bold text-lg'>{getFromName(leadMetadata)} Details</Text>
                <Text className='text-xs ml-1 text-gray-500'>({toFriendlyCustomerType(leadDetails.crmCustomer.customerType)})</Text>
              </View>
              <LeadDetailFieldValue label="Contact">{leadDetails.crmCustomer.firstName} {leadDetails.crmCustomer.lastName}</LeadDetailFieldValue>
              <LeadDetailFieldValue label="Phone"><TouchableOpacity onPress={() => handlePhoneNumberPress(leadDetails.crmCustomer.phoneNumber.phoneNumber)}><Text className='text-blue-500' selectable={true}>{formatUSPhone(leadDetails.crmCustomer.phoneNumber.phoneNumber)}</Text></TouchableOpacity></LeadDetailFieldValue>
              <LeadDetailFieldValue label="Email">{leadDetails.crmCustomer.email}</LeadDetailFieldValue>
              <View className="flex">
                <Text className="font-semibold mr-1">Address:</Text>
                <Text selectable={true}>
                  {leadDetails.crmCustomer?.address.address1}
                  {leadDetails.crmCustomer?.address.address2 ? `\n${leadDetails.crmCustomer?.address.address2}` : ''}
                  {`\n${leadDetails.crmCustomer?.address.city}, ${leadDetails.crmCustomer?.address.state} ${leadDetails.crmCustomer?.address.zipcode}`}
                </Text>
              </View>
            </View>
            <View className="mb-2 mt-2 rounded-lg p-4" style={alertBackgroundStyle}>
              <Text className='font-bold text-lg mb-4'>Lead Details</Text>
              <LeadDetailFieldValue label="Type">{leadDetails.leadFlow.name}</LeadDetailFieldValue>
              <LeadDetailFieldValue label="Status">{toFriendlyStatus(leadDetails.status)}</LeadDetailFieldValue>
              <LeadDetailFieldValue label="Created">{toFriendlyDate(leadDetails.createdDate)}</LeadDetailFieldValue>
              {leadDetails.answers.map((answer, index) => {
                {
                switch(answer.dataType) {
                  case "BOOLEAN":
                    return (<LeadDetailBooleanFieldValue key={index} answer={answer} question={leadDetails.leadFlow.questions.find(q => q.id === answer.leadFlowQuestionId)} />);
                  case "TEXT":
                    return (<LeadDetailTextFieldValue key={index} answer={answer} question={leadDetails.leadFlow.questions.find(q => q.id === answer.leadFlowQuestionId)} />);
                  case "TEXTAREA":
                    return (<LeadDetailTextAreaFieldValue key={index} answer={answer} question={leadDetails.leadFlow.questions.find(q => q.id === answer.leadFlowQuestionId)} />);
                  case "NUMBER":
                    return (<LeadDetailNumberFieldValue key={index} answer={answer} question={leadDetails.leadFlow.questions.find(q => q.id === answer.leadFlowQuestionId)} />);
                  case "DECIMAL":
                    return (<LeadDetailDecimalFieldValue key={index} answer={answer} question={leadDetails.leadFlow.questions.find(q => q.id === answer.leadFlowQuestionId)} />);
                  case "IMAGE":
                    return (<LeadDetailImageFieldValue key={index} answer={answer} question={leadDetails.leadFlow.questions.find(q => q.id === answer.leadFlowQuestionId)} cdnBaseUrl={leadDetails.cdnBaseUrl} />);
                  default:
                    return (null);
                }
              }
              })}
            </View>
            {leadDetails.status === 'NEW' && <PrimaryButton onPress={() => handleStatusUpdate(leadDetails.id, 'IN_PROGRESS')} isWorking={isSaving}>
              Mark as In Progress
            </PrimaryButton>}
            {leadDetails.status === 'IN_PROGRESS' && <PrimaryButton onPress={() => handleStatusUpdate(leadDetails.id, 'NEW')} isWorking={isSaving}>
              Mark as New
            </PrimaryButton>}
            {leadDetails.status === 'IN_PROGRESS' && <PrimaryButton onPress={() => handleStatusUpdate(leadDetails.id, 'CLOSED_WON')} isWorking={isSaving}>
              Mark as Done
            </PrimaryButton>}
            {leadDetails.status === 'NEW' && <WarningButton onPress={() => handleStatusUpdate(leadDetails.id, 'CLOSED_LOST')} isWorking={isSaving}>
              Mark as Closed - Lost
            </WarningButton>}
            {leadDetails.status === 'NEW' && <WarningButton onPress={() => handleStatusUpdate(leadDetails.id, 'UNQUALIFIED')} isWorking={isSaving}>
              Mark as Unqualified
            </WarningButton>}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}