import React, {useState} from "react";
import { Image, TextInput, TouchableOpacity, View, Alert, Platform } from "react-native";
import { useCompanyTheme } from "../../../hooks/useCompanyTheme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator";
import { useAppContext } from "../../../hooks/AppContext";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Spinner from "../../Spinner";
import Toast from 'react-native-toast-message';
import { logAuthenticatedError } from '../../../services/mobileLogger';
import { publicService } from "../../../services/backend/publicService";
import EditQRAnswerText from "./EditQRAnswerText";
import { customerService } from "../../../services/backend/customerService";

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

export default function EditImageQRAnswer({ children, customerId, isRequired = false, value, onChange, hasValidationError, initCdnBaseUrl = "" }) {
  const { mutedWidgetBackgroundStyle, mutedWidgetButtonTextStyle } = useCompanyTheme();
  const [cdnBaseUrl, setCdnBaseUrl] = useState<string>(initCdnBaseUrl);
  const [uploading, setUploading] = useState<boolean>(false);
  const {user} = useAppContext();

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
    try {
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
    } catch (error) {
      Toast.show({
                type: 'error',
                text1: "There was an issue selecting the photo.",
                text2: "Please try again."
              });

      logAuthenticatedError({
        userType: user.role,
        page: 'EditImageQRAnswer',
        message: 'Pick image failed',
        error,
      }).catch(() => {
        // swallow errors from logger
      });

      return null;
    }
    
  }

  const takePhoto = async () => {
    try {
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
    } catch (error) {
      Toast.show({
                type: 'error',
                text1: "There was an issue taking the photo.",
                text2: "Please try again."
              });

      logAuthenticatedError({
        userType: user.role,
        page: 'EditImageQRAnswer',
        message: 'Take photo failed',
        error,
      }).catch(() => {
        // swallow errors from logger
      });

      return null;
    }
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
    try {
      customerService.removePhoto(customerId, value);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: "There was an issue removing the photo.",
        text2: "Please try again."
      });

      logAuthenticatedError({
        userType: user.role,
        page: 'EditImageQRAnswer',
        message: 'Remove photo backend call failed',
        error,
      }).catch(() => {
        // swallow errors from logger
      });
    }
    onChange(null);
  }

  const uploadImage = async (photo) => {
    try {
      setUploading(true);
      const mimeType = photo.mimeType || photo.type || "image/jpeg";
      const ext = mimeToExtension(mimeType);
      const uuid = uuidv4();
      const fileName = `photo_${uuid}.${ext}`;

      // 1. Get presigned URL
      const { data: presigned } = await customerService.getImageUploadUrl(customerId, fileName, mimeType);

      const url = presigned.url;
      setCdnBaseUrl(presigned.cdnBaseUrl);

      // 2. Read the file as ArrayBuffer (works reliably on Android)
      const response = await fetch(photo.uri);
      const buffer = await response.arrayBuffer();

      // 3. Upload to S3
      const uploadResult = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": mimeType,
        },
        body: buffer,
      });

      if(!uploadResult.ok) {
        throw new Error(`Upload to ${url} failed with status ${uploadResult.status} and response ${await uploadResult.text()}`);
      }
      
      onChange(presigned.rawPath);
    } catch (error) {
      Toast.show({
                type: 'error',
                text1: "There was an issue attaching the photo.",
                text2: "Please try again."
              });
      
      logAuthenticatedError({
        userType: user.role,
        page: 'EditImageQRAnswer',
        message: 'Image upload failed',
        error,
      }).catch(() => {
        // swallow errors from logger
      });
    } finally {
      setUploading(false);
    }
  };

  const imageUrl = cdnBaseUrl && value ? `${cdnBaseUrl}/${value}` : null;

  return (
    <View className="flex">
      <EditQRAnswerText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</EditQRAnswerText>
      {!value ? (!uploading ? <View className="flex-row">
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
      </View> : <Spinner message="Uploading"></Spinner>) : (
        <View style={{ position: 'relative' }}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className="h-48 rounded-xl" />
          ) : (
            <View className="h-48 bg-gray-200 rounded-xl" ></View>
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