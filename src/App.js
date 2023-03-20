import React, { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";

function App() {
    const [videoSrc, setVideoSrc] = useState("");
    const [convertedSrc, setConvertedSrc] = useState("");
    const [message, setMessage] = useState("Click Start to transcode");

    const ffmpeg = createFFmpeg({
        corePath: "./core/dist/ffmpeg-core.js",
        log: true,
    });

    const res = "250px";

    const getURL = (value) => {
        return URL.createObjectURL(value);
    };

    const doTranscode = async () => {
        setConvertedSrc(null);
        setMessage("Loading ffmpeg-core.js");
        await ffmpeg.load();
        const startTime = Date.now();
        setMessage("Start transcoding");
        ffmpeg.FS("writeFile", "test.avi", await fetchFile(getURL(videoSrc)));
        ffmpeg.setProgress((progress) =>
            setMessage(
                `Transcoding: ${
                    progress.ratio < 0 ? 0 : (progress.ratio * 100).toFixed(2)
                } %`
            )
        );
        await ffmpeg.run(
            "-noautorotate",
            "-i",
            "test.avi",
            "-r",
            "25",
            "-c:v",
            "libx264",
            "-movflags",
            "faststart",
            "-crf",
            "32",
            "-vf",
            "scale=1280:720",
            // "-s",
            // "hd720",
            "output.mp4"
        );
        const endTime = Date.now();
        setMessage(
            `Complete transcoding: startTime=${startTime} endTime=${endTime} \n Total time=${
                endTime - startTime
            }ms`
        );
        const data = ffmpeg.FS("readFile", "output.mp4");
        setConvertedSrc(new Blob([data.buffer], { type: "video/mp4" }));
    };
    return (
        <div className="App">
            <p />
            <input
                type="file"
                accept="video/*"
                onChange={(event) => {
                    console.log(event.target.files);
                    setVideoSrc(event.target.files[0]);
                }}
            />
            <h1>Original</h1>
            <p>
                Details:
                {/* {videoSrc ? getURL(videoSrc) : "none"},  */}
                Size: {videoSrc.size / 1024 ** 2 || 0} mb
            </p>
            {/* {videoSrc && (
                <video
                    key={getURL(videoSrc)}
                    src={getURL(videoSrc)}
                    controls
                    style={{
                        border: "1px solid black",
                        width: res,
                        maxHeight: res,
                    }}
                ></video>
            )} */}
            <br />
            <p>{message}</p>
            <h1>Converted</h1>
            <p>
                Details: {convertedSrc ? getURL(convertedSrc) : "none"}, Size:{" "}
                {convertedSrc ? convertedSrc.size / 1024 ** 2 : 0} mb
            </p>
            {convertedSrc && (
                <video
                    key={getURL(convertedSrc)}
                    src={getURL(convertedSrc)}
                    controls
                    style={{
                        border: "1px solid black",
                        width: res,
                        maxHeight: res,
                    }}
                ></video>
            )}
            <br />
            <button onClick={doTranscode}>Start</button>
        </div>
    );
}

export default App;
