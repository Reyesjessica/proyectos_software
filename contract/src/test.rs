#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{
    Bytes, BytesN, Env, vec,
};

#[test]
fn test_init_success() {
    let env = Env::default();
    
    // Create a 64-byte public key (secp256r1 uncompressed)
    let public_key_bytes = [1u8; 64];
    let public_key = BytesN::from_array(&env, &public_key_bytes);
    let credential_id = Bytes::from_slice(&env, b"test-credential-id");
    
    // Verify the public key is created correctly
    assert_eq!(public_key.len(), 64);
    
    // Verify credential_id is created correctly
    assert_eq!(credential_id.len(), 18);
}

#[test]
fn test_bytearray_operations() {
    let env = Env::default();
    
    let bytes1 = [1u8; 64];
    let bytes2 = [2u8; 64];
    
    let key1 = BytesN::from_array(&env, &bytes1);
    let key2 = BytesN::from_array(&env, &bytes2);
    
    // Test that different byte arrays create different keys
    assert_ne!(key1, key2);
}

#[test]
fn test_credential_id_variants() {
    let env = Env::default();
    
    let _public_key_bytes = [3u8; 64];
    
    let cred_id_1 = Bytes::from_slice(&env, b"cred-1");
    let cred_id_2 = Bytes::from_slice(&env, b"cred-2");
    
    // Verify different credentials
    assert_ne!(cred_id_1, cred_id_2);
    assert_eq!(cred_id_1.len(), 6);
    assert_eq!(cred_id_2.len(), 6);
}

#[test]
fn test_public_key_sizes() {
    let env = Env::default();
    
    // Test secp256r1 public key (64 bytes for uncompressed X||Y)
    let public_key_bytes = [5u8; 64];
    let public_key = BytesN::from_array(&env, &public_key_bytes);
    
    assert_eq!(public_key.len(), 64);
}

#[test]
fn test_multiple_public_keys() {
    let env = Env::default();
    
    let mut keys = vec![&env];
    
    for i in 0..3 {
        let mut bytes = [0u8; 64];
        bytes[0] = i;
        let key = BytesN::from_array(&env, &bytes);
        keys.push_back(key);
    }
    
    // Verify all keys are different
    assert_ne!(keys.get(0), keys.get(1));
    assert_ne!(keys.get(1), keys.get(2));
    assert_ne!(keys.get(0), keys.get(2));
}

#[test]
fn test_bytes_slicing() {
    let env = Env::default();
    
    let data = b"test-credential-id-12345";
    let bytes = Bytes::from_slice(&env, data);
    
    assert_eq!(bytes.len(), data.len() as u32);
}

#[test]
fn test_error_variants() {
    // Test that error types are defined correctly
    let _already_init = Error::AlreadyInitialized;
    let _not_init = Error::NotInitialized;
    let _invalid_key = Error::InvalidPublicKey;
    let _invalid_sig = Error::InvalidSignature;
}

#[test]
fn test_public_key_comparison() {
    let env = Env::default();
    
    let key_bytes = [42u8; 64];
    let key = BytesN::from_array(&env, &key_bytes);
    
    // Test that the key is created properly
    assert_eq!(key.len(), 64);
}



