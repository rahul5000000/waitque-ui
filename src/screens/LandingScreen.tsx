import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, Pressable, Modal, Alert, TextInput } from 'react-native';
import { useAppContext } from '../hooks/AppContext';
import QRScanner from '../components/QRScanner';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from '../hooks/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import { discovery, buildRedirectUri, exchangeCodeForToken, buildAuthRequest } from "../services/authService";
import { userService } from '../services/backend/userService';
import { publicService } from '../services/backend/publicService';
import { companyService } from '../services/backend/companyService';
import { logoutUser } from "../services/authService";
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import Toast from 'react-native-toast-message';
import { logError } from '../services/mobileLogger';

WebBrowser.maybeCompleteAuthSession();

export default function LandingScreen({ navigation }) {
  const { setCompany, setCustomer, setFlows, setQrCode, setQuestionnaires, setUser, clearContext } = useAppContext();
  const [isFetching, setIsFetching] = React.useState(false);
  const { isLoaded, mode, customerCode, loginCustomer, loginAdmin, logout } = useAuth();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [manualCustomerCode, setManualCustomerCode] = React.useState('');

  console.log("Rendering LandingScreen");

  useEffect(() => {
    if (!isLoaded) return;              // Wait until SecureStore is loaded

    console.log("Auth is loaded. Mode is", mode);

    if (mode === "customer") {
      fetchCustomerData(customerCode);
    } else if (mode === "admin") {
      fetchUserData();
    }
  }, [isLoaded, mode]);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const fetchCustomerData = async (qrCode) => {
    try {
      console.log("Fetching customer data with QR code:", qrCode);
      setIsFetching(true);
      loginCustomer(qrCode);

      const [customerResponse, companyResponse, flowsResponse, questionnairesResponse] = await Promise.all([
        publicService.getMe(qrCode),
        publicService.getCompany(qrCode),
        publicService.getFlows(qrCode, 10, 0), // TODO: get all pages of flows
        publicService.getQuestionnaireResponses(qrCode, 10, 0), // TODO: get all pages of flows
      ]);

      setCustomer(customerResponse.data);
      setCompany(companyResponse.data);
      setFlows(flowsResponse.data);
      setQrCode(qrCode);
      setQuestionnaires(questionnairesResponse.data);

      await delay(500);

      console.log("Navigating to home screen");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      logError({
        qrCode,
        page: 'LandingScreen',
        message: 'Failed to fetch customer data',
        error,
      }).catch(() => {
        // swallow errors from logger
      });

      await logoutUser(mode, logout);
      await clearContext();
    } finally {
      setIsFetching(false);
    }
  };

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data");
      setIsFetching(true);
      const userResponse = await userService.getMe();
      const user = userResponse.data;
      setUser(user);

      const companyResponse = await companyService.getCompany(user.role);
      setCompany(companyResponse.data);

      await delay(1000);

      console.log("Navigating to field home screen");

      if(user.role == "FIELD_USER") {
        navigation.reset({
          index: 0,
          routes: [{ name: "FieldHome" }],
        });
      } else {
        throw new Error("Unsupported user role");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      await logoutUser(mode, logout);
      await clearContext();
    } finally {
      setIsFetching(false);
    }
  }

  const redirectUri = buildRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    buildAuthRequest(redirectUri),
    discovery
  );

  useEffect(() => {
    const handleAuth = async () => {
      if (response?.type === "success") {
        const { code } = response.params;

        const tokenResult = await exchangeCodeForToken({
          code,
          clientId: "mobile-app",
          redirectUri,
          codeVerifier: request.codeVerifier,
        });

        await loginAdmin(tokenResult.accessToken, tokenResult.refreshToken);

        await fetchUserData();
      }
    };

    handleAuth();
  }, [response]);

  const manuallyLogin = async () => {
    if(manualCustomerCode === "123-123") {
      //await fetchCustomerData("abb751db-5624-4c0a-ac05-af8291e2effa");
      await fetchCustomerData("3e9cb878-8176-422e-9dd0-61d5023b2f28");
      setModalVisible(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Customer not found"
      });
    }
  }

  return (
    <SafeAreaView className='flex-1'>
      <LoadingOverlay isLoaded={isLoaded && !isFetching} />
      {!isLoaded || isFetching ? null :
        <>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.25)'}}>
              <View className='m-8 p-6 rounded-xl bg-white' style={{width: '80%'}}>
                <Text className='mb-2'>Enter Customer Code:</Text>
                <TextInput autoComplete='off' autoCorrect={false} inputMode='numeric' style={{borderColor: "#ddd", borderWidth: 2, padding: 12, marginBottom: 12, borderRadius: 5, backgroundColor: 'white', color: 'black', fontWeight: 'bold', fontSize: 16, textAlign: 'center'}} onChangeText={(customerCode) => setManualCustomerCode(customerCode)} value={manualCustomerCode}/>
                <PrimaryButton onPress={manuallyLogin}>Login</PrimaryButton>
                <SecondaryButton onPress={() => setModalVisible(false)}>Cancel</SecondaryButton>
              </View>
            </View>
          </Modal>
          <View className='flex-row justify-end p-4'>
            <TouchableOpacity className='pb-10 pl-10 pt-2 pr-2' onPress={() => promptAsync()}>
              <Ionicons name="lock-open" size={24}></Ionicons>
            </TouchableOpacity>
          </View>
          <View className='p-5 m-5'>
            <Text className="text-3xl font-bold mr-20 mb-5">Login with your customer QR code:</Text>
            <QRScanner onScan={fetchCustomerData} />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text className='text-center mt-6 text-blue-500'>or Manually enter your Customer Code</Text>
            </TouchableOpacity>
          </View>
        </>
      }

    </SafeAreaView>
  )
}
