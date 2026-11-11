# MovieVerse — Endterm Project

## Project title and topic
**MovieVerse — Movie Information, Ratings, Trailers & Reviews**

The endterm project extends our midterm website (same topic and structure) with interactivity built with **JavaScript and jQuery**.

## Group members
- Student 1 — Almadi Askhat
- Student 2 — Amina Toleugazinova
- Student 3 — Saida Amirgaliyeva

## Short description
MovieVerse is a multi-page responsive movie website that provides movie information, audience ratings, trailer previews and community reviews. In the endterm stage we added client-side form validation, real-time search and filtering, a dynamic ratings table with full CRUD operations, and an image gallery with a lightbox. All midterm requirements (HTML5, CSS, Bootstrap, responsiveness) remain intact.

## Pages
1. Home — `index.html`
2. Movies — `movies.html` (search + category filter)
3. Ratings — `ratings.html` (CRUD table)
4. Trailers — `trailers.html`
5. Reviews — `reviews.html`
6. Gallery — `gallery.html` (new, lightbox)
7. Register — `register.html` (new, validated form)

## Features implemented

### Midterm features (kept)
- 5 connected pages with a navigation bar on every page
- Semantic HTML5, CSS Flexbox/Grid, CSS variables, hover/focus states, media queries
- Bootstrap 5 navbar, grid, buttons, spacing and form utilities
- Movie cards, ratings table, trailer cards, community reviews

### Endterm features
1. **Form validation** (`register.html`)
   - Required-field checks for name, email, password and message
   - Email format check using a Regular Expression
   - Password strength indicator (Weak / Medium / Strong) with a colored bar
   - Password confirmation check
   - Real-time feedback (✔ / ✘ messages and green/red borders) via jQuery events
   - Submission is blocked while any field is invalid; a Bootstrap alert explains what to fix
2. **Dynamic search and filter** (`movies.html`)
   - Live search as the user types (`input`/`keyup`), case-insensitive
   - Category buttons (All, Action, Fantasy, Drama, History, Romance, Thriller, Horror, Sci-Fi)
   - Search and category filter work together; result counter and "no results" message
3. **Dynamic table with CRUD** (`ratings.html`)
   - **Create:** "Add movie" opens a Bootstrap modal form
   - **Read:** table is rendered dynamically from a JavaScript array
   - **Update:** "Edit" opens the same modal pre-filled with the record
   - **Delete:** confirmation modal before removal
   - Input validation in the modal; data is kept in `localStorage`; "Reset data" restores the original list
4. **Image gallery** (`gallery.html`)
   - Responsive Bootstrap grid of movie posters with hover zoom
   - Lightbox with previous/next arrows, keyboard control (←, →, Esc) and image counter
   - Smooth jQuery `.fadeIn()` / `.fadeOut()` transitions

## Technologies used
- HTML5
- CSS3
- Bootstrap 5.3
- JavaScript (ES6)
- jQuery 3.7
- Google Fonts (Inter)
- Git and GitHub, GitHub Pages

## Project structure
```
index.html, movies.html, ratings.html, trailers.html,
reviews.html, gallery.html, register.html
css/style.css
js/script.js
images/   videos/
```

## Individual contribution
- **Student 1 — Almadi Askhat:** Registration form and validation (RegEx, password strength, confirmation), navigation updates, README
- **Student 2 — Amina Toleugazinova:** Real-time search and category filter on the Movies page, Image gallery with lightbox and jQuery effects
- **Student 3 — Saida Amirgaliyeva:** Ratings table with CRUD (modals, delete confirmation, localStorage), responsive and visual testing
- **All members:** Code review, testing, merging and publishing the website

## Published website
https://gloshf.github.io/MovieVerse-WEB/

## Repository
https://github.com/gloshf/MovieVerse-WEB
