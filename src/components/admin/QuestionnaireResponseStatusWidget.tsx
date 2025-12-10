import React from 'react';
import { View, Text } from 'react-native';
import { useCompanyTheme } from '../../hooks/useCompanyTheme';
import { Ionicons } from '@expo/vector-icons';

export default function QuestionnaireResponseStatusWidget({questionnaire, questionnaireResponse}) {
  const {colors, mutedWidgetButtonTextStyle} = useCompanyTheme();

  const isResponseActive = () => {
    if(!questionnaireResponse) return false;
    return questionnaireResponse.status === "ACTIVE";
  }

  const hasResponseBeenUpdated = () => {
    if(!questionnaireResponse) return false;
    return questionnaireResponse.createdDate != questionnaireResponse.updatedDate;
  }

  const formatDate = (date) => {
    return new Date(date)
      .toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
  }

  return (
    <View className='p-4 flex-row'>
      <View className='flex-1'>
        <Text className='text-xl'>{questionnaire.name}</Text>
          {questionnaireResponse 
          ?
          (
            isResponseActive() ?
            (
              hasResponseBeenUpdated() ?
              <>
              <Text style={{color: colors.primaryButtonColor}}>Active</Text>
              <Text className='text-xs mt-2' style={mutedWidgetButtonTextStyle}>Updated {formatDate(questionnaireResponse.updatedDate)}</Text>
              </>
              :
              <>
              <Text style={{color: colors.primaryButtonColor}}>Active</Text>
              <Text className='text-xs mt-2' style={mutedWidgetButtonTextStyle}>Completed {formatDate(questionnaireResponse.createdDate)}</Text>
              </>
            )
            :
            <>
            <Text style={{color: colors.warningButtonColor}}>Inactive</Text>
            <Text className='text-xs mt-2' style={mutedWidgetButtonTextStyle}>Inactivated {formatDate(questionnaireResponse.updatedDate)}</Text>
            </>
          )
          :
          <Text style={{color: colors.dangerButtonColor}}>Not Completed</Text>
          }
      </View>
      <View className='justify-center items-center'>
        <Ionicons size={25} name='arrow-forward-outline'></Ionicons>
      </View>
    </View>
  )
}