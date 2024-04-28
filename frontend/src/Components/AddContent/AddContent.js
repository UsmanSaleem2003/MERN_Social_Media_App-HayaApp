import React, { useState, useRef } from 'react';
import "./AddContent.css";
import Webcam from "react-webcam";

export default function AddContent() {
    const [webcam, setWebcam] = useState(false);
    const [capturedImage, setCapturedImage] = useState(false);
    const [imgURL, setImgURL] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const webRef = useRef(null);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImgURL(reader.result);
            setCapturedImage(false);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };


    const handleupload = async (event) => {
        event.preventDefault();
        console.log(imgURL);

        const base64ImageData = imgURL.slice(imgURL.indexOf(',') + 1);

        // Send the base64 image data to the backend
        try {
            const response = await fetch("http://localhost:4000/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ base64ImageData, description }),
            });

            if (response.ok) {
                setStatus("Image uploaded successfully!!!");

                setTimeout(async () => {
                    setStatus("");
                }, 1000);

                console.log("Image sent to server successfully");
            } else {
                setStatus("Failed to upload image!!!");

                setTimeout(async () => {
                    setStatus("");
                }, 2000);

                console.error("Failed to send image to server");
            }
        } catch (error) {
            setStatus("Network Error! Image Not Uploaded!!!");

            setTimeout(async () => {
                setStatus("");
            }, 2000);

            console.error("Error uploading image may be due to network:", error);
        }
    };

    const ClickImaged = async () => {
        setCapturedImage(!capturedImage);
        setImgURL(webRef.current.getScreenshot());
    }

    const handleBack = async () => {
        setCapturedImage(!capturedImage);
        setImgURL("");
    }

    const handlePostCancel = async (event) => {
        event.preventDefault();
        setCapturedImage(false);
        setImgURL("");
        setDescription("");
    }

    const handleTextAreaChange = async (e) => {
        setDescription(e.target.value);
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

                    {webcam ? (
                        capturedImage ? (
                            <button className='clickImage-btn' onClick={handleBack}>Back</button>
                        ) : (
                            <button className='clickImage-btn' onClick={ClickImaged}>Click Image</button>
                        )
                    ) : (
                        <button className='clickImage-btn' onClick={ClickImaged} disabled>Click Image</button>
                    )}

                    {capturedImage ? webcam ? <button className='downloadImg-btn' onClick={downloadImage}>Download Image</button> : <button className='clickImage-btn' onClick={downloadImage} disabled>Download Image</button> : <button className='clickImage-btn' onClick={downloadImage} disabled>Download Image</button>}

                    <label className="upload-button">
                        <input type="file" style={{ display: "none" }} accept='.jpg, .png, .jpeg' onChange={handleFileChange} />
                        Upload Image
                    </label>
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
                        {imgURL !== "" ? <img src={imgURL} alt='clickedimg' className='clicked-img' /> : <div className='null-div'>Image To be Uploaded <br /><br /> Click / Upload Image</div>}
                    </div>

                    <div className='picture-data'>

                        <form action='http://localhost:4000/upload' method='POST' encType="multipart/form-data">

                            <span>Add Description</span>
                            <textarea onChange={handleTextAreaChange} maxLength={200} value={description} placeholder='Add Description of limited 200 characters' />

                            <div>{status}</div>
                            {imgURL !== "" ? <button onClick={handleupload} className='upload'>Upload</button> : <button className='upload' onClick={handleupload} disabled>Upload</button>}
                            <button onClick={(event) => handlePostCancel(event)} className='upload'>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}