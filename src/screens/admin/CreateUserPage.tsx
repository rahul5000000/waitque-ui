import React, { use, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import { companyService } from "../../services/backend/companyService";
import { useAppContext } from "../../hooks/AppContext";
import Spinner from "../../components/Spinner";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import TextNewUserQuestion from "../../components/admin/new-user/TextNewUserQuestion";
import EmailNewUserQuestion from "../../components/admin/new-user/EmailNewUserQuestion";
import NewUserQuestionText from "../../components/admin/new-user/NewUserQuestionText";
import Toast from "react-native-toast-message";

export default function CreateUserPage({navigation, route}) {
  const { refreshCallback } = route.params;
  const [isSaving, setIsSaving] = React.useState(false);
  const {user} = useAppContext();
  const [username, setUsername] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [usernameValidationError, setUsernameValidationError] = React.useState(false);
  const [firstNameValidationError, setFirstNameValidationError] = React.useState(false);
  const [lastNameValidationError, setLastNameValidationError] = React.useState(false);
  const [emailValidationError, setEmailValidationError] = React.useState(false);

  const toFriendlyRoleName = (role: string) => {
    switch(role) {
      case "ADMIN":
        return "Admin";
      case "FIELD_USER":
        return "Field User";
      default:
        return role;
    }
  }

  const handleSave = async () => {    
    // Check for any validation errors
    if(!validateFields()) {
      Toast.show({
        text1: "Complete all required fields",
        type: "error",
      });
      return;
    }
    // Implement user creation logic here
    let userData = {
      "username": username,
      "firstName": firstName,
      "lastName": lastName,
      "email": email
    };

    setIsSaving(true);
    try {
      await companyService.createUser("FIELD_USER", userData, user.role);
      Toast.show({
        text1: "User created successfully",
        type: "success",
      });
      // After successful creation, call the refresh callback to update the user list
      if (refreshCallback) {
        await refreshCallback();
      }

      // Navigate back to the user search page
      navigation.goBack();
    } catch (error) {
      console.error("Error creating user:", error);
      Toast.show({
        text1: "Error creating user",
        text2: "Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const validateEmailField = (email: string): boolean => {
    if(!email || email.trim() === "") return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validateTextField = (text: string): boolean => {
    return text && text.trim() !== "";
  }

  const validateFields = () => {
    let usernameValid = validateTextField(username);
    let firstNameValid = validateTextField(firstName);
    let lastNameValid = validateTextField(lastName);
    let emailValid = validateEmailField(email);
    
    setUsernameValidationError(!usernameValid);
    setFirstNameValidationError(!firstNameValid);
    setLastNameValidationError(!lastNameValid);
    setEmailValidationError(!emailValid);

    return usernameValid && firstNameValid && lastNameValid && emailValid;
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className="flex-1 p-8">
        <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>Create New User</Header>
        <ScrollView className="flex-1 mt-2">
          <TextNewUserQuestion isRequired={true} hasValidationError={usernameValidationError} value={username} onChange={setUsername}>Username</TextNewUserQuestion>
          <TextNewUserQuestion isRequired={true} hasValidationError={firstNameValidationError} value={firstName} onChange={setFirstName}>First Name</TextNewUserQuestion>
          <TextNewUserQuestion isRequired={true} hasValidationError={lastNameValidationError} value={lastName} onChange={setLastName}>Last Name</TextNewUserQuestion>
          <EmailNewUserQuestion isRequired={true} hasValidationError={emailValidationError} value={email} onChange={setEmail}>Email</EmailNewUserQuestion>
          <NewUserQuestionText hasValidationError={false}>Role: Field User</NewUserQuestionText>
        </ScrollView>
        <PrimaryButton onPress={handleSave} isWorking={isSaving}>Save</PrimaryButton>
        <SecondaryButton onPress={() => navigation.goBack()} isWorking={isSaving}>Cancel</SecondaryButton>
      </View>
    </SafeAreaView>
  )
}