var ffmpeg;

function ExtractAudioFFMPEG(file, infoFunc) {
    const info = (msg) => {
        if (infoFunc !== undefined) {
            infoFunc(msg);
        }
    };
    return new Promise(function (done, failed) {
        var newFile;
        const { createFFmpeg, fetchFile } = FFmpeg;
        const transcode = async (file) => {
            try {
                if (ffmpeg === undefined) {
                    const ffmpegTmp = createFFmpeg({
                        log: true,
                        // corePath: 'dist/ffmpeg-core.js'
                    });
                    info('Loading ffmpeg-core.js');
                    await ffmpegTmp.load();
                    info('Loaded ffmpeg-core.js');
                    ffmpeg = ffmpegTmp;
                }
                const { name } = file;
                ffmpeg.FS('writeFile', name, await fetchFile(file));
                info('Start copy audio');
                await ffmpeg.run('-i', name, '-map', '0:a', '-acodec', 'copy', 'output.mp4');
                info('Preparing file');
                const data = ffmpeg.FS('readFile', 'output.mp4');
                newFile = new Blob([data.buffer], { type: 'audio/mp4', name: "audio.mp4" })
                info('Done');
                done(newFile);
            } catch (e) {
                if (failed !== undefined){
                    failed(e);
                } else {
                    console.error(e)
                }
            }

        }
        transcode(file);
    });
}

module.exports = ExtractAudioFFMPEG;