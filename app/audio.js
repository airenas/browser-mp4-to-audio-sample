const prettyBytes = require ('./../node_modules/pretty-bytes/index.js');
const audioBufferToWav = require ('./../node_modules/audiobuffer-to-wav/index.js');

var data;
var file;
var newFile;
var sampleRate = 16000;
var working = false;

function save(file) {
    if (file) {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(file);
        a.href = url;
        a.download = "olia";
        a.click();
        document.removeChild(a);
        window.URL.revokeObjectURL(url);
    } else {
        console.log("no file");
    }
}

function setResultAudio(file) {
    var audio = document.getElementById('result');
    audio.src = window.URL.createObjectURL(file);

}

function getBuffer(resolve) {
    var reader = new FileReader();
    reader.onload = function () {
        var arrayBuffer = reader.result;
        resolve(arrayBuffer);
    }
    reader.readAsArrayBuffer(file);
}

function extractWAV() {
    working = true;
    updateControls();
    var audioContext = new (window.AudioContext || window.webkitAudioContext)(({ sampleRate: sampleRate }));
    var videoFileAsBuffer = new Promise(getBuffer);
    videoFileAsBuffer.then(function (data) {
        console.log(data)
        audioContext.decodeAudioData(data).then(function (decodedAudioData) {
            console.log(decodedAudioData)
            var wav = audioBufferToWav(decodedAudioData)
            console.log(wav)
            newFile = new Blob([wav], { type: "wav", name: "audio.wav" })
            console.log(newFile);
            setResultAudio(newFile);
            working = false;
            updateControls()
            console.log("Done");
        });
    });
}

function extractMP3() {
    working = true;
    updateControls();
    var audioContext = new (window.AudioContext || window.webkitAudioContext)(({ sampleRate: sampleRate }));
    var videoFileAsBuffer = new Promise(getBuffer);
    videoFileAsBuffer.then(function (data) {
        console.log(data)
        audioContext.decodeAudioData(data).then(function (decodedAudioData) {
            console.log("Decoded")
            console.log(decodedAudioData)
            var buffer = audioBufferToIntArray(decodedAudioData)
            console.log(buffer)
            buffer = new Int16Array(buffer)
            console.log(buffer)
            console.log("Starting to convert to mp3, buffer: ", buffer.length)

            var mp3encoder = new lamejs.Mp3Encoder(1, decodedAudioData.sampleRate, 48);
            const sampleBlockSize = 1152;
            var mp3Data = [];
            console.log(buffer.length)
            const pr = document.getElementById('progress')
            pr.innerHTML = "Starting"
            var lt = 0;

            var i = 0;
            function doChunk() {
                if (i < buffer.length) {
                    var sampleChunk = buffer.subarray(i, i + sampleBlockSize);
                    var mp3buf = mp3encoder.encodeBuffer(sampleChunk);
                    if (mp3buf.length > 0) {
                        mp3Data.push(mp3buf);
                    }
                    if (new Date() > lt) {
                        console.log("encoding ...")
                        pr.innerHTML = ((i / buffer.length) * 100).toFixed(0);
                        lt = new Date();
                        lt.setSeconds(lt.getSeconds() + 2);
                    }
                    i += sampleBlockSize
                    setTimeout(doChunk, 1);
                } else {
                    console.log("Done converting to mp3")
                    var mp3buf = mp3encoder.flush();

                    if (mp3buf.length > 0) {
                        mp3Data.push(mp3buf);
                    }
                    pr.innerHTML = "Done"
                    console.log("Done converting to mp3")
                    console.log(mp3Data.length)

                    newFile = new Blob(mp3Data, { type: "audio/mp3", name: "audio.mp3" })
                    console.log(newFile)
                    setResultAudio(newFile);
                    working = false;
                    updateControls();
                    console.log("Done")
                }
            }
            doChunk();
        });
    });
}

function audioBufferToIntArray(abuffer) {
    var numOfChan = abuffer.numberOfChannels,
        length = (abuffer.length / abuffer.numberOfChannels) * 2,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        offset = 0,
        pos = 0;

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));
    console.log(channels)

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true);          // write 16-bit sample
            pos += 2;
        }
        offset++                                     // next source sample
    }
    return buffer
}

function getAudioTrack(tracks) {
    for (var i = 0; i < tracks.length; i++) {
        console.log(tracks[i], i, tracks[i].type);
        if (tracks[i].type === "audio") {
            console.log("found Audio track")
            return tracks[i]
        }
    }
    return null;
}

function loadFile() {
    var reader = new FileReader();
    if (input.files) {
        file = input.files[0]
        console.log(file)
        var reader = new FileReader();
        reader.onload = function (e) {
            var audio = document.getElementById('audio');
            audio.src = e.target.result;
                data = e.target.result;
        }
        reader.readAsDataURL(file);
    }
    updateControls();
}

function initEvent() {
    document.getElementById('btnWAV').onclick = extractWAV;
    document.getElementById('btnMP3').onclick = extractMP3;
    document.getElementById('btnSave').onclick = function () { save(newFile) }
    document.getElementById('input').onchange = loadFile;
}

var working = false;

function updateControls() {
    document.getElementById('btnWAV').disabled = working || !(file && file.size > 0);
    document.getElementById('btnMP3').disabled = working || !(file && file.size > 0);
    document.getElementById('btnSave').disabled = working || !(newFile && newFile.size > 0);
    document.getElementById('spanLen').innerHTML = ''
    if (file && file.size > 0){
        document.getElementById('spanLen').innerHTML = prettyBytes(file.size)
    }
    document.getElementById('spanLenResult').innerHTML = ''
    if (newFile && newFile.size > 0){
        document.getElementById('spanLenResult').innerHTML = prettyBytes(newFile.size)
    }
}

initEvent();
updateControls();
console.log("Loaded")
