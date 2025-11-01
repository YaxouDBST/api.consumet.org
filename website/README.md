# Consumet Manga & Anime Website# MangaHub - Modern Manga & Manhua Reading Platform# React + TypeScript + Vite



A modern web application for browsing manga and anime using the Consumet API. Built with vanilla JavaScript, HTML5, and CSS3.



## 📋 Table of ContentsA modern, fast, and feature-rich web application for reading manga and manhuas online. Built with React, TypeScript, Vite, and Tailwind CSS, powered by the Consumet API.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

- [Features](#features)

- [Project Structure](#project-structure)

- [How It Works](#how-it-works)

- [Setup & Running](#setup--running)## 🚀 FeaturesCurrently, two official plugins are available:

- [Architecture](#architecture)

- [API Providers](#api-providers)

- [Code Overview](#code-overview)

### Core Features- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

## ✨ Features

- **Browse & Discover**: Trending and latest manga collections- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Anime

- Browse top-airing and most-popular anime- **Search**: Powerful search functionality to find your favorite manga

- View anime descriptions and episode counts

- Click through episodes (71+ anime with complete episode lists)- **Read**: Beautiful, responsive reader with multiple viewing modes## React Compiler

- Search anime across multiple providers

- Multi-provider fallback system- **Manga Details**: Comprehensive information with chapter listings



### Manga- **Two Interface Modes**: The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- Browse trending manga

- Read chapters with multi-page viewer  - **Simple Mode**: Compact, card-based layout

- View chapter list and descriptions

- Search manga from 6 different providers  - **Advanced Mode**: Detailed view with more information## Expanding the ESLint configuration

- Smart navigation (hide "Next" button on last chapter)



### General

- Responsive design with modern UI### Technical FeaturesIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- Fast loading with concurrent API requests

- Error handling with graceful fallbacks- ⚡ Fast loading with Vite

- Search filtering (Both/Anime/Manga)

- Provider diversity for reliability- 📱 Fully responsive design```js



## 📁 Project Structure- 🎨 Beautiful UI with Tailwind CSSexport default defineConfig([



```- 🔍 Real-time search  globalIgnores(['dist']),

website/

├── index.html           # Main HTML structure- 🌐 API-powered content  {

├── app.js              # Frontend logic (all functionality)

├── styles.css          # UI styling    files: ['**/*.{ts,tsx}'],

├── server.js           # Optional Node.js server

├── README.md           # This file## 📋 Prerequisites    extends: [

├── src/                # TypeScript sources (backend, not used in frontend)

│   ├── services/      // Other configs...

│   │   └── mangaAPI.ts # API wrapper functions

│   └── routes/         # Backend route definitions- Node.js 16+ 

└── node_modules/       # Dependencies

```- npm or yarn      // Remove tseslint.configs.recommended and replace with this



## 🔧 How It Works      tseslint.configs.recommendedTypeChecked,



### Frontend Flow## 🛠️ Installation & Setup      // Alternatively, use this for stricter rules



1. **User opens website** → `index.html` loads      tseslint.configs.strictTypeChecked,

2. **App initializes** → `app.js` runs on page load

3. **loadAllLatest()** fetches anime/manga from providers```bash      // Optionally, add this for stylistic rules

4. **Cards display** → `createMangaCard()` renders each item

5. **User clicks card** → `loadDetails()` fetches full info (skipped for anime, uses card data)# Install dependencies      tseslint.configs.stylisticTypeChecked,

6. **Detail modal opens** → `showDetailModal()` displays episodes/chapters

7. **User clicks episode/chapter** → `readChapter()` fetches streams/pagesnpm install

8. **Viewer displays** → `loadAndDisplayChapter()` shows content

      // Other configs...

### Data Flow Diagram

# Start development server    ],

```

User Action → API Call → Parse Response → Display Modal → User Interactionnpm run dev    languageOptions: {

     ↑                                                              ↓

     └──────────────── Fetch Content/Streams ←─────────────────────┘      parserOptions: {

```

# Build for production        project: ['./tsconfig.node.json', './tsconfig.app.json'],

### Provider Fallback System

npm run build        tsconfigRootDir: import.meta.dirname,

When loading content:

1. **Primary Provider**: Try first endpoint      },

2. **Secondary Providers**: Try alternatives if primary fails

3. **Fallback Data**: Use original card data if all fail# Preview production build      // other options...

4. **Error Messages**: Display helpful error to user

npm run preview    },

## 🚀 Setup & Running

```  },

### Prerequisites

- Python 3.x (for frontend server)])

- Node.js 16+ (for backend API)

- Modern web browser## 📂 Project Structure```



### Starting the Frontend



```bash```You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

cd website

python -m http.server 8000src/

```

├── components/          # Reusable React components```js

Visit: `http://localhost:8000`

│   ├── Header.tsx      # Navigation header// eslint.config.js

### Starting the Backend API

│   └── MangaCard.tsx   # Manga card componentimport reactX from 'eslint-plugin-react-x'

```bash

cd ../  # Go to parent directory├── context/            # React Contextimport reactDom from 'eslint-plugin-react-dom'

npm start

```│   └── AppContext.tsx  # Global app state



API runs on: `http://localhost:3000`├── pages/              # Page componentsexport default defineConfig([



## 🏗️ Architecture│   ├── HomePage.tsx    # Landing page  globalIgnores(['dist']),



### Frontend Architecture (Vanilla JS)│   ├── BrowsePage.tsx  # Browse manga  {



**State Variables:**│   ├── SearchPage.tsx  # Search functionality    files: ['**/*.{ts,tsx}'],

```javascript

currentTab           // 'home', 'manga', 'anime'│   ├── MangaDetailPage.tsx   # Manga details    extends: [

searchFilter         // 'both', 'anime', 'manga'

currentMangaData     // {id, type, _provider}│   └── ReaderPage.tsx  # Chapter reader      // Other configs...

currentChapterIndex  // Index in allChapters array

allChapters          // Array of chapters/episodes├── services/           # API services      // Enable lint rules for React

```

│   └── mangaAPI.ts     # Consumet API wrapper      reactX.configs['recommended-typescript'],

**Main Functions:**

- `switchTab()` - Change between Home/Manga/Anime tabs└── App.tsx             # Main app component      // Enable lint rules for React DOM

- `loadAllLatest()` - Load trending/latest content

- `loadTrending()` - Load trending content```      reactDom.configs.recommended,

- `performSearch()` - Search functionality

- `loadDetails()` - Fetch anime/manga details    ],

- `showDetailModal()` - Display detail view

- `readChapter()` - Open specific episode/chapter## 🌐 API Integration    languageOptions: {

- `loadAndDisplayChapter()` - Display content viewer

- `createMangaCard()` - Render anime/manga card      parserOptions: {

- `openSearchModal()` - Show search interface

Uses the **Consumet API** (https://api.consumet.org/manga):        project: ['./tsconfig.node.json', './tsconfig.app.json'],

**Helper Functions:**

- `showLoading()` / `hideLoading()` - Loading indicators- Browse trending and latest manga        tsconfigRootDir: import.meta.dirname,

- `closeSearchModal()` / `closeDetailModal()` - Modal management

- Search functionality      },

### Backend Architecture (Node.js/Fastify)

- Manga details with chapters      // other options...

Located in parent directory, provides REST API:

- Chapter page images    },

```

GET /anime/{provider}/top-airing        # Get top-airing anime  },

GET /anime/{provider}/most-popular      # Get most-popular anime

GET /anime/{provider}/latest-completed  # Get completed anime## 🎮 How to Use])

GET /anime/{provider}/search?query=     # Search anime

GET /anime/{provider}/info/{id}         # Get anime details```

GET /anime/{provider}/watch/{episodeId} # Get episode streams

1. **Browse** - Discover trending and latest manga

GET /manga/{provider}/trending          # Get trending manga2. **Search** - Find specific manga by title

GET /manga/{provider}/search?query=     # Search manga3. **View Details** - See chapters and synopsis

GET /manga/{provider}/info/{id}         # Get manga details4. **Read** - View manga pages with multiple fit modes

GET /manga/{provider}/read/{chapterId}  # Get chapter pages

```## ⚙️ Customization



## 🎬 API ProvidersEdit theme colors in `tailwind.config.js`:

```javascript

### Anime Providerstheme: {

  extend: {

| Provider | Endpoint | Episodes | Status |    colors: {

|----------|----------|----------|--------|      primary: "#6366f1",

| Zoro | `zoro` | 38/40 (most-popular) | ✓ Working |      secondary: "#ec4899",

| Zoro | `zoro` | 33/40 (latest-completed) | ✓ Working |      dark: "#0f172a",

| AnimeParhe | `animepahe` | 8/8 (top-airing) | ✓ Working |      darker: "#0a0e27",

| Anix | `anix` | Limited | ⚠️ Fallback |    },

| 9Anime | `9anime` | Limited | ⚠️ Fallback |  },

}

**Total: 71+ anime with episodes**```



### Manga Providers## 📝 Available Scripts



| Provider | Search | Trending | Chapters | Status |- `npm run dev` - Start dev server

|----------|--------|----------|----------|--------|- `npm run build` - Build for production

| MangaDex | ✓ | ✓ | ✓ | ✓ Working |- `npm run preview` - Preview production build

| MangaKakalot | ✓ | ✓ | ✓ | ✓ Working |- `npm run lint` - Run ESLint

| MangaPark | ✓ | ✓ | ✓ | ✓ Working |

| ManaGreader | ✓ | ✓ | ✓ | ✓ Working |## 🚀 Deployment

| MangaPill | ✓ | ✓ | ✓ | ✓ Working |

| MangaSee123 | ✓ | ✓ | ✓ | ✓ Working |### Vercel

```bash

## 💻 Code Overviewnpm i -g vercel

vercel

### Main Entry Point: `app.js````



**Initialization (lines 1-20):**### Netlify

```javascript```bash

const API_BASE = 'http://localhost:3000';npm run build

let currentTab = 'home';# Deploy the dist folder

let searchFilter = 'both';```

```

## 📱 Responsive Design

**Tab Switching (lines 21-30):**

```javascriptFully responsive with mobile, tablet, and desktop support.

function switchTab(tab) {

  currentTab = tab;## 🔐 Security

  // Update UI, load content

  loadAllLatest();- No user data storage

}- Direct API calls to Consumet

```- Public content sources only



**Content Loading (lines 76-105):**## ✨ Features Roadmap

```javascript

async function loadAllLatest() {- [ ] User favorites

  // Fetch from multiple providers concurrently- [ ] Reading history

  // Combine results- [ ] Theme customization

  // Display cards- [ ] Multiple languages

}- [ ] Advanced filtering

```

---

**Card Creation (lines 106-126):**

```javascript**Made with ❤️ for manga lovers**

function createMangaCard(item) {
  // Create card element
  // Add click handler to load details
  // Return card DOM element
}
```

**Detail Loading (lines 127-195):**
```javascript
async function loadDetails(id, type, provider) {
  // For anime: Skip fetch, use card data
  // For manga: Fetch from /info endpoint
  // Handle multiple providers
  // Return enriched data
}
```

**Detail Display (lines 196-280):**
```javascript
function showDetailModal(data) {
  // Extract title, image, description
  // Generate episodes from episode count
  // Build HTML for episodes/chapters
  // Display modal with content
}
```

**Content Viewer (lines 297-350):**
```javascript
async function loadAndDisplayChapter(chapterId) {
  // Fetch from /watch or /read endpoint
  // Parse streams/pages
  // Display in viewer
  // Handle navigation
}
```

### Key Data Structures

**Anime Card (from zoro.most-popular):**
```javascript
{
  id: "one-piece-100",
  title: "One Piece",
  image: "https://...",
  episodes: 1000,          // Episode count or array
  duration: "24m",
  type: "TV",
  _type: "anime",          // Added by frontend
  _provider: "zoro"        // Added by frontend
}
```

**Manga Card (from mangadex):**
```javascript
{
  id: "manga-id-xyz",
  title: "Manga Title",
  image: "https://...",
  chapters: [...],         // Array of chapter objects
  description: "...",
  _type: "manga",
  _provider: "mangadex"
}
```

**Episode Object (generated or from API):**
```javascript
{
  title: "Episode 1",
  episode: 1,
  number: 1,
  id: "anime-id-episode-1",  // Used for /watch endpoint
  url: "anime-id?ep=1"       // Alternative format
}
```

## 🔍 Key Features Explained

### Episode Generation
When zoro returns `episodes: 1000` (number), the frontend generates:
```javascript
for(let i=1; i<=1000; i++) {
  episodes.push({
    title: 'Episode ' + i,
    id: animId + '-episode-' + i
  });
}
```
This allows 1000 clickable episodes even though API only returns count.

### Multi-Provider Fallback
For manga details:
```javascript
providers = ['mangadex', 'mangakakalot', 'mangapark', 'managreader', 'mangapill'];
for(let p of providers) {
  if(tryFetch(p)) return success;
}
// If all fail, use card data
```

### Description Fallback Chain
```
English description
  → Any language description
    → Synopsis field
      → Plot field
        → Japanese title
          → "No description available"
```

### Smart Episode Display
- If `episodes > 0`: Show clickable episode list
- If `episodes === 0`: Show only title/image/description
- If `episodes` is array: Show each episode

## 🎨 UI Components

### Modals
- **Search Modal** (`#searchModal`) - Search interface
- **Detail Modal** (`#detailModal`) - Anime/manga details with episodes/chapters
- **Loading Overlay** (`#loadingOverlay`) - Loading indicator

### Containers
- **Latest Container** (`#latestContainer`) - Main content grid
- **Search Results** (`#searchResults`) - Search result cards
- **Detail Content** (`#detailContent`) - Detail modal content
- **Chapter Viewer** (`#chapterViewer`) - Content display area

## 📱 Responsive Design

- **Mobile First** approach
- **Grid Layout** for cards (auto-responsive)
- **Modal-based** UI for details
- **Touch-friendly** buttons and clickable areas

## 🐛 Error Handling

**Network Errors:**
- Concurrent requests to multiple providers
- If primary fails, try secondary
- If all fail, use fallback data or show error message

**Data Validation:**
- Check if response has actual content
- Skip empty responses
- Validate required fields (title, image)

**User Feedback:**
- Loading spinner during fetch
- Error messages for failures
- Graceful degradation

## 🚀 Performance Optimizations

1. **Concurrent API Calls** - Fetch from multiple providers at once
2. **Array Slicing** - Only display 24 cards per load
3. **Event Delegation** - Use bubbling for click handlers
4. **DOM Caching** - Store modal references
5. **String Concatenation** - Build HTML efficiently

## 📝 To Add Features

1. **Add Anime Provider:**
   - Update `loadAllLatest()` endpoints
   - Update `performSearch()` endpoints
   - Test provider works

2. **Add Manga Provider:**
   - Same as above, use `/manga/` routes

3. **Add Functionality:**
   - Add new function in `app.js`
   - Call from appropriate event handler
   - Test thoroughly

## 🔐 Security Notes

- All API calls go through backend proxy
- Backend handles CORS
- User input sanitized in onclick handlers
- No sensitive data stored in frontend

## 📞 Support

If episodes/chapters aren't showing:
1. Check backend is running on port 3000
2. Check provider is still working (may be down)
3. Try search to verify API connectivity
4. Check browser console for errors

If UI looks broken:
1. Clear browser cache
2. Try different browser
3. Check styles.css loaded
4. Check JavaScript console for errors

---

**Last Updated:** November 2025
**Version:** 1.0 - Production Ready
