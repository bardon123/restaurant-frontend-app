# Restaurant Frontend App

A React app that connects to a backend Rails API and database to display and order menu items.

## Features

- Modern React frontend
- Apollo Client for GraphQL queries
- Connects to a Rails backend (see backend repo)
- Pokemon Black & Yellow theme
- Add to cart, modifiers, and cart preview

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables (if needed):**

   - If you use a `.env` file for API URLs, create it in the root directory.

4. **Start the development server:**

   ```sh
   npm start
   # or
   yarn start
   ```

5. **The app will run at** [http://localhost:3000](http://localhost:3000)

### Connecting to the Backend

- This app expects a Rails backend running and serving a GraphQL API.
- By default, it connects to:  
  `https://menu-query.onrender.com/graphql`
- To use your own backend, update the `uri` in `src/apollo-client.js`.

### Backend Setup

- See the [menu_query](https://github.com/bardon123/menu_query) -  for Rails API setup.

## Deployment

You can deploy this app to Vercel, Netlify, or any static hosting provider.

## License

MIT
