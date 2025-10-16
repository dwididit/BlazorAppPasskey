# Passkey Authentication Guide

## What are Passkeys?

Passkeys are a modern, secure alternative to passwords. They use **WebAuthn** technology and biometric authentication (like Touch ID, Face ID, or Windows Hello) to provide passwordless login.

## Requirements

### Browser Support
Passkeys work on modern browsers:
- **Chrome/Edge**: Version 109+
- **Safari**: Version 16+ (macOS Ventura or iOS 16+)
- **Firefox**: Version 119+

### Device Requirements
- **macOS**: Ventura (13.0) or later with Touch ID
- **iOS**: iOS 16+ with Face ID or Touch ID
- **Windows**: Windows 10/11 with Windows Hello
- **Android**: Android 9+ with fingerprint or face unlock

## How to Test Passkey Registration

### Step 1: Run the Application

```bash
cd BlazorApp
dotnet run
```

Access the app at `https://localhost:5001` (HTTPS is required for WebAuthn)

### Step 2: Register a Passkey

1. Enter a username in the "Username or Email" field
2. Click **"Register New Passkey"** button
3. Your browser will prompt you to:
   - **macOS**: Use Touch ID or enter your Mac password
   - **Windows**: Use Windows Hello (PIN, fingerprint, or face)
   - **Mobile**: Use your device's biometric authentication

4. Once successful, the passkey is saved to your device

### Step 3: Authenticate with Passkey

1. Enter the same username
2. Click **"Sign in with Passkey"** button
3. Your browser will prompt for biometric authentication
4. You'll be logged in without entering a password!

## How It Works

### Registration Flow
1. User enters username
2. JavaScript calls WebAuthn API: `navigator.credentials.create()`
3. Device creates a public/private key pair
4. Private key stays on your device (never shared)
5. Public key is stored (in this demo: localStorage)

### Authentication Flow
1. User enters username
2. JavaScript calls WebAuthn API: `navigator.credentials.get()`
3. Device uses biometric to sign a challenge
4. Signature is verified against stored public key
5. User is authenticated!

## Security Features

✅ **Phishing-resistant**: Passkeys are bound to the website domain
✅ **No passwords to steal**: Private keys never leave your device
✅ **Biometric protection**: Touch ID, Face ID, or Windows Hello
✅ **Sync across devices**: Via iCloud Keychain or Google Password Manager

## Storage (Demo Mode)

In this demo, passkeys are stored in **localStorage** for simplicity.

**In production**, you should:
- Store public keys on your backend server
- Verify signatures server-side
- Use a proper user database
- Implement challenge-response protocol

## Troubleshooting

### "WebAuthn is not supported"
- Make sure you're using HTTPS (not HTTP)
- Update your browser to the latest version
- Check if your device supports biometric authentication

### "No passkey found"
- Register a passkey first before trying to authenticate
- Make sure you're using the same username

### Touch ID not working
- Check System Preferences > Touch ID & Password
- Make sure Touch ID is enabled for your Mac

## Browser Console

Open Developer Tools (F12) to see detailed logs of the WebAuthn process.

## Next Steps for Production

1. **Backend API**: Create endpoints to store/verify passkeys
2. **Challenge Generation**: Server should generate random challenges
3. **Signature Verification**: Verify signatures server-side
4. **User Management**: Associate passkeys with user accounts
5. **Fallback Options**: Provide password/email backup options

## Resources

- [WebAuthn Guide](https://webauthn.guide/)
- [Passkeys.dev](https://passkeys.dev/)
- [FIDO Alliance](https://fidoalliance.org/)
