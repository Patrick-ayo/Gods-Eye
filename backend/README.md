# Backend Firebase Setup

All Firebase-related files are now managed in the backend folder for security and organization. This includes:
- firebase.js (Firebase Admin SDK initialization)
- serviceAccountKey.json (Service account credentials)
- firebase.json (Firebase project config)
- .firebaserc (Firebase project alias/config)

## Setup
1. Place your serviceAccountKey.json in this folder (do NOT commit it to version control).
2. Ensure firebase.js uses the correct path for serviceAccountKey.json.
3. All backend Firebase logic should import from ./firebase.js.
4. Do not use Firebase SDK in the frontend for authentication or sensitive operations. 