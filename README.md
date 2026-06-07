# DEVIL DON OFFICIAL

Premium Next.js + Firebase website for username/password login, manual QR key purchases, subscription activation, APK downloads, and an admin panel.

## Setup

1. Create a Firebase project.
2. Enable Email/Password authentication.
3. Create a Firestore database and Firebase Storage bucket.
4. Copy `.env.example` to `.env.local` and fill in your Firebase web app config.
5. Deploy `firestore.rules` and `storage.rules` from the Firebase console or CLI.
6. Run `npm install`, then `npm run dev`.

## Admin Access

Register a normal account first, then set that user document in Firestore:

```json
{
  "role": "admin",
  "status": "active"
}
```

The admin panel is available at `/admin`.
