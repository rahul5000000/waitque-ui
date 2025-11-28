import React, {useState} from "react";
import { Image, TextInput, TouchableOpacity, View, Alert, Platform } from "react-native";
import LeadQuestionText from "./LeadQuestionText";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator";
import { useAppContext } from "../../hooks/AppContext";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const mimeToExtension = (mime: string) => {
  if (!mime) return 'jpg';
  const m = mime.toLowerCase();
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/heic': 'heic',
  };

  if (map[m]) return map[m];

  const parts = m.split('/');
  return parts.length > 1 ? parts[1] : 'jpg';
};

export default function ImageLeadQuestion({ children, isRequired = false, value, onChange, hasValidationError }) {
  const { mutedWidgetBackgroundStyle, mutedWidgetButtonTextStyle } = useCompanyTheme();
  const { backendBaseUrl, qrCode } = useAppContext();
  const [cdnBaseUrl, setCdnBaseUrl] = useState<string>("");

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

    if(result.canceled) return null;

    const asset = result.assets[0];

    const resized = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 1024 } }],   // auto-calculates height
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
    );

    return resized;
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

    if(result.canceled) return null;

    const asset = result.assets[0];

    const resized = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 1024 } }],   // auto-calculates height
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
    );

    return resized;
  }

  const handleRemove = () => {
    if(Platform.OS === "web") {
      return removePhoto();
    }

    Alert.alert(
      'Remove photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removePhoto() },
      ]
    );
  }

  const removePhoto = () => {
    onChange(null);
  }

  const uploadImage = async (photo) => {
    const mimeType = photo.mimeType || photo.type || "image/jpeg";
    const ext = mimeToExtension(mimeType);
    const uuid = uuidv4();
    const fileName = `photo_${uuid}.${ext}`;

    // 1. Get presigned URL
    const { data: presigned } = await axios.get(
      `${backendBaseUrl}/api/public/customers/qrCode/${qrCode}/leads/photoUploadUrl?fileName=${encodeURIComponent(
        fileName
      )}&contentType=${encodeURIComponent(mimeType)}`
    );

    const url = presigned.url;
    setCdnBaseUrl(presigned.cdnBaseUrl);

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

    console.log("Uploaded OK", fileName);
    
    onChange(presigned.rawPath);
  };

  const imageUrl = cdnBaseUrl && value ? `${cdnBaseUrl}/${value}` : null;

  return (
    <View className="flex">
      <LeadQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</LeadQuestionText>
      {!value ? <View className="flex-row">
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
      </View> : (
        <View style={{ position: 'relative' }}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className="h-48 rounded-xl" />
          ) : (
            <View className="h-48 bg-gray-200 rounded-xl" />
          )}
          <TouchableOpacity
            accessibilityLabel="Remove photo"
            onPress={handleRemove}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: 8,
              borderRadius: 20,
            }}
          >
            <Ionicons name="trash" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}