import JSEncrypt from 'jsencrypt';

/**
 * Encrypts a plain text password using an RSA public key.
 * @param {string} password - The plain text password to encrypt.
 * @param {string} publicKey - The RSA public key (PEM format).
 * @returns {string} - The encrypted password in Base64 format.
 */
export const encryptPassword = (password, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encrypted = encrypt.encrypt(password);
  
  if (!encrypted) {
    throw new Error('Encryption failed');
  }
  
  return encrypted;
};
