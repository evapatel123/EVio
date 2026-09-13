# EVio — Your AI College Guide
EVio is a framework-free student success and college exploration platform built with **HTML, CSS, JavaScript, and
Node.js**.
EVio is designed to help students explore majors, research colleges, organize their academic goals, prepare
college applications, discover resources, and track their progress throughout the college-planning process.
The application uses a lightweight Node.js backend with JSON-based persistent storage. No frontend framework or
external database is required. 
**NOTE : IF YOU WANT TO VIEW WHAT IT LOOKS LIKE, GO TO THE SCREENSHOTS FOLDER**
> **Important:** The EVio chatbot is intentionally NOT handled by the Node.js backend. It is loaded separately
through an iframe and can be connected to an existing Gradio/Hugging Face chatbot.
---
## Features
### Dashboard
The dashboard provides a centralized view of the student's progress.
It includes:
- Application progress
- Study goals
- Explore Score
- Recommended next steps
- Tasks
- Academic schedule
- Major exploration progress
- College exploration progress
- Application story progress
- Personalized recommendations
Dashboard statistics are calculated from backend data rather than being hard-coded.
---
## Major Advisor
EVio includes an interactive Major Advisor assessment.
The major recommendation system contains:
- **506 questions**
- A randomized question selection system
- Server-side scoring
- Multiple major profiles
- Tag-based interest and preference matching
- Top 5 major recommendations
- Match percentages
- Saved quiz results
The question bank is stored in:
```text
data/major-questions.json
```
Major profiles are stored in:
```text
data/major-profiles.json
```
The quiz results are saved to the backend.
---
## College Fit
The College Fit feature allows students to evaluate what they want from a college.
Students can provide preferences involving factors such as:
- College size
- Location
- Cost
- Campus culture
- Academic programs
The backend calculates and stores the resulting College Fit score.
---
## Application Progress
EVio contains a complete college application checklist.
The checklist includes tasks involving:
- College research
- Application accounts
- Activities
- Honors
- Recommendation letters
- Personal statements
- Supplemental essays
- Academics
- Financial aid
- Scholarships
- Application review
- Submission
Every checklist item is stored in the backend.
The application progress percentage is calculated automatically based on completed checklist items.
---
## Study Goals
Students can configure their own:
- Daily study goal
- Weekly study goal
Students can also log study hours.
The backend calculates:
- Daily hours
- Weekly hours
- Daily progress percentage
- Weekly progress percentage
Study activity also contributes to the Explore Score.
---
## Explore Score
EVio tracks exploration activity across multiple categories:
- Major exploration
- College exploration
- Application exploration
- Resources
- Planning
The Explore Score is calculated from actual backend activity.
Completing activities such as the Major Advisor, College Fit assessment, and Application Story contributes to the
student's exploration progress.
---
## Application Story
The Application Story feature helps students reflect on their experiences and build a stronger application
narrative.
Students provide information about:
- Experiences
- Growth
- Impact
- Future goals
The backend validates and stores the completed story.
Completing the Application Story also contributes to the Explore Score.
---
# Settings
EVio's Settings section is fully connected to the backend.
Settings are saved to:
```text
data/evio-data.json
```
## Appearance
EVio supports multiple appearance themes and customization options.
The appearance settings include:
- Theme
- Glow intensity
- Card style
- Interface density
- Font size
- Background effects
- Reduce motion
- Reduce transparency
- Reduce flashing effects
Theme and appearance changes are persisted by the backend.
---
## AI Behavior
Users can customize how EVio's AI guidance should behave.
Available settings include:
- Guidance style
- Explanation depth
- Hints before solutions
- Personalized guidance
- Proactive suggestions
- Confidence indicators
These settings are stored by the backend.
---
## Accessibility
EVio includes accessibility preferences such as:
- Larger text
- High contrast
- Strong focus indicators
- Screen-reader optimized interface
- Reduced motion
- Reduced transparency
- Reduced flashing
- Notification preferences
Accessibility settings are persisted so they remain available when the application is reopened.
---
# Chatbot
The EVio chatbot is intentionally separate from the Node.js backend.
The chatbot is loaded through an iframe.
To connect your chatbot:
Open:
```text
script.js
```
At the top of the file, find:
```javascript
const CHATBOT_URL = "PASTE_YOUR_CHATBOT_URL_HERE";
```
Replace it with the URL of your deployed chatbot.
For example:
```javascript
const CHATBOT_URL = "https://your-chatbot-url";
```
Do NOT add the chatbot backend to this Node.js server.
The EVio website will automatically load the chatbot inside the existing iframe when a valid URL is provided.
---
# Project Structure
The project should have the following structure:
```text
evio_website/
■
■■■ index.html
■■■ style.css
■■■ script.js
■■■ server.js
■■■ package.json
■■■ README.md
■
■■■ assets/
■ ■■■ evio-logo.svg
■ ■■■ evio-banner.svg
■
■■■ data/
 ■■■ evio-data.json
 ■■■ major-profiles.json
 ■■■ major-questions.json
```
### `index.html`
Contains the EVio application interface.
### `style.css`
Contains the complete visual styling, including:
- Dark green theme
- Pink accents
- Glassmorphism
- Cards
- Animations
- Responsive layouts
- Accessibility styling
- Dashboard styling
### `script.js`
Contains the frontend application logic.
It communicates with the Node.js backend using API requests.
It also handles the external chatbot iframe.
### `server.js`
Contains the Node.js backend.
The server:
- Serves the website
- Provides API endpoints
- Reads and writes application data
- Calculates progress
- Calculates study statistics
- Calculates Explore Score
- Processes Major Advisor results
- Stores settings
- Stores tasks
- Stores application progress
- Stores College Fit results
- Stores Application Story results
### `data/evio-data.json`
Contains persistent application data.
This includes:
- Profile
- Settings
- Tasks
- Schedule
- Goals
- Study data
- Application checklist
- Explore activity
- College Fit results
- Application Story
- Quiz results
- Resources
### `data/major-questions.json`
Contains the 506-question Major Advisor question bank.
### `data/major-profiles.json`
Contains the major profiles used by the server-side recommendation system.
### `assets/evio-logo.svg`
EVio's recreated SVG logo.
### `assets/evio-banner.svg`
EVio's recreated SVG banner.
---
# Requirements
Before running EVio, install:
- Node.js 18 or newer
- Git
- A web browser
No additional database software is required.
No Python installation is required.
No React installation is required.
No external npm packages are required.
---
# Running EVio Locally
## Step 1 — Install Node.js
Download and install Node.js from the official Node.js website.
After installation, open a terminal and verify that Node.js is installed:
```bash
node --version
```
You should see a version number such as:
```text
v18.x.x
```
or newer.
Also verify npm:
```bash
npm --version
```
---
# Step 2 — Clone the GitHub Repository
Open a terminal.
Navigate to the folder where you want to store the project.
For example:
```bash
cd Desktop
```
Clone the repository:
```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```
Replace:
```text
YOUR_GITHUB_REPOSITORY_URL
```
with the URL of your EVio GitHub repository.
For example:
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```
Then enter the repository:
```bash
cd YOUR-REPOSITORY
```
---
# Step 3 — Locate the EVio Application
The `package.json` file must be in the same directory as:
```text
server.js
index.html
script.js
style.css
```
For example:
```text
YOUR-REPOSITORY/
■■■ evio_website/
 ■■■ package.json
 ■■■ server.js
 ■■■ index.html
 ■■■ script.js
 ■■■ style.css
 ■■■ assets/
 ■■■ data/
```
If the EVio application is inside the `evio_website` folder, enter it:
```bash
cd evio_website
```
You can verify that you are in the correct directory by running:
### Windows Command Prompt
```cmd
dir
```
### macOS/Linux
```bash
ls
```
You should see:
```text
index.html
style.css
script.js
server.js
package.json
assets
data
```
---
# Step 4 — Install Dependencies
EVio currently has no external npm dependencies.
Therefore, you do not need to install additional packages.
However, running the following command is safe:
```bash
npm install
```
This ensures npm has initialized the local project environment based on `package.json`.
---
# Step 5 — Start the EVio Backend
From the directory containing `server.js`, run:
```bash
npm start
```
You should see a message similar to:
```text
EVio running at http://localhost:3000
```
---
# Step 6 — Open EVio
Open your web browser and go to:
```text
http://localhost:3000
```
**Do NOT open `index.html` directly by double-clicking it.**
Use:
```text
http://localhost:3000
```
because the frontend communicates with the Node.js backend through API endpoints.
---
# Step 7 — Verify the Backend
You can verify that the backend is running by opening:
```text
http://localhost:3000/api/health
```
You should receive a response similar to:
```json
{
 "ok": true,
 "service": "EVio backend",
 "chatbot": "external iframe"
}
```
If you receive this response, the backend is running correctly.
---
# Backend API
The EVio frontend communicates with the backend using REST-style API endpoints.
## General State
```text
GET /api/state
```
Returns the main application state.
---
## Dashboard
```text
GET /api/dashboard
```
Returns:
- Application progress
- Study progress
- Explore Score
- Tasks
- Recommendations
- College Fit status
- Application Story status
---
## Profile
Get profile:
```text
GET /api/profile
```
Update profile:
```text
PUT /api/profile
```
---
## Settings
Update settings:
```text
PUT /api/settings
```
Settings are persisted to the JSON database.
---
# Tasks API
Get tasks:
```text
GET /api/tasks
```
Create a task:
```text
POST /api/tasks
```
Update a task:
```text
PATCH /api/tasks/:id
```
Delete a task:
```text
DELETE /api/tasks/:id
```
---
# Academic Schedule API
Get schedule:
```text
GET /api/schedule
```
Create a schedule item:
```text
POST /api/schedule
```
Delete a schedule item:
```text
DELETE /api/schedule/:id
```
---
# Study Goals API
Get study statistics:
```text
GET /api/study
```
Update study goals:
```text
PUT /api/study
```
Log study time:
```text
POST /api/study/log
```
The backend calculates daily and weekly progress automatically.
---
# Application Progress API
Get the application checklist:
```text
GET /api/application
```
Update an application step:
```text
PATCH /api/application/:id
```
Reset the application checklist:
```text
POST /api/application/reset
```
The application percentage is calculated automatically from completed steps.
---
# Explore Score API
Get the current Explore Score:
```text
GET /api/explore
```
Record an exploration event:
```text
POST /api/explore/event
```
Complete the College Fit assessment:
```text
POST /api/explore/college-fit
```
Complete the Application Story:
```text
POST /api/explore/application-story
```
---
# Major Advisor API
Get questions:
```text
GET /api/quiz/questions
```
The endpoint returns a randomized selection from the 506-question bank.
You can optionally specify the number of questions:
```text
/api/quiz/questions?count=24
```
Submit quiz results:
```text
POST /api/quiz/results
```
Get previous quiz results:
```text
GET /api/quiz/results
```
Major recommendations are calculated on the server.
---
# Resources API
Get available resources:
```text
GET /api/resources
```
---
# Data Storage
EVio currently uses:
```text
data/evio-data.json
```
as its persistent data store.
This is intentionally simple and is appropriate for the current prototype.
The application does not require:
- MongoDB
- PostgreSQL
- MySQL
- Firebase
- Supabase
The backend reads and writes the JSON file directly.
---
# Important GitHub Note
Because user data is stored in:
```text
data/evio-data.json
```
You should decide whether this file should be committed to GitHub. For a development or demo repository, you can keep the initial example data. For a real multi-user deployment, the JSON storage system should eventually be replaced with a proper database andauthentication system. Do NOT commit private user information or sensitive personal data to GitHub.
---
# Stopping the Server
To stop the EVio server, return to the terminal where it is running and press:
```text
Ctrl + C
```
The server will stop.
---
# Restarting EVio
Whenever you want to run EVio again:
```bash
cd YOUR-REPOSITORY
cd evio_website
npm start
```
Then open:
```text
http://localhost:3000
```
---
# Troubleshooting
## `node` is not recognized
If you see an error such as:
```text
'node' is not recognized as an internal or external command
```
Node.js is either not installed or is not available in your PATH.
Install Node.js and restart your terminal.
Then run:
```bash
node --version
```
---
## Port 3000 is already in use
If another application is using port 3000, start EVio using another port.
### Windows Command Prompt
```cmd
set PORT=3001 && npm start
```
### Windows PowerShell
```powershell
$env:PORT=3001; npm start
```
Then open:
```text
http://localhost:3001
```
---
## The website loads but data does not update
Make sure you started EVio with:
```bash
npm start
```
Do not open:
```text
index.html
```
directly.
The application needs the Node.js server for its API endpoints.
---
## The chatbot does not appear
Open:
```text
script.js
```
Find:
```javascript
const CHATBOT_URL = "PASTE_YOUR_CHATBOT_URL_HERE";
```
Replace the placeholder with your deployed chatbot URL.
Then restart the server and refresh the browser.
---
## Settings do not persist
Make sure the server has permission to write to:
```text
data/evio-data.json
```
The backend uses this file to persist settings and application data.
---
## Major Advisor questions are missing
Make sure this file exists:
```text
data/major-questions.json
```
The backend expects the question bank to be present.
Also make sure:
```text
data/major-profiles.json
```
exists because the server uses it to calculate major recommendations.
---
# Development Workflow
When making changes:
1. Edit the appropriate file.
2. Save the file.
3. If you changed frontend files, refresh the browser.
4. If you changed `server.js`, restart the Node.js server.
5. Test the relevant feature.
6. Check the backend API if necessary.
7. Commit the changes to Git.
8. Push the changes to GitHub.
Example:
```bash
git status
git add .
git commit -m "Update EVio functionality"
git push
```
---
# GitHub Setup
After cloning and testing the project locally, push the EVio files to your repository.
From the repository directory:
```bash
git status
```
Add the files:
```bash
git add .
```
Commit them:
```bash
git commit -m "Add EVio application and backend"
```
Push them:
```bash
git push origin main
```
If your repository uses a different branch, replace `main` with the appropriate branch name.
---
# Deployment
The EVio application is a Node.js application because the backend needs to run.
Therefore, do not deploy it as a simple static GitHub Pages website if you want the backend functionality to work.
The deployment platform must support running a Node.js server.
The deployed application needs to run:
```bash
npm start
```
The server uses the hosting provider's `PORT` environment variable when available.
The server contains:
```javascript
const PORT = process.env.PORT || 3000;
```
so it can use the hosting platform's assigned port.
---
# Chatbot Deployment
The chatbot remains independent from EVio.
The recommended architecture is:
```text
 EVio Website
 |
 +----------+----------+
 | |
 v v
 EVio Node Backend External Chatbot
 | |
 v v
 JSON Application Data Gradio/Hugging Face
```
EVio's Node backend handles:
- Settings
- Tasks
- Goals
- Application progress
- Study tracking
- Explore Score
- Major Advisor
- College Fit
- Application Story
- Resources
- Dashboard data
The external chatbot handles:
- AI conversations
- Chatbot-specific backend
- Chatbot knowledge/RAG
- AI model processing
The chatbot is displayed inside EVio through an iframe.
---
# Technology
EVio intentionally uses a simple technology stack.
### Frontend
- HTML
- CSS
- Vanilla JavaScript
- SVG
### Backend
- Node.js
- Node.js built-in `http` module
- JSON file storage
### AI
- External chatbot
- Gradio/Hugging Face deployment
- Loaded through iframe
### No Framework Requirement
EVio does not require:
- React
- Next.js
- Vue
- Angular
- Express
- Tailwind
- Python
- MongoDB
- Firebase
---
# Current Project Status
EVio currently provides a functional prototype containing:
- Responsive dashboard
- Major Advisor
- 506-question major assessment
- Major recommendation scoring
- College Fit
- Application Story
- Application checklist
- Application progress calculation
- Daily study goals
- Weekly study goals
- Study-hour logging
- Explore Score
- Explore recommendations
- Task management
- Academic schedule
- Resource hub
- Persistent settings
- Multiple appearance themes
- Accessibility preferences
- AI behavior preferences
- External chatbot iframe
- Persistent JSON backend
---
# License

**EVio is proprietary software. All rights reserved.**

The source code is publicly available for viewing and reference only. You may **not** use, copy, modify, distribute, reproduce, deploy, host, sublicense, sell, or create derivative works from this project without explicit written permission from the copyright holder.

See the [`LICENSE`](./LICENSE) file for the complete terms.

Copyright © 2026 Eva J Patel. All Rights Reserved.
