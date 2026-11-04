const express = require('express');
const cors = require('cors');
const exec = require('yt-dlp-exec');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Please enter a URL.' });
  }

  try {
    const output = await exec(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      format: 'best',
    });

    const downloadUrl = output.url || (output.formats && output.formats[output.formats.length - 1]?.url);
    const title = output.title || 'facebook_video';

    if (!downloadUrl) {
      return res.status(400).json({ error: 'Could not extract raw video download URL.' });
    }

    return res.json({ title, downloadUrl });
  } catch (err) {
    console.error('Extraction Error:', err.stderr || err.message);
    return res.status(500).json({ error: 'Failed to process Facebook link. Ensure the video is public.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});