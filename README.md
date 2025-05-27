# Bespoke Artisan Subscription Platform

## Overview

The Bespoke Artisan Subscription Platform is a web application designed to provide artisans with a subscription-based access to premium features. Artisans can subscribe to a monthly plan to unlock advanced tools and services, including unlimited quote responses, priority support, and analytics.

## Features

- **Artisan Console**: Manage quotes, view analytics, and access premium tools.
- **Subscription Management**: Artisans can subscribe to a monthly plan and manage their subscription.
- **Stripe Integration**: Secure payment processing using Stripe.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd bespoke
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
     ```
5. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Navigate to the artisan console.
2. Click on "Manage Subscription" in the sidebar.
3. Subscribe to the monthly plan using the secure payment form.
4. Access premium features after successful subscription.

## Backend Setup

Ensure the backend API is configured to handle subscription creation and return a `clientSecret` for Stripe payments. The endpoint `/api/create-subscription` should:

- Accept the artisan's email and subscription plan.
- Create a Stripe subscription.
- Return the `clientSecret` for the payment.

## Technologies Used

- **React**: Frontend framework.
- **Stripe**: Payment processing.
- **AWS Amplify**: Authentication and backend services.
- **React Router**: Client-side routing.

## Folder Structure

- `src/components`: Contains React components for the application.
- `src/App.js`: Main application file with routing.
- `src/index.js`: Entry point of the application.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For support or inquiries, please contact [support@bespoke.co.uk](mailto:support@bespoke.co.uk).

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
