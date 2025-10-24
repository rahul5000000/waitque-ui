import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Platform, Alert, Button } from 'react-native';
import Header from '../components/Header';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { WarningButton } from '../components/Buttons';
import BooleanLeadQuestion from '../components/Lead/BooleanLeadQuestion';
import TextLeadQuestion from '../components/Lead/TextLeadQuestion';
import TextAreaLeadQuestion from '../components/Lead/TextAreaLeadQuestion';
import NumberLeadQuestion from '../components/Lead/NumberLeadQuestion';
import DecimalLeadQuestion from '../components/Lead/DecimalLeadQuestion';

export default function LeadEntryScreen({route, navigation}) {
  const { flow } = route.params;

  const [flowDetails, setFlowDetails] = useState(null); 
  const [loading, setLoading] = useState(true);

  const handleGoBack = async () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    const fetchFlowDetails = async () => {
      try {
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8083' : 'http://localhost:8083';

        const [flowDetailResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/public/customers/qrCode/412af2e9-3fc6-462d-a3b7-d1290e591564/company/leadFlows/${flow.id}`),
        ]);

        console.log('Flow Details:', flowDetailResponse.data);

        setFlowDetails(flowDetailResponse.data);
      } catch (error) {
        console.error('Error fetching customer:', error);
        Alert.alert('Error', 'Failed to load customer information.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlowDetails();
  }, [flow]);

  return(
    <SafeAreaView>
      <View className="p-8">
        {loading ? <Spinner message="Loading data"></Spinner> : 
        <View>
          <Header icon="arrow-back-outline" iconOnPress={() => handleGoBack()}>{flowDetails.title}</Header>
          {flowDetails.questions.map((question) => {
            switch(question.dataType) {
              case "BOOLEAN": return (<BooleanLeadQuestion isRequired={question.isRequired} falseText={question.falseText} trueText={question.trueText}>{question.question}</BooleanLeadQuestion>);
              case "TEXT": return (<TextLeadQuestion isRequired={question.isRequired}>{question.question}</TextLeadQuestion>)
              case "TEXTAREA": return (<TextAreaLeadQuestion isRequired={question.isRequired}>{question.question}</TextAreaLeadQuestion>)
              case "NUMBER": return (<NumberLeadQuestion isRequired={question.isRequired}>{question.question}</NumberLeadQuestion>)
              case "DECIMAL": return (<DecimalLeadQuestion isRequired={question.isRequired}>{question.question}</DecimalLeadQuestion>)
            }
          })}
          <View className="mt-4">
            <WarningButton>{flowDetails.buttonText}</WarningButton>
          </View>
        </View>}
      </View>
    </SafeAreaView>
  )
}