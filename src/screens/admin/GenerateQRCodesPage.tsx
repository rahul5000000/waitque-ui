import React, { useState } from "react";
import { companyService } from "../../services/backend/companyService";
import { useAppContext } from '../../hooks/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, View, Text, TextInput } from 'react-native';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import { PrimaryButton } from "../../components/Buttons";
import Toast from "react-native-toast-message";
import { writeAsStringAsync, documentDirectory, EncodingType } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

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
    companyService.generateQRCodes(numToGenerate, user.role).then(async (response) => {
      try {
        // Convert arraybuffer to base64
        const bytes = new Uint8Array(response.data);
        let base64 = '';
        for (let i = 0; i < bytes.length; i++) {
          base64 += String.fromCharCode(bytes[i]);
        }
        const encoded = btoa(base64);

        if (Platform.OS === 'web') {
          // Web: use blob download
          const blob = new Blob([response.data], { type: 'application/zip' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `qr-codes-${Date.now()}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          // Native: use file system
          const fileName = `qr-codes-${Date.now()}.zip`;
          const fileUri = documentDirectory + fileName;
          await writeAsStringAsync(fileUri, encoded, { encoding: EncodingType.Base64 });
          await Sharing.shareAsync(fileUri, { mimeType: 'application/zip' });
        }

        Toast.show({ text1: "QR codes downloaded!", type: "success" });
        navigation.goBack();
      } catch (err) {
        console.error('File error:', err);
        Toast.show({ text1: "Failed to save file.", type: "error" });
      }
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
          <Text className="text-gray-500">Generate new unassigned QR codes to print on flyers, swag, etc. These unassigned QR codes can be assigned to customers later in the field.</Text>
          <Text className="mt-4 mb-2">Number of QR codes to generate (up to 1000):</Text>
          <TextInput style={textInputStyle} value={value} onChangeText={handleChange} keyboardType="number-pad" placeholder="1–1000"/>
          <PrimaryButton onPress={handleGenerate} isWorking={isGenerating}>Generate QR Codes</PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}