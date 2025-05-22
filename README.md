# 🎮 Multiplayer Chess

<div align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io"/>
</div>

<p align="center">
  A modern, real-time multiplayer chess game built with React Native and Node.js
</p>

## ✨ Features

- 🎮 **Real-time multiplayer** - Play chess with friends online
- 🌓 **Dark/Light mode** - Beautiful UI with theme support
- 📱 **Cross-platform** - Works on iOS, Android, and Web
- 🎯 **Move validation** - Built-in chess rules and move validation
- 🔄 **Game state management** - Track game state, turns, and win conditions
- 🚀 **Modern UI/UX** - Glassmorphic design with beautiful animations
- 🧩 **Intuitive gameplay** - Highlighting valid moves and last moves

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **TypeScript** - Type-safe JavaScript
- **React Navigation/Expo Router** - Navigation management
- **Socket.io Client** - Real-time communication
- **Linear Gradient** - Beautiful UI gradients
- **Expo Blur** - Glassmorphic UI effects
- **React Native SVG** - Vector graphics support
- **React Native Animatable** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web server framework
- **Socket.io** - Real-time bidirectional communication
- **Chess.js** - Chess move validation and game state
- **UUID** - Unique game ID generation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Client Setup
```bash
# Clone the repository
git clone https://github.com/Dbrightson/Multiplayer-Chess.git
cd Multiplayer-Chess/client

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

### Server Setup
```bash
# Navigate to server directory
cd ../server

# Install dependencies
npm install

# Start the server
npm start
```

## 🎮 How to Play

1. Start both client and server applications
2. Create a new game and share the game ID with a friend
3. Your friend can join the game using the game ID
4. White player moves first, then players alternate turns
5. The game automatically checks for checkmate, stalemate, and draw conditions

## 🌈 UI/UX Design

The application features a modern, glassmorphic design with:
- Smooth animations and transitions
- Responsive layout for different screen sizes
- Dark and light theme support
- High-contrast chess pieces for better visibility
- Intuitive move highlighting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👤 Author

**Don Brightson**

---

<div align="center">
  Made with ❤️ by Don Brightson
</div>
