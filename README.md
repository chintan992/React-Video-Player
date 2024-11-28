# Let's Stream

The Let's Stream Website project aims to create a website that uses Streaming API to fetch video URLs and implements the TMDB API to fetch movies and series data. It also includes a recommendation engine in Python that recommends the user's next movie or series to watch based on their recently played movies and series. The project will have a basic iframe implementation of Streaming API using a form to get the movies and series data, which is implemented in React and deployed on Netlify. The team is planning to switch the whole project to Cloudflare Pages for the front-end and serverless functions to run on Cloudflare Workers. They will also make a recommendation engine in Node.js or Python, whichever is easier to implement with the current prospect.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/chintan992/lets-stream.git
   cd lets-stream
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To run the application, use the following command:

```bash
npm start
```

Then, open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

For guidelines on how to contribute to this project, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Future Goals

1. **User profiles:** Create user profiles that store their recently played movies and series, their preferences, and their watch history. This will allow the recommendation engine to provide more personalized recommendations based on the user’s viewing habits.
2. **Social media integration:** Allow users to share their favorite movies and series on social media platforms like Facebook, Twitter, and Instagram. This will help to increase the website’s visibility and attract more users.
3. **Advanced search:** Implement an advanced search feature that allows users to search for movies and series based on various criteria such as genre, year of release, rating, and more.
4. **User reviews and ratings:** Allow users to rate and review movies and series. This will help other users to decide whether or not to watch a particular movie or series.
5. **Multiple languages:** Add support for multiple languages to make the website accessible to a wider audience.
6. **Mobile app:** Develop a mobile app for the Let’s Stream Website project. This will allow users to access the website on their mobile devices and watch movies and series on the go.
7. **Live streaming:** Add support for live streaming of events such as movie premieres, award shows, and more. This will help to attract more users to the website and increase engagement.
8. **Subscription model:** Implement a subscription model that allows users to access premium content such as exclusive movies and series. This will help to generate revenue for the website and provide users with more options.

## Useful Files 
```
/React-Video-Player
│
├── /src
│   ├── /api
│   │   └── tmdbApi.js
│   ├── /components
│   │   ├── AboutUs.js
│   │   ├── DarkModeContext.js
│   │   ├── Discover.js
│   │   ├── ExpandedView.js
│   │   ├── HomePage.js
│   │   ├── MediaDetail.js
│   │   ├── MediaForm.js
│   │   ├── MediaItem.js
│   │   ├── Navbar.js
│   │   ├── Search.js
│   │   ├── Signup.js
│   │   ├── Support.js
│   │   ├── VideoSection.js
│   │   └── WatchPage.js
│   ├── /hooks
│   │   └── useInfiniteScroll.js
│   ├── App.js
│   ├── index.js
│   ├── reportWebVitals.js
│   └── tailwind.config.js
│
├── /public
│   └── index.html
│
├── api_list.txt
├── package.json
├── package-lock.json
└── .gitignore
