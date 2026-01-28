import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCompanyTheme } from '../../../hooks/useCompanyTheme';
import { Ionicons } from '@expo/vector-icons';

export default function MessageResultWidget({ message, onPress }) {
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
      case 'UNREAD':
        return 'Unread';
      case 'READ':
        return 'Read';
      case 'FOLLOW_UP':
        return 'Follow Up';
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
        <Text className='font-semibold text-lg'>From: {getFromName(message)}</Text>
        <View className='flex-row items-center'>
          <Ionicons name="mail-open-outline" size={20} className='mt-2 mb-1 text-gray-400'/>
          <Text className='ml-1 mt-1'>{message.contentSnippet}</Text>
        </View>
        <View className="flex-row justify-between mt-2">
          <View>
            <Text className="font-semibold text-xs text-gray-400">Status:</Text>
            <Text className="text-xs">{toFriendlyStatus(message.status)}</Text>
          </View>
          <View>
            <Text className="font-semibold text-xs text-gray-400">Received:</Text>
            <Text className="text-xs">{toFriendlyDate(message.createdDate)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}