// WebAuthn / Passkey implementation for Blazor

window.passkeyHelper = {
    // Check if WebAuthn is supported
    isSupported: function () {
        return window.PublicKeyCredential !== undefined &&
               navigator.credentials !== undefined;
    },

    // Register a new passkey
    register: async function (username, displayName) {
        try {
            if (!this.isSupported()) {
                throw new Error('WebAuthn is not supported in this browser');
            }

            // Generate challenge (in production, this should come from server)
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            // Generate user ID
            const userId = new Uint8Array(16);
            window.crypto.getRandomValues(userId);

            const publicKeyCredentialCreationOptions = {
                challenge: challenge,
                rp: {
                    name: "BlazorApp",
                    id: window.location.hostname
                },
                user: {
                    id: userId,
                    name: username,
                    displayName: displayName || username
                },
                pubKeyCredParams: [
                    { alg: -7, type: "public-key" },  // ES256
                    { alg: -257, type: "public-key" } // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: "platform", // Prefer platform authenticators (e.g., Touch ID, Windows Hello)
                    requireResidentKey: true,
                    residentKey: "required",
                    userVerification: "required"
                },
                timeout: 60000,
                attestation: "none"
            };

            const credential = await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions
            });

            // Convert ArrayBuffer to base64 for storage
            const credentialId = this.arrayBufferToBase64(credential.rawId);
            const publicKey = this.arrayBufferToBase64(
                credential.response.getPublicKey()
            );

            // Store in localStorage (in production, send to server)
            const passkeyData = {
                username: username,
                credentialId: credentialId,
                publicKey: publicKey,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem(`passkey_${username}`, JSON.stringify(passkeyData));

            return {
                success: true,
                message: `Passkey registered successfully for ${username}!`,
                credentialId: credentialId
            };

        } catch (error) {
            console.error('Passkey registration error:', error);
            return {
                success: false,
                error: error.message || 'Failed to register passkey'
            };
        }
    },

    // Authenticate with passkey
    authenticate: async function (username) {
        try {
            if (!this.isSupported()) {
                throw new Error('WebAuthn is not supported in this browser');
            }

            // Get stored passkey data
            const storedData = localStorage.getItem(`passkey_${username}`);
            if (!storedData) {
                throw new Error('No passkey found for this username');
            }

            const passkeyData = JSON.parse(storedData);

            // Generate challenge (in production, this should come from server)
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            const publicKeyCredentialRequestOptions = {
                challenge: challenge,
                allowCredentials: [{
                    id: this.base64ToArrayBuffer(passkeyData.credentialId),
                    type: 'public-key',
                    transports: ['internal', 'hybrid']
                }],
                timeout: 60000,
                userVerification: "required"
            };

            const assertion = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            });

            if (assertion) {
                return {
                    success: true,
                    message: `Successfully authenticated as ${username}!`,
                    username: username
                };
            }

            throw new Error('Authentication failed');

        } catch (error) {
            console.error('Passkey authentication error:', error);
            return {
                success: false,
                error: error.message || 'Failed to authenticate with passkey'
            };
        }
    },

    // List all registered passkeys
    listPasskeys: function () {
        const passkeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('passkey_')) {
                const data = JSON.parse(localStorage.getItem(key));
                passkeys.push({
                    username: data.username,
                    timestamp: data.timestamp
                });
            }
        }
        return passkeys;
    },

    // Delete a passkey
    deletePasskey: function (username) {
        localStorage.removeItem(`passkey_${username}`);
        return { success: true, message: `Passkey deleted for ${username}` };
    },

    // Helper: Convert ArrayBuffer to base64
    arrayBufferToBase64: function (buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    },

    // Helper: Convert base64 to ArrayBuffer
    base64ToArrayBuffer: function (base64) {
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
};
