const GetFileData = require('./utils.js');
const AudioBufferToWav = require('./../node_modules/audiobuffer-to-wav/index.js');

const sampleRate = 16000;

function ExtractWAV(file, infoFunc) {
    const info = (msg) => {
        if (infoFunc !== undefined) {
            infoFunc(msg);
        }
    };
    return new Promise(function (done, failed) {
        GetFileData(file).then(data => {
            info('Start copy audio');
            var audioContext = new (window.AudioContext || window.webkitAudioContext)(({ sampleRate: sampleRate }));
            audioContext.decodeAudioData(data).then(decodedAudioData => {
                info('Prepare file');
                var wav = AudioBufferToWav(decodedAudioData)
                var newFile = new Blob([wav], { type: "wav", name: "audio.wav" })
                console.log("nf", newFile);
                info("Done");
                done(newFile);
            }).catch(err => failed(err));
        }).catch(err => failed(err));
    })
}

module.exports = ExtractWAV;
