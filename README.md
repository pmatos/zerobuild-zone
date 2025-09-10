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

### Automated Episode Creation (Recommended)

Use the automated script to create episodes from MP3 files:

```bash
node scripts/new.js <episode-number>
```

**Prerequisites:**
1. **Environment setup**: Create a `.env` file in the root directory with:
   ```bash
   BUNNY_ZONE=your-bunny-storage-zone-name
   BUNNY_KEY=your-bunny-cdn-access-key
   ```

2. **MP3 file preparation**: 
   - Name your MP3 file as `001.mp3`, `002.mp3`, etc. (padded with zeros)
   - Add ID3 tags to your MP3:
     - **Title**: Episode title (e.g., "Welcome to Zero Build Zone")
     - **Comment**: Episode summary/description
   - Place the MP3 file in the project root directory

**Usage example:**
```bash
# For episode 3, ensure you have 003.mp3 in the root directory
node scripts/new.js 3
```

**What the script does:**
1. Reads MP3 metadata (title, summary) from ID3 tags
2. Calculates file size and duration automatically
3. Generates episode frontmatter with GUID and publish date
4. Creates the episode markdown file in `episodes/`
5. Uploads the MP3 file to your Bunny CDN storage
6. Files are uploaded to the root of your CDN (matches current URL structure)

**Dependencies:**
The script requires these npm packages (already included in package.json):
- `uuid` - for generating unique episode GUIDs
- `mp3-duration` - for calculating MP3 duration
- `node-id3` - for reading MP3 metadata
- `dotenv` - for environment variable management

### Manual Episode Creation

If you prefer manual control, create a new markdown file in the `episodes/` directory with the format `XXX.md` (e.g., `001.md`, `002.md`).

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
├── assets/
│   ├── css/             # Stylesheets
│   ├── img/             # Images and logos
│   │   └── zero-build-zone-logo.svg  # Main podcast logo
│   └── favicon.ico      # Site icon
├── episodes/            # Episode markdown files
├── transcripts/         # Optional transcript files
├── .eleventy.js         # Eleventy configuration
├── feed.njk             # RSS feed template
├── index.njk            # Homepage
└── episodes.njk         # Episode listing page
```

## 🎨 Logo and Artwork

The podcast logo is located at `assets/img/zero-build-zone-logo.svg`. 

**Note for RSS Feed Compatibility:** Some podcast platforms prefer PNG/JPG formats. If needed, create PNG versions:
- `assets/img/zero-build-zone-logo-large.png` (1400x1400px minimum for iTunes)
- `assets/img/zero-build-zone-logo-small.png` (300x300px for embeds)

Then update `_data/podcast.json` to reference the PNG files if RSS compatibility issues arise.

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

### TODO: Enhanced RSS Feed Optimizations

**High Impact Enhancements:**
- [ ] `<podcast:transcript>` - Link existing transcript files directly in RSS
- [ ] `<podcast:person>` - Detailed host/guest information with roles
- [ ] Enhanced episode descriptions with HTML formatting support
- [ ] `<podcast:funding>` - Donation/support links (if monetization planned)

**Medium Impact Enhancements:**
- [ ] `<podcast:chapters>` - Chapter markers from transcript timestamps
- [ ] Season/series organization with `<podcast:season>` tags
- [ ] Individual episode artwork support with episode-specific images
- [ ] `<podcast:medium>` - Content type specification (podcast vs audiobook)

**Low Priority Enhancements:**
- [ ] `<podcast:value>` - Value4Value/Bitcoin support integration
- [ ] `<podcast:location>` - Geographic data for location-based discovery
- [ ] Advanced content ratings and advisory tags
- [ ] `<podcast:complete>` - Mark podcast completion status
- [ ] Episode-level blocking controls with `<itunes:block>`

**Current RSS Strengths (Already Implemented):**
- ✅ iTunes namespace with comprehensive metadata
- ✅ Podcast Index namespace foundation
- ✅ Apple Podcasts verification tags
- ✅ Proper RSS 2.0 structure with enclosures
- ✅ Dublin Core metadata integration

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

### Using Automated Script (`scripts/new.js`)

1. ✅ Prepare MP3 file with proper naming (`001.mp3`, `002.mp3`, etc.)
2. ✅ Add ID3 tags (title and comment) to MP3 file
3. ✅ Run `node scripts/new.js <episode-number>`
4. ✅ Add episode content/show notes to generated markdown file
5. ✅ Include transcript (optional)
6. ✅ Test locally with `npm start`
7. ✅ Push to main branch for deployment

### Using Manual Process

1. ✅ Upload MP3 to bunny.net
2. ✅ Create episode markdown file in `episodes/`
3. ✅ Fill in all required frontmatter fields
4. ✅ Add episode content/show notes
5. ✅ Include transcript (optional)
6. ✅ Test locally with `npm start`
7. ✅ Push to main branch for deployment

The episode will automatically appear on the website and in the RSS feed!