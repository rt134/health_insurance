## Setup

- Clone Repo : git clone <repo>

### Setup MongoDB Database
- docker pull mongo
- docker run -d -p 27017:27017 mongo:latest

### Setup Local Server
- pip install virtualenv
- virtualenv venv
- source venv/bin/activate
- cd server
- pip install -r requirements.txt
- python app.py



## API Endpoints

1. **Signup**
   - **URL:** `/signup`
   - **Method:** POST
   - **Description:** Register a new user.
   - **Request Body:**
     - `name`: User's name.
     - `email`: User's email.
     - `password`: User's password.

2. **Login**
   - **URL:** `/login`
   - **Method:** POST
   - **Description:** Authenticate and login a user.
   - **Request Body:**
     - `email`: User's email.
     - `password`: User's password.
   - **Response:**
     - `user`: User information (name and email).
     - `access_token`: JWT access token for authentication.

3. **Get User Plans**
   - **URL:** `/plans`
   - **Method:** GET
   - **Description:** Get user's insurance plans.
   - **Query Parameters:**
     - `is_active` (optional): Filter active or inactive plans (default: active).
   - **Authorization:** JWT token required.

4. **Get Insured Members**
   - **URL:** `/members`
   - **Method:** GET
   - **Description:** Get user's insured members.
   - **Authorization:** JWT token required.

5. **Calculate Premium**
   - **URL:** `/calculate_premium`
   - **Method:** POST
   - **Description:** Calculate insurance premium based on user input.
   - **Request Body:**
     - `ages`: List of ages of insured individuals.
     - `city_tier`: City tier.
     - `sum_insured`: Sum insured amount.
     - `tenure`: Insurance tenure.
   - **Authorization:** JWT token required.

6. **Add to Cart**
   - **URL:** `/add_to_cart/<plan_id>/`
   - **Method:** POST
   - **Description:** Add an insurance plan to the user's cart.
   - **Path Parameter:**
     - `plan_id`: ID of the insurance plan to add.
   - **Authorization:** JWT token required.

7. **Get Cart Details**
   - **URL:** `/cart`
   - **Method:** GET
   - **Description:** Get details of items in the user's cart.
   - **Authorization:** JWT token required.

8. **Clear Cart**
   - **URL:** `/clear_cart`
   - **Method:** DELETE
   - **Description:** Clear the user's cart.
   - **Authorization:** JWT token required.

9. **Checkout**
   - **URL:** `/checkout`
   - **Method:** POST
   - **Description:** Checkout and activate insurance plans in the user's cart.
   - **Authorization:** JWT token required.
