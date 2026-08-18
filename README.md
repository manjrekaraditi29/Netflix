# NETFIX Enhanced Student Project

A Netflix-style streaming student project built with HTML, CSS and JavaScript, with an optional Node.js + Nodemailer OTP backend.

## What was upgraded
- Account creation now immediately opens the email OTP verification screen.
- Signup OTP and Login OTP are both supported.
- OTP has 5-minute expiry and maximum-attempt protection.
- If Gmail SMTP is not configured, the server automatically uses **Demo OTP mode** so the project still works during a college presentation. The generated OTP is shown on the page.
- Premium streaming-style home page with:
  - Home, Shows, Movies, Games, New & Popular, My List and Browse by Languages navigation
  - Search icon
  - Notification panel
  - Multiple profile switching from the header
  - #1 Movie of Today hero
  - Interstellar official trailer video background
  - Top Searches
  - Top 10 Shows in India Today with large 1–10 numbers
  - Today's Top Picks for You
  - New on NETFIX
  - Familiar Favourites
  - TV Dramas
  - Continue Watching
  - Hindi Movies & TV
  - Exciting Movies
  - Romantic Movies
  - Only on NETFIX
  - Emotional Movies
  - NETFIX Games
  - Browse by Languages
  - Large footer
- Improved profile page with profile switching, plan, preferences, activity links and sign-out.
- My List, watch history, continue watching and profile-specific data remain supported.

## Run
1. Open this folder in VS Code.
2. Open Terminal in this folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000/index.html`.

### Real email OTP
For real email delivery, copy `.env.example` to `.env` and add a Gmail address plus a Google App Password. Do not use your normal Gmail password and never upload `.env` to GitHub.

### Demo OTP
If SMTP is not configured, NETFIX automatically switches to Demo OTP mode. Create an account, click Create Account, and the OTP screen will display the generated six-digit code. Enter it and the account opens the Home page.

## Notes
- The Interstellar hero uses the official Warner Bros. India trailer hosted on YouTube.
- Poster images are loaded remotely for this student/demo project.
- The project is a student-made Netflix-style UI and is not the official Netflix service.
