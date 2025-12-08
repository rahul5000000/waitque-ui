import * as AuthSession from "expo-auth-session";
import { retrieveRefreshToken } from "./backend/tokenStorage";

const KEYCLOAK_BASE =
  "http://waitque-alb-1208411922.us-east-1.elb.amazonaws.com/realms/rrs-waitque/protocol/openid-connect";
const CLIENT_ID = "mobile-app";

export const discovery = {
  authorizationEndpoint: `${KEYCLOAK_BASE}/auth`,
  tokenEndpoint: `${KEYCLOAK_BASE}/token`,
  revocationEndpoint: `${KEYCLOAK_BASE}/revoke`,
  logoutEndpoint: `${KEYCLOAK_BASE}/logout`, // you'll want this later
};

/**
 * Build your redirect URI so other modules can reuse it.
 */
export function buildRedirectUri() {
  return AuthSession.makeRedirectUri({
    scheme: "waitque",
    path: "redirect",
  });
}

/**
 * Perform token exchange (pure function, no hooks).
 */
export async function exchangeCodeForToken({
  code,
  clientId,
  redirectUri,
  codeVerifier,
}: {
  code: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
}) {
  return AuthSession.exchangeCodeAsync(
    {
      code,
      clientId,
      redirectUri,
      extraParams: {
        code_verifier: codeVerifier,
      },
    },
    discovery
  );
}

export function buildAuthRequest(redirectUri: string) {
  return {
      clientId: CLIENT_ID,
      redirectUri,
      responseType: "code",
      scopes: ["openid", "profile", "email"],
      usePKCE: true,
    };
}

export async function logoutUser(mode, logoutHook) {
  if(mode === "admin") {
    const refreshToken = await retrieveRefreshToken();
    if(refreshToken) {
      await fetch(discovery.logoutEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `client_id=${CLIENT_ID}&refresh_token=${refreshToken}`,
      });
    } else {
      console.warn("No refresh token available for logout request");
    }
  }

  await logoutHook();
}
