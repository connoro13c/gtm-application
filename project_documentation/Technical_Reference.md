# Technical Reference

## 1. Common Commands
-------------------

### Build

-   **Frontend:** `npm run build`

-   **Backend:** `npm run build`

### Test

-   **Run Tests:** `npm run test`

-   **Watch Mode:** `npm run test:watch`

### Lint

-   **Lint Checks:** `npm run lint`

-   **Auto-fix Lint Issues:** `npm run lint:fix`

* * * * *

## 2. Code Conventions & Patterns Specific to Project
---------------------------------------------------

-   Use **functional components** for React development.

-   Utilize **hooks** over class-based state management.

-   Keep **component files organized** by feature or page.

-   Adopt **single-responsibility principle (SRP)** for components and services.

-   Follow a clear **naming convention:**

    -   Components: `PascalCase` (e.g., `UserList`)

    -   Utility and helpers: `camelCase` (e.g., `fetchUserData`)

-   Always provide **inline documentation/comments** for complex logic.

-   Keep styles encapsulated using **Tailwind CSS**.

* * * * *

## 3. Tech Stack and Environment Documentation
--------------------------------------------

### 3a. Frontend Tech Stack

-   **Framework:** React

-   **Styling:** Tailwind CSS

-   **UI Components:** shadcn/ui

-   **Animations:** Framer Motion

-   **State Management:** Zustand

-   **Charts & Visualizations:** Recharts

### 3b. Backend Tech Stack

-   **Framework:** Node.js with Express.js

-   **Database:** PostgreSQL

-   **ORM:** Prisma

-   **Authentication:** Auth0 or JWT

-   **ML Models:** Python, scikit-learn, RandomForest, XGBoost

### 3c. Environment Variables Documentation

-   **Frontend:**

    -   `REACT_APP_API_URL`: URL for API endpoints

    -   `REACT_APP_AUTH0_DOMAIN`: Auth0 authentication domain

    -   `REACT_APP_AUTH0_CLIENT_ID`: Auth0 Client ID

-   **Backend:**

    -   `DATABASE_URL`: Connection string for PostgreSQL

    -   `JWT_SECRET`: Secret key for JWT authentication

    -   `AUTH0_CLIENT_SECRET`: Client secret for Auth0 integration

    -   `NODE_ENV`: Environment indicator (development, test, production)

* * * * *

## 4. Authentication Flow Documentation
-------------------------------------

-   **Auth Provider:** Auth0 or JWT

-   **Login Flow:**

    1.  User visits login page.

    2.  Authenticates via Auth0.

    3.  Receives JWT token upon successful authentication.

    4.  Token stored securely in local storage or cookies.

-   **Session Validation:**

    -   Validate JWT token on every protected API request.

    -   Redirect to login if token invalid or expired.

* * * * *

## 5. API Documentation & Endpoints
---------------------------------

-   **GET /accounts** - Retrieves list of accounts.

-   **POST /accounts/score** - Initiates scoring via selected ML model.

-   **GET /accounts/:id** - Fetch details for a specific account.

-   **PUT /accounts/:id** - Updates account information.

-   **GET /territories** - Retrieves all territory data.

-   **POST /territories/calculate** - Recalculates territory assignments.

-   **GET /segments** - Retrieves current segmentation.