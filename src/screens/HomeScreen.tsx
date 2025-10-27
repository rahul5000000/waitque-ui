import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import FlowWidget from '../components/FlowWidget';
import { useAppContext } from '../hooks/AppContext';
import ContactWidget from '../components/ContactWidget';


export default function HomeScreen({ navigation, route }) {
  const {company, customer, flows} = useAppContext();
  const {backgroundStyle, textStyle} = useCompanyTheme();

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, padding: 24 }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ flex: 1 }}>
                <View style={{ marginTop: 24, marginBottom: 48 }}>
                  <Text className="text-2xl font-semibold" style={textStyle}>
                    Hi {customer.firstName} {customer.lastName},
                  </Text>
                  <Text className="text-2xl font-semibold mb-6" style={textStyle}>
                    {company.landingPrompt}
                  </Text>
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
                    {flows.leadFlows.length % 2 === 1 ? (
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}