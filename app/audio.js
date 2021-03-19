const prettyBytes = require('./../node_modules/pretty-bytes/index.js');
const audioFFMPEG = require('./audio-ffmpeg.js');
const audioMP3 = require('./audio-mp3.js');
const audioWAV = require('./audio-wav.js');

var file;
var newFile;
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
    newFile = file;
    var audio = document.getElementById('result');
    if (file !== undefined) {
        audio.src = window.URL.createObjectURL(file);
    } else {
        audio.src = '';
    }

}

function extractAudio(extractFunc) {
    working = true;
    setResultAudio(undefined);
    updateControls();
    extractFunc(file, info).then(
        (file) => {
            console.log(file);
            setResultAudio(file);
            working = false;
            updateControls()
            console.log("Done");
        },
        err => {
            setResultAudio(undefined);
            working = false;
            info(err)
            updateControls()
            console.error(err);
        }
    )
}

function extractWAV() {
    extractAudio(audioWAV);
}

function extractMP3() {
    extractAudio(audioMP3)
}

function extractFFMPEG() {
    extractAudio(audioFFMPEG)
}

function loadFile() {
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

function initEvent() {
    document.getElementById('btnWAV').onclick = extractWAV;
    document.getElementById('btnMP3').onclick = extractMP3;
    document.getElementById('btnSave').onclick = function () { save(newFile) }
    document.getElementById('input').onchange = loadFile;
    document.getElementById('btnFFMPEG').onclick = extractFFMPEG;
}

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
