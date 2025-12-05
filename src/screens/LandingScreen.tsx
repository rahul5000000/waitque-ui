import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Alert, Platform, Button, View, TouchableOpacity } from 'react-native';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useAppContext } from '../hooks/AppContext';
import QRScanner from '../components/QRScanner';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from '../hooks/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

export default function LandingScreen({ navigation }) {
  const { setCompany, setCustomer, setFlows, setBackendBaseUrl, setQrCode, setQuestionnaires } = useAppContext();
  const [isFetching, setIsFetching] = React.useState(false);
  const [tokenResponse, setTokenResponse] = React.useState(null);
  const { isLoaded, mode, customerCode, loginCustomer, loginAdmin } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;              // Wait until SecureStore is loaded

    if (mode === "customer") {
      fetchCustomerData(customerCode);
    }
  }, [isLoaded, mode]);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const fetchCustomerData = async (qrCode) => {
    try {
      setIsFetching(true);
      loginCustomer(qrCode);
      const baseUrl = Platform.OS === 'android' || Platform.OS === 'ios' ? 'http://10.0.0.236:8083' : 'http://localhost:8083';

      const [customerResponse, companyResponse, flowsResponse, questionnairesResponse] = await Promise.all([
        axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/me`),
        axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/company`),
        axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/company/flows?limit=10&page=0`), // TODO: get all pages of flows
        axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/questionnaires/*/responses?status=ACTIVE&limit=10&page=0`), // TODO: get all pages of flows
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

  const discovery = {
      authorizationEndpoint: "http://waitque-alb-1208411922.us-east-1.elb.amazonaws.com/realms/rrs-waitque/protocol/openid-connect/auth",
      tokenEndpoint: "http://waitque-alb-1208411922.us-east-1.elb.amazonaws.com/realms/rrs-waitque/protocol/openid-connect/token",
      revocationEndpoint: "http://waitque-alb-1208411922.us-east-1.elb.amazonaws.com/realms/rrs-waitque/protocol/openid-connect/revoke",
    };
  
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "waitque",
      path: "redirect",
    });
  
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: "mobile-app",
        redirectUri,
        responseType: "code",
        scopes: ["openid", "profile", "email"],
        usePKCE: true,
      },
      discovery
    );
  
    useEffect(() => {
      const exchange = async () => {
        if (response?.type === "success") {
          const { code } = response.params;
  
          const tokenResult = await AuthSession.exchangeCodeAsync(
            {
              code,
              clientId: "mobile-app",
              redirectUri,
              extraParams: {
                code_verifier: request.codeVerifier,
              },
            },
            discovery
          );
  
          console.log("Token Result:", tokenResult);
  
          setTokenResponse(tokenResult);
        }
      };
  
      exchange();
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
          <QRScanner onScan={fetchCustomerData}/>
          <Text className='text-center mt-6'>or Manually enter your Customer Code</Text>
        </View>
      </>
      }

    </SafeAreaView>
  )
}
