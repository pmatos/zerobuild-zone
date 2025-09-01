# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zero Build Zone is a Fortnite gaming podcast website built with Eleventy (11ty) that generates a complete podcast site with RSS feed, episode pages, and platform links. The site directs users to Apple Podcasts and Spotify exclusively - no audio players or RSS subscription buttons are included on the website itself.

## Build and Development Commands

- **Development server**: `npm start` (serves at http://localhost:8080)
- **Production build**: `npm run build` (outputs to `_site/`)
- **Clean build**: The build script automatically cleans `_site/*` before rebuilding

## Architecture Overview

### Static Site Generation
- **Framework**: Eleventy 3.x with Nunjucks templating
- **Content**: Episodes stored as Markdown files in `episodes/` directory
- **Data**: Global data in `_data/` (podcast metadata, platform links)
- **Templates**: Reusable layouts in `_includes/`
- **Assets**: Static files in `assets/` (CSS, images, favicon)

### Content Structure
- **Episodes**: Each episode is a `.md` file with frontmatter containing metadata (title, duration, audioUrl, etc.)
- **RSS Feed**: Auto-generated from episode collection at `/feed.xml`
- **Pagination**: Homepage shows 5 latest episodes with full content for first episode, summaries for others
- **Platform Integration**: Subscribe buttons link to Apple Podcasts and Spotify only

### Key Collections and Filters
- `episodes` collection: All episodes sorted by publish date (newest first)
- `dateForEpisode`: Formats dates for display
- `limit`: Limits array results for pagination
- `rfc822Date`: RFC 822 date formatting for RSS
- `xmlEscape`: Escapes content for XML feeds
- `collectionLastUpdatedDate`: Gets latest episode date for RSS

## Episode Management

### Episode Frontmatter Requirements
```yaml
---
title: "Episode Title"
layout: episode
episodeNumber: 1
published: "2025-01-01T10:00:00.000Z"
duration: "15:30" 
summary: "Brief description"
audioUrl: "https://zerobuild-zone.b-cdn.net/Episode1.mp3"
length: 14850000
guid: "zbz-001"
---
```

### Audio Hosting
- Episodes are hosted on bunny.net CDN
- RSS feed includes proper enclosure tags pointing to MP3 files
- Website contains NO audio players - users are directed to streaming platforms

## Template System

### Layout Hierarchy
- `base.njk`: Main layout with header, navigation, subscribe buttons
- `episode.njk`: Individual episode pages
- `embed.njk`: Embed pages with platform links only

### Key Template Features
- Platform subscribe buttons (Apple Podcasts, Spotify) 
- No RSS feed subscription options on website
- Social media metadata (Open Graph, Twitter Cards)
- RSS feed discovery via `<link rel="alternate">`

## Data Configuration

### `_data/podcast.json`
Contains podcast metadata including title, description, author, image URLs, RSS configuration, and technical fields like webMaster, managingEditor, TTL.

### `_data/services.json` 
Array of platform links (Apple Podcasts, Spotify) with colors and URLs for subscribe buttons.

## RSS Feed Enhancement
The RSS feed includes comprehensive podcast namespace support:
- iTunes tags for Apple Podcasts compatibility
- Podcast Index namespace tags
- Dublin Core metadata
- Atom feed links
- Technical metadata (TTL, managing editor, webmaster)

## Deployment

- **Platform**: Netlify with automatic deployment
- **Trigger**: Pushes to `main` branch
- **Build Command**: `npm run build`
- **Publish Directory**: `_site`
- **Domain**: https://zerobuild.zone

## File Structure Specifics

### Critical Files for Episode Management
- `episodes/*.md`: Episode content and metadata
- `feed.njk`: RSS feed generation template
- `index.njk`: Homepage with episode previews
- `episode-pagination.njk`: Paginated episode listings

### Content Strategy
- Homepage shows latest 5 episodes
- First episode shows full content, others show summaries only
- No audio players anywhere on site
- Subscribe buttons direct to external platforms only
- RSS feed available for podcast directories but not promoted to users