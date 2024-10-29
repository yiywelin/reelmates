# ReelsMate 🎬

A modern movie discovery app that lets users swipe through movies, save their favorites, and match with others based on movie preferences. Built with Vue.js and Firebase.

## 🌟 Features

- Movie swiping interface with smooth animations
- TMDB integration for up-to-date movie data
- User authentication and profiles
- Match with users having similar movie tastes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))
- Firebase project ([Set up here](https://console.firebase.google.com/))

### Installation

1. Clone the repository
```bash
git clone <your-repository-url>
cd reelsmate
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the environment template
cp .env .env.local

# Edit .env.local and add your API keys
VUE_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Start the development server
```bash
npm run serve
```

### Available Scripts

- `npm run serve` - Compiles and hot-reloads for development
- `npm run build` - Compiles and minifies for production
- `npm run lint` - Lints and fixes files

## 🔑 Environment Variables

Create a `.env.local` file in the project root with these variables:

```env
VUE_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

⚠️ Never commit `.env.local` to version control!


## 🔧 Configuration

### Vue CLI Configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### TMDB API
The app uses TMDB API for movie data. To configure:
1. Get an API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Add it to your `.env.local` file

## 🚥 Git Workflow

### Ignored Files
- `node_modules/`
- `.env.local`
- `dist/`
- Editor-specific files
- OS-specific files