import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View, Linking } from "react-native";
import { useAppContext } from "../hooks/AppContext";
import { useCompanyTheme } from "../hooks/useCompanyTheme";
import axios from "axios";
import Toast from 'react-native-toast-message';

export default function ContactWidget() {
  const arrowIcon = "arrow-forward-outline";
  const callIcon = "call";
  const messageMode = "message";
  const callMode = "call";

  const {company, backendBaseUrl} = useAppContext();
  const {colors} = useCompanyTheme();

  const [message, setMessage] = React.useState(''); 
  const [mode, setMode] = React.useState(callMode); 

  const handleTypeMessage = (text) => {
    if(text && mode !== messageMode) {
      setMode(messageMode);
    } else if(!text && mode !== callMode) {
      setMode(callMode);
    }

    setMessage(text);
  }

  const handleButtonPress = () => {
    if(mode === callMode) {
      Linking.openURL(`tel:${company.phoneNumber.phoneNumber}`)
    } else {
      axios.post(`${backendBaseUrl}/api/public/customers/qrCode/412af2e9-3fc6-462d-a3b7-d1290e591564/messages`, {"message": message}).then((res) => {
        handleTypeMessage('');
        Toast.show({
          type: 'success',
          text1: "Message sent!"
        })
      })
    }
  }

  return (
    <View className="flex-row">
      <TextInput 
        style={{borderWidth: 1, borderColor: '#ddd', borderRadius: 30, padding: 12, backgroundColor: 'white'}} 
        className="flex-1 shadow" 
        placeholder={`Message ${company.name} ...`} 
        onChangeText={handleTypeMessage}
        returnKeyType="send"
        onSubmitEditing={handleButtonPress}
        value={message}></TextInput>
      <TouchableOpacity className="p-5 ml-4 items-center" style={{borderRadius: 30, backgroundColor: colors.primaryButtonColor}} onPress={handleButtonPress}>
        <Ionicons name={mode === callMode ? callIcon : arrowIcon} color={'white'} size={16}></Ionicons>
      </TouchableOpacity>
    </View>
  )
}