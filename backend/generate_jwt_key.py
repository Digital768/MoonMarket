import secrets

def generate_jwt_secret_key():
    return secrets.token_hex(32)

print(generate_jwt_secret_key())
