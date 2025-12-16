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

export default function EditQuestionnairePage({ navigation, route }) {
  const { customerMetadata, page, questionnaireResponse, answers } = route.params;
  const {user} = useAppContext();
  const { colors, backgroundStyle } = useCompanyTheme();
  const [questionnaireDetails, setQuestionnaireDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCustomerDisplayName = () => {
    if (customerMetadata.customerType === "RESIDENTIAL") {
      return `${customerMetadata.firstName} ${customerMetadata.lastName}`;
    } else if (customerMetadata.customerType === "COMMERCIAL") {
      return customerMetadata.companyName;
    } else {
      throw new Error("Unsupported customerType");
    }
  };

  const editMode = () => questionnaireResponse != null;

  const isActive = () => questionnaireResponse?.status === "ACTIVE"

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <View>
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            {getCustomerDisplayName()} / {page.pageTitle}
          </Header>
        </View>
      </View>
      <ScrollView className="mt-8 flex-1" style={{ flex: 1 }}>
        <View className="flex-row flex-wrap justify-center gap-4 mb-8">
        </View>
      </ScrollView>
      <View className="m-8">
        <PrimaryButton onPress={() => {console.log('Save')}}>Save</PrimaryButton>
      </View>
    </SafeAreaView>
  )
}