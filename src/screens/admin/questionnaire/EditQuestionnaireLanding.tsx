import React, { use, useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, Platform } from "react-native";
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
import { customerService } from "../../../services/backend/customerService";
import { logAuthenticatedError } from "../../../services/mobileLogger";

export default function EditQuestionnaireLanding({ navigation, route }) {
  const { customerMetadata, questionnaire, questionnaireResponse, questionnaireResponseUpdatedCallback } = route.params;
  const {user} = useAppContext();
  const { backgroundStyle } = useCompanyTheme();
  const [questionnaireDetails, setQuestionnaireDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionnaireResponseDetail, setQuestionnaireResponseDetail] = useState(null);
  const [editModeFlag, setEditModeFlag] = useState(false);
  const [isActiveFlag, setIsActiveFlag] = useState(false);
  const [isInactivating, setIsInactivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const getCustomerDisplayName = () => {
    if (customerMetadata.customerType === "RESIDENTIAL") {
      return `${customerMetadata.firstName} ${customerMetadata.lastName}`;
    } else if (customerMetadata.customerType === "COMMERCIAL") {
      return customerMetadata.companyName;
    } else {
      throw new Error("Unsupported customerType");
    }
  };

  useEffect(() => {
    if(questionnaireResponse != null) {
      fetchQuestionnaireResponseDetails();
    } else {
      fetchQuestionnaireDetails();
    }
  }, []);

  const fetchQuestionnaireResponseDetails = async() => {
    try{
      setIsLoading(true);
      const questionnaireResponseDetailResponse = await customerService.getQuestionnaireResponseDetail(customerMetadata.id, questionnaireResponse.id, user.role);
      setQuestionnaireDetails(questionnaireResponseDetailResponse.data.questionnaire);
      setQuestionnaireResponseDetail(questionnaireResponseDetailResponse.data);
    } catch(error) {
      logAuthenticatedError({
        userType: user.role,
        page: 'EditQuestionnaireLanding',
        message: 'Failed to load questionnaire response details',
        error,
      }).catch(() => {
        // swallow errors from logger
      });

      Toast.show({
        type: 'error',
        text1: "Failed to load questionnaire response details"
      });

      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }

  const fetchQuestionnaireDetails = async() => {
    try{
      setIsLoading(true);
      const questionnaireDetailResponse = await companyService.getQuestionnaire(questionnaire.id, user.role);
      setQuestionnaireDetails(questionnaireDetailResponse.data);
    } catch(error) {
      logAuthenticatedError({
        userType: user.role,
        page: 'EditQuestionnaireLanding',
        message: 'Failed to load questionnaire details',
        error,
      }).catch(() => {
        // swallow errors from logger
      });

      Toast.show({
        type: 'error',
        text1: "Failed to load questionnaire details"
      });

      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }

  const saveUpdatedQuestionnaireResponseCallback = (questionnaireResponseDetail) => {
    setQuestionnaireResponseDetail(questionnaireResponseDetail);
    questionnaireResponseUpdatedCallback();
  }

  useEffect(() => {
    setEditModeFlag(editMode());
    setIsActiveFlag(isActive());
  }, [questionnaireResponseDetail]);

  const editMode = () => questionnaireResponseDetail != null;

  const isActive = () => questionnaireResponseDetail?.status === "ACTIVE";

  const handleInactivate = () => {
    if(Platform.OS === 'web') {
      return inactivateQuestionnaireResponse();
    }

    Alert.alert(
      'Deactivate '+questionnaire.name + ' ?',
      'Customers will no longer be able to access this ' + questionnaire.name,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Deactivate', style: 'destructive', onPress: () => inactivateQuestionnaireResponse() },
      ]
    );
  }

  const inactivateQuestionnaireResponse = () => {
    setIsInactivating(true);
    let questionnaireResponseId = questionnaireResponse.id != null ? questionnaireResponse.id : questionnaireResponseDetail.id;
    customerService.deleteQuestionnaireResponse(customerMetadata.id, questionnaireResponseId, user.role).then((res) => {
      setQuestionnaireResponseDetail(res.data);
      questionnaireResponseUpdatedCallback();
    }).catch((error) => {
      logAuthenticatedError({
        userType: user.role,
        page: 'EditQuestionnaireLanding',
        message: 'Failed to inactivate questionnaire response',
        error,
      }).catch(() => {
        // swallow errors from logger
      });

      Toast.show({
        type: 'error',
        text1: "There was an issue deactivating the questionnaire response.",
        text2: "Please try again."
      });
    }).finally(() => {
      setIsInactivating(false);
    });
  }

  const handleActivate = () => {
    if(Platform.OS === 'web') {
      return activateQuestionnaireResponse();
    }

    Alert.alert(
      'Activate '+questionnaire.name + '?',
      'Customers will have access to this ' + questionnaire.name + ' immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Activate', style: 'destructive', onPress: () => activateQuestionnaireResponse() },
      ]
    );
  }

  const activateQuestionnaireResponse = () => {
    setIsActivating(true);
    let questionnaireResponseId = questionnaireResponse.id != null ? questionnaireResponse.id : questionnaireResponseDetail.id;
    customerService.updateQuestionnaireResponseStatus(customerMetadata.id, questionnaireResponseId, "ACTIVE", user.role).then((res) => {
      setQuestionnaireResponseDetail(res.data);
      questionnaireResponseUpdatedCallback();
    }).catch((error) => {
      logAuthenticatedError({
        userType: user.role,
        page: 'EditQuestionnaireLanding',
        message: 'Failed to activate questionnaire response',
        error,
      }).catch(() => {
        // swallow errors from logger
      });

      Toast.show({
        type: 'error',
        text1: "There was an issue activating the questionnaire response.",
        text2: "Please try again."
      });
    }).finally(() => {
      setIsActivating(false);
    });
  }

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
        <View className="flex-row flex-wrap justify-center gap-4 mb-8 px-4">
          {questionnaireDetails?.pages.map((page) => (
            <QuestionnaireResponsePageStatusWidget
              key={page.id}
              navigation={navigation}
              customerMetadata={customerMetadata}
              questionnairePage={page}
              questionnaireResponse={questionnaireResponseDetail}
              answers={questionnaireResponseDetail?.answers?.filter(a => page.questions.some(q => q.id === a.questionnaireQuestionId))}
              questionnaireId={questionnaireDetails.id}
              cdnBaseUrl={questionnaireResponseDetail?.cdnBaseUrl}
              saveUpdatedQuestionnaireResponseCallback={saveUpdatedQuestionnaireResponseCallback}
            />
          ))}
          {questionnaireDetails?.pages.length % 2 === 1 ? (
            <View className="w-36 h-32 rounded-xl" />
          ) : null}
        </View>
      </ScrollView>
      }
      {editModeFlag ? (
      <View className="m-8">
        {isActiveFlag ? (
          <WarningButton onPress={handleInactivate} isWorking={isInactivating}>
            Deactivate
          </WarningButton>
        ) : (
          <PrimaryButton onPress={handleActivate} isWorking={isActivating}>
            Activate
          </PrimaryButton>
        )}
      </View>
      ) : null}
    </SafeAreaView>
  )
}