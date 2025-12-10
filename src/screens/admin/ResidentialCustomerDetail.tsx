import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanyTheme } from "../../hooks/useCompanyTheme";import SettingsWidget from "../../components/SettingsWidget";
import { useAppContext } from "../../hooks/AppContext";
import ManageCustomerWidget from "../../components/ManageCustomerWidget";
import Header from "../../components/Header";
import { customerService } from "../../services/backend/customerService";
import Toast from "react-native-toast-message";
import Spinner from "../../components/Spinner";
import TitledText from "../../components/TitledText";
import TitledMultilineText from "../../components/TitledMultilineText";
import QRCodeRender from "../../components/QRCodeRender";
import { WarningButton } from "../../components/Buttons";
import { Ionicons } from "@expo/vector-icons";

export default function ResidentialCustomerDetail({navigation, route}) {
  const {customerMetadata} = route.params;
  const {user} = useAppContext();
  const {colors, backgroundStyle, mutedWidgetBackgroundStyle, mutedWidgetButtonTextStyle} = useCompanyTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async() => {
    setIsLoading(true);
    try{
      const customerResponse = await customerService.getCustomer(customerMetadata.id, user.role);
      setCustomer(customerResponse.data);

      console.log("Customer Details: ", customerResponse.data);
    } catch(error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: "Failed to load customer details"
      })
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <View style={{ flex: 1}}>
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            Customer Details
          </Header>
        </View>

        {isLoading ? <Spinner/> : <>
          <View className="mx-8 mt-6 mb-0">
            <Text className="text-2xl font-semibold">{customerMetadata.firstName} {customerMetadata.lastName}</Text>
          </View>
          <View className="p-4 m-8 mt-4 rounded-xl" style={mutedWidgetBackgroundStyle}>
            <View>
              {customer?.phone.phoneNumber ?
              <View className="pb-3 border-b" style={{borderColor: colors.backgroundColor}}>
                <TitledText title="Phone">{customer?.phone.phoneNumber}</TitledText>
              </View>
              : null}
              {customer?.address ?
              <View className="py-3 border-b" style={{borderColor: colors.backgroundColor}}>
                <TitledMultilineText title="Address">
                  <Text>{customer?.address.address1}</Text>
                  {customer?.address.address2 ?
                  <Text>{customer?.address.address2}</Text>
                  : null}
                  <Text>{customer?.address.city}, {customer?.address.state} {customer?.address.zipcode}</Text>
                </TitledMultilineText>
              </View>
              : null}
              {customer?.email ?
              <View className="pt-3">
                <TitledText title="Email">{customer?.email}</TitledText>
              </View>
              : null}
            </View>
          </View>

          {customer?.frontEndLink ?
          <View 
            className="mx-8 mt-6 p-6 rounded-2xl"
            style={mutedWidgetBackgroundStyle}
          >
            <Text className="text-lg font-semibold mb-3 text-center">
              Customer QR Code
            </Text>

            <View className="items-center">
              <View 
                className="p-4 rounded-2xl bg-white mb-4" 
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: 3
                }}
              >
                <QRCodeRender size={220}>
                  {customer?.frontEndLink}
                </QRCodeRender>
              </View>
            </View>

            <WarningButton>
              <Ionicons name="ban" size={16}/> Assign new QR Code
            </WarningButton>
          </View>

          :
          <View style={{ flex: 1 }}>
            <View className="flex-row flex-wrap justify-center gap-4 mb-8">
              <ManageCustomerWidget navigation={navigation} />
              <SettingsWidget navigation={navigation} />
              {(1 + 1) % 2 === 1 ? (
                <View className="w-36 h-32 rounded-xl" />
              ) : null}
            </View>
          </View>
          }
        </>}
      </View>
    </SafeAreaView>
  )
}