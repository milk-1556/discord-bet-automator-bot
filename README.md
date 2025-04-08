
# Discord Bet Automator

This application automates monitoring Discord channels for betting messages and places bets on various sportsbooks automatically.

## Architecture

The system consists of two parts:

1. **Frontend (React)**: User interface for configuration, status monitoring, and control
2. **Backend (Python)**: Automation service using Selenium for Discord monitoring and bet placement

## Frontend Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`

## Backend Setup

The backend service needs to be run separately on your local machine. Follow these steps:

1. Ensure you have Python 3.8+ installed
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install required packages: `pip install -r requirements.txt`
5. Set up your `.env` file with your credentials (see `.env.example`)
6. Run the backend service: `python backend_server.py`

## Required Python Packages

The backend requires the following packages:

```
selenium
python-dotenv
flask
flask-cors
```

## Usage

1. Start both the frontend and backend
2. Configure your Discord credentials and betting platform accounts in the Settings page
3. Click "Start Monitoring" on the Dashboard to begin automation
4. View betting activity and history in the Bet History page

## Important Notes

- This application is for educational purposes only
- Using automation scripts may violate the Terms of Service of Discord and betting platforms
- Always ensure you're complying with local laws and regulations regarding online betting
- Use at your own risk

## Development

- Frontend: React with TypeScript, Tailwind CSS
- Backend: Python with Flask, Selenium
- Storage: Browser LocalStorage for frontend, .env file for backend
