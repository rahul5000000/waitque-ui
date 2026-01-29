import React, { useState } from "react";
import { companyService } from "../../services/backend/companyService";
import { useAppContext } from '../../hooks/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TextInput } from 'react-native';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import { PrimaryButton } from "../../components/Buttons";
import Toast from "react-native-toast-message";

export default function GenerateQRCodesPage({navigation}) {
  const {user} = useAppContext();
  const {textInputStyle} = useCompanyTheme();
  const [value, setValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (text: string) => {
    // Allow only digits
    if (!/^\d*$/.test(text)) return;

    const num = Number(text);

    // Enforce range if value exists
    if (num > 1000) return;

    setValue(text);
  };

  const handleGenerate = () => {
    const numToGenerate = Number(value);
    if (isNaN(numToGenerate) || numToGenerate < 1 || numToGenerate > 1000) {
      Toast.show({
        text1: "Please enter a valid number between 1 and 1000.",
        type: "error",
      });
      return;
    }

    //Call backend service to generate QR codes
    setIsGenerating(true);
    companyService.generateQRCodes(numToGenerate, user.role).then((response) => {
      console.log("Generated QR codes:", response.data);
      //navigation.goBack();
    }).catch((error) => {
      console.log("Failed to generate QR codes:", error);
      Toast.show({
        text1: "Failed to generate QR codes. Please try again.",
        type: "error",
      });
    }).finally(() => {
      setIsGenerating(false);
    });
  };
  
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            Generated QR Codes
          </Header>
        </View>
        <View className="px-8 mt-6">
          <Text className="text-gray-500">Generate new unassigned QR codes to print on flyers, etc. These unassigned QR codes can be assigned to customers later in the field.</Text>
          <Text className="mt-4 mb-2">Number of QR codes to generate (up to 1000):</Text>
          <TextInput style={textInputStyle} value={value} onChangeText={handleChange} keyboardType="number-pad" placeholder="1–1000"/>
          <PrimaryButton onPress={handleGenerate} isWorking={isGenerating}>Generate QR Codes</PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}