import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useCompanyTheme } from "../../../hooks/useCompanyTheme";
import Header from "../../../components/Header";
import { PrimaryButton, WarningButton } from "../../../components/Buttons";
import Toast from "react-native-toast-message";
import { companyService } from "../../../services/backend/companyService";
import { useAppContext } from "../../../hooks/AppContext";
import Spinner from "../../../components/Spinner";
import QuestionnaireResponsePageStatusWidget from "../../../components/admin/QuestionnaireResponsePageStatusWidget";

export default function EditQuestionnaireLanding({ navigation, route }) {
  const { customerMetadata, questionnaire, questionnaireResponse } = route.params;
  const {user} = useAppContext();
  const { colors, backgroundStyle } = useCompanyTheme();
  const [questionnaireDetails, setQuestionnaireDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCustomerDisplayName = () => {
    console.log(questionnaire)
    if (customerMetadata.customerType === "RESIDENTIAL") {
      return `${customerMetadata.firstName} ${customerMetadata.lastName}`;
    } else if (customerMetadata.customerType === "COMMERCIAL") {
      return customerMetadata.companyName;
    } else {
      throw new Error("Unsupported customerType");
    }
  };

  useEffect(() => {
    if(editMode()) {
      setQuestionnaireDetails(questionnaireResponse.questionnaire)
    } else {
      fetchQuestionnaireDetails();
    }
  }, []);

  const fetchQuestionnaireDetails = async() => {
    try{
      const questionnaireDetailResponse = await companyService.getQuestionnaire(questionnaire.id, user.role);
      setQuestionnaireDetails(questionnaireDetailResponse.data);

      console.log(questionnaireDetailResponse.data);
    } catch(error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: "Failed to load questionnaire details"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const editMode = () => questionnaireResponse != null;

  const isActive = () => questionnaireResponse?.status === "ACTIVE"

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <View>
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            {getCustomerDisplayName()} / {questionnaire.name}
          </Header>
        </View>
      </View>
      {isLoading ? <Spinner/> :
      <ScrollView className="mt-8 flex-1" style={{ flex: 1 }}>
        <View className="flex-row flex-wrap justify-center gap-4 mb-8">
          {questionnaireDetails?.pages.map((page) => (
            <QuestionnaireResponsePageStatusWidget
              key={page.id}
              navigation={navigation}
              customerMetadata={customerMetadata}
              questionnairePage={page}
              questionnaireResponse={questionnaireResponse}
              answers={questionnaireResponse?.answers}
            />
          ))}
          {questionnaireDetails?.pages.length % 2 === 1 ? (
            <View className="w-36 h-32 rounded-xl" />
          ) : null}
        </View>
      </ScrollView>
      }
      {editMode() ? (
      <View className="m-8">
        {isActive() ? (
          <WarningButton onPress={() => console.log('Inactivate')}>
            Inactivate
          </WarningButton>
        ) : (
          <PrimaryButton onPress={() => console.log('Activate')}>
            Activate
          </PrimaryButton>
        )}
      </View>
      ) : null}
    </SafeAreaView>
  )
}