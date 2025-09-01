#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RSS_FILE = path.join(__dirname, '..', '_site', 'feed.rss');

function validatePodcastRSS() {
    console.log('🎙️  Validating podcast RSS feed...');
    
    if (!fs.existsSync(RSS_FILE)) {
        console.error('❌ RSS file not found:', RSS_FILE);
        process.exit(1);
    }
    
    const xmlContent = fs.readFileSync(RSS_FILE, 'utf8');
    
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
    });
    
    let parsed;
    try {
        parsed = parser.parse(xmlContent);
    } catch (error) {
        console.error('❌ XML parsing error:', error.message);
        process.exit(1);
    }
    
    const rss = parsed.rss;
    if (!rss) {
        console.error('❌ No RSS root element found');
        process.exit(1);
    }
    
    const channel = rss.channel;
    if (!channel) {
        console.error('❌ No channel element found');
        process.exit(1);
    }
    
    // Required RSS elements
    const requiredElements = [
        'title',
        'description',
        'link',
        'language',
        'pubDate',
        'lastBuildDate'
    ];
    
    for (const element of requiredElements) {
        if (!channel[element]) {
            console.error(`❌ Missing required RSS element: ${element}`);
            process.exit(1);
        }
    }
    
    // Required iTunes elements for podcast
    const requiredItunesElements = [
        'itunes:author',
        'itunes:summary',
        'itunes:image',
        'itunes:category',
        'itunes:owner'
    ];
    
    for (const element of requiredItunesElements) {
        if (!channel[element]) {
            console.error(`❌ Missing required iTunes element: ${element}`);
            process.exit(1);
        }
    }
    
    // Validate iTunes owner
    if (!channel['itunes:owner']['itunes:name'] || !channel['itunes:owner']['itunes:email']) {
        console.error('❌ iTunes owner must have both name and email');
        process.exit(1);
    }
    
    // Validate episodes
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];
    if (!items || items.length === 0) {
        console.error('❌ No episodes found in RSS feed');
        process.exit(1);
    }
    
    items.forEach((item, index) => {
        const requiredItemElements = [
            'title',
            'description',
            'pubDate',
            'guid',
            'enclosure'
        ];
        
        for (const element of requiredItemElements) {
            if (!item[element]) {
                console.error(`❌ Episode ${index + 1}: Missing required element: ${element}`);
                process.exit(1);
            }
        }
        
        // Validate enclosure
        const enclosure = item.enclosure;
        if (!enclosure['@_url'] || !enclosure['@_type'] || !enclosure['@_length']) {
            console.error(`❌ Episode ${index + 1}: Enclosure must have url, type, and length attributes`);
            process.exit(1);
        }
        
        if (enclosure['@_type'] !== 'audio/mpeg') {
            console.error(`❌ Episode ${index + 1}: Enclosure type should be audio/mpeg, got: ${enclosure['@_type']}`);
            process.exit(1);
        }
    });
    
    console.log(`✅ RSS feed validation passed!`);
    console.log(`📊 Found ${items.length} episode(s)`);
    console.log(`📝 Title: ${channel.title}`);
    console.log(`👤 Author: ${channel['itunes:author']}`);
    console.log(`🏷️  Category: ${channel['itunes:category']['@_text']}`);
}

// Run validation if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    validatePodcastRSS();
}

export { validatePodcastRSS };