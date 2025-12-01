import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage, resetChat } from './services/gemini';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'English',
    notifications: true,
    soundEffects: true,
    dataCollection: false
  });
  const [profile, setProfile] = useState({
    name: 'Veda User',
    email: 'user@vedaai.com',
    avatar: '👤',
    joinDate: 'November 2025',
    totalChats: 47,
    apiUsage: '2.4 MB'
  });
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([
    { 
      id: 1, 
      title: 'Image Generation Tips', 
      date: 'Today', 
      time: '2:30 PM',
      messages: [
        { role: 'user', content: 'How do I create better AI images?' },
        { role: 'assistant', content: 'Here are some tips for better AI image generation:\n\n1. Be specific with descriptions\n2. Include style references\n3. Mention lighting and composition\n4. Specify colors and mood\n5. Use descriptive adjectives' }
      ]
    },
    { 
      id: 2, 
      title: 'Python Coding Help', 
      date: 'Today', 
      time: '11:15 AM',
      messages: [
        { role: 'user', content: 'Explain list comprehension in Python' },
        { role: 'assistant', content: 'List comprehension is a concise way to create lists in Python:\n\n```python\n# Traditional way\nsquares = []\nfor x in range(10):\n    squares.append(x**2)\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\n```\n\nIt\'s more readable and often faster!' }
      ]
    },
    { 
      id: 3, 
      title: 'AI Search Queries', 
      date: 'Yesterday', 
      time: '4:45 PM',
      messages: [
        { role: 'user', content: 'What are the latest AI trends?' },
        { role: 'assistant', content: 'Current AI trends in 2025:\n\n• Multimodal AI models\n• Edge AI deployment\n• AI agents and automation\n• Responsible AI practices\n• Generative AI in enterprise\n• AI-powered coding assistants' }
      ]
    },
    { 
      id: 4, 
      title: 'Web Development Advice', 
      date: 'Yesterday', 
      time: '10:20 AM',
      messages: [
        { role: 'user', content: 'Best practices for React apps?' },
        { role: 'assistant', content: 'React best practices:\n\n1. Use functional components\n2. Leverage hooks effectively\n3. Keep components small and focused\n4. Implement proper error boundaries\n5. Optimize with React.memo\n6. Use proper key props in lists' }
      ]
    }
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    const newUserMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      // Get AI response
      const response = await sendMessage(userMessage);
      const newAssistantMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, newAssistantMessage]);
      
      // Save to chat history if this is a new conversation
      if (messages.length === 0) {
        const newChat = {
          id: Date.now(),
          title: userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : ''),
          date: 'Today',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          messages: [newUserMessage, newAssistantMessage]
        };
        setChatHistory(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: error.message || 'Sorry, I encountered an error. Please try again.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    resetChat();
  };

  const handleNewChat = () => {
    handleClearChat();
  };

  const handleChatHistoryClick = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    
    switch(feature) {
      case 'Chat Files':
        fileInputRef.current?.click();
        break;
      case 'Images':
        imageInputRef.current?.click();
        break;
      case 'Translate':
        setInput('Translate this text to Spanish: ');
        showNotification('Translation mode activated');
        break;
      case 'Audio Chat':
        handleAudioChat();
        break;
      default:
        break;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setInput(`Analyze this file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      showNotification(`File "${file.name}" ready for analysis`);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(`Analyze this image: ${file.name}`);
        showNotification(`Image "${file.name}" uploaded`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChat = () => {
    if (!isRecording) {
      setIsRecording(true);
      showNotification('🎤 Recording started...');
      
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setInput('Voice message: "Hello, can you help me with something?"');
        showNotification('Recording complete!');
      }, 3000);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    showNotification(`${key} updated`);
  };

  const handleProfileUpdate = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
    showNotification('Profile updated successfully');
  };

  return (
    <div className="app-container">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt"
      />
      <input
        ref={imageInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
        accept="image/*"
      />

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="notification"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            ✨ {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <span className="icon">✨</span>
            <span>New Chat</span>
          </button>
        </div>

        <div className="chat-history">
          <div className="history-section">
            <h3 className="history-title">Today</h3>
            {chatHistory.filter(c => c.date === 'Today').map(chat => (
              <motion.div
                key={chat.id}
                className={`history-item ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => handleChatHistoryClick(chat)}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="history-icon">{chat.id === 1 ? '🎨' : '💻'}</div>
                <div className="history-info">
                  <div className="history-name">{chat.title}</div>
                  <div className="history-time">{chat.time}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="history-section">
            <h3 className="history-title">Yesterday</h3>
            {chatHistory.filter(c => c.date === 'Yesterday').map(chat => (
              <motion.div
                key={chat.id}
                className={`history-item ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => handleChatHistoryClick(chat)}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="history-icon">{chat.id === 3 ? '🔍' : '🌐'}</div>
                <div className="history-info">
                  <div className="history-name">{chat.title}</div>
                  <div className="history-time">{chat.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-icons">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              title="Settings"
              onClick={() => setShowSettings(true)}
            >
              ⚙️
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              title="Profile"
              onClick={() => setShowProfile(true)}
            >
              👤
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="modal-header">
                <h2>⚙️ Settings</h2>
                <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
              </div>
              <div className="modal-content">
                <div className="setting-group">
                  <label className="setting-label">
                    <span>Theme</span>
                    <select 
                      value={settings.theme} 
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="setting-select"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </label>
                </div>

                <div className="setting-group">
                  <label className="setting-label">
                    <span>Language</span>
                    <select 
                      value={settings.language} 
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="setting-select"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </label>
                </div>

                <div className="setting-group">
                  <label className="setting-toggle">
                    <span>
                      <strong>Notifications</strong>
                      <small>Receive toast notifications</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-group">
                  <label className="setting-toggle">
                    <span>
                      <strong>Sound Effects</strong>
                      <small>Play sounds for actions</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.soundEffects}
                      onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-group">
                  <label className="setting-toggle">
                    <span>
                      <strong>Data Collection</strong>
                      <small>Help improve Veda AI</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.dataCollection}
                      onChange={(e) => handleSettingChange('dataCollection', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-group">
                  <button className="danger-button" onClick={() => {
                    if (confirm('Are you sure you want to clear all chat history?')) {
                      setChatHistory([]);
                      setMessages([]);
                      showNotification('Chat history cleared');
                      setShowSettings(false);
                    }
                  }}>
                    🗑️ Clear All Chat History
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
            />
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="modal-header">
                <h2>👤 Profile</h2>
                <button className="modal-close" onClick={() => setShowProfile(false)}>✕</button>
              </div>
              <div className="modal-content">
                <div className="profile-avatar">
                  <div className="avatar-circle">{profile.avatar}</div>
                  <button className="change-avatar-btn" onClick={() => {
                    const avatars = ['👤', '🧑', '👨', '👩', '🤖', '🔮', '✨', '🎭', '🦄'];
                    const newAvatar = avatars[Math.floor(Math.random() * avatars.length)];
                    handleProfileUpdate({ avatar: newAvatar });
                  }}>
                    Change Avatar
                  </button>
                </div>

                <div className="profile-info">
                  <div className="profile-field">
                    <label>Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="profile-input"
                    />
                  </div>

                  <div className="profile-field">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="profile-input"
                    />
                  </div>

                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-label">Member Since</span>
                      <span className="stat-value">{profile.joinDate}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Chats</span>
                      <span className="stat-value">{profile.totalChats}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">API Usage</span>
                      <span className="stat-value">{profile.apiUsage}</span>
                    </div>
                  </div>

                  <button 
                    className="save-profile-btn"
                    onClick={() => {
                      handleProfileUpdate({});
                      setShowProfile(false);
                    }}
                  >
                    💾 Save Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="main-content">
        <motion.button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ☰
        </motion.button>

        <div className="chat-area">
          {messages.length === 0 ? (
            <motion.div 
              className="welcome-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div 
                className="avatar"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔮
              </motion.div>
              <h1 className="welcome-title">Hi! How can I help you?</h1>
              <p className="welcome-subtitle">Ask me anything and I'll assist you</p>
            </motion.div>
          ) : (
            <div className="messages-list">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`chat-message ${message.role}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="message-avatar">
                      {message.role === 'user' ? '👤' : '🔮'}
                    </div>
                    <div className="message-bubble">
                      <div className="message-text">{message.content}</div>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div 
                    className="chat-message assistant"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="message-avatar">🔮</div>
                    <div className="message-bubble">
                      <div className="typing-indicator">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="dot"
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-container">
          <div className="feature-buttons">
            <motion.button 
              className={`feature-btn ${selectedFeature === 'Chat Files' ? 'active' : ''}`}
              onClick={() => handleFeatureClick('Chat Files')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="feature-icon">📎</span>
              <span className="feature-label">Chat Files</span>
            </motion.button>
            <motion.button 
              className={`feature-btn ${selectedFeature === 'Images' ? 'active' : ''}`}
              onClick={() => handleFeatureClick('Images')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="feature-icon">🖼️</span>
              <span className="feature-label">Images</span>
            </motion.button>
            <motion.button 
              className={`feature-btn ${selectedFeature === 'Translate' ? 'active' : ''}`}
              onClick={() => handleFeatureClick('Translate')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="feature-icon">🌐</span>
              <span className="feature-label">Translate</span>
            </motion.button>
            <motion.button 
              className={`feature-btn ${selectedFeature === 'Audio Chat' ? 'active' : ''} ${isRecording ? 'recording' : ''}`}
              onClick={() => handleFeatureClick('Audio Chat')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="feature-icon">{isRecording ? '🔴' : '🎤'}</span>
              <span className="feature-label">{isRecording ? 'Recording...' : 'Audio Chat'}</span>
            </motion.button>
          </div>

          <form className="input-form" onSubmit={handleSubmit}>
            {(selectedFile || selectedImage) && (
              <div className="file-indicator">
                <span>{selectedFile ? '📎' : '🖼️'} {selectedFile?.name || selectedImage?.name}</span>
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedFile(null);
                    setSelectedImage(null);
                    setInput('');
                  }}
                  className="remove-file"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={loading}
              className="chat-input"
            />
            <motion.button 
              type="submit" 
              disabled={loading || !input.trim()} 
              className="send-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="send-icon">↑</span>
            </motion.button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
