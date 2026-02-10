import bcrypt
from app.repositories.auth_repo import create_user, get_user_by_email

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
    return create_user(user_data)

def authenticate_user(email, password):
    user = get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user['hashed_password']):
        return False
    return user