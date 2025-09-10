import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import https from 'https'
import mp3Duration from 'mp3-duration'
import id3 from 'node-id3'
import dotenv from 'dotenv'
dotenv.config()

const args = process.argv.slice(2)
const episodeNumber = args[0]
const paddedEpisodeNumber = episodeNumber.toString().padStart(3, '0')

const filename = `${paddedEpisodeNumber}.mp3`

const tags = id3.read(filename)
const title = tags.title || `${episodeNumber} - TODO title`
const summary = tags.comment.text

const stats = fs.statSync(filename)
const length = stats.size;
let duration = null

await mp3Duration(filename, function (err, seconds) {
  if (err) return console.log(err.message)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  if (hours > 0) {
    duration = `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    duration = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
})

const pubDate = new Date().toUTCString().replace('GMT', '+0000')

const content = `---
layout: episode
guid: ${uuidv4()}
title: "${title}"
published: "${pubDate}"
permalink: ${episodeNumber}/index.html
file: "${paddedEpisodeNumber}.mp3"
length: ${length}
duration: ${duration}
summary: "${summary}"
episodeNumber: ${episodeNumber}
---`

fs.writeFile(`episodes/${paddedEpisodeNumber}.md`, content, function (err) {
    if (err) throw err;
    console.log(`Created episode ${paddedEpisodeNumber} successfully.`);
})

const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = BASE_HOSTNAME;
const STORAGE_ZONE_NAME = process.env.BUNNY_ZONE;
const FILENAME_TO_UPLOAD = filename;
const FILE_PATH = filename;
const ACCESS_KEY = process.env.BUNNY_KEY;

const uploadFile = async () => {
  const readStream = fs.createReadStream(FILE_PATH);

  const options = {
    method: 'PUT',
    host: HOSTNAME,
    path: `/${STORAGE_ZONE_NAME}/${FILENAME_TO_UPLOAD}`,
    headers: {
      AccessKey: ACCESS_KEY,
      'Content-Type': 'application/octet-stream',
    },
  };

  const req = https.request(options, (res) => {
    res.on('data', (chunk) => {
      console.log(chunk.toString('utf8'));
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  readStream.pipe(req);
};

await uploadFile()

console.log('File uploaded')