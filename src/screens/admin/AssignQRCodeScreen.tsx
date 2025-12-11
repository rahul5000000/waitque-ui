import React, { useEffect, useState } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import Header from "../../components/Header";
import QRScanner from "../../components/QRScanner";
import { customerService } from "../../services/backend/customerService";
import Spinner from "../../components/Spinner";
import Toast from "react-native-toast-message";

export default function AssignQRCodeScreen({navigation, route}) {
  const {customerMetadata} = route.params;
  const {user} = useAppContext();
  const {backgroundStyle, colors} = useCompanyTheme();
  const [isLoading, setIsLoading] = useState(false);

  const assignQrCode = async (newQrCode) => {
    setIsLoading(true);

    try{
      if(customerMetadata.isAssociated) {
        await customerService.unassignQrCode(customerMetadata.id, user.role);
      }

      await customerService.assignQrCode(newQrCode, customerMetadata.id, user.role);

      Toast.show({
        type: 'info',
        text1: "QR Code assigned"
      });
    } catch(error) {
      console.log("Failed to assign QR Code to customer", error);

      if(error?.response?.status === 409) {
        Toast.show({
          type: 'error',
          text1: "Cannot assign this QR Code",
          text2: "QR Code is assigned to another customer"
        });
      } else {
        Toast.show({
          type: 'error',
          text1: "Failed to assign QR Code"
        });
      }
    } finally {
      setIsLoading(false);
      if(customerMetadata.customerType === "RESIDENTIAL") {
        navigation.replace("ResidentialCustomerDetail", {customerMetadata})
      } else if(customerMetadata.customerType === "COMMERCIAL") {
        navigation.replace("CommercialCustomerDetail", {customerMetadata})
      } else {
        throw new Error("Unsupported customerType");
      }
    }
  }

  const getCustomerDisplayName = () => {
    console.log(customerMetadata)
    if (customerMetadata.customerType === "RESIDENTIAL") {
      return `${customerMetadata.firstName} ${customerMetadata.lastName}`;
    } else if(customerMetadata.customerType === "COMMERCIAL") {
      return customerMetadata.companyName;
    } else {
      throw new Error("Unsupported customerType");
    }
  };

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <View style={{ flex: 1}}>
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>
            {getCustomerDisplayName()}: Assign QR Code
          </Header>
        </View>
        {isLoading ?
        <Spinner message="Assigning QR Code"/>
        :
        <View className="py-8 items-center justify-center">
          <QRScanner onScan={assignQrCode} />
          <Text className="pt-8">The QR Code must be a Waitque QR Code</Text>
          {customerMetadata.isAssociated ?
          <>
            <Text className="p-8 text-center" style={{color: colors.dangerButtonColor}}>WARNING: Assigning a new QR Code will permanently deactivate the current QR Code!</Text>
          </>
          : null}
        </View>
        }
      </View>
    </SafeAreaView>
  );
}