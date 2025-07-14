# YouTube Transcript Fetcher

A basic web application that fetches transcripts from YouTube videos and displays them in a clean, responsive interface.

## Features

- **Clean Interface**: Simple input form for YouTube URLs or video IDs
- **Real-time Fetching**: Fetches transcripts using yt-dlp for reliable extraction
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error handling for invalid URLs or unavailable transcripts
- **Timestamped Display**: Shows transcript with timestamps for easy navigation
- **Extensible Architecture**: Built with expansion in mind for future features

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **API**: yt-dlp for reliable transcript extraction
- **Styling**: CSS with responsive design

## Project Structure

```
basic_web_app/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── node_modules/
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── ...
│   ├── public/
│   └── node_modules/
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm
- Python 3.x with pip
- yt-dlp (installed via pip)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd basic_web_app
   ```

2. **Install yt-dlp**
   ```bash
   pip install yt-dlp
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend server will run on `http://localhost:3001`

2. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the Application**
   Open your browser and go to `http://localhost:3000`

## Usage

1. Enter a YouTube video URL or video ID in the input field
2. Click "Get Transcript" to fetch the transcript
3. View the transcript with timestamps displayed below

### Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `VIDEO_ID` (just the 11-character video ID)

## API Endpoints

### POST /api/transcript

Fetches the transcript for a given YouTube video.

**Request Body:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "VIDEO_ID",
  "transcript": [
    {
      "text": "Transcript text",
      "start": 0,
      "duration": 1000
    }
  ]
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "Server is running"
}
```

## Future Enhancement Ideas

- **Search Functionality**: Search within transcripts
- **Export Options**: Export transcripts as TXT, PDF, or SRT files
- **Multiple Languages**: Support for different transcript languages
- **Video Information**: Display video title, thumbnail, and metadata
- **Bookmark System**: Save and organize favorite transcripts
- **User Authentication**: User accounts and personal transcript libraries
- **Real-time Updates**: WebSocket integration for live transcript updates
- **Transcript Editing**: Edit and save custom transcript versions

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure both frontend and backend are running on their respective ports
2. **Transcript Not Found**: Some videos may not have transcripts available
3. **Rate Limiting**: YouTube may temporarily block requests if too many are made

### Error Messages

- "Video URL is required" - Make sure to enter a valid YouTube URL
- "Failed to fetch transcript" - The video may not have transcripts available
- "Error connecting to server" - Check if the backend server is running on port 3001

## Dependencies

### Backend
- express: Web framework for Node.js
- cors: Enable CORS for cross-origin requests
- yt-dlp: Reliable YouTube transcript extraction

### Frontend
- react: JavaScript library for building user interfaces
- react-dom: React package for DOM manipulation

## Git Workflow

### Basic Git Commands

```bash
# Check repository status
git status

# Add changes to staging
git add .

# Commit changes
git commit -m "Your commit message"

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branches
git merge feature/new-feature
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch for integration
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical fixes

## License

This project is for educational purposes. YouTube transcript fetching is done through unofficial APIs and should be used responsibly.