import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../components/Header";
import { useCompanyTheme } from "../hooks/useCompanyTheme";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({navigation}) {
  const {colors} = useCompanyTheme();

  const [tokenResponse, setTokenResponse] = useState(null);

  const handleGoBack = async () => {
    navigation.navigate('Home');
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

  console.log("Redirect URI:", redirectUri);

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
      <ScrollView className="flex-1">
        <View className="p-8">
          <Header icon="arrow-back-outline" iconOnPress={() => handleGoBack()}>Admin Login</Header>
          {!tokenResponse ? (
            <Button
              title="Login with Keycloak"
              disabled={!request}
              onPress={() => promptAsync()}
            />
          ) : (
            <>
              <Text>Logged In!</Text>
              <Text>Access Token:</Text>
              <Text selectable>{tokenResponse.accessToken}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}