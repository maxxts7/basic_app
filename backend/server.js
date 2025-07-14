const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : url;
}

function parseVTTToTranscript(vttContent) {
  const lines = vttContent.split('\n');
  const transcript = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for timestamp lines
    if (line.includes('-->')) {
      const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}\.\d{3})/);
      if (timeMatch) {
        const startTime = timeMatch[1];
        const endTime = timeMatch[2];
        
        // Get the text content from the next lines
        let textContent = '';
        let j = i + 1;
        while (j < lines.length && lines[j].trim() !== '' && !lines[j].includes('-->')) {
          let text = lines[j].trim();
          
          // Remove VTT formatting tags
          text = text.replace(/<[^>]*>/g, '');
          text = text.replace(/\d{2}:\d{2}:\d{2}\.\d{3}/g, '');
          text = text.replace(/<c[^>]*>/g, '').replace(/<\/c>/g, '');
          
          if (text) {
            textContent += text + ' ';
          }
          j++;
        }
        
        if (textContent.trim()) {
          const startSeconds = timeToSeconds(startTime);
          const endSeconds = timeToSeconds(endTime);
          
          transcript.push({
            text: textContent.trim(),
            start: startSeconds,
            duration: endSeconds - startSeconds
          });
        }
      }
    }
  }
  
  return transcript;
}

function timeToSeconds(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(':');
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
}

app.post('/api/transcript', async (req, res) => {
  try {
    const { videoUrl } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    const videoId = extractVideoId(videoUrl);
    console.log(`Fetching transcript for video ID: ${videoId}`);

    const outputFile = path.join(__dirname, `transcript_${videoId}`);
    const vttFile = `${outputFile}.en.vtt`;
    
    // Use yt-dlp to fetch transcript
    const ytdlp = spawn('yt-dlp', [
      '--write-auto-sub',
      '--skip-download',
      '--sub-format', 'vtt',
      '--sub-lang', 'en',
      '-o', outputFile,
      `https://www.youtube.com/watch?v=${videoId}`
    ]);

    let stderr = '';
    
    ytdlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0) {
        // Check if VTT file exists
        if (fs.existsSync(vttFile)) {
          try {
            const vttContent = fs.readFileSync(vttFile, 'utf8');
            const transcript = parseVTTToTranscript(vttContent);
            
            // Clean up the file
            fs.unlinkSync(vttFile);
            
            res.json({
              success: true,
              videoId,
              transcript
            });
          } catch (parseError) {
            console.error('Error parsing VTT:', parseError);
            res.status(500).json({ 
              error: 'Failed to parse transcript',
              message: parseError.message 
            });
          }
        } else {
          res.status(404).json({ 
            error: 'No transcript available for this video',
            message: 'The video may not have captions or subtitles enabled'
          });
        }
      } else {
        console.error('yt-dlp failed:', stderr);
        res.status(500).json({ 
          error: 'Failed to fetch transcript',
          message: 'Could not download transcript from YouTube'
        });
      }
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transcript',
      message: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});