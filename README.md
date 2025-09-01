# Zero Build Zone Podcast Website

A static podcast website built with [Eleventy (11ty)](https://www.11ty.dev/) that generates a complete podcast site with RSS feed, episode pages, and platform links.

## 🚀 Quick Start

```bash
npm install
npm start
```

Visit `http://localhost:8080` to see your site.

## 📦 Deployment

The site automatically deploys to Netlify when you push to the `main` branch.

### Automatic Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `_site`
4. Push your changes to the `main` branch
5. Netlify will automatically build and deploy the site
6. Your site will be available at https://zerobuild.zone

### Netlify Setup
1. Go to [Netlify](https://netlify.com) and connect your GitHub account
2. Click "New site from Git" and select your `zerobuild-zone` repository
3. Netlify will auto-detect the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `_site`
   - Node version: 20
4. Add your custom domain `zerobuild.zone` in Netlify's domain settings
5. Netlify will handle SSL certificates automatically

### Manual Deployment
```bash
npm run build
```

The built site will be in the `_site` directory.

## 🎙️ Adding Episodes

### Episode Information
Create a new markdown file in the `episodes/` directory with the format `XXX.md` (e.g., `001.md`, `002.md`).

**Episode frontmatter format:**
```yaml
---
title: "Your Episode Title"
episodeNumber: 1
published: "2024-01-01T10:00:00.000Z"
duration: "15:30"
summary: "Brief episode description for listings"
audioUrl: "https://your-bunny-net-url.com/episodes/001.mp3"
length: 14850000
guid: "zbz-001"
---

Your episode content/show notes go here in markdown format.

## Topics Covered
- Topic 1
- Topic 2

## Links
- [Example Link](https://example.com)
```

**Required fields:**
- `title`: Episode title
- `episodeNumber`: Sequential episode number
- `published`: Publication date in ISO format
- `duration`: Episode length in MM:SS or HH:MM:SS format
- `summary`: Brief description for podcast listings
- `audioUrl`: Full URL to MP3 file on bunny.net
- `length`: File size in bytes
- `guid`: Unique identifier for the episode (e.g., "zbz-XXX")

### 🔊 MP3 Files

**Location:** Upload your MP3 files to bunny.net

1. Upload your episode MP3 to your bunny.net storage
2. Get the public URL for the file
3. Use this URL as the `audioUrl` in your episode frontmatter

**Example bunny.net URL structure:**
```
https://your-bunny-storage.b-cdn.net/episodes/001.mp3
```

### 📝 Transcripts

**Location:** Include transcripts directly in the episode markdown file

Add your transcript in the markdown content section of your episode file:

```markdown
---
title: "Episode Title"
# ... other frontmatter
---

Episode description and show notes here.

## Transcript

**Host:** Welcome to Zero Build Zone...

**Guest:** Thanks for having me...

[Continue with full transcript]
```

**Alternative:** Create a separate transcript file in the `transcripts/` directory:

```
transcripts/
├── 001.md
├── 002.md
└── 003.md
```

Then link to it from your episode:
```markdown
[Full Transcript](https://zerobuild.zone/transcripts/001/)
```

## 📂 Project Structure

```
├── _data/
│   ├── podcast.json     # Podcast metadata
│   └── services.json    # Platform links (Spotify, Apple, etc.)
├── _includes/
│   ├── base.njk         # Base template
│   ├── episode.njk      # Individual episode template
│   └── embed.njk        # Embed player template
├── assets/              # CSS, images, fonts
├── episodes/            # Episode markdown files
├── transcripts/         # Optional transcript files
├── .eleventy.js         # Eleventy configuration
├── feed.njk             # RSS feed template
├── index.njk            # Homepage
└── episodes.njk         # Episode listing page
```

## ⚙️ Configuration

### Podcast Settings
Edit `_data/podcast.json` to update:
- Podcast title and description
- Author information
- Cover art URLs
- Website URL
- Keywords

### Platform Links
Edit `_data/services.json` to update podcast platform links:
- Spotify
- Apple Podcasts
- RSS feed

## 🔗 RSS Feed

The RSS feed is automatically generated at `/feed.xml` and includes:
- iTunes-compatible metadata
- Episode enclosures pointing to bunny.net MP3 files
- Proper episode numbering and descriptions

## 🛠️ Development

### Local Development
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Dependencies
- Node.js (version specified in `.nvmrc`)
- Eleventy 3.x
- Various utilities for RSS generation and date formatting

## 📋 Episode Checklist

When adding a new episode:

1. ✅ Upload MP3 to bunny.net
2. ✅ Create episode markdown file in `episodes/`
3. ✅ Fill in all required frontmatter fields
4. ✅ Add episode content/show notes
5. ✅ Include transcript (optional)
6. ✅ Test locally with `npm start`
7. ✅ Push to main branch for deployment

The episode will automatically appear on the website and in the RSS feed!