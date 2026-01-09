import React, { useEffect } from "react";
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import TextNewCustomerQuestion from "../../components/admin/new-customer/TextNewCustomerQuestion";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import BooleanNewCustomerQuestion from "../../components/admin/new-customer/BooleanNewCustomerQuestion";
import { PrimaryButton } from "../../components/Buttons";
import PhoneNumberNewCustomerQuestion from "../../components/admin/new-customer/PhoneNumberNewCustomerQuestion";
import Toast from "react-native-toast-message";
import { customerService } from "../../services/backend/customerService";
import { useAppContext } from "../../hooks/AppContext";
import Spinner from "../../components/Spinner";

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
  const { mutedWidgetBackgroundStyle } = useCompanyTheme();
  const {user} = useAppContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    // Validate fields on change
    validateFields();
  }, [isCommercial, companyName, firstName, lastName, address1, city, state, zip, email, phone]);

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

    let customerData = {
      "customerType": isCommercial ? "COMMERCIAL" : "RESIDENTIAL",
      "companyName": isCommercial ? companyName : null,
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "phone": {
        "countryCode": "1",
        "phoneNumber": phone
      },
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

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
        {isSubmitting ? <Spinner message="Creating Customer"></Spinner> :
        <>
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            New Customer
          </Header>
        </View>
        <ScrollView className="flex-1 px-8">
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
            <PrimaryButton onPress={handleSubmit}>Create Customer</PrimaryButton>
          </View>
        </ScrollView>
        </>
      }
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}