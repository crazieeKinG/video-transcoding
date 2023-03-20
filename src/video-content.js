const OriginalVideo = ({ videoFile }) => {
    const url = URL.createObjectURL(videoFile);

    return (
        <div>
            <video
                key={url}
                style={{
                    border: "1px solid black",
                    width: "500px",
                    maxHeight: "500px",
                }}
                controls
            >
                <source src={videoFile ? url : ""} />
            </video>

            <div>
                <h1>Details</h1>
                <ol>
                    <li>{videoFile.size / 1024 ** 2} mb</li>
                </ol>
            </div>
        </div>
    );
};

export default OriginalVideo;
