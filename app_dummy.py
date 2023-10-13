from flask import Flask, request, jsonify, Response
from passlib.context import CryptContext
from flask_cors import CORS

import jwt
from datetime import datetime, timedelta

from minio import Minio
from minio.error import S3Error
import os

MINIO_ENDPOINT = os.environ.get('MINIO_ENDPOINT') 
MINIO_ACCESS_KEY = os.environ.get('MINIO_USER')
MINIO_SECRET_KEY = os.environ.get('MINIO_USER_PASSWD')

minio_client = Minio(
            MINIO_ENDPOINT,
            access_key=MINIO_ACCESS_KEY,
            secret_key=MINIO_SECRET_KEY,
            secure=-----------,  
        )

SECRET_KEY = '------------------------'
ALGORITHM = '-----------------------'
ACCESS_TOKEN_EXPIRY_MINUTES = ---------

db = {
    "------" : {
        "username" : "-------",
        "email" : "---------------",
        "hashed_password" : "------------------",
        "disabled" : ------------
    }
}

app = Flask(__name__)

CORS(app, origins=[
    '-------------------------',
    "-------------------------"  
])

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(username):
    if username in db:
        user_data = db[username]
        return user_data

def authenticate_user(username, password):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user['hashed_password']):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encoded = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encoded.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encoded, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def validate_token(token):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = decoded_token.get('sub')
        token_exp = decoded_token.get('exp')
        if token_exp:
            expiration_time = datetime.utcfromtimestamp(token_exp)
            current_time = datetime.utcnow()
            if expiration_time < current_time:
                return jsonify({'Response' : 'Token is expired'})
        if username != db[username]:
            return jsonify({'Response' : 'invalid request'})
        return True

    except JWTError:
        return jsonify({'Response' : 'invalid request'})

def get_bucket_list():
    bucket_list = dict()
    try:
        buckets = minio_client.list_buckets()
        prefixes = ['Plink', 'Pheno', 'DNAmeth', 'DNAseq', 'Meta', 'RNAseq', 'ShortReadAssemblies', 'LongReadAssemblies', 'VCFdata', 'Analysis']
        for bucket in buckets:
            bucket_name = bucket.name
            bucket_list[bucket_name] = {prefix: [] for prefix in prefixes}
        for key, value in bucket_list.items():
            for key2, value2 in value.items():
                objects = minio_client.list_objects(key, key2+'/', recursive=True)
                for obj in objects:
                    value2.append(obj.object_name.split('/')[1])
    except S3Error as e:
        print(f"Error: {e}")
    return bucket_list

# @app.route('/token', methods=['GET'])
# def login_for_access_token():
#     username = 'untwistSPA'
#     password = 'Untwist23#'   
#     user = authenticate_user(username, password)
#     if not user:
#         return jsonify({"detail": "Incorrect username or password"}), 401

#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRY_MINUTES)
#     access_token = create_access_token(data={"sub": user['username']}, expires_delta=access_token_expires)
    
#     return jsonify({"access_token": access_token})

@app.route('/')
def root():
    return jsonify({"UNTWIST-IBG4": "V1.0"})

@app.route('/auth', methods=['POST'])
def authenticate():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        print(f'user: {username}, tried to login in at {datetime.now()}')
        if not username or not password:
            print('Login failed')
            return jsonify({"error": "Username and password are required"}), 400
        user = authenticate_user(username, password)
        if not user:
            print('Login failed')
            return jsonify({"error": "Invalid username or password"}), 401
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRY_MINUTES)
        access_token = create_access_token(data={"sub": user['username']}, expires_delta=access_token_expires)
        print('Login successful \n\n')
        return jsonify({"access_token": access_token})
    except Exception as e:
        return jsonify({"error": "Authentication failed"}), 500
    
    
@app.route("/getBucketList/", methods=["POST"])
def list_buckets():
    try:       
        token = request.args.get("token")
        if not token or not validate_token(token):
            return {"error": "Invalid or missing parameters"}, 400
        buckets = minio_client.list_buckets()
        bucket_names = [bucket.name for bucket in buckets]
        return jsonify({"buckets": bucket_names})
    except S3Error as e:
        return jsonify({"error": str(e)})

@app.route("/getBucketObjectList/", methods=["POST"])
def get_bucket_list_endpoint():
    try:
        token = request.args.get("token")
        if not token or not validate_token(token):
            return {"error": "Invalid or missing parameters"}, 400
        bucket_list = get_bucket_list()
        return bucket_list
    except Exception as e:
        return {"error": "Invalid request"}        

@app.route("/getBucketObjectData/", methods=["POST"])
def get_bucket_object_data():
    try:
        bucket_name = request.args.get("bucket_name")
        object_name = request.args.get("object_name")
        token = request.args.get("token")

        if not bucket_name or not object_name or not token or not validate_token(token):
            return {"error": "Invalid or missing parameters"}, 400

        response = minio_client.get_object(bucket_name, object_name)
        object_content = response.read()

        # Determine the content type based on file extension
        if object_name.endswith(".bed"):
            content_type = "application/octet-stream"  # Binary for .bed files
        else:
            content_type = "text/plain"  # Assume text for other file extensions

        return Response(object_content, content_type=content_type)

    except S3Error as e:
        return {"error": str(e)}

@app.route("/getBucketObjectFile/", methods=["POST"])
def get_bucket_objectFile():
    try:
        bucket_name = request.args.get("bucket_name")
        object_name = request.args.get("object_name")
        token = request.args.get("token")
        if not bucket_name or not object_name or not token or not validate_token(token):
            return {"error": "Invalid or missing parameters"}, 400
        response = minio_client.stat_object(bucket_name, object_name)
        content_type = response.content_type
        return send_file(
            minio_client.get_object(bucket_name, object_name),
            mimetype=content_type,
            as_attachment=True,  
            download_name=object_name  
        )

    except S3Error as e:
        return {"error": str(e)}

if __name__ == '__main__':
    app.run()

# usage flask run --host=134.94.65.182 --port=5000
# gunicorn -c gunicorn_config.py app:app