const escape = require('lodash.escape')
const rfc822Date = require('rfc822-date')
const fs = require('fs')

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets")

    eleventyConfig.addCollection("episodes", function(collection) {
        return collection.getFilteredByGlob("episodes/**/*.md").sort((a, b) => {
            return new Date(b.data.published).getTime() - new Date(a.data.published).getTime()
        })
    })

    eleventyConfig.addFilter('dateForEpisode', function(date) {
        return new Date(date).toISOString().split('T')[0]
    })

    // ISO date for sitemap
    eleventyConfig.addFilter('isoDate', function(date) {
        return new Date(date).toISOString()
    })

    eleventyConfig.addFilter("limit", function(array, limit) {
        return array.slice(0, limit)
    })

    // https://www.marclittlemore.com/create-an-eleventy-podcast-feed/
    // RSS
    eleventyConfig.addFilter('rfc822Date', (dateValue) => {
        return rfc822Date(dateValue);
    });

    // Escape characters for XML feed
    eleventyConfig.addFilter('xmlEscape', (value) => {
        return escape(value);
    });

    // Newest date in the collection
    eleventyConfig.addFilter('collectionLastUpdatedDate', (collection) => {
        const date = Math.max(...collection.map((item) => {
            return new Date(item.data.published).getTime()
        }))

        return rfc822Date(new Date(date))
    });

    // Process transcript file into formatted HTML
    eleventyConfig.addFilter('processTranscript', (transcriptPath) => {
        if (!transcriptPath) return '';
        
        try {
            // Resolve path from project root
            const path = require('path');
            const fullPath = path.resolve(transcriptPath);
            const transcriptContent = fs.readFileSync(fullPath, 'utf8');
            const lines = transcriptContent.split('\n');
            const speakers = {
                'RapidRaven880': 'speaker-rapidraven',
                'MatosPT': 'speaker-matospt'
            };
            
            let html = '<div class="transcript-content">';
            
            for (let line of lines) {
                line = line.trim();
                if (!line) continue;
                
                // Skip markdown headers
                if (line.startsWith('#')) continue;
                
                // Parse markdown format: "**RapidRaven880:** Welcome to episode two..."
                const markdownMatch = line.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
                if (markdownMatch) {
                    const [, speaker, content] = markdownMatch;
                    const speakerClass = speakers[speaker] || 'speaker-unknown';
                    html += `<div class="transcript-line">`;
                    html += `<span class="transcript-speaker ${speakerClass}">[${speaker}]</span>`;
                    html += `</div>`;
                    
                    // Process the content for actions like [laughs], strikethrough, etc.
                    let processedContent = content;
                    
                    // Handle strikethrough text (~~text~~)
                    processedContent = processedContent.replace(/~~([^~]+)~~/g, '<del>$1</del>');
                    
                    // Handle timestamps [00:00:00]
                    processedContent = processedContent.replace(/\[(\d{2}:\d{2}:\d{2})\]/g, '<span class="transcript-timestamp">[$1]</span>');
                    
                    if (processedContent === '[laughs]' || processedContent === '[clears throat]') {
                        html += `<div class="transcript-action">${escape(processedContent)}</div>`;
                    } else {
                        html += `<div class="transcript-text">${processedContent}</div>`;
                    }
                    continue;
                }
                
                // Parse legacy timestamp format: "00:00:11,640 --> 00:00:19,120 [RapidRaven880]"
                const timestampMatch = line.match(/^(\d{2}:\d{2}:\d{2},\d{3}) --> \d{2}:\d{2}:\d{2},\d{3} \[([^\]]+)\]$/);
                if (timestampMatch) {
                    const [, timestamp, speaker] = timestampMatch;
                    const speakerClass = speakers[speaker] || 'speaker-unknown';
                    html += `<div class="transcript-line">`;
                    html += `<span class="transcript-timestamp">${timestamp}</span> `;
                    html += `<span class="transcript-speaker ${speakerClass}">[${speaker}]</span>`;
                    html += `</div>`;
                } else {
                    // This is the actual spoken content for legacy format
                    if (line !== '[laughs]' && line !== '[clears throat]') {
                        html += `<div class="transcript-text">${escape(line)}</div>`;
                    } else {
                        html += `<div class="transcript-action">${escape(line)}</div>`;
                    }
                }
            }
            
            html += '</div>';
            return html;
        } catch (error) {
            return `<p>Error loading transcript: ${error.message}</p>`;
        }
    });
}
