var ffmpeg = require("../node_modules/ffmpeg.js/ffmpeg-mp4.js");

function ExtractAudioFFMPEG2(file, infoFunc) {
    const info = (msg) => {
        if (infoFunc !== undefined) {
            infoFunc(msg);
        }
    };
    return new Promise(function (done, failed) {
        const transcode = async (file) => {
            try {
                file.arrayBuffer().then(buffer => {
                    info('Starting');
                    var d = extract(buffer, info)
                    var newFile = new Blob([d], { type: 'audio/mp4', name: "audio.mp4" })
                    info('Done');
                    done(newFile);
                });
            } catch (e) {
                if (failed !== undefined) {
                    failed(e);
                } else {
                    console.error(e)
                }
            }

        }
        transcode(file);
    });
}

function extract(arrayBuffer, info) {
    function noop() {}
    var code;
    var result = ffmpeg({
        MEMFS: [{ name: "1.mp4", data: arrayBuffer }],
        arguments: ["-i", "1.mp4", '-map', '0:a', '-acodec', 'copy', "out.mp4"],
        // Ignore stdin read requests.
        stdin: noop,
        print: info,
        printErr: noop,
        onExit: function(v) {code = v},
    });
    // Write out.webm to disk.
    var out = result.MEMFS[0];
    if (!out) {
        throw new Error('Could not convert video')
    }
    return Uint8Array.from(out.data)
}

module.exports = ExtractAudioFFMPEG2;
