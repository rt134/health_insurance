from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from models import User, InsuredMember, InsurancePlan, Cart
from flask_mongoengine import MongoEngine
from functions import calculate_base_premium, calculate_total_premium, clean_up_old_instances
from flask_cors import CORS


app = Flask(__name__)
cors = CORS(app, resources={"*": {"origins": "*"}})
# Connecting to my local mongoDb container
app.config['MONGODB_SETTINGS'] = {
    'db': 'health_insurance',
    'host': 'mongodb://localhost:27017/health_insurance',
}

app.config.from_object('config.Config')
db = MongoEngine(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

@app.route('/', methods=['GET'])
def home():
    return '<center><h1>Setup Done Successfully</h1></center>'


# signup endpoint
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(name=data['name'], email=data['email'], password=hashed_password)
        new_user.save()
        return {'message': 'User registered successfully'}, 201
    except Exception as e:
        print(e)
        return {'error': str(e)}, 500


# login endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.objects(email=data['email']).first()

        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity=str(user.id))
            return {'user' : {'name':user.name, 'email' : user.email},'access_token': access_token}, 200
        else:
            return {'message': 'Invalid credentials'}, 401
    except Exception as e:
        print(e)
        return {'error': str(e)}, 500


# Get Plans
@app.route('/plans', methods=['GET'])
@jwt_required()
def get_user_plans():
    try:
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)

        is_active = request.args.get('is_active', 'true').lower() == 'true'

        plans = InsurancePlan.objects(user=user, active=is_active)

        # Serialize the plans
        plan_data = []
        for plan in plans:
            plan_data.append({
                'id': str(plan.id),
                'final_premium': plan.final_premium,
                'status': plan.status,
                'active': plan.active,
                'timestamp': plan.timestamp
            })

        return jsonify(plan_data), 200

    except Exception as e:
        return {'error': str(e)}, 500


# Get Members
@app.route('/members', methods=['GET'])
@jwt_required()
def get_insured_members():
    try:
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)

        members = InsuredMember.objects(user=user)

        # Serialize the members
        member_data = []
        for member in members:
            member_data.append({
                'id': str(member.id),
                'age': member.age,
                'city_tier': member.city_tier.value,
                'sum_assured': member.sum_assured,
                'tenure': member.tenure,
                'base_premium': member.base_premium,
                'user_relation': member.user_relation,
                'discount': member.discount,
            })

        return jsonify(member_data), 200

    except Exception as e:
        return {'error': str(e)}, 500


# Calculate Premium API
@app.route('/calculate_premium', methods=['POST'])
@jwt_required()
def calculate_premium():
    try:
        data = request.json
        user_id = get_jwt_identity()
        ages = data.get('ages')
        city_tier = data.get('city_tier')
        sum_insured = data.get('sum_insured')
        tenure = data.get('tenure')

        # Retrieve user
        user = User.objects.get(id=user_id)

        # Cleaning Up old uninsured members
        clean_up_old_instances(user)

        # Create insured members based on input
        insured_members = []
        for age in ages:
            insured_member = InsuredMember(
                user=user,
                age=age,
                city_tier=city_tier,
                sum_assured=sum_insured,
                tenure=tenure,
                base_premium=calculate_base_premium(age, city_tier, sum_insured, tenure),
            )
            insured_member.save()
            insured_members.append(insured_member)

        # Calculate the total premium based on insured members
        total_premium = calculate_total_premium(insured_members)

        plan_name = str(user.name) + " plan for " + str(len(insured_members))

        insurance_plan = InsurancePlan(
            name=plan_name,
            user=user,
            insured_members=insured_members,
            final_premium=total_premium
        )
        insurance_plan.save()

        return jsonify({'total_premium': total_premium, 'members': insured_members, 'insurance_plan': insurance_plan}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Get cart details
@app.route('/cart', methods=['GET'])
@jwt_required()
def get_cart_details():
    try:
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)

        cart_items = Cart.objects(user=user)

        # Serialize cart items
        cart_data = []
        for cart_item in cart_items:
            cart_data.append({
                'id': str(cart_item.id),
                'insurance_plans': [str(plan.id) for plan in cart_item.insurance_plans],
                'total_premium': cart_item.total_premium
            })

        return jsonify(cart_data), 200

    except Exception as e:
        return {'error': str(e)}, 500


@app.route('/clear_cart', methods=['DELETE'])
@jwt_required()
def clear_cart():
    try:
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)
        Cart.objects(user=user).delete()
    except Exception as e:
        return {'error': str(e)}, 500


# Add to cart API
@app.route('/add_to_cart/<plan_id>/', methods=['POST'])
@jwt_required()
def add_to_cart(plan_id):
    try:
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)
        insurance_plan = InsurancePlan.objects.get(id=plan_id)

        existing_cart = Cart.objects(user=user).first()

        if existing_cart:
            # Check if the plan is already in the cart
            if insurance_plan in existing_cart.insurance_plans:
                return {'message': 'Insurance plan is already in the cart'}, 400
            # Add the plan to the existing cart
            existing_cart.insurance_plans.append(insurance_plan)
            existing_cart.total_premium += insurance_plan.final_premium
            existing_cart.save()
        else:
            # Create new cart if it does not exists
            cart_item = Cart(user=user, insurance_plans=[insurance_plan], total_premium=insurance_plan.final_premium)
            cart_item.save()

        insurance_plan.status = True
        insurance_plan.save()

        return {'message': 'Insurance plan added to the cart successfully'}, 200

    except Exception as e:
        return {'error': str(e)}, 500


# Checkout API
@app.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    try:
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)
        
        existing_cart = Cart.objects(user=user).first()
        cart_items = existing_cart.insurance_plans

        if not cart_items:
            return {'message': 'No active insurance plans in the cart'}, 400


        for plan in cart_items:
            plan.active = True
            plan.save()

        # Calculate the total premium for the cart items
        total_premium = existing_cart.total_premium

        # Clear the user's cart
        Cart.objects(user=user).delete()

        return {'message': 'Checkout successful', 'total_premium': total_premium}, 200

    except Exception as e:
        return {'error': str(e)}, 500



if __name__ == '__main__':
    app.run(host=app.config['APP_DOMAIN'], debug=app.config['DEBUG'])