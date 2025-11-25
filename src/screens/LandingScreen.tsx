import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Platform } from 'react-native';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useAppContext } from '../hooks/AppContext';

export default function LandingScreen({ navigation }) {
  const { setCompany, setCustomer, setFlows, setBackendBaseUrl, setQrCode, setQuestionnaires } = useAppContext();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const baseUrl = Platform.OS === 'android' || Platform.OS === 'ios' ? 'http://10.0.0.151:8083' : 'http://localhost:8083';
        const qrCode = "abb751db-5624-4c0a-ac05-af8291e2effa";

        const [customerResponse, companyResponse, flowsResponse, questionnairesResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/me`),
          axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/company`),
          axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/company/flows?limit=10&page=0`), // TODO: get all pages of flows
          axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/questionnaires/*/responses?status=ACTIVE&limit=10&page=0`), // TODO: get all pages of flows
        ]);

        console.log('Customer:', customerResponse.data);
        console.log('Company:', companyResponse.data);
        console.log('Flows:', flowsResponse.data);
        console.log('Questionnaires:', questionnairesResponse.data);

        setCustomer(customerResponse.data);
        setCompany(companyResponse.data);
        setFlows(flowsResponse.data);
        setBackendBaseUrl(baseUrl);
        setQrCode(qrCode);
        setQuestionnaires(questionnairesResponse.data);

        navigation.navigate('Home');
      } catch (error) {
        console.error('Error fetching customer:', error);
        Alert.alert('Error', 'Failed to load customer information.');
      }
    };

    fetchCustomerData();
  }, [navigation]);

  return (
    <SafeAreaView className='flex-1 items-center justify-center'>
      <Spinner message="Looking up your information"></Spinner>
    </SafeAreaView>
  )
}
