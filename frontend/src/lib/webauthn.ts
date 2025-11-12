/**
 * WebAuthn/Passkey utilities for browser-side authentication
 * Implements ES256 (secp256r1) signature generation for Soroban
 */

import type { PasskeyResult } from "@/hooks/usePasskey";
import { decode as cborDecode } from 'cbor-x';

/**
 * Check if the browser supports WebAuthn
 */
export function browserSupportsWebAuthn(): boolean {
  return (
    typeof window !== "undefined" &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === "function"
  );
}

/**
 * Generate a random challenge for authentication
 */
function generateChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

/**
 * Generate a random user ID
 */
function generateUserId(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Convert a Uint8Array to a base64url string
 */
function bufferToBase64Url(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(buffer)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Convert a base64url string to a Uint8Array
 */
function base64UrlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/**
 * Extract the public key from the credential response
 * Converts from COSE format to raw secp256r1 coordinates
 */
function bufferToUint8Array(buf: ArrayBuffer | Buffer | Uint8Array): Uint8Array {
  if (buf instanceof Uint8Array) return buf;
  if (buf instanceof ArrayBuffer) return new Uint8Array(buf);
  // Node Buffer
  return new Uint8Array(buf as any);
}

function extractPublicKey(credential: PublicKeyCredential): Uint8Array {
  // Parse attestationObject to extract the credentialPublicKey (COSE Key), then
  // decode COSE to raw uncompressed X||Y (64 bytes) for secp256r1.
  try {
    const response = credential.response as AuthenticatorAttestationResponse;
    const attestationObject = bufferToUint8Array(response.attestationObject as any);

    // attestationObject is CBOR encoded structure: {fmt, authData, attStmt}
  // cborDecode expects a Buffer/Uint8Array; ensure we pass Uint8Array
  const decoded = cborDecode(new Uint8Array(attestationObject.buffer));
  const authData = bufferToUint8Array((decoded as any).authData as ArrayBuffer);

    // authData layout: rpIdHash(32) | flags(1) | signCount(4) | attestedCredentialData?
    let pointer = 0;
    // rpIdHash
    pointer += 32;
    // flags
    pointer += 1;
    // signCount
    pointer += 4;

    // Check if attested credential data flag (0x40) is set
    const flags = authData[32];
    const AT_FLAG = 0x40;
    if (!(flags & AT_FLAG)) {
      throw new Error('No attested credential data present in authData');
    }

    // aaguid
    const aaguid = authData.slice(pointer, pointer + 16);
    pointer += 16;

    // credentialId length (big-endian uint16)
    const credIdLen = (authData[pointer] << 8) | authData[pointer + 1];
    pointer += 2;

    // credentialId
    const credentialId = authData.slice(pointer, pointer + credIdLen);
    pointer += credIdLen;

    // The remaining bytes are the credentialPublicKey in CBOR format
    const publicKeyCbor = authData.slice(pointer);

    // Decode the COSE key
  const cose = cborDecode(new Uint8Array(publicKeyCbor.buffer)) as any;

    // COSE EC2 key parameters: -2 => x, -3 => y
    const x = bufferToUint8Array(cose.get ? cose.get(-2) : cose[-2]);
    const y = bufferToUint8Array(cose.get ? cose.get(-3) : cose[-3]);

    if (!x || !y) {
      throw new Error('Invalid COSE key structure; missing x/y coordinates');
    }

    // Ensure x and y are 32 bytes each
    const xBytes = x.length === 32 ? x : x.slice(-32);
    const yBytes = y.length === 32 ? y : y.slice(-32);

    const raw = new Uint8Array(64);
    raw.set(xBytes, 0);
    raw.set(yBytes, 32);
    return raw;
  } catch (err) {
    console.error('extractPublicKey error:', err);
    // Fallback: return zeroed 64 bytes to avoid crashes; caller should detect
    return new Uint8Array(64);
  }
}

/**
 * Start passkey registration (creation)
 */
export async function startRegistration(
  username: string
): Promise<PasskeyResult> {
  try {
    const challenge = generateChallenge();
    const userId = generateUserId();

    // Create credential options
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
      {
        challenge: challenge as BufferSource,
        rp: {
          name: "Soroban Passkey Demo",
          id: typeof window !== "undefined" ? window.location.hostname : "localhost",
        },
        user: {
          id: userId as BufferSource,
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7, // ES256 (secp256r1)
          },
        ],
        authenticatorSelection: {
          // No especificar authenticatorAttachment permite usar cualquier autenticador
          // Esto permite usar el navegador sin Windows Hello
          userVerification: "discouraged", // Permite registro sin verificación biométrica
          residentKey: "preferred",
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: "none", // We don't need attestation for this demo
      };

    // Create the credential
    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })) as PublicKeyCredential;

    if (!credential) {
      return { success: false, error: "Failed to create credential" };
    }

    // Extract the public key and credential ID
    const credentialId = bufferToBase64Url(
      new Uint8Array(credential.rawId)
    );
    const publicKey = extractPublicKey(credential);

    // NOTE: we no longer auto-persist credentials here. The caller (UI) should
    // decide whether to store the credential locally or provide it via QR.
    // This keeps credential handling explicit and allows presenting a QR for
    // mobile storage instead of saving on the current device.

    return {
      success: true,
      credentialId,
      publicKey,
    };
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof Error) {
      // Handle specific WebAuthn errors
      if (error.name === "NotAllowedError") {
        return {
          success: false,
          error: "Operation cancelled or not allowed",
        };
      }
      if (error.name === "InvalidStateError") {
        return {
          success: false,
          error: "This authenticator is already registered",
        };
      }
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Unknown error occurred" };
  }
}

