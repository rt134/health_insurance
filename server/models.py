from mongoengine import Document, ListField, ReferenceField, EnumField, StringField, IntField, FloatField, EmailField, BooleanField, DateTimeField
from enum import Enum as PyEnum
from datetime import datetime

class CityTier(PyEnum):
    TIER_1 = "Tier-1"
    TIER_2 = "Tier-2"

class User(Document):
    name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)

class InsuredMember(Document):
    user = ReferenceField(User, required=True)
    age = IntField(required=True)
    city_tier = EnumField(CityTier, default=CityTier.TIER_1, required=True)
    sum_assured = IntField(required=True)
    tenure = IntField(default=1, required=True)
    base_premium = FloatField(required=True)
    user_relation = StringField(required=True, default="family")
    discount = IntField(required=True, default=0)
    active = BooleanField(default=False)

class InsurancePlan(Document):
    name = StringField(required=True)
    user = ReferenceField(User, required=True)
    insured_members = ListField(ReferenceField(InsuredMember), required=True)
    final_premium = FloatField(required=True)
    status = BooleanField(required=True, default=False)
    active = BooleanField(required=True, default=False)
    timestamp = DateTimeField(default=datetime.utcnow)

class Cart(Document):
    user = ReferenceField(User, required=True, unique=True)
    insurance_plans = ListField(ReferenceField(InsurancePlan), required=True)
    total_premium = FloatField(required=True)
