const prettyBytes = require('./../node_modules/pretty-bytes/index.js');
const audioBufferToWav = require('./../node_modules/audiobuffer-to-wav/index.js');
const audioFFMPEG = require('./audio-ffmpeg.js');
const audioMP3 = require('./audio-mp3.js');

var file;
var newFile;
const sampleRate = 16000;
var working = false;

function save(file) {
    if (file) {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(file);
        a.href = url;
        a.download = "olia";
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        console.log("no file");
    }
}

function setResultAudio(file) {
    var audio = document.getElementById('result');
    if (file !== undefined) {
        audio.src = window.URL.createObjectURL(file);
    } else {
        audio.src = '';
    }

}

function getBuffer(resolve) {
    var reader = new FileReader();
    reader.onload = function () {
        var arrayBuffer = reader.result;
        resolve(arrayBuffer);
    }
    info("Load file")
    reader.readAsArrayBuffer(file);
}


function extractWAV() {
    working = true;
    newFile = undefined;
    setResultAudio(newFile);
    info("Starting")
    updateControls();
    var audioContext = new (window.AudioContext || window.webkitAudioContext)(({ sampleRate: sampleRate }));
    var videoFileAsBuffer = new Promise(getBuffer);
    videoFileAsBuffer.then(function (data) {
        console.log(data)
        audioContext.decodeAudioData(data).then(function (decodedAudioData) {
            console.log(decodedAudioData)
            var wav = audioBufferToWav(decodedAudioData)
            newFile = new Blob([wav], { type: "wav", name: "audio.wav" })
            setResultAudio(newFile);
            working = false;
            updateControls()
            info("Done")
            console.log("Done");
        });
    });
}

function extractMP3() {
    working = true;
    newFile = undefined;
    setResultAudio(newFile);
    updateControls();
    audioMP3(file, info).then(
        (file) => {
            newFile = file;
            console.log(newFile);
            setResultAudio(newFile);
            working = false;
            updateControls()
            console.log("Done");
        },
        err => {
            newFile = undefined;
            setResultAudio(newFile);
            working = false;
            info(err)
            updateControls()
            console.log(err);
        }
    )
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
        }
        reader.readAsDataURL(file);
    }
    updateControls();
}

const info = async (msg) => {
    const message = document.getElementById('progress');
    message.innerHTML = msg;
}

function extractFFMPEG() {
    working = true;
    newFile = undefined;
    setResultAudio(newFile);
    updateControls();
    audioFFMPEG(file, info).then(
        (file) => {
            newFile = file;
            console.log(newFile);
            setResultAudio(newFile);
            working = false;
            updateControls()
            console.log("Done");
        },
        err => {
            newFile = undefined;
            setResultAudio(newFile);
            working = false;
            info(err)
            updateControls()
            console.log(err);
        }
    )
}

function initEvent() {
    document.getElementById('btnWAV').onclick = extractWAV;
    document.getElementById('btnMP3').onclick = extractMP3;
    document.getElementById('btnSave').onclick = function () { save(newFile) }
    document.getElementById('input').onchange = loadFile;
    document.getElementById('btnFFMPEG').onclick = extractFFMPEG;
}

var working = false;

function updateControls() {
    document.getElementById('btnWAV').disabled = working || !(file && file.size > 0);
    document.getElementById('btnMP3').disabled = working || !(file && file.size > 0);
    document.getElementById('btnFFMPEG').disabled = working || !(file && file.size > 0);
    document.getElementById('btnSave').disabled = working || !(newFile && newFile.size > 0);
    document.getElementById('spanLen').innerHTML = ''
    if (file && file.size > 0) {
        document.getElementById('spanLen').innerHTML = prettyBytes(file.size)
    } else {
        document.getElementById('spanLen').innerHTML = prettyBytes(0)
    }
    document.getElementById('spanLenResult').innerHTML = ''
    if (newFile && newFile.size > 0) {
        document.getElementById('spanLenResult').innerHTML = prettyBytes(newFile.size)
    } else {
        document.getElementById('spanLenResult').innerHTML = prettyBytes(0)
    }
}

initEvent();
updateControls();
console.log("Loaded")
