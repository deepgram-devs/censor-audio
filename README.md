# Censor Profanity with Node.js

This is a barebones project which automatically censors audio based on transcripts from [Deepgram](http://deepgram.com)'s AI Speech Recognition API.

## Setup

```
git clone https://github.com/deepgram-devs/censor-audio.git
cd censor-audio
npm install
```

Set your `DG_KEY` environment variable or replace `process.env.DG_KEY` with your key.

## Usage

Replace the filename on line 11 and run with:

```
node index.js
```
