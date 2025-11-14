from smartapi import SmartConnect

# Replace with your credentials
api_key = "1jSVU5HW"
client_id = "HEEB1248"
password = "1212"
totp_token = "DZRHKYDJ5VDRGFAQNFXACXOM4A"  # from Google Authenticator if enabled

obj = SmartConnect(api_key=api_key)

# Generate session (login)
try:
    data = obj.generateSession(client_id, password, totp_token)
    print("✅ Login successful!")
    print("🔐 Access Token:", data['data']['access_token'])

    # Optional: Save token to file
    with open("token.txt", "w") as f:
        f.write(data['data']['access_token'])
        print("💾 Token saved to token.txt")

except Exception as e:
    print("❌ Login failed:", e)