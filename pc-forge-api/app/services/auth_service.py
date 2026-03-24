import bcrypt
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.repositories.auth_repo import create_user, get_user_by_email

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "86043141731671850106248604314173167185010624")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def verify_password(plain_password, hashed_password):
    # Check if we're dealing with strings or bytes
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')

    return bcrypt.checkpw(plain_password, hashed_password)

def get_password_hash(password):
    if isinstance(password, str):
        password = password.encode('utf-8')

    # Generate salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    return hashed.decode('utf-8')

def register_user(user_data):
    # Check if user exists
    existing = get_user_by_email(user_data['email'])
    if existing:
        return None

    hashed = get_password_hash(user_data['password'])
    user_data['hashed_password'] = hashed
    # Default is_admin is handled by DB default (False)
    return create_user(user_data)

def authenticate_user(email, password):
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user['hashed_password']):
        return None

    # Generate JWT
    token_data = {
        "sub": user['email'],
        "user_id": user['id'],
        "username": user['username'],
        "is_admin": user.get('is_admin', False)
    }
    access_token = create_access_token(token_data)

    return {
        "user": {
            "id": user['id'],
            "username": user['username'],
            "email": user['email'],
            "is_admin": user.get('is_admin', False)
        },
        "access_token": access_token
    }