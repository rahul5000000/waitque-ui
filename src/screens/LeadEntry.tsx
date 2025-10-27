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
  const [questionAnswerMap, setQuestionAnswerMap] = useState({});
  const [questionValidationErrorMap, setQuestionValidationErrorMap] = useState({});
  const [hasActiveValidationError, setHasActiveValidationError] = useState(false);

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

        const initialAnswers = {};
        const initialValidationErrors = {};
        flowDetailResponse.data.questions.forEach((q) => {
          if(q.dataType === "BOOLEAN") {
            initialAnswers[q.id] = false;
          } else {
            initialAnswers[q.id] = "";
          }

          initialValidationErrors[q.id] = false;
        });
        setQuestionAnswerMap(initialAnswers);
        setQuestionValidationErrorMap(initialValidationErrors);
      } catch (error) {
        console.error('Error fetching customer:', error);
        Alert.alert('Error', 'Failed to load customer information.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlowDetails();
  }, [flow]);

  const handleAnswerChange = (questionId, value) => {
    setQuestionAnswerMap((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if(hasActiveValidationError) {
      validateFields();
    }
  };

  const handleSubmit = () => {
    const hasErrors = validateFields();

    if(!hasErrors) {
      const body = {
        leadFlowId: flowDetails.id,
        answers: flowDetails.questions.filter(question => question.dataType === "BOOLEAN" || questionAnswerMap[question.id] != null && questionAnswerMap[question.id] != "").map(question => {
          switch(question.dataType) {
            case "BOOLEAN": return {
                leadFlowQuestionId: question.id,
                dataType: question.dataType,
                enabled: questionAnswerMap[question.id]
              };
            case "TEXT": return {
                leadFlowQuestionId: question.id,
                dataType: question.dataType,
                text: questionAnswerMap[question.id]
              };
            case "TEXTAREA": return {
                leadFlowQuestionId: question.id,
                dataType: question.dataType,
                paragraph: questionAnswerMap[question.id]
              };
            case "IMAGE": return {
                leadFlowQuestionId: question.id,
                dataType: question.dataType,
                url: questionAnswerMap[question.id]
              };
            case "NUMBER": return {
                leadFlowQuestionId: question.id,
                dataType: question.dataType,
                number: questionAnswerMap[question.id]
              };
            case "DECIMAL": return {
                leadFlowQuestionId: question.id,
                dataType: question.dataType,
                decimal: questionAnswerMap[question.id]
              };
          }
        })
      };

      const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8083' : 'http://localhost:8083';
      axios.post(`${baseUrl}/api/public/customers/qrCode/412af2e9-3fc6-462d-a3b7-d1290e591564/leads`, body).then((res) => {
        console.log(res);
        navigation.navigate('LeadConfirmation', {flowDetails});
      });
    }
  }

  const validateFields = () => {
    // Validate all required fields are populated
    const newValidationErrors = { ...questionValidationErrorMap };
    flowDetails.questions.filter(question => question.isRequired && question.dataType !== "BOOLEAN").forEach(requiredQuestion => {
      newValidationErrors[requiredQuestion.id] = (questionAnswerMap[requiredQuestion.id] == null || questionAnswerMap[requiredQuestion.id] == "");
    });

    setQuestionValidationErrorMap(newValidationErrors);

    if(Object.values(newValidationErrors).some(v => v === true)) {
      setHasActiveValidationError(true);
      return true;
    } else {
      setHasActiveValidationError(false);
      return false;
    }
  }

  return(
    <SafeAreaView>
      <View className="p-8">
        {loading ? <Spinner message="Loading data"></Spinner> : 
        <View>
          <Header icon="arrow-back-outline" iconOnPress={() => handleGoBack()}>{flowDetails.title}</Header>
          {flowDetails.questions.map((question) => {
            switch(question.dataType) {
              case "BOOLEAN": return (<BooleanLeadQuestion isRequired={question.isRequired} falseText={question.falseText} trueText={question.trueText} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</BooleanLeadQuestion>);
              case "TEXT": return (<TextLeadQuestion isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</TextLeadQuestion>)
              case "TEXTAREA": return (<TextAreaLeadQuestion isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</TextAreaLeadQuestion>)
              case "NUMBER": return (<NumberLeadQuestion isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</NumberLeadQuestion>)
              case "DECIMAL": return (<DecimalLeadQuestion isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</DecimalLeadQuestion>)
            }
          })}
          <View className="mt-4">
            {hasActiveValidationError ? <Text>Fix fields highlighted in red</Text> : null}
            <WarningButton onPress={handleSubmit}>{flowDetails.buttonText}</WarningButton>
          </View>
        </View>}
      </View>
    </SafeAreaView>
  )
}