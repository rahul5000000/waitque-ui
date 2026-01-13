import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useCompanyTheme } from "../../../hooks/useCompanyTheme";
import Header from "../../../components/Header";
import { PrimaryButton, WarningButton } from "../../../components/Buttons";
import Toast from "react-native-toast-message";
import { useAppContext } from "../../../hooks/AppContext";
import EditTextQRAnswer from "../../../components/admin/questionnaire-response/EditTextQRAnswer";
import EditImageQRAnswer from "../../../components/admin/questionnaire-response/EditImageQRAnswer";
import EditNumberQRAnswer from "../../../components/admin/questionnaire-response/EditNumberQRAnswer";
import EditBooleanQRAnswer from "../../../components/admin/questionnaire-response/EditBooleanQRAnswer";
import EditDecimalQRAnswer from "../../../components/admin/questionnaire-response/EditDecimalQRAnswer";
import EditTextAreaQRAnswer from "../../../components/admin/questionnaire-response/EditTextAreaQRAnswer";
import EditPhoneQRAnswer from "../../../components/admin/questionnaire-response/EditPhoneQRAnswer";
import EditEmailQRAnswer from "../../../components/admin/questionnaire-response/EditEmailQRAnswer";
import { customerService } from "../../../services/backend/customerService";
import { logAuthenticatedError } from "../../../services/mobileLogger";

