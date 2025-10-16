using Microsoft.JSInterop;

namespace BlazorAppPasskey.Services;

public class PasskeyAuthService
{
    private readonly IJSRuntime _jsRuntime;

    public event Action<string>? OnAuthenticationStateChanged;

    private string? _currentUser;

    public bool IsAuthenticated => !string.IsNullOrEmpty(_currentUser);

    public string? CurrentUser => _currentUser;

    public PasskeyAuthService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public async Task<AuthResult> AuthenticateWithPasswordAsync(string username, string password)
    {
        // Simulate API call
        await Task.Delay(1000);

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            return new AuthResult
            {
                Success = false,
                ErrorMessage = "Please enter both username and password."
            };
        }

        // Demo: Accept any non-empty credentials
        _currentUser = username;
        OnAuthenticationStateChanged?.Invoke(username);

        return new AuthResult
        {
            Success = true,
            Message = $"Welcome back, {username}!"
        };
    }

    public async Task<AuthResult> AuthenticateWithPasskeyAsync(string? username = null)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "Please enter a username to authenticate with Passkey."
                };
            }

            // Check if WebAuthn is supported
            var isSupported = await _jsRuntime.InvokeAsync<bool>("passkeyHelper.isSupported");
            if (!isSupported)
            {
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "Passkeys are not supported in your browser. Please use a modern browser like Chrome, Safari, or Edge."
                };
            }

            // Call JavaScript to authenticate with WebAuthn
            var result = await _jsRuntime.InvokeAsync<PasskeyResult>("passkeyHelper.authenticate", username);

            if (result.Success)
            {
                _currentUser = username;
                OnAuthenticationStateChanged?.Invoke(_currentUser);

                return new AuthResult
                {
                    Success = true,
                    Message = result.Message ?? "Successfully authenticated with Passkey!"
                };
            }

            return new AuthResult
            {
                Success = false,
                ErrorMessage = result.Error ?? "Failed to authenticate with Passkey."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                Success = false,
                ErrorMessage = $"Passkey authentication error: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> RegisterPasskeyAsync(string username)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "Please enter a username first to register a Passkey."
                };
            }

            // Check if WebAuthn is supported
            var isSupported = await _jsRuntime.InvokeAsync<bool>("passkeyHelper.isSupported");
            if (!isSupported)
            {
                return new AuthResult
                {
                    Success = false,
                    ErrorMessage = "Passkeys are not supported in your browser. Please use a modern browser like Chrome, Safari, or Edge."
                };
            }

            // Call JavaScript to register with WebAuthn
            var result = await _jsRuntime.InvokeAsync<PasskeyResult>("passkeyHelper.register", username, username);

            if (result.Success)
            {
                return new AuthResult
                {
                    Success = true,
                    Message = result.Message ?? $"Passkey registered successfully for {username}!"
                };
            }

            return new AuthResult
            {
                Success = false,
                ErrorMessage = result.Error ?? "Failed to register Passkey."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                Success = false,
                ErrorMessage = $"Passkey registration error: {ex.Message}"
            };
        }
    }

    public void Logout()
    {
        _currentUser = null;
        OnAuthenticationStateChanged?.Invoke(string.Empty);
    }
}

public class AuthResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;
}

public class PasskeyResult
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public string? Error { get; set; }
    public string? CredentialId { get; set; }
    public string? Username { get; set; }
}