/**
 * Start passkey authentication
 */
export async function startAuthentication(): Promise<PasskeyResult> {
  try {
    const challenge = generateChallenge();

    // Get stored credentials
    const storedCredentials =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("passkey-credentials") || "[]")
        : [];

    if (storedCredentials.length === 0) {
      return {
        success: false,
        error: "No passkeys found. Please create one first.",
      };
    }

    // Prepare credential IDs for authentication
    const allowCredentials = storedCredentials.map(
      (cred: { credentialId: string }) => ({
        type: "public-key" as const,
        id: base64UrlToBuffer(cred.credentialId),
      })
    );

    // Create assertion options
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
      {
        challenge: challenge as BufferSource,
        allowCredentials,
        timeout: 60000,
        userVerification: "discouraged", // Permite autenticación sin verificación biométrica
        rpId: typeof window !== "undefined" ? window.location.hostname : "localhost",
      };

    // Get the credential (authenticate)
    const credential = (await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    })) as PublicKeyCredential;

    if (!credential) {
      return { success: false, error: "Authentication failed" };
    }

    const response = credential.response as AuthenticatorAssertionResponse;
    
    // Extract signature and other data
    const credentialId = bufferToBase64Url(new Uint8Array(credential.rawId));
    const signature = new Uint8Array(response.signature);
    const userHandle = response.userHandle
      ? bufferToBase64Url(new Uint8Array(response.userHandle))
      : undefined;

    // Find the matching credential
    const matchedCred = storedCredentials.find(
      (cred: { credentialId: string }) => cred.credentialId === credentialId
    );

    return {
      success: true,
      credentialId,
      signature,
      userHandle: matchedCred?.username || userHandle,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    
    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        return {
          success: false,
          error: "Authentication cancelled or not allowed",
        };
      }
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Unknown error occurred" };
  }
}

/**
 * Get all stored credentials
 */
export function getStoredCredentials(): Array<{
  credentialId: string;
  username: string;
  userId: string;
  createdAt: string;
}> {
  if (typeof window === "undefined") return [];
  
  try {
    return JSON.parse(localStorage.getItem("passkey-credentials") || "[]");
  } catch {
    return [];
  }
}

/**
 * Clear all stored credentials
 */
export function clearStoredCredentials(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("passkey-credentials");
  }
}
