import React, { useState, useRef } from 'react';
import "./AddContent.css";
import Webcam from "react-webcam";

export default function AddContent() {
    const [webcam, setWebcam] = useState(false); // to check whether to open camera or not
    const [capturedImage, setCapturedImage] = useState(false); // to store the clicked image
    const webRef = useRef(null);


    function imageClicked() {
        setCapturedImage(true);
    }


    const downloadImage = async () => {
        const imgUrl = webRef.current.getScreenshot();
        // setCapturedImage(imgUrl);

        // Convert base64 to Blob
        fetch(imgUrl)
            .then((res) => res.blob())
            .then(async (blob) => {
                // Create a Blob from the data URL
                const imageBlob = new Blob([blob], { type: "image/jpeg" });

                // Use showSaveFilePicker to prompt the user for a file location
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: "captured_image.jpg",
                    types: [
                        {
                            description: "JPEG Files",
                            accept: {
                                "image/jpeg": [".jpg"],
                            },
                        },
                    ],
                });

                // Create a WritableStream and write the Blob to it
                const writable = await fileHandle.createWritable();
                await writable.write(imageBlob);
                await writable.close();
            })
            .catch((error) => console.error("Error converting to Blob:", error));
    };

    return (
        <div className='AddContent'>


            <div className='addContent-buttons'>
                {webcam ? <button className='webcam-btn' onClick={() => setWebcam(false)}> Close WebCam </button> : <button className='webcam-btn' onClick={() => setWebcam(true)}>Open WebCam</button>}
                {webcam ? <button className='clickImage-btn' onClick={imageClicked}>Click Image</button> : <button className='clickImage-btn' onClick={imageClicked} disabled>Click Image</button>}
                {capturedImage ? <button className='downloadImg-btn' onClick={downloadImage}>Download Image</button> : <button className='clickImage-btn' onClick={downloadImage} disabled>Download Image</button>}
                {/* {capturedImage ? <img src={capturedImage} alt='' /> : <p>No Image Captured</p>} */}
            </div>

            <div className='webcam-pic'>
                {webcam ? <Webcam imageSmoothing={true} ref={webRef} mirrored={true} /> : null}
            </div>
        </div>
    );
}
