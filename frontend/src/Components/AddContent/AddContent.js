import React, { useState, useRef } from 'react';
import "./AddContent.css";
import Webcam from "react-webcam";

export default function AddContent() {
    const [webcam, setWebcam] = useState(false); // to check whether to open camera or not
    const [capturedImage, setCapturedImage] = useState(false); // to store the clicked image
    const [imgURL, setImgURL] = useState("");
    const [uploaded, setuploaded] = useState(false);
    const webRef = useRef(null);

    const handleupload = async () => {
        setuploaded(true);
    }

    const ClickImaged = async () => {
        setCapturedImage(!capturedImage);
        setImgURL(webRef.current.getScreenshot());
    }

    const downloadImage = async () => {
        const imgUrl = webRef.current.getScreenshot();

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


            <div className='camera-contents'>

                <div className='addContent-buttons'>
                    {webcam ? <button className='webcam-btn' onClick={() => setWebcam(false)}> Close WebCam </button> : <button className='webcam-btn' onClick={() => setWebcam(true)}>Open WebCam</button>}
                    {/* {webcam ?  <button className='clickImage-btn' onClick={ClickImaged}>Click Image</button> : <button className='clickImage-btn' onClick={ClickImaged} disabled>Click Image</button>} */}
                    {webcam ? capturedImage ? <button className='clickImage-btn' onClick={ClickImaged}>Back</button> : <button className='clickImage-btn' onClick={ClickImaged} >Click Image</button> : <button className='clickImage-btn' onClick={ClickImaged} disabled>Click Image</button>}
                    {capturedImage ? webcam ? <button className='downloadImg-btn' onClick={downloadImage}>Download Image</button> : <button className='clickImage-btn' onClick={downloadImage} disabled>Download Image</button> : <button className='clickImage-btn' onClick={downloadImage} disabled>Download Image</button>}
                </div>

                <div className='webcam-pic'>
                    {webcam ? <Webcam imageSmoothing={true} ref={webRef} mirrored={true} /> : null}
                </div>
            </div>

            <hr />

            <div className='post-inputs'>

                <span>Preview Post</span>

                <div className='Preview-post-contents'>

                    <div className='preview-image'>
                        {capturedImage ? <img src={imgURL} alt='clickedimg' className='clicked-img' /> : <div className='null-div'>Image To be Previewed</div>}
                    </div>

                    <div className='picture-data'>
                        <span>Add Description</span>
                        <textarea maxLength={200} placeholder='Add Description of limited 200 characters' />

                        {capturedImage ? <button onClick={handleupload} className='upload'>Upload</button> : <button className='upload' onClick={handleupload} disabled>Upload</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}
