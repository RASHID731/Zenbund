### Description
A mobile-first marketplace built **exclusively for students** to buy, sell, and connect within their university ecosystem.

The app provides a **verified, campus-only platform** where students can discover local offers, chat securely, and engage in community discussions.
Each user is verified through their university email, ensuring trust and authenticity. The interface is fast, social, and student-friendly — combining simple listings, 1-on-1 messaging, and Reddit-style community threads.

---

## Tech Stack

**Frontend Mobile:** React Native (Expo), Tamagui, TypeScript
**Frontend Web:** React, Next.js, Shadcn
**Backend:** Java (Spring Boot) with RESTful APIs
**Database:** PostgreSQL with Hibernate ORM
**Data Schema:** 9 tables (see `data-tables.json` for complete data model)

---

## Features

#### **MVP Features**

**Authentication & Profiles:**
- User registration and login with university email verification
- Profile creation with name, bio, profile picture, university, major, and year
- Optional Instagram link integration
- Profile statistics: listings count, followers, and following
- Edit profile: Update name, bio, profile picture, university info, major, year, Instagram link
- Settings page: Change password, email preferences, privacy settings, notification preferences, account deletion

**Marketplace:**
- Create listings with multiple images, title, price, category, pickup location, and description
- Category system: Dorm, Fashion, School, Hobbies with emoji icons
- Listing detail view with full information and seller profile
- Mark listings as available or sold
- Edit and delete your own listings
- Search functionality with real-time results
- Filter offers by category, price range, and keywords
- Sort by: Most Recent, Price (Low to High), Price (High to Low), Most Wishlisted
- Image upload from camera or gallery
- Automatic image compression and optimization
- Wishlist count displayed on each listing (popularity indicator)

**Wishlist:**
- Save favorite listings for later
- View all saved items in one place
- Remove items from wishlist
- Quick access to wishlisted item details
- See how many other users wishlisted each item

**Messaging:**
- 1-on-1 chat between buyers and sellers
- Chat list showing all conversations
- Unread message indicators
- Message timestamps
- Start chat directly from listing detail page

**Community Threads:**
- Browse and discover community threads (Study Group, Gaming Club, Art Society, Fitness Group, etc.)
- Join and leave threads with anonymous posting preference per thread
- View member counts and thread descriptions
- Reddit-style comment system with nested replies
- Like comments and view like counts
- Reply to comments with full threading support
- Per-thread anonymity setting: Choose to post anonymously when joining each thread
- Change anonymity preference anytime in thread settings
- Once posted, comments maintain their anonymity status (immutable for privacy)
- User avatars and names displayed on comments (or "Anonymous" based on preference)
- Comment timestamps

**Notifications:**
- Push notifications for new messages
- In-app notification badge on chat icon
- Activity notifications for wishlisted items

**Data & Performance:**
- Offline data caching
- Fast image loading with lazy loading
- Smooth animations and transitions
- Dark mode support

#### **Database Schema**
9 core tables defined in `data-tables.json`:
- **User:** Authentication, profile info, university verification, relationships to offers and wishlisted items
- **Offer:** Marketplace listings with images, details, and wishlist count for popularity tracking
- **Category:** Predefined categories with emojis
- **Thread:** Community discussion groups
- **ThreadMember:** Many-to-many relationship for thread membership with per-thread anonymity preference
- **Comment:** Threaded comments with nested replies and immutable anonymity status
- **Chat:** 1-on-1 conversations between users
- **Message:** Individual messages within chats
- **Wishlist:** Saved listings for each user

#### **Future Features (Post-MVP)**
- **Payments:** Stripe Checkout integration for secure in-app transactions
- **Email Notifications:** Transaction confirmations and important updates
- **Social Features:** User reviews, ratings, following system, share listings
- **Notifications Page:** Centralized activity feed for all interactions
- **AI Recommendations:** Personalized offer suggestions based on browsing history
- **Multi-Campus Network:** Isolated communities per university with cross-campus discovery
- **Sponsored Posts:** Advertisement blocks in community feed for monetization
- **User Badges:** Reputation and achievement system for active members
- **Admin Dashboard:** Web-based moderation tools for content management
- **Advanced Analytics:** User insights and marketplace trends
- **Real-time message:** Delivery via WebSockets

---

## App Layout

### Navbar (Displayed on Home, Search, Community, Profile tabs)

- **Sell Button ➕** (Left):
    - Opens modal to create a new listing
	- Upload photos from camera or gallery
	- Form fields: Title, Price, Category, Pickup Location, Description
	- Input validation and error handling
	- Warns before discarding unsaved changes
- **"Zenbund" Text** (Center):
	- App branding displayed prominently in center
	- Consistent across all main tabs
- **Chat Icon 💬** (Right):
	- Direct access to messaging screen
	- Red notification badge shows unread message count
	- Badge disappears when all messages are read

### Bottom Tabs

1. **Home 🏠**
    - **Category Buttons:** Quick browse by Dorm, Fashion, School, and Hobbies
        - Each category has distinct color scheme and emoji icon
        - Tap to filter listings by that category
    - **Sorting Dropdown:** Sort by Most Recent, Price: Low to High, Price: High to Low, Most Wishlisted
    - **Filter Button:** Opens advanced filtering modal
        - Filter by price range
        - Filter by multiple categories
        - Filter by keywords
    - **Listings Grid:** 2-column grid of available offers
    - **Listing Cards:** Display product image, title, price, and wishlist count
    - **Tap Card:** Opens listing detail modal

2. **Search 🔍**
    - **Search Bar:** Real-time search across all listings
    - **Search by:** Title, description, category keywords
    - **Results Display:** Grid view matching home screen style
    - **Empty State:** Helpful prompts when no results found
    - **Recent Searches:** Quick access to previous search queries

3. **Community 💬**
    - **Thread Discovery Section:**
        - Browse all available community threads
        - Thread cards show: emoji, name, member count, description
        - **Join Button:** Opens dialog with anonymity preference
            - "Post anonymously in this thread?" toggle
            - Explanation of immutable anonymity (once posted, comments stay that way)
            - Confirm to join with selected preference
        - **Leave Button:** Confirm dialog before leaving
        - Visual indicator for joined threads
    - **"Go to Threads" Button:**
        - Appears when user has joined at least one thread
        - Opens threads page with user's joined threads
    - **Threads Page:**
        - Pill-shaped tabs for switching between joined threads
        - Horizontal scrollable tab bar
        - Active thread highlighted
        - **Thread Settings:** (accessible via menu icon)
            - Change anonymity preference for this thread
            - Note: Only affects future comments, not existing ones
            - Leave thread option
        - **Comment Feed:**
            - Reddit-style threaded discussions
            - User avatars and names (or "Anonymous" based on comment's immutable status)
            - Comment text with full formatting
            - Like button with count
            - Reply button with reply count
            - Nested replies with visual indentation
            - Timestamps (e.g., "2h ago")
        - **Post Comment:**
            - Text input at bottom
            - Indicator showing "Posting as [Your Name]" or "Posting as Anonymous"
            - Post button

4. **Profile 👤**
    - **Profile Header:**
        - Profile picture (large circular avatar)
        - Username
        - University name
    - **Stats Row:**
        - Listings count
        - Followers count
        - Following count
        - Each stat is tappable for detailed view
    - **About Section:**
        - Bio text
        - Major and year
        - Instagram link (if provided)
    - **Edit Profile Button:** Opens edit profile screen
    - **Settings Button:** Access app settings
    - **My Listings:**
        - Grid of user's active offers
        - Shows listing images, title, price
        - Tap to view/edit
        - Badge showing "Sold" status when applicable

### Modal Screens

**Listing Detail Modal:**
- Slides up from bottom when tapping a listing
- **Image Gallery:**
    - Large image carousel with swipe navigation
    - Dots indicator showing current image
    - Pinch to zoom functionality
- **Listing Information:**
    - Item title (large, bold)
    - Price (prominent, colored)
    - Category badge
    - Pickup location
    - Full description text
    - Wishlist count (e.g., "❤️ 12 people wishlisted this")
- **Seller Section:**
    - Seller avatar and name
    - Tap to view seller's profile
    - See all seller's listings
- **Action Buttons:**
    - **Wishlist Button:** Heart icon, filled when saved, shows count
    - **Chat Seller Button:** Primary action, opens chat

**Sell Modal:**
- Opens from navbar Sell button
- **Header:** Title with close button
- **Photo Section:**
    - Add up to 10 photos
    - Take photo with camera or select from gallery
    - Drag to reorder photos
    - Delete button on each photo
    - Automatic compression before upload
- **Form Fields:**
    - Title (required, max 100 characters)
    - Price (required, numeric input)
    - Category (dropdown selector)
    - Pickup Location (text input)
    - Description (multiline, max 500 characters)
- **Validation:** Real-time error messages
- **Publish Button:** Disabled until required fields filled
- **Discard Warning:** Alert when closing with unsaved changes

**Chat Screen:**
- Opens from chat icon or "Chat Seller" button
- **Header:**
    - Back button
    - Other user's name and avatar
    - Tap to view their profile
- **Message List:**
    - Scrollable conversation history
    - Messages grouped by date
    - Own messages aligned right (colored)
    - Other user's messages aligned left (gray)
    - Timestamps below messages
    - Read receipts (seen/delivered)
- **Message Input:**
    - Text input field at bottom
    - Send button (enabled when text entered)
- **Real-time:** WebSocket connection for instant delivery
- **Scroll to Bottom:** Button appears when scrolled up

### Additional Screens

**Edit Profile:**
- Opens from "Edit Profile" button on profile tab
- **Header:** Title with back and save buttons
- **Editable Fields:**
    - Profile picture (tap to change)
    - Name (text input)
    - Bio (multiline, max 200 characters)
    - University (dropdown with verified universities)
    - Major (text input)
    - Year (dropdown: Freshman, Sophomore, Junior, Senior, Graduate)
    - Instagram link (text input, validated URL format)
- **Save Button:** Updates profile and returns to profile tab
- **Cancel Button:** Discards changes with confirmation dialog

**Settings:**
- Opens from settings button on profile tab
- **Header:** Title with back button
- **Account Section:**
    - Change Password
    - Email Preferences
    - University Verification Status
- **Privacy Section:**
    - Profile Visibility (Public / University Only)
    - Show Instagram Link (toggle)
    - Show Year (toggle)
    - Show Major (toggle)
- **Notifications Section:**
    - Push Notifications (toggle)
    - Message Notifications (toggle)
    - Thread Activity (toggle)
    - Wishlist Updates (toggle)
- **App Section:**
    - Dark Mode (toggle)
    - Language Selection
    - About Zenbund
    - Terms of Service
    - Privacy Policy
- **Danger Zone:**
    - Logout (confirmation dialog)
    - Delete Account (double confirmation with password)

**Chats List:**
- Shows all active conversations
- **Chat Preview Items:**
    - Other user's avatar and name
    - Last message preview (truncated)
    - Timestamp of last message
    - Unread badge count
    - Tap to open conversation
- **Empty State:** Prompt to browse listings and start chatting
- **Swipe Actions:** Archive or delete conversation

**Wishlist Screen:**
- Grid view of all saved listings
- Same card style as home screen
- **Remove Button:** Swipe or long-press to remove
- **Tap Card:** Opens listing detail
- **Empty State:** Encouragement to explore and save items

---

### **Key Dependencies**

**Frontend (Mobile):**
- `tamagui` - UI component library with theming
- `expo-router` - File-based navigation system
- `lucide-react-native` - Icon library
- `react-native-safe-area-context` - Safe area handling
- `@expo-google-fonts/dm-sans` - Custom typography
- `expo-camera` - Camera access for photo capture
- `expo-image-picker` - Gallery photo selection
- `expo-notifications` - Push notification handling
- `expo-image-manipulator` - Image compression and optimization
- `zustand` - Global state management
- `axios` - HTTP client for API communication
- `socket.io-client` - WebSocket client for real-time messaging
- TypeScript - Type safety and developer experience

**Backend:**
- Spring Boot - REST API framework
- Spring Security - Authentication and authorization
- Spring Data JPA - Database ORM
- Hibernate - Object-relational mapping
- PostgreSQL Driver - Database connectivity
- Spring WebSocket - Real-time messaging support
- BCrypt - Password hashing
- JWT - Token-based authentication
- AWS SDK / Firebase Admin SDK - Cloud storage integration
**Development Tools:**
- ESLint & Prettier - Code formatting
- Jest & React Native Testing Library - Unit testing
- Detox - End-to-end testing
- Expo Dev Client - Custom development builds

---

## Development Notes

### Current Implementation Status

**API Integration:**
- Backend API connection established (http://localhost:8080/api)
- Offers fetching implemented (GET /api/offers)
- Offer creation with image upload implemented (POST /api/offers)
- Image compression and validation in place (max 10 images, 1200px width, JPEG 0.8 quality)

**Error Handling - Future Improvements:**
The current implementation uses simple Alert dialogs for error feedback. The following enhancements are planned for future iterations:

- **Loading States:** Add loading spinners and skeleton screens during data fetching
- **Retry Logic:** Implement automatic retry mechanisms for failed network requests
- **Network Error Handling:** Better offline detection and graceful degradation
- **Validation Feedback:** Real-time inline validation for form fields
- **Toast Notifications:** Replace alerts with non-intrusive toast messages
- **Error Boundaries:** React error boundaries for catching and displaying component errors
- **Progress Indicators:** Show upload progress percentage for image uploads
- **Optimistic Updates:** Update UI immediately and rollback on failure

These improvements will enhance user experience while maintaining the current functionality.