export default function EditQuestionnairePage({ navigation, route }) {
  const { customerMetadata, page, questionnaireResponse, answers, questionnaireId, cdnBaseUrl, saveUpdatedQuestionnaireResponse } = route.params;
  const {user} = useAppContext();
  const { colors, backgroundStyle, cardStyle, primaryButtonTextStyle } = useCompanyTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [questionAnswerMap, setQuestionAnswerMap] = useState({});
  const [questionValidationErrorMap, setQuestionValidationErrorMap] = useState({});
  const [hasActiveValidationError, setHasActiveValidationError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const initialAnswers = {};
      const initialValidationErrors = {};
      page.questions.forEach((q) => {
        if(q.dataType === "BOOLEAN") {
          initialAnswers[q.id] = answers?.find(a => a.questionnaireQuestionId === q.id)?.enabled || false;
        } else if(q.dataType === "NUMBER") {
          initialAnswers[q.id] = answers?.find(a => a.questionnaireQuestionId === q.id)?.number.toString() || "";
        } else if(q.dataType === "DECIMAL") {
          initialAnswers[q.id] = answers?.find(a => a.questionnaireQuestionId === q.id)?.decimal.toString() || "";
        } else if(q.dataType === "IMAGE") {
          initialAnswers[q.id] = answers?.find(a => a.questionnaireQuestionId === q.id)?.url || "";
        } else if(q.dataType === "PHONE") {
          initialAnswers[q.id] = answers?.find(a => a.questionnaireQuestionId === q.id)?.phoneNumber.toString() || "";
        } else if(q.dataType === "EMAIL") {
          initialAnswers[q.id] = answers?.find(a => a.questionnaireQuestionId === q.id)?.email || "";
        } else if(q.dataType === "TEXTAREA") {
          initialAnswers[q.id] = answers?.find(a => a.questionnaireQuestionId === q.id)?.paragraph || ""; 
        } else if(q.dataType === "TEXT") {
          initialAnswers[q.id] = answers?.find(a => a.questionnaireQuestionId === q.id)?.text || "";
        } else {
          throw new Error("Unsupported dataType");
        }

        initialValidationErrors[q.id] = false;
      });
      setQuestionAnswerMap(initialAnswers);
      setQuestionValidationErrorMap(initialValidationErrors);
    }, [page]);

  const editMode = () => questionnaireResponse != null;

  const isActive = () => questionnaireResponse?.status === "ACTIVE"

  const handleAnswerChange = (questionId, value) => {
    setQuestionAnswerMap((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if(hasActiveValidationError) {
      validateFields();
    }
  };

  const validateFields = () => {
    // Validate all required fields are populated
    const newValidationErrors = { ...questionValidationErrorMap };
    page.questions.filter(question => question.isRequired && question.dataType !== "BOOLEAN").forEach(requiredQuestion => {
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

  const renderQuestion = (question) => {
    switch(question.dataType) {
      case "BOOLEAN": return (<EditBooleanQRAnswer key={question.id} isRequired={question.isRequired} falseText={question.falseText} trueText={question.trueText} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</EditBooleanQRAnswer>);
      case "TEXT": return (<EditTextQRAnswer key={question.id} isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</EditTextQRAnswer>)
      case "TEXTAREA": return (<EditTextAreaQRAnswer key={question.id} isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</EditTextAreaQRAnswer>)
      case "NUMBER": return (<EditNumberQRAnswer key={question.id} isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</EditNumberQRAnswer>)
      case "DECIMAL": return (<EditDecimalQRAnswer key={question.id} isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</EditDecimalQRAnswer>)
      case "IMAGE": return (<EditImageQRAnswer key={question.id} customerId={customerMetadata.id} isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)} initCdnBaseUrl={cdnBaseUrl}>{question.question}</EditImageQRAnswer>)
      case "PHONE": return (<EditPhoneQRAnswer key={question.id} isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</EditPhoneQRAnswer>)
      case "EMAIL": return (<EditEmailQRAnswer key={question.id} isRequired={question.isRequired} hasValidationError={questionValidationErrorMap[question.id]} value={questionAnswerMap[question.id]} onChange={(value) => handleAnswerChange(question.id, value)}>{question.question}</EditEmailQRAnswer>)
    }
  }

  const handleSave = () => {
    const answers = buildAnswersForCurrentPage();
    setIsSubmitting(true);
    customerService.createQuestionnaireResponse(customerMetadata.id, questionnaireId, answers, 'INACTIVE', user.role).then((res) => {
      saveUpdatedQuestionnaireResponse(res.data);
      navigation.goBack();
    }).catch((error) => {
      logAuthenticatedError({
        userType: user.role,
        page: 'EditQuestionnairePage',
        message: 'Failed to save questionnaire response',
        error,
      }).catch(() => {
        // swallow errors from logger
      });

      Toast.show({
        type: 'error',
        text1: "Failed to save questionnaire response"
      });
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  const handleUpdate = () => {
    const currentPageAnswers = buildAnswersForCurrentPage();
    
    // First remove all answers that are for questions on the current page
    // Then add all answers for the current page
    const allAnswers = questionnaireResponse.answers.filter(answer => !page.questions.some(q => q.id === answer.questionnaireQuestionId));

    allAnswers.push(...currentPageAnswers);
    
    setIsSubmitting(true);
    customerService.updateQuestionnaireResponse(customerMetadata.id, questionnaireId, questionnaireResponse.id, allAnswers, questionnaireResponse.status, user.role).then((res) => {
      saveUpdatedQuestionnaireResponse(res.data);
      navigation.goBack();
    }).catch((error) => {
      logAuthenticatedError({
        userType: user.role,
        page: 'EditQuestionnairePage',
        message: 'Failed to update questionnaire response',
        error,
      }).catch(() => {
        // swallow errors from logger
      });

      Toast.show({
        type: 'error',
        text1: "Failed to update questionnaire response"
      });
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
      <View>
        <View className="pt-8 pb-4 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            {getCustomerDisplayName()} / {page.pageTitle}
          </Header>
        </View>
      </View>
      <ScrollView className="flex-1 mx-8">
        {page.questions.filter((question) => !question.questionGroup).map(renderQuestion)}
        {Object.entries(page.questions.filter((question) => question.questionGroup).reduce((groups, question) => {
            const group = question.questionGroup;
            if (!groups[group]) {
              groups[group] = [];
            }
            groups[group].push(question);
            return groups;
          }, {})).map(([groupName, questions]) => ({groupName, questions})).map((groupedQuestions) => {
            return (
              <View key={groupedQuestions.groupName} className="p-4 my-4" style={cardStyle}>
                <Text className="text-[18px] font-bold" style={primaryButtonTextStyle}>{groupedQuestions.groupName}</Text>
                {(groupedQuestions.questions as any).map(renderQuestion)}
              </View>
            )
          })
        }
      </ScrollView>
      <View className="m-8">
        {editMode() ?
        <PrimaryButton onPress={handleUpdate} isWorking={isSubmitting}>Update</PrimaryButton>
        :
        <PrimaryButton onPress={handleSave} isWorking={isSubmitting}>Save</PrimaryButton>
        }
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )

  function buildAnswersForCurrentPage() {
    return Object.entries(questionAnswerMap).filter(([_, value]) => value != null && value !== "").map(([questionId, value]) => {
      const question = page.questions.find(q => q.id === parseInt(questionId));
      switch (question.dataType) {
        case "TEXT": return {
          "questionnaireQuestionId": question.id,
          "dataType": "TEXT",
          "text": value
        };
        case "TEXTAREA": return {
          "questionnaireQuestionId": question.id,
          "dataType": "TEXTAREA",
          "paragraph": value
        };
        case "NUMBER": return {
          "questionnaireQuestionId": question.id,
          "dataType": "NUMBER",
          "number": value
        };
        case "DECIMAL": return {
          "questionnaireQuestionId": question.id,
          "dataType": "DECIMAL",
          "decimal": value
        };
        case "BOOLEAN": return {
          "questionnaireQuestionId": question.id,
          "dataType": "BOOLEAN",
          "enabled": value
        };
        case "IMAGE": return {
          "questionnaireQuestionId": question.id,
          "dataType": "IMAGE",
          "url": value
        };
        case "PHONE": return {
          "questionnaireQuestionId": question.id,
          "dataType": "PHONE",
          "phoneNumber": value
        };
        case "EMAIL": return {
          "questionnaireQuestionId": question.id,
          "dataType": "EMAIL",
          "email": value
        };
      }
    });
  }
}