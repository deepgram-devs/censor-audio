const fs = require('fs');
const { exec } = require('child_process');
const { Deepgram } = require('@deepgram/sdk');
const profanities = require('profane-words');
const ffmpegStatic = require('ffmpeg-static');

const deepgram = new Deepgram(process.env.DG_KEY);

async function main() {
	try {
		const transcript = await deepgram.transcription.preRecorded({ buffer: fs.readFileSync('./input.m4a'), mimetype: 'audio/m4a' });
		const words = transcript.results.channels[0].alternatives[0].words;

		const bleeps = words.filter(word => profanities.find(w => word.word == w));

		const noBleeps = [{ start: 0, end: bleeps[0].start }];
		for (let i = 0; i < bleeps.length; i++) {
			if (i < bleeps.length - 1) {
				noBleeps.push({ start: bleeps[i].end, end: bleeps[i + 1].start });
			} else {
				noBleeps.push({ start: bleeps[i].end });
			}
		}

		const filter = [
			`[0]volume=0:enable='${bleeps.map(b => `between(t,${b.start},${b.end})`).join('+')}'[dippedVocals]`,
			'sine=d=5:f=800,pan=stereo|FL=c0|FR=c0[constantBleep]',
			`[constantBleep]atrim=start=0:end=${noBleeps[noBleeps.length - 1].start}[shortenedBleep]`,
			`[shortenedBleep]volume=0:enable='${noBleeps
				.slice(0, -1)
				.map(b => `between(t,${b.start},${b.end})`)
				.join('+')}'[dippedBleep]`,
			'[dippedVocals][dippedBleep]amix=inputs=2',
		].join(';');

		exec(`${ffmpegStatic} -y -i dirty.m4a -filter_complex "${filter}" output.wav`);
	} catch (error) {
		console.log({ error });
	}
}

main();
