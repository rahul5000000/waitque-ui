import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import LeadQuestionText from "./LeadQuestionText";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from "../../hooks/AppContext";
import axios from "axios";

export default function ImageLeadQuestion({ children, isRequired = false, value, onChange, hasValidationError }) {
  const { mutedWidgetBackgroundStyle, mutedWidgetButtonTextStyle } = useCompanyTheme();
  const { backendBaseUrl, qrCode } = useAppContext();

  const handleUpload = async () => {
    const photo = await pickImage();
    if (photo) {
      await uploadImage(photo);
    }
  }

  const handleTakePhoto = async () => {
    const photo = await takePhoto();
    if (photo) {
      await uploadImage(photo);
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required!");
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1, // full quality
    });

    if (!result.canceled) {
      return result.assets[0]; // { uri, width, height, etc }
    }

    return null;
  }

  const uploadImage = async (photo) => {
    const mimeType = photo.mimeType || "image/jpeg";

    // 1. Get presigned URL
    const { data: presigned } = await axios.get(
      `${backendBaseUrl}/api/public/customers/qrCode/${qrCode}/leads/photoUploadUrl?fileName=${photo.fileName}&contentType=${mimeType}`
    );

    const url = presigned.url;

    // 2. Read the file as ArrayBuffer (works reliably on Android)
    const response = await fetch(photo.uri);
    const buffer = await response.arrayBuffer();

    // 3. Upload to S3
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": mimeType,
      },
      body: buffer,
    });

    console.log("Uploaded OK");
  };

  return (
    <View className="flex">
      <LeadQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</LeadQuestionText>
      <View className="flex-row">
        <TouchableOpacity
          className="rounded-xl items-center justify-center p-12 mr-2 flex-1" style={mutedWidgetBackgroundStyle}
          onPress={handleUpload}
        >
          <Ionicons name="cloud-upload" size={30} style={mutedWidgetButtonTextStyle} />
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-xl items-center justify-center py-12 px-8" style={mutedWidgetBackgroundStyle}
          onPress={handleTakePhoto}
        >
          <Ionicons name="camera" size={30} style={mutedWidgetButtonTextStyle} />
        </TouchableOpacity>
      </View>
    </View>
  )
}