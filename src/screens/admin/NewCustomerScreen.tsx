import React, { useEffect } from "react";
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import TextNewCustomerQuestion from "../../components/admin/new-customer/TextNewCustomerQuestion";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import BooleanNewCustomerQuestion from "../../components/admin/new-customer/BooleanNewCustomerQuestion";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import PhoneNumberNewCustomerQuestion from "../../components/admin/new-customer/PhoneNumberNewCustomerQuestion";
import Toast from "react-native-toast-message";
import { customerService } from "../../services/backend/customerService";
import { useAppContext } from "../../hooks/AppContext";
import Spinner from "../../components/Spinner";
import NewCustomerQuestionText from "../../components/admin/new-customer/NewCustomerQuestionText";
import { Ionicons } from "@expo/vector-icons";

export default function NewCustomerScreen({ navigation }) {
  const [isCommercial, setIsCommercial] = React.useState(true);
  const [companyName, setCompanyName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [address1, setAddress1] = React.useState("");
  const [address2, setAddress2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [validationErrorMap, setValidationErrorMap] = React.useState(new Map<string, boolean>());
  const { mutedWidgetBackgroundStyle, textInputStyle } = useCompanyTheme();
  const {user} = useAppContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [additionalPhoneNumbers, setAdditionalPhoneNumbers] = React.useState([]);
  const [addlPhoneNumberInputType, setAddlPhoneNumberInputType] = React.useState("");
  const [addlPhoneNunberInput, setAddlPhoneNumberInput] = React.useState("");

  useEffect(() => {
    // Validate fields on change
    validateFields();
  }, [isCommercial, companyName, firstName, lastName, address1, city, state, zip, email, phone]);

  const digitsOnly = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  const handleSubmit = () => {
    validateFields();

    // Check for any validation errors
    let hasErrors = false;
    validationErrorMap.forEach((hasError) => {
      if(hasError) hasErrors = true;
    });

    if(hasErrors) {
      Toast.show({
        text1: "Complete all required fields correctly",
        type: "error",
      });
      return;
    }

    let addlPhonesPayload = additionalPhoneNumbers.map(phone => ({
      "countryCode": phone.countryCode,
      "phoneNumber": digitsOnly(phone.phoneNumber),
      "type": phone.type
    }));

    let customerData = {
      "customerType": isCommercial ? "COMMERCIAL" : "RESIDENTIAL",
      "companyName": isCommercial ? companyName : null,
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "phone": {
        "countryCode": "1",
        "phoneNumber": digitsOnly(phone)
      },
      "additionalPhones": addlPhonesPayload,
      "address": {
        "address1": address1,
        "address2": address2,
        "city": city,
        "state": state,
        "zipcode": zip,
        "country": "US"
      }
    };

    setIsSubmitting(true);

    customerService.createCustomer(customerData, user.role).then(() => {
      Toast.show({
        text1: "Customer created successfully",
        type: "success",
      });
      navigation.goBack();
    }).catch((error) => {
      Toast.show({
        text1: "Failed to create customer",
        text2: "Please try again later",
        type: "error",
      });
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  const validateFields = () => {
    if(isCommercial) {
      validateStringField(companyName, "companyName");
    } else {
      setValidationErrorMap(prev => new Map(prev.set("companyName", false)));
    }

    validateStringField(firstName, "firstName");
    validateStringField(lastName, "lastName");
    validateEmailField(email, "email");
    validatePhoneField(phone, "phone");
    validateStringField(address1, "address1");
    validateStringField(city, "city");
    validateStringField(state, "state");
    validateStringField(zip, "zip");
  }

  const validateStringField = (value: string, fieldName: string): boolean => {
    if(!value || value.trim() === "") {
      setValidationErrorMap(prev => new Map(prev.set(fieldName, true)));
      return false;
    }
    setValidationErrorMap(prev => new Map(prev.set(fieldName, false)));
    return true;
  }

  const validateEmailField = (value: string, fieldName: string): boolean => {
    // simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(value)) {
      setValidationErrorMap(prev => new Map(prev.set(fieldName, true)));
      return false;
    }
    setValidationErrorMap(prev => new Map(prev.set(fieldName, false)));
    return true;
  }

  const validatePhoneField = (value: string, fieldName: string): boolean => {
    // simple phone regex (US)
    const phoneRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
    if(!phoneRegex.test(value)) {
      setValidationErrorMap(prev => new Map(prev.set(fieldName, true)));
      return false;
    }
    setValidationErrorMap(prev => new Map(prev.set(fieldName, false)));
    return true;
  }

  const cancelAddlPhoneNumberModal = () => {
    setAddlPhoneNumberInput("");
    setAddlPhoneNumberInputType("");
    setModalVisible(false);
  }

  const handleAddlPhoneNumber = () => {
    if(!addlPhoneNumberInputType || addlPhoneNumberInputType.trim() === "") {
      Toast.show({
        text1: "Please enter a phone type",
        type: "error",
      });
      return;
    }

    const digitsOnlyPhoneNumber = digitsOnly(addlPhoneNunberInput);
    const phoneRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
    if(!phoneRegex.test(digitsOnlyPhoneNumber)) {
      Toast.show({
        text1: "Please enter a valid phone number",
        type: "error",
      });
      return;
    }

    setAdditionalPhoneNumbers(prev => [...prev, {
      "countryCode": "1",
      "phoneNumber": digitsOnlyPhoneNumber,
      "type": addlPhoneNumberInputType
    }]);

    setAddlPhoneNumberInput("");
    setAddlPhoneNumberInputType("");
    setModalVisible(false);
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            New Customer
          </Header>
        </View>
        <ScrollView className="flex-1 px-8">
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.25)'}}>
              <View className='m-8 p-6 rounded-xl bg-white' style={{width: '80%'}}>
                <Text className='mb-2 font-bold'>Add Phone Number</Text>
                <NewCustomerQuestionText isRequired={true} hasValidationError={false}>Who's Phone Number?</NewCustomerQuestionText>
                <TextInput autoComplete='off' autoCorrect={false} style={textInputStyle} onChangeText={(phoneType) => setAddlPhoneNumberInputType(phoneType)} value={addlPhoneNumberInputType} />
                <NewCustomerQuestionText isRequired={true} hasValidationError={false}>Phone Number</NewCustomerQuestionText>
                <TextInput autoComplete="off" inputMode="tel" keyboardType="phone-pad" style={textInputStyle} onChangeText={(value) => setAddlPhoneNumberInput(value)} value={addlPhoneNunberInput} />
                <View className="mt-4">
                  <PrimaryButton onPress={() => handleAddlPhoneNumber()}>Add</PrimaryButton>
                  <SecondaryButton onPress={() => cancelAddlPhoneNumberModal()}>Cancel</SecondaryButton>
                </View>
              </View>
            </View>
          </Modal>
          <View style={mutedWidgetBackgroundStyle} className="p-4 rounded-xl my-6">
            <Text className="font-bold">Customer Information</Text>
            <BooleanNewCustomerQuestion isRequired={true} value={isCommercial} onChange={setIsCommercial} falseText={"Residential"} trueText={"Commercial"} hasValidationError={false}>Customer Type</BooleanNewCustomerQuestion>
            {isCommercial ? 
            <>
              <TextNewCustomerQuestion isRequired={true} value={companyName} onChange={setCompanyName} hasValidationError={validationErrorMap.get("companyName")}>Company Name</TextNewCustomerQuestion>
              <TextNewCustomerQuestion isRequired ={true} value={firstName} onChange={setFirstName} hasValidationError={validationErrorMap.get("firstName")}>Contact First Name</TextNewCustomerQuestion> 
              <TextNewCustomerQuestion isRequired ={true} value={lastName} onChange={setLastName} hasValidationError={validationErrorMap.get("lastName")}>Contact Last Name</TextNewCustomerQuestion>
            </>
            :
            <>
              <TextNewCustomerQuestion isRequired ={true} value={firstName} onChange={setFirstName} hasValidationError={validationErrorMap.get("firstName")}>Customer First Name</TextNewCustomerQuestion> 
              <TextNewCustomerQuestion isRequired ={true} value={lastName} onChange={setLastName} hasValidationError={validationErrorMap.get("lastName")}>Customer Last Name</TextNewCustomerQuestion>
            </>
            }
          </View>
          <View style={mutedWidgetBackgroundStyle} className="p-4 rounded-xl mb-6">
            <Text className="font-bold">Contact Information</Text>
            <TextNewCustomerQuestion isRequired ={true} value={email} onChange={setEmail} hasValidationError={validationErrorMap.get("email")}>Email</TextNewCustomerQuestion>
            <PhoneNumberNewCustomerQuestion isRequired ={true} value={phone} onChange={setPhone} hasValidationError={validationErrorMap.get("phone")}>Phone Number</PhoneNumberNewCustomerQuestion>
            <View>
              {additionalPhoneNumbers.map((phone, index) => (
                <View key={index} className="flex-row justify-between items-center">
                  <View className="mt-4">
                    <Text className="font-bold">{phone.type}'s Phone Number</Text>
                    <Text>{`(${phone.phoneNumber.slice(0,3)}) ${phone.phoneNumber.slice(3,6)}-${phone.phoneNumber.slice(6)}`}</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setAdditionalPhoneNumbers(prev => prev.filter((_, i) => i !== index));
                  }}>
                    <Ionicons name="remove-circle" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)} className="mt-2">
              <Text className="mt-2">+ Additional Phone Numbers</Text>
            </TouchableOpacity>
          </View>
          <View style={mutedWidgetBackgroundStyle} className="p-4 rounded-xl mb-6">
            <Text className="font-bold">Address</Text>
            <TextNewCustomerQuestion isRequired ={true} value={address1} onChange={setAddress1} hasValidationError={validationErrorMap.get("address1")}>Address Line 1</TextNewCustomerQuestion>
            <TextNewCustomerQuestion isRequired ={false} value={address2} onChange={setAddress2} hasValidationError={false}>Address Line 2</TextNewCustomerQuestion>
            <TextNewCustomerQuestion isRequired ={true} value={city} onChange={setCity} hasValidationError={validationErrorMap.get("city")}>City</TextNewCustomerQuestion>
            <TextNewCustomerQuestion isRequired ={true} value={state} onChange={setState} hasValidationError={validationErrorMap.get("state")}>State</TextNewCustomerQuestion>
            <TextNewCustomerQuestion isRequired ={true} value={zip} onChange={setZip} hasValidationError={validationErrorMap.get("zip")}>Zip Code</TextNewCustomerQuestion>
          </View>
          <View className="mb-4">
            <PrimaryButton onPress={handleSubmit} isWorking={isSubmitting}>Create Customer</PrimaryButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}