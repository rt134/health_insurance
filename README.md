## Setup

- Clone Repo : git clone https://github.com/rt134/health_insurance.git

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

### Setup Frontend
- cd client
- npm i
- npm start