import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LandingScreen from './src/screens/LandingScreen';
import "./global.css";
import { AppProvider } from './src/hooks/AppContext';
import LeadEntryScreen from './src/screens/LeadEntry';
import LeadConfirmationScreen from './src/screens/LeadConfirmationScreen';
import Toast from 'react-native-toast-message';
import QuestionnaireResponseDetailViewScreen from './src/screens/QuestionnaireResponseDetailViewScreen';
import QuestionnaireResponsePageViewScreen from './src/screens/QuestionnaireResponsePageViewScreen';
import 'react-native-get-random-values';
import { AuthProvider } from './src/hooks/AuthContext';
import SettingsScreen from './src/screens/SettingsScreen';
import FieldHomeScreen from './src/screens/admin/FieldHomeScreen';
import ManageCustomersScreen from './src/screens/admin/ManageCustomersScreen';
import ResidentialCustomerDetail from './src/screens/admin/ResidentialCustomerDetail';
import { setNavigator } from './src/services/navigationService';
import AssignQRCodeScreen from './src/screens/admin/AssignQRCodeScreen';
import CommercialCustomerDetail from './src/screens/admin/CommercialCustomerDetail';
import EditQuestionnaireLanding from './src/screens/admin/questionnaire/EditQuestionnaireLanding';
import EditQuestionnairePage from './src/screens/admin/questionnaire/EditQuestionnairePage';
import NewCustomerScreen from './src/screens/admin/NewCustomerScreen';
import AdminHomeScreen from './src/screens/admin/AdminHomeScreen';
import LeadSearchPage from './src/screens/admin/LeadSearchPage';
import MessageSearchPage from './src/screens/admin/MessageSearchPage';
import MessageDetailPage from './src/screens/admin/MessageDetailPage';
import LeadDetailPage from './src/screens/admin/LeadDetailPage';
import GenerateQRCodesPage from './src/screens/admin/GenerateQRCodesPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationContainer ref={(ref) => {setNavigator(ref);}}>
          <Stack.Navigator>
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LeadEntry" component={LeadEntryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LeadConfirmation" component={LeadConfirmationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="QuestionnaireResponseDetailView" component={QuestionnaireResponseDetailViewScreen} options={{ headerShown: false }} />
            <Stack.Screen name="QuestionnairePageView" component={QuestionnaireResponsePageViewScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FieldHome" component={FieldHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ManageCustomers" component={ManageCustomersScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResidentialCustomerDetail" component={ResidentialCustomerDetail} options={{ headerShown: false }} />
            <Stack.Screen name="AssignQRCodeScreen" component={AssignQRCodeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CommercialCustomerDetail" component={CommercialCustomerDetail} options={{ headerShown: false }} />
            <Stack.Screen name="EditQuestionnaireLanding" component={EditQuestionnaireLanding} options={{ headerShown: false }} />
            <Stack.Screen name="EditQuestionnairePage" component={EditQuestionnairePage} options={{ headerShown: false }} />
            <Stack.Screen name="NewCustomerScreen" component={NewCustomerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LeadSearchPage" component={LeadSearchPage} options={{ headerShown: false }} />
            <Stack.Screen name="MessageSearchPage" component={MessageSearchPage} options={{ headerShown: false }} />
            <Stack.Screen name="MessageDetailPage" component={MessageDetailPage} options={{ headerShown: false }} />
            <Stack.Screen name="LeadDetailPage" component={LeadDetailPage} options={{ headerShown: false }} />
            <Stack.Screen name="GenerateQRCodesPage" component={GenerateQRCodesPage} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast/>
      </AppProvider>
    </AuthProvider>
  );
}