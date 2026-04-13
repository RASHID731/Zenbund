### Description
A mobile-first marketplace built **exclusively for students** to buy, sell, and connect within their university ecosystem.

The app provides a **verified, campus-only platform** where students can discover local offers, chat securely, and engage in community discussions.
Each user is verified through their university email, ensuring trust and authenticity. The interface is fast, social, and student-friendly — combining simple listings, 1-on-1 messaging, and Reddit-style community threads.

---

## Tech Stack

**Frontend Mobile:** React Native (Expo), Tamagui, TypeScript
**Backend:** Java (Spring Boot) with RESTful APIs
**Database:** PostgreSQL with Hibernate ORM
**Data Schema:** 9 tables (see `data-tables.json` for complete data model)

---

## Features

**Authentication & Profiles:**
- User registration and login with JWT token-based authentication
- Profile creation with name, bio, profile picture, university, major, and year
- Optional Instagram link integration
- Edit profile: Update name, bio, profile picture, university info, major, year, Instagram link
- Account deletion with password confirmation

**Marketplace:**
- Create listings with multiple images, title, price, category, pickup location, and description
- Category system: Dorm, Fashion, School, Hobbies with emoji icons
- Listing detail view with full information and seller profile
- Mark listings as available or sold
- Edit and delete your own listings
- Filter offers by category and price range
- Sort by: Most Recent, Price (Low to High), Price (High to Low), Most Wishlisted
- Paginated listings (page, limit, sortBy, sortDirection, minPrice, maxPrice)
- Image upload from camera or gallery with automatic compression (max 1200px, JPEG 0.8)
- Wishlist count displayed on each listing (popularity indicator)

**Wishlist:**
- Save and remove favourite listings
- View all saved items in one place
- Quick access to wishlisted item details
- See how many other users wishlisted each item

**Messaging:**
- 1-on-1 real-time chat via WebSockets (STOMP)
- Chat list showing all conversations
- Message timestamps
- Edit and delete sent messages (with `editedAt` tracking)
- Typing indicators via WebSocket events
- Start chat directly from listing detail page

**Community Threads:**
- Browse and discover community threads
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

---

#### **Database Schema**
9 core tables defined in `data-tables.json`:
- **User:** Authentication, profile info, university verification
- **Offer:** Marketplace listings with images, details, and wishlist count
- **Category:** Predefined categories with emojis
- **Thread:** Community discussion groups
- **ThreadMember:** Thread membership with per-thread anonymity preference
- **Comment:** Threaded comments with nested replies and immutable anonymity status
- **Chat:** 1-on-1 conversations between users
- **Message:** Individual messages within chats with edit timestamp support
- **Wishlist:** Saved listings per user

#### **Future Features**
- **Payments:** Stripe Checkout integration for secure in-app transactions
- **Push Notifications:** Message and activity notifications via Expo Notifications
- **Followers/Following:** Social graph, user following system
- **User Reviews & Ratings:** Post-transaction reputation system
- **Read Receipts:** Message seen/delivered tracking
- **Password Change:** Account security settings
- **Notifications Page:** Centralized activity feed for all interactions
- **AI Recommendations:** Personalized offer suggestions based on browsing history
- **Multi-Campus Network:** Isolated communities per university with cross-campus discovery
- **Admin Dashboard:** Web-based moderation tools for content management

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

### Bottom Tabs

1. **Home 🏠**
    - **Category Buttons:** Quick browse by Dorm, Fashion, School, and Hobbies
        - Each category has distinct color scheme and emoji icon
        - Tap to filter listings by that category
    - **Sorting Dropdown:** Sort by Most Recent, Price: Low to High, Price: High to Low, Most Wishlisted
    - **Filter Button:** Opens advanced filtering modal
        - Filter by price range
        - Filter by multiple categories
    - **Listings Grid:** 2-column grid of available offers
    - **Listing Cards:** Display product image, title, price, and wishlist count
    - **Tap Card:** Opens listing detail modal

2. **Search 🔍**
    - **Search Bar:** Real-time search across all listings
    - **Results Display:** Grid view matching home screen style
    - **Empty State:** Helpful prompts when no results found

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
- **Listing Information:**
    - Item title, price, category badge, pickup location
    - Full description text
    - Wishlist count (e.g., "❤️ 12 people wishlisted this")
- **Seller Section:**
    - Seller avatar and name
    - Tap to view seller's profile and all their listings
- **Action Buttons:**
    - **Wishlist Button:** Heart icon, filled when saved, shows count
    - **Chat Seller Button:** Primary action, opens chat

**Sell Modal:**
- Opens from navbar Sell button
- **Photo Section:**
    - Add up to 10 photos
    - Take photo with camera or select from gallery
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
- **Message List:**
    - Scrollable conversation history
    - Own messages aligned right, other user's aligned left
    - Timestamps below messages
    - Edit and delete on sent messages
- **Message Input:**
    - Text input field at bottom
    - Send button (enabled when text entered)
- **Real-time:** WebSocket connection for instant delivery
- **Typing Indicator:** Shows when the other user is typing

### Additional Screens

**Edit Profile:**
- Opens from "Edit Profile" button on profile tab
- **Editable Fields:**
    - Profile picture (tap to change)
    - Name, Bio (max 200 characters)
    - University, Major
    - Year (Freshman, Sophomore, Junior, Senior, Graduate)
    - Instagram link

**Settings:**
- Opens from settings button on profile tab
- Account deletion with password confirmation
- UI toggles for notifications and dark mode (persistence coming in future)

**Chats List:**
- Shows all active conversations
- **Chat Preview Items:**
    - Other user's avatar and name
    - Last message preview (truncated)
    - Timestamp of last message
    - Tap to open conversation
- **Empty State:** Prompt to browse listings and start chatting

**Wishlist Screen:**
- Grid view of all saved listings
- Same card style as home screen
- **Remove:** Swipe or long-press to remove
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
- `expo-image-manipulator` - Image compression and optimization
- `expo-secure-store` - Encrypted JWT token storage
- `axios` - HTTP client for API communication
- `socket.io-client` - WebSocket client for real-time messaging
- TypeScript - Type safety and developer experience

**Backend:**
- Spring Boot - REST API framework
- Spring Security - Authentication and authorization
- Spring Data JPA - Database ORM
- Hibernate - Object-relational mapping
- PostgreSQL Driver - Database connectivity
- Spring WebSocket (STOMP) - Real-time messaging
- BCrypt - Password hashing
- JWT - Token-based authentication
- Cloudinary SDK - Cloud image storage and optimization
