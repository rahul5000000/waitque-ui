import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Alert, Platform, Button, View, TouchableOpacity } from 'react-native';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useAppContext } from '../hooks/AppContext';
import QRScanner from '../components/QRScanner';
import { Ionicons } from '@expo/vector-icons';

export default function LandingScreen({ navigation }) {
  const { setCompany, setCustomer, setFlows, setBackendBaseUrl, setQrCode, setQuestionnaires } = useAppContext();
  const [isFetching, setIsFetching] = React.useState(false);

  // useEffect(() => {
  //   fetchCustomerData("abb751db-5624-4c0a-ac05-af8291e2effa");
  // }, [navigation]);

  const fetchCustomerData = async (qrCode) => {
    try {
      setIsFetching(true);
      const baseUrl = Platform.OS === 'android' || Platform.OS === 'ios' ? 'http://10.0.0.236:8083' : 'http://localhost:8083';

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
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-row justify-end p-4'>
        <TouchableOpacity className='pb-10 pl-10 pt-2 pr-2' onPress={() => navigation.navigate('Login')}>
          <Ionicons name="lock-open" size={24}></Ionicons>
        </TouchableOpacity>
      </View>
      <View className='p-5 m-5'>
        {isFetching ? <Spinner message="Looking up your information"></Spinner> : <>
          <Text className="text-3xl font-bold mr-20 mb-5">Login with your customer QR code:</Text>
          <QRScanner onScan={fetchCustomerData}/>
          <Text className='text-center mt-6'>or Manually enter your Customer Code</Text>
        </>}
      </View>

    </SafeAreaView>
  )
}
