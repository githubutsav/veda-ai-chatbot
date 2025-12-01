# Veda AI Chatbot 🔮

A modern, feature-rich chatbot application built with React, Framer Motion, and Google's Gemini API.

![Veda AI](https://img.shields.io/badge/Veda-AI%20Chatbot-4a148c?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google)

## ✨ Features

### 💬 **Modern Chat Interface**
- Clean, professional sidebar with chat history
- Real-time message streaming
- Smooth animations with Framer Motion
- Avatar-based message bubbles
- Typing indicators

### 📱 **Smart Sidebar**
- Chat history organized by date (Today/Yesterday)
- Quick access to previous conversations
- Collapsible sidebar for more screen space
- Active chat highlighting
- New chat button with gradient styling

### 🎯 **Feature Buttons**
- **Chat Files** (📎) - Document analysis ready
- **Images** (🖼️) - Image analysis capabilities
- **Translate** (🌐) - Multi-language support UI
- **Audio Chat** (🎤) - Voice conversation interface

### 🎨 **Beautiful Design**
- Light, modern color scheme
- Gradient accents (Deep purple to blue)
- Smooth hover effects and transitions
- Responsive layout (Desktop & Mobile)
- Custom scrollbars
- Toast notifications

### ⚡ **Functionality**
- Click chat history to load previous conversations
- Feature buttons pre-fill prompts
- Settings and profile buttons
- Auto-save chat history
- Real-time AI responses via Gemini 1.5 Flash

## 🚀 **Quick Start**

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/veda-ai-chatbot.git
cd veda-ai-chatbot
```

2. **Install dependencies**
```bash
npm install
```

3. **Get your Gemini API key**
   - Visit https://makersuite.google.com/app/apikey
   - Create a new API key (it's free!)

4. **Set up environment variables**
```bash
cp .env.example .env
```

5. **Add your API key to `.env`**
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

6. **Run the development server**
```bash
npm run dev
```

7. **Open your browser**
   - Navigate to http://localhost:5173

## 🎮 **Usage**

### Starting a New Chat
1. Click the **"✨ New Chat"** button in the sidebar
2. Type your message in the input field
3. Press Enter or click the send button (↑)

### Loading Previous Chats
- Click any chat in the sidebar history
- The conversation will load instantly
- Continue chatting from where you left off

### Using Features
- Click any feature button (Chat Files, Images, Translate, Audio Chat)
- The input field will be pre-filled with a relevant prompt
- Modify the prompt and send your message

### Keyboard Shortcuts
- **Enter** - Send message
- **Shift + Enter** - New line in message

## 🛠️ **Technologies Used**

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Smooth animations
- **Google Generative AI** - Gemini 1.5 Flash model
- **CSS3** - Modern styling with gradients and transitions

## 📦 **Project Structure**

```
veda-ai-chatbot/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Styling
│   ├── main.jsx         # Entry point
│   └── services/
│       └── gemini.js    # Gemini API integration
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── .env.example         # Environment variables template
└── README.md           # Documentation
```

## 🎨 **Hardcoded Demo Data**

The app includes realistic demo conversations:
- **Image Generation Tips** - AI image creation advice
- **Python Coding Help** - List comprehension tutorial
- **AI Search Queries** - Latest AI trends
- **Web Development Advice** - React best practices

## 🔒 **Security**

- API keys are stored in `.env` files (not committed to git)
- `.gitignore` prevents sensitive data from being pushed
- API calls include error handling and validation

## 🤝 **Contributing**

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 **License**

ISC License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 **Author**

Built with ❤️ using React and Gemini AI

---

**Note**: This chatbot requires an active internet connection and a valid Gemini API key to function properly.
