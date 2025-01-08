# Let's Stream

The **Let's Stream Website** is a feature-rich platform designed to use the Streaming API for video URLs and the TMDB API for movie and series data. The project incorporates a recommendation engine in Python to suggest the next movie or series to watch based on the user's recently played content. The current version implements basic iframe integration for video playback, React for the frontend, and is deployed on Netlify. Future plans include transitioning the frontend to **Cloudflare Pages**, **Netlify**, and **Heroku** and serverless functions to **Cloudflare Workers**, with the recommendation engine potentially moving to Node.js or Python for enhanced scalability.

---
# Proxy: 
##### https://prox992y.chintanr21.workers.dev/
---

## Features

- **Authentication**: User authentication powered by Firebase.
- **Dark Mode**: Built-in support for a sleek, user-friendly dark mode.
- **Infinite Scroll**: Continuous content loading with `react-infinite-scroll-component`.
- **Responsive Design**: Optimized for all devices using Tailwind CSS.
- **PWA Support**: Progressive Web App capabilities enabled by Workbox.
- **Interactive Carousel**: Seamless browsing with `react-slick`.
- **Error Handling**: Graceful fallback and error management through error boundaries.
- **Personalized Profiles**:Allow users to create and customize their profiles with avatars, bios, and preferences. Enable users to save their favorite movies and series for quick access.
- **Watchlists**: Implement a watchlist feature where users can add movies and series they want to watch later. Provide notifications when new episodes of series in the watchlist are released.
- **User Reviews and Ratings**: Allow users to rate and review movies and series. Display aggregated ratings and reviews from TMDB and other users.
- **Social Sharing:** Enable users to share their favorite content on social media platforms. Integrate with social media APIs to allow users to log in with their social accounts.
- **Trending and Popular Content:** Display trending and popular movies and series based on global or regional data. Use TMDB's trending API to fetch real-time data.
- **Search**: Enable users to search for movies, series, and actors. Use TMDB's search API to fetch relevant results.
- **Dark Mode**: Implement a dark mode feature for users to switch between light and dark themes.

---

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router v6, React Slick
- **Backend/Services**: Firebase Authentication
- **Progressive Web App**: Workbox
- **Utilities**: ESLint for code quality
- **Deployment**: Netlify, Cloudflare Pages
- **APIs**: TMDB API, Streaming API
- **Testing**: Jest, React Testing Library
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Documentation**: Markdown
- **Security**: Firebase Security Rules
- **Accessibility**: WAI-ARIA
- **Performance**: Lighthouse
- **Open Source**: MIT License
- **Contributing**: GitHub
- **Issues**: GitHub
- **Pull Requests**: GitHub
- **Code of Conduct**: Contributing
- **Contributors**: Contributors


---

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```
   git clone https://github.com/chintan992/lets-stream.git
   cd lets-stream
   ```
2. **Install dependencies**:
      ```
      Copy code
      npm install
      ```
3. **Configure environment variables: Create a .env file in the root directory and add your Firebase and TMDB API configurations:**
      ```
      REACT_APP_TMDB_API_KEY=YOUR-API-KEY
      REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
      REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
      ```
## Usage
**To run the application in development mode:**
      ```
      npm start
      ```
**To create a production build:**
      ```
      npm run build
      ```
      **Open your browser and navigate to http://localhost:3000 to view the application.**

## Deployment
**Deploy on Netlify:**
   Create a new site in your Netlify dashboard.
   Connect your Git repository.
   Set the build command to npm run build and the publish directory to build/.
   Click Deploy site.

**Deploy on Heroku:**
   Install the Heroku CLI: If you haven’t already, install the Heroku CLI from here.
   Create a Heroku app:
      ```
      heroku create lets-stream
      ```
   Set environment variables:
      ```
      heroku config:set REACT_APP_TMDB_API_KEY=YOUR-API-KEY
      heroku config:set REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
      heroku config:set REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
      ```
   Deploy the app: Ensure your repository has a Procfile containing:
      ```
      web: npm start
      ```
   Then, push your code to Heroku:
      ```
      git push heroku main
      ```
   Access the deployed app: Visit the Heroku app URL provided after deployment.

