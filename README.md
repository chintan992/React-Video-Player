# Let's Stream

The **Let's Stream Website** is a feature-rich platform designed to use the Streaming API for video URLs and the TMDB API for movie and series data. The project incorporates a recommendation engine in Python to suggest the next movie or series to watch based on the user's recently played content. The current version implements basic iframe integration for video playback, React for the frontend, and is deployed on Netlify. Future plans include transitioning the frontend to **Cloudflare Pages**, **Netlify**, and **Heroku** and serverless functions to **Cloudflare Workers**, with the recommendation engine potentially moving to Node.js or Python for enhanced scalability.

---

## Features

- **Authentication**: User authentication powered by Firebase.
- **Dark Mode**: Built-in support for a sleek, user-friendly dark mode.
- **Infinite Scroll**: Continuous content loading with `react-infinite-scroll-component`.
- **Responsive Design**: Optimized for all devices using Tailwind CSS.
- **PWA Support**: Progressive Web App capabilities enabled by Workbox.
- **Interactive Carousel**: Seamless browsing with `react-slick`.
- **Error Handling**: Graceful fallback and error management through error boundaries.

---

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router v6, React Slick
- **Backend/Services**: Firebase Authentication
- **Progressive Web App**: Workbox
- **Utilities**: ESLint for code quality

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
/React-Video-Player
├── /src
│   ├── /api
│   │   └── tmdbApi.js          # TMDB API integration
│   ├── /components
│   │   ├── AboutUs.js
│   │   ├── DarkModeContext.js  # Dark mode logic
│   │   ├── Discover.js
│   │   ├── HomePage.js
│   │   ├── MediaDetail.js
│   │   ├── MediaForm.js
│   │   ├── MediaItem.js
│   │   ├── Navbar.js
│   │   ├── Search.js
│   │   ├── Login.js            # Firebase Authentication
│   │   ├── Signup.js           # User Registration
│   │   └── WatchPage.js
│   ├── /context
│   │   └── AuthContext.js      # Authentication Context
│   ├── /firebase
│   │   ├── auth.js             # Firebase Auth Configuration
│   │   └── config.js           # Firebase App Configuration
│   └── /hooks
│       └── useInfiniteScroll.js

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
