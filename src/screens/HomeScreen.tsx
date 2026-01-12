import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Button, Settings } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import FlowWidget from '../components/FlowWidget';
import { useAppContext } from '../hooks/AppContext';
import ContactWidget from '../components/ContactWidget';
import QuestionnaireResponseWidget from '../components/QuestionnaireResponseWidget';
import Logo from '../components/Logo';
import SettingsWidget from '../components/SettingsWidget';
import { KeyboardDismissWrapper } from '../components/KeyboardDismissWrapper';


export default function HomeScreen({ navigation, route }) {
  const {company, customer, flows, questionnaires} = useAppContext();
  const {backgroundStyle, textStyle} = useCompanyTheme();

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <KeyboardDismissWrapper>
          <View style={{ flex: 1, padding: 24 }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ flex: 1 }}>
                <View className='flex-row mb-10 mt-2'>
                  <View className='flex-2 items-start justify-center'>
                    <Text className="text-2xl font-semibold" style={textStyle}>
                      Hi {customer.customerType === "RESIDENTIAL" || !customer.companyName ? `${customer.firstName} ${customer.lastName}` : customer.companyName},
                    </Text>
                    <Text className="text-2xl font-semibold" style={textStyle}>
                      {company.landingPrompt}
                    </Text>
                  </View>
                  <View className='flex-1 items-end justify-center'>
                    <Logo/>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <View className="flex-row flex-wrap justify-center gap-4 mb-8">
                    {flows.leadFlows.map((flow) => (
                      <FlowWidget
                        key={flow.id}
                        navigation={navigation}
                        flow={flow}
                      />
                    ))}
                    {questionnaires.questionnaireResponses.map((questionnaireResponse) => (
                      <QuestionnaireResponseWidget
                        key={questionnaireResponse.id}
                        navigation={navigation}
                        questionnaireResponse={questionnaireResponse}
                      />
                    ))}
                    <SettingsWidget navigation={navigation} />
                    {(flows.leadFlows.length + questionnaires.questionnaireResponses.length + 1) % 2 === 1 ? (
                      <View className="w-36 h-32 rounded-xl" />
                    ) : null}
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Footer stays above keyboard */}
            <View style={{ marginTop: "auto" }}>
              <ContactWidget />
            </View>
          </View>
        </KeyboardDismissWrapper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}