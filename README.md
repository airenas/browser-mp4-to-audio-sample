# browser-mp4-to-audio-sample

This is demo page for testing how to extract audio from mp4 video file using js in browser.

There are several implementations:

- using `AudioContext` extracting wav 16kHz. Problem: file is sometimes bigger than full video file.
- using `lamejs` converting wav into mp3. Very slow.
- using `ffmpeg.js`. Very big ffmpeg.js needs to be downloaded 24Mb, or 8Mb zipped. Limited support on browsers: see https://github.com/ffmpegwasm/ffmpeg.wasm#installation

## Building

### Local env

Tested on linux. Make sure you have `node` installed. Run:

```bash
make prepare
make compile
make serve
```

Open `http://localhost:3000`

### Docker

```bash
make prepare
make compile
cd build && make clean dbuild

```

Start the service with: `docker run -p 3000:8000 ${USER}/browser-audio-extract:0.1.2`. Version may differ.

---

### Author

#### Airenas Vaičiūnas

- [github.com/airenas](https://github.com/airenas/)
- [linkedin.com/in/airenas](https://www.linkedin.com/in/airenas/)

---

### License

Copyright © 2021, [Airenas Vaičiūnas](https://github.com/airenas).
Released under the [The 3-Clause BSD License](LICENSE).

---
