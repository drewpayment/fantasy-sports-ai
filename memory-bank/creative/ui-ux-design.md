# UI/UX Design

## Color Palette

- **Primary:** #1A202C (Dark Blue/Gray)
- **Secondary:** #2D3748 (Slightly Lighter Blue/Gray)
- **Accent:** #4A5568 (Gray)
- **Highlight:** #63B3ED (Light Blue)
- **Text:** #FFFFFF (White)

## Typography

- **Headings:** Inter, Bold
- **Body:** Inter, Regular

## Key Pages and Components

### 1. Dashboard/Home Page
- **Purpose:** Provide an overview of the user's leagues and upcoming events.
- **Components:**
  - `Header`: With navigation and user profile.
  - `LeagueList`: A card-based list of the user's leagues.
  - `UpcomingDrafts`: A section showing upcoming drafts.
  - `RecentNews`: A feed of recent fantasy football news.

### 2. League Settings Page
- **Purpose:** Allow users to create and edit their league settings.
- **Components:**
  - `LeagueSettingsForm`: A form with tabs for different setting categories (e.g., General, Scoring, Rosters).
  - `SaveSettingsButton`: A button to save the settings.

### 3. Players Page
- **Purpose:** Display a list of all available players.
- **Components:**
  - `PlayerTable`: A sortable and filterable table of players.
  - `SearchBar`: To search for players by name.
  - `FilterDropdowns`: For filtering by position, team, etc.
  - `PlayerDetailModal`: A modal that shows more information about a player when clicked.

### 4. Teams Page
- **Purpose:** Allow users to view and manage the teams in their league.
- **Components:**
  - `TeamGrid`: A grid of cards, each representing a team.
  - `AddTeamButton`: To add a new team to the league.
  - `EditTeamModal`: A modal for editing a team's name and owner.

### 5. Draft Room Page
- **Purpose:** The main interface for the fantasy draft.
- **Components:**
  - `DraftBoard`: A grid showing the draft picks for each team.
  - `PlayerQueue`: A list of players the user is interested in drafting.
  - `DraftChat`: A chat window for league members.
  - `AI-Assistant`: A chat interface to interact with the Vercel AI for draft advice.
