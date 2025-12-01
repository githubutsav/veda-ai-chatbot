# Gemini Chatbot

A modern chatbot application built with React and Google's Gemini API.

## Features

- Clean and modern UI
- Real-time chat interface
- Powered by Google Gemini AI
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Get your Gemini API key:
   - Visit https://makersuite.google.com/app/apikey
   - Create a new API key

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your API key to the `.env` file:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

## Usage

Simply type your message in the input field and press Enter or click Send to chat with the AI assistant.

## Technologies Used

- React 18
- Vite
- Google Generative AI (Gemini)
- CSS3
