# BlazorAppPasskey 🔐

A modern Blazor Server application demonstrating **Passkey authentication** (WebAuthn/FIDO2) with biometric login support.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Blazor](https://img.shields.io/badge/Blazor-Server-512BD4?logo=blazor)](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor)
[![WebAuthn](https://img.shields.io/badge/WebAuthn-FIDO2-00B2A9?logo=fido-alliance)](https://webauthn.guide/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

- 🔑 **Passwordless Authentication** - Login with Touch ID, Face ID, or Windows Hello
- 🛡️ **WebAuthn/FIDO2 Standard** - Industry-standard security protocol
- 🎨 **Modern UI** - Clean, centered login page with Bootstrap 5
- 🔐 **Passkey Registration** - Easy registration flow with biometric enrollment
- 📱 **Cross-Platform** - Works on macOS, Windows, iOS, and Android
- 🚀 **Blazor Server** - Fast, interactive server-side rendering
- 💾 **LocalStorage Demo** - Simple demo storage (production-ready backend needed)

## 🎯 What are Passkeys?

Passkeys are a **phishing-resistant** replacement for passwords. They use public-key cryptography and biometric authentication to provide:

- ✅ **Stronger Security** - No passwords to steal or guess
- ✅ **Better UX** - Login with a fingerprint or face
- ✅ **Privacy-Focused** - Private keys never leave your device
- ✅ **Cross-Device Sync** - Via iCloud Keychain or Google Password Manager

## 🚀 Quick Start

### Prerequisites

- **.NET 8.0 SDK** or later ([Download](https://dotnet.microsoft.com/download))
- **Modern Browser** (Chrome 109+, Safari 16+, Edge 109+, or Firefox 119+)
- **Biometric Device** (Touch ID, Face ID, Windows Hello, etc.)

### Installation

```bash
git clone https://github.com/dwididit/BlazorAppPasskey.git
cd BlazorAppPasskey/BlazorAppPasskey
dotnet run
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

**⚠️ Important:** For Passkey/WebAuthn features to work properly, use HTTPS:
```
https://localhost:5001
```

## 📋 How to Use

### 1. Register a Passkey

1. Enter a **username** in the login form
2. Click **"Register New Passkey"**
3. Your browser will prompt for biometric authentication
4. Complete the Touch ID/Face ID/Windows Hello prompt
5. Success! Your passkey is registered

### 2. Login with Passkey

1. Enter your **username**
2. Click **"Sign in with Passkey"**
3. Authenticate with your biometric sensor
4. You're logged in! No password needed

### 3. Traditional Password Login

The app also supports traditional username/password login for comparison.

## 🏗️ Project Structure

```
BlazorAppPasskey/
├── Components/
│   ├── Layout/
│   │   ├── MainLayout.razor          # Main layout with conditional sidebar
│   │   ├── MainLayout.razor.css      # Layout styles
│   │   ├── NavMenu.razor             # Navigation with auth status
│   │   └── NavMenu.razor.css         # Navigation styles
│   ├── Pages/
│   │   ├── Home.razor                # Login page with Passkey UI
│   │   ├── Counter.razor             # Demo counter page
│   │   └── Weather.razor             # Demo weather page
│   ├── App.razor                     # Root component
│   └── _Imports.razor                # Global using statements
├── Services/
│   └── PasskeyAuthService.cs         # Passkey authentication service
├── wwwroot/
│   └── js/
│       └── passkey.js                # WebAuthn JavaScript implementation
├── Program.cs                        # Application entry point
└── BlazorAppPasskey.csproj           # Project file
```

## 🔧 Technology Stack

| Technology | Purpose |
|------------|---------|
| **ASP.NET Core 8.0** | Web framework |
| **Blazor Server** | Interactive UI with C# |
| **WebAuthn API** | Passkey authentication |
| **Bootstrap 5** | UI styling |
| **JavaScript Interop** | Bridge between C# and WebAuthn API |

## 💻 Browser Compatibility

| Browser | Minimum Version | Platform |
|---------|----------------|----------|
| Chrome | 109+ | Windows, macOS, Linux |
| Safari | 16+ | macOS, iOS (requires iOS 16+) |
| Edge | 109+ | Windows, macOS |
| Firefox | 119+ | Windows, macOS, Linux |

## 🔐 Security Features

### WebAuthn Implementation

```javascript
// Registration
const credential = await navigator.credentials.create({
    publicKey: {
        challenge: serverChallenge,
        rp: { name: "BlazorAppPasskey", id: window.location.hostname },
        user: { id: userId, name: username, displayName: username },
        authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: true,
            userVerification: "required"
        }
    }
});
```

### C# Service Layer

```csharp
public async Task<AuthResult> RegisterPasskeyAsync(string username)
{
    // Check browser support
    var isSupported = await _jsRuntime.InvokeAsync<bool>("passkeyHelper.isSupported");

    // Call WebAuthn API via JavaScript
    var result = await _jsRuntime.InvokeAsync<PasskeyResult>(
        "passkeyHelper.register",
        username,
        username
    );

    return new AuthResult { Success = result.Success };
}
```

## 📦 Key Components

### PasskeyAuthService

Handles all authentication logic:
- `RegisterPasskeyAsync()` - Register new passkey
- `AuthenticateWithPasskeyAsync()` - Login with passkey
- `AuthenticateWithPasswordAsync()` - Traditional login
- Browser compatibility detection
- Authentication state management

### WebAuthn JavaScript Helper

Located in `wwwroot/js/passkey.js`:
- `register()` - Create new passkey credential
- `authenticate()` - Verify existing passkey
- `isSupported()` - Check browser compatibility
- LocalStorage integration for demo

## 🚧 Production Considerations

This is a **demonstration application**. For production use, implement:

### Backend Integration
- Server-side challenge generation
- Public key storage in database
- Signature verification on server
- User account management
- Session management with JWT/cookies

### Security Enhancements
- CSRF protection
- Rate limiting on auth endpoints
- Proper error handling and logging
- Audit trail for authentication events

### User Experience
- Account recovery mechanisms
- Multiple passkey support per user
- Passkey management UI (list, delete)
- Fallback authentication methods

## 📚 Resources

- [WebAuthn Guide](https://webauthn.guide/) - Interactive WebAuthn tutorial
- [Passkeys.dev](https://passkeys.dev/) - Comprehensive passkey resources
- [FIDO Alliance](https://fidoalliance.org/) - Standards organization
- [W3C WebAuthn Spec](https://www.w3.org/TR/webauthn-2/) - Official specification
- [Microsoft Docs - WebAuthn in ASP.NET](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/webauthn)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor)
- UI components from [Bootstrap](https://getbootstrap.com/)
- Inspired by the [WebAuthn community](https://webauthn.io/)

## ⭐ Show your support

Give a ⭐️ if this project helped you learn about Passkeys and WebAuthn!

---

**Built with ❤️ using Blazor and WebAuthn**
