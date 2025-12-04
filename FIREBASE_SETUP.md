# Firebase Setup Guide

## What's Been Done ✅

1. **Firebase Configuration**
   - Environment variables set up in `.env.local`
   - Firebase SDK initialized in `lib/firebase/config.ts`
   - Authentication, Firestore, and Storage configured

2. **Authentication Integration**
   - Sign-up page integrated with Firebase Auth ([app/sign-up/page.tsx](app/sign-up/page.tsx))
   - Sign-in page integrated with Firebase Auth ([app/sign-in/page.tsx](app/sign-in/page.tsx))
   - AuthContext provider created to manage user state ([lib/context/AuthContext.tsx](lib/context/AuthContext.tsx))
   - User data stored in Firestore `users` collection

3. **Utility Functions Created**
   - **Auth utilities** ([lib/firebase/auth.ts](lib/firebase/auth.ts)):
     - `registerUser()`, `loginUser()`, `logoutUser()`, `resetPassword()`, `getCurrentUser()`

   - **Firestore utilities** ([lib/firebase/firestore.ts](lib/firebase/firestore.ts)):
     - `addDocument()`, `getDocument()`, `getDocuments()`, `updateDocument()`, `deleteDocument()`

   - **Storage utilities** ([lib/firebase/storage.ts](lib/firebase/storage.ts)):
     - `uploadFile()`, `uploadFileWithProgress()`, `getFileURL()`, `deleteFile()`

---

## What You Need to Do in Firebase Console 🔧

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **unipool-910a3**
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password** authentication
5. (Optional) Enable other providers like Google, Facebook, etc.

### 2. Create Firestore Database
1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** or **Test mode** (recommended for development)
4. Select a location (choose closest to your users)
5. Click **Enable**

**Recommended Firestore Structure:**
```
users/
  {userId}/
    - name: string
    - email: string
    - universityId: string
    - phone: string
    - role: "driver" | "rider" | null
    - createdAt: timestamp
    - profilePicture: string (URL)
    - rating: number

rides/
  {rideId}/
    - driverId: string
    - driverName: string
    - from: string
    - to: string
    - date: timestamp
    - availableSeats: number
    - price: number
    - status: "available" | "in_progress" | "completed" | "cancelled"
    - passengers: array of userId

chats/
  {chatId}/
    - participants: array of userId
    - lastMessage: string
    - lastMessageTime: timestamp

    messages/ (subcollection)
      {messageId}/
        - senderId: string
        - text: string
        - timestamp: timestamp

notifications/
  {userId}/
    {notificationId}/
      - type: string
      - message: string
      - read: boolean
      - timestamp: timestamp
```

### 3. Set Up Firestore Security Rules
Go to **Firestore Database** > **Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Rides collection
    match /rides/{rideId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.driverId;
    }

    // Chats collection
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;

      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }

    // Notifications collection
    match /notifications/{userId}/{notificationId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### 4. Enable Storage
1. Navigate to **Storage**
2. Click **Get started**
3. Choose **Production mode** or **Test mode**
4. Select a location
5. Click **Done**

### 5. Set Up Storage Security Rules
Go to **Storage** > **Rules** and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## Testing the Integration

1. **Install dependencies** (if not already):
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Test Sign-up**:
   - Go to `http://localhost:3000/sign-up`
   - Create a new account
   - Check Firebase Console > Authentication to see the new user
   - Check Firestore > users collection for user data

4. **Test Sign-in**:
   - Go to `http://localhost:3000/sign-in`
   - Login with the account you created
   - You should be redirected to `/role-selection`

---

## Next Steps for Full Integration

### Pages That Need Firebase Integration:

1. **Profile Page** ([app/profile/page.tsx](app/profile/page.tsx))
   - Fetch and display user data from Firestore
   - Allow profile picture upload to Storage

2. **Driver/Rider Pages** ([app/driver/page.tsx](app/driver/page.tsx), [app/rider/page.tsx](app/rider/page.tsx))
   - Create and fetch rides from Firestore
   - Real-time updates for ride status

3. **Chat Page** ([app/chat/page.tsx](app/chat/page.tsx))
   - Implement real-time messaging using Firestore

4. **Notifications** ([app/notifications/page.tsx](app/notifications/page.tsx))
   - Fetch notifications from Firestore
   - Mark as read functionality

5. **Ratings** ([app/ratings/page.tsx](app/ratings/page.tsx))
   - Store and fetch ratings in Firestore

6. **Role Selection** ([app/role-selection/page.tsx](app/role-selection/page.tsx))
   - Update user role in Firestore

---

## Important Notes

- ⚠️ **Never commit `.env.local`** - It's already in `.gitignore`
- 🔒 **Security Rules**: Start with test mode, then tighten security rules for production
- 📊 **Firestore Indexes**: You may need to create indexes for complex queries
- 💰 **Firebase Pricing**: Monitor usage to stay within free tier limits

---

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Firebase Console for authentication/database errors
3. Verify environment variables are loaded correctly