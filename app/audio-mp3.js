const sampleRate = 16000;

function getBuffer(file) {
    return new Promise(function (done, failed) {
        var reader = new FileReader();
        reader.onload = function () {
            done(reader.result);
        }
        reader.onerror = err => failed(err);
        reader.readAsArrayBuffer(file);
    });
}

function ExtractMP3(file, infoFunc) {
    const info = (msg) => {
        if (infoFunc !== undefined) {
            infoFunc(msg);
        }
    };
    return new Promise(function (done, failed) {
        getBuffer(file).then(function (data) {
            info('File read')
            var audioContext = new (window.AudioContext || window.webkitAudioContext)(({ sampleRate: sampleRate }));
            console.log(data)
            audioContext.decodeAudioData(data).then(function (decodedAudioData) {
                console.log("Decoded")
                console.log(decodedAudioData)
                var buffer = audioBufferToIntArray(decodedAudioData)
                buffer = new Int16Array(buffer)
                console.log("Starting to convert to mp3, buffer: ", buffer.length)

                var mp3encoder = new lamejs.Mp3Encoder(1, decodedAudioData.sampleRate, 48);
                const sampleBlockSize = 1152;
                var mp3Data = [];
                console.log(buffer.length)
                info("Starting")
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
                            info(((i / buffer.length) * 100).toFixed(0));
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
                        info("Done");
                        console.log("Done converting to mp3")

                        var newFile = new Blob(mp3Data, { type: "audio/mp3", name: "audio.mp3" })
                        done(newFile);
                    }
                }
                doChunk();
            }).catch(err => failed(err));
        }).catch(err => failed(err));
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

module.exports = ExtractMP3;
