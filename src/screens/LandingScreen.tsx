import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Platform } from 'react-native';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useAppContext } from '../hooks/AppContext';

export default function LandingScreen({ navigation }) {
  const { setCompany, setCustomer, setFlows, setBackendBaseUrl, setQrCode } = useAppContext();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.0.190:8083' : 'http://localhost:8083';
        const qrCode = "412af2e9-3fc6-462d-a3b7-d1290e591564";

        const [customerResponse, companyResponse, flowsResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/me`),
          axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/company`),
          axios.get(`${baseUrl}/api/public/customers/qrCode/${qrCode}/company/flows?limit=10&page=0`), // TODO: get all pages of flows
        ]);

        console.log('Customer:', customerResponse.data);
        console.log('Company:', companyResponse.data);
        console.log('Flows:', flowsResponse.data);

        setCustomer(customerResponse.data);
        setCompany(companyResponse.data);
        setFlows(flowsResponse.data);
        setBackendBaseUrl(baseUrl);
        setQrCode(qrCode);

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
