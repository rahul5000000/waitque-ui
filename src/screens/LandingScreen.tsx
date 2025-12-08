import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Alert, Platform, Button, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
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

export default function LandingScreen({ navigation }) {
  const { setCompany, setCustomer, setFlows, setBackendBaseUrl, setQrCode, setQuestionnaires } = useAppContext();
  const [isFetching, setIsFetching] = React.useState(false);
  const { isLoaded, mode, customerCode, loginCustomer, loginAdmin } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;              // Wait until SecureStore is loaded

    if (mode === "customer") {
      fetchCustomerData(customerCode);
    } else if (mode === "admin") {
      navigation.reset({
        index: 0,
        routes: [{ name: "FieldHome" }],
      });
    }
  }, [isLoaded, mode]);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const fetchCustomerData = async (qrCode) => {
    try {
      setIsFetching(true);
      loginCustomer(qrCode);
      const baseUrl = Platform.OS === 'android' || Platform.OS === 'ios' ? 'http://10.0.0.236:8083' : 'http://localhost:8083';

      const [customerResponse, companyResponse, flowsResponse, questionnairesResponse] = await Promise.all([
        publicService.getMe(qrCode),
        publicService.getCompany(qrCode),
        publicService.getFlows(qrCode, 10, 0), // TODO: get all pages of flows
        publicService.getQuestionnaireResponses(qrCode, 10, 0), // TODO: get all pages of flows
      ]);

      setCustomer(customerResponse.data);
      setCompany(companyResponse.data);
      setFlows(flowsResponse.data);
      setBackendBaseUrl(baseUrl);
      setQrCode(qrCode);
      setQuestionnaires(questionnairesResponse.data);

      await delay(500);

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      Alert.alert('Error', 'Failed to load customer information.');
    } finally {
      setIsFetching(false);
    }
  };

  const fetchUserData = async (accessToken) => {
    try {
      setIsFetching(true);
      const user = await userService.getMe();

      console.log('Fetched user data:', user.data);

      if(user.data.role == "FIELD_USER") {
        navigation.reset({
          index: 0,
          routes: [{ name: "FieldHome" }],
        });
      } else {
        throw new Error("Unsupported user role");
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user information.');
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

        console.log("Token Result:", tokenResult);

        await loginAdmin(tokenResult.accessToken, tokenResult.refreshToken);

        await fetchUserData(tokenResult.accessToken);
      }
    };

    handleAuth();
  }, [response]);


  return (
    <SafeAreaView className='flex-1'>
      <LoadingOverlay isLoaded={isLoaded && !isFetching} />
      {!isLoaded || isFetching ? null :
        <>
          <View className='flex-row justify-end p-4'>
            <TouchableOpacity className='pb-10 pl-10 pt-2 pr-2' onPress={() => promptAsync()}>
              <Ionicons name="lock-open" size={24}></Ionicons>
            </TouchableOpacity>
          </View>
          <View className='p-5 m-5'>
            <Text className="text-3xl font-bold mr-20 mb-5">Login with your customer QR code:</Text>
            <QRScanner onScan={fetchCustomerData} />
            <Text className='text-center mt-6'>or Manually enter your Customer Code</Text>
          </View>
        </>
      }

    </SafeAreaView>
  )
}
