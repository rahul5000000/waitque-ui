import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCompanyTheme } from '../../../hooks/useCompanyTheme';

export default function LeadResultWidget({ lead, onPress }) {
  const {alertBackgroundStyle} = useCompanyTheme();

  const toFriendlyDate = (dateStr) => {
    const date = new Date(dateStr + 'Z'); // Ensure it's treated as UTC
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
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

  const getFromName = (message) => {
    if(message.companyName) {
      return message.companyName;
    }
    return `${message.firstName} ${message.lastName}`;
  }

  return (
    <TouchableOpacity className="p-4 mb-4 rounded-lg" style={alertBackgroundStyle} onPress={onPress}>
      <View>
        <Text className='font-semibold text-lg'>{lead.leadFlowName} Lead for {getFromName(lead)}</Text>
        <View className="flex-row justify-between mt-2">
          <View>
            <Text className="font-semibold text-xs text-gray-400">Status:</Text>
            <Text className="text-xs">{toFriendlyStatus(lead.status)}</Text>
          </View>
          <View>
            <Text className="font-semibold text-xs text-gray-400">Created:</Text>
            <Text className="text-xs">{toFriendlyDate(lead.createdDate)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}