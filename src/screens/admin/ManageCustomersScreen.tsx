import React from "react";
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import { customerService } from "../../services/backend/customerService";
import { useAppContext } from "../../hooks/AppContext";
import Spinner from "../../components/Spinner";
import { PrimaryButton } from "../../components/Buttons";
import { Ionicons } from "@expo/vector-icons";

export default function ManageCustomersScreen({ navigation }) {
  const { colors, textInputStyle } = useCompanyTheme();
  const {user} = useAppContext();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // ---- Debounce ----
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const triggerSearch = (value: string) => {
    if(value.trim()) setIsSearching(true);
    // Clear previous debounce timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 500); // 500ms debounce
  };

  // ---- API call ----
  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    try {
      const response = await customerService.customerSearch(term, user.role);
      setResults(response.data.customers || []);

    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGoBack = () => navigation.goBack();

  const handleAddNewCustomer = () => {
    // Navigate to Add New Customer Screen
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
        <View className="pt-8 px-8">
          <Header icon="arrow-back-outline" iconOnPress={handleGoBack}>
            Search Customers
          </Header>

          <TextInput
            className="my-4"
            style={textInputStyle}
            onChangeText={(value) => {
              setSearchTerm(value);
              triggerSearch(value);
            }}
            value={searchTerm}
            placeholder="Search by name, customer ID, phone or address"
          />
        </View>

        <ScrollView className="flex-1 px-8">
          {!isSearching && results.length === 0 && searchTerm.length > 0 && (
            <Text className="py-4">No results found.</Text>
          )}

          {results.map((c, index) => (
            <View key={index} className="py-4 border-b border-gray-300">
              {c.customerType == "RESIDENTIAL" ? (
                <TouchableOpacity onPress={() => navigation.navigate("ResidentialCustomerDetail", {customerMetadata: c})}>
                  <Text className="text-lg">{c.firstName} {c.lastName}</Text>
                </TouchableOpacity>
              ) : (
                <Text className="text-lg">{c.companyName}</Text>
              )}
            </View>
          ))}
        </ScrollView>
        {isSearching && 
          <View className="pt-4" >
            <Spinner message="Searching..."/>
          </View>
        }
        <View className="px-8 py-4">
          <PrimaryButton onPress={handleAddNewCustomer}><Ionicons size={16} name="person"/> New Customer</PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