**Deploy on Cloudflare Pages:**
   Set up your project in the Cloudflare Pages dashboard:

   Log in to your Cloudflare account and navigate to Pages.
   Click on Create a Project.
   Connect your Git repository:

   Select your repository from GitHub or GitLab and grant the necessary permissions.
   Configure build settings:
      ```
      Build command: npm run build
      Build output directory: build/
      ```
   Environment variables: Add the following:
      ```
      REACT_APP_TMDB_API_KEY=YOUR-API-KEY
      REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
      REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
      ```
   Deploy your app:

   Cloudflare Pages will automatically build and deploy your app after configuration.
   Access your app:

   Once deployed, your app will be available at the Cloudflare Pages URL.

## Project Structure 
```
/React-Video-Player/
├── .devcontainer/
│   └── devcontainer.json
├── .env
├── .firebaserc
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── bug_report.md
│   ├── dependabot.yml
│   └── workflows/
│       └── node.js.yml
├── .gitignore
├── .idx/
│   ├── dev.nix
│   └── integrations.json
├── .netlify/
│   └── state.json
├── .vscode/
│   └── settings.json
├── 85f7f045f99c649f87f9d0baa67c7663.txt
├── Asset 1.svg
├── Asset 1chrome.png
├── Background.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── IMPROVEMENTS.md
├── LICENSE
├── README.md
├── api list.txt
├── docs/
├── image.png
├── netlify.toml
├─] node_modules/ (ignored)
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   ├── offline.html
│   ├── robots.txt
│   ├── service-worker.js
│   ├── site.webmanifest
│   └── web.config
├── src/
│   ├── App.js
│   ├── api/
│   │   └── tmdbApi.js
│   ├── api.js
│   ├── background/
│   │   ├── Hyperspeed.css
│   │   ├── Hyperspeed.js
│   │   ├── Hyperspeedpreset.js
│   │   ├── SplashCursor.js
│   │   ├── Squares.js
│   │   └── background.js
│   ├── components/
│   │   ├── AboutUs.js
│   │   ├── AdvancedSearchForm.js
│   │   ├── ApiSelector.js
│   │   ├── DarkModeContext.js
│   │   ├── Discover.js
│   │   ├── ErrorBoundary.js
│   │   ├── Footer.js
│   │   ├── LoadingSkeleton.js
│   │   ├── LoadingSpinner.js
│   │   ├── Login.js
│   │   ├── MediaControls.js
│   │   ├── MediaDetail.js
│   │   ├── MediaForm.js
│   │   ├── MediaItem.js
│   │   ├── Navbar/
│   │   │   ├── Navbar.js
│   │   │   ├── ProfileDropdown.js
│   │   │   └── navConfig.js
│   │   ├── Navbar.js
│   │   ├── PrivacyPolicy.js
│   │   ├── ScrollToTop.js
│   │   ├── Search.js
│   │   ├── ShareTargetHandler.js
│   │   ├── Signup.js
│   │   ├── SplashScreen.js
│   │   ├── Support.js
│   │   ├── TermsOfUse.js
│   │   ├── UserFeatures.js
│   │   ├── UserListsSidebar.js
│   │   ├── VideoSection.js
│   │   ├── WatchPage.js
│   │   └── common/
│   │       ├── FeaturedContent.js
│   │       ├── FilterBar.js
│   │       ├── MediaCard.js
│   │       ├── ScrollToTop.js
│   │       └── SkeletonLoader.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── SearchContext.js
│   ├── firebase/
│   │   ├── auth.js
│   │   ├── config.js
│   │   └── userService.js
│   ├── hooks/
│   │   ├── useInfiniteScroll.js
│   │   ├── useInstallPrompt.js
│   │   └── useUserFeatures.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── service-worker.js
│   ├── serviceWorkerRegistration.js
│   ├── setupTests.js
│   ├── styles/
│   │   └── colors.css
│   └── utils/
│       ├── security.js
│       └── storage.js
└── tailwind.config.js

```

## Future Goals
   User Profiles: Store user preferences, watch history, and personalized recommendations.
   Social Media Integration: Share favorite movies and series on platforms like Facebook, Twitter, and Instagram.
   Advanced Search: Filter by genre, release year, rating, and more.
   User Reviews & Ratings: Enable community feedback to assist other viewers.
   Multilingual Support: Make the platform accessible to a global audience.
   Mobile App: Create a dedicated mobile application for on-the-go streaming.
   Live Streaming: Include events like premieres and award shows.
   Subscription Model: Offer premium content through a subscription-based service.
