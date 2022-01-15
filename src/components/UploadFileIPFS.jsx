import React, { useState } from "react";
import { useMoralisFile } from 'react-moralis'
import {Button} from '@mui/material';

function UploadFileIPFS() {

    const {saveFile} = useMoralisFile();

    const [file, setFile] = useState("");

    const handleUpload = async () => {
        await saveFileIPFS(file);
    }
    const saveFileIPFS = async (f) => {
        if(f === "" || f === null || f === undefined){
            console.log("File is null or undefined. Skipping upload");
            return;
        }
        console.log("FILE",f)
        
        const fileIpfs = await saveFile(f.name, f, {saveIPFS: true})
        console.log('file ipfs:',fileIpfs._ipfs);
    }
    
    return (
        <div id="upload-box" style={{marginTop:"8px", marginBottom:"12px", width:"50ch"}}>
        <input type="file" id="fileUpload" onChange={(e) => setFile(e.target.files[0])} style = {{marginBottom:"12px"}}/>
        <Button variant="contained" id="uploadImage" onClick={handleUpload}>Upload</Button>
    </div>       
    );
}
export default UploadFileIPFS;