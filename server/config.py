import os
from urllib.parse import quote_plus

class Config:
    APP_DOMAIN = os.getenv("APP_DOMAIN", "localhost")
    DEBUG = bool(os.getenv("DEBUG", "true"))
    MONGO_ADDRESS = os.getenv("MONGO_ADDRESS", "localhost")
    MONGO_PORT = os.getenv("MONGO_PORT", "27017")
    MONGO_DBNAME = os.getenv("MONGO_DBNAME", "health_insurance")
    MONGO_URI = f"mongodb://{quote_plus(MONGO_ADDRESS)}:{quote_plus(MONGO_PORT)}/{quote_plus(MONGO_DBNAME)}"
    SECRET_KEY = os.getenv("SECRET_KEY", "Mongo86&%@!$%W5Y")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "LKjewyugd2q7qtedgaugd3%@^7")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 360000))