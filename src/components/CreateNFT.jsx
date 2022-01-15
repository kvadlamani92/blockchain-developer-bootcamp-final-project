import React, { useEffect, useState } from "react";
import {Box,TextField, Button} from '@mui/material';
import { useMoralisFile } from 'react-moralis'
import { Moralis } from 'moralis'
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Modal} from "antd";

const styles = {
    NFTs: {
        display: "flex",
        flexWrap: "wrap",
        WebkitBoxPack: "start",
        justifyContent: "flex-start",
        margin: "0 auto",
        maxWidth: "1000px",
        gap: "10px"
    }
  };
 
function CreateNFT(props) {
    const {walletAddress, tokenAddress, tokenABI} = useMoralisDapp();
    const {saveFile} = useMoralisFile();
    const [file, setFile] = useState("");
    const [metadataFileURI, setMetadataFileURI] = useState("");
    const [metadata, setMetadata] = useState({
        name: "",
        description: "",
        image: "",
    });

    function succMint() {
        let secondsToGo = 5;
        const modal = Modal.success({
        title: "Success!",
        content: `Your new NFT is minted!`,
        });
        setTimeout(() => {
        modal.destroy();
        }, secondsToGo * 1000);
    }

    function failMint() {
        let secondsToGo = 5;
        const modal = Modal.error({
        title: "Error!",
        content: `There was a problem in minting your NFT. Please try again after sometime.`,
        });
        setTimeout(() => {
        modal.destroy();
        }, secondsToGo * 1000);
    }
    
    useEffect(() => {
        async function saveMetadataFile(){
            console.log('metadata before saving:', metadata);
            const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
            await metadataFile.saveIPFS();
            
            console.log('metadata file ipfs:',metadataFile.ipfs());
            setMetadataFileURI(metadataFile.ipfs());
        }
        if(metadata.image){
            console.log('metadata image is',metadata.image);
            saveMetadataFile();
        }
    }, [metadata.image]);

    useEffect(() => {
        async function mint(tokenURI) {
            if(tokenURI === "" || tokenURI === undefined){
                console.log('tokenURI is not valid. Skipping');
                return;
            }
            console.log('Mint function tokenURI:', tokenURI);
            let web3 = await Moralis.Web3.enableWeb3();
            const contract = new web3.eth.Contract(tokenABI, tokenAddress);
            await contract.methods
            .safeMint(walletAddress,tokenURI)
            .send({from: walletAddress})
            .then((response) => {
                console.log(response);
                succMint();
            })
            .catch((err) => {
                console.log(err);
                failMint();
            });
            }

        if(metadataFileURI){
            console.log('metadataFileURI:',metadataFileURI);
            mint(metadataFileURI);
        }
    }, [metadataFileURI])
    
    const handleMetadataChange = async (name,value) => {
      setMetadata((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleUpload = async () => {
        if(validateForm()) { 
            await saveFileIPFS(file);
        }
    }
    
    const saveFileIPFS = async (f) => {
        if(f === "" || f === null || f === undefined){
            console.log("File is null or undefined. Skipping upload");
            return;
        }
        console.log("FILE",f)
        
        const fileIpfs = await saveFile(f.name, file, {saveIPFS: true})
        console.log('file ipfs:',fileIpfs._ipfs);

        await handleMetadataChange("image",fileIpfs._ipfs);
    }

    const validateForm = () => {
        if(metadata.name === ""){
            alert("NFT name is empty. Please give valid name.");
            return false;
        }
        if(metadata.description === ""){
            alert("NFT description is empty. Please give valid description.");
            return false;
        }
        if(file === ""){
            alert("NFT image is empty. Please upload a valid image.");
            return false;
        }
        return true;
    }
    
    /**
     * Component to display thumbnail of image.
     */
    const ImageThumb = ({ image }) => {
        return <img src={URL.createObjectURL(image)} alt={image.name}/>;
    };

    return (
      <div style={styles.NFTs}>
          <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { ml: 0, mt:1, mb:1, width: '50ch' }
            }}
            noValidate
            autoComplete="off"
          >
            <div>
                <TextField
                required
                id="nftName"
                name="name"
                label="Name"
                placeholder="NFT name"
                onChange={(e) => handleMetadataChange(e.target.name,e.target.value)}
                />
                </div>
                <div>
                <TextField
                required
                fullWidth
                name="description"
                id="nftDescription"
                label="Description"
                placeholder="NFT description"
                onChange={(e) => handleMetadataChange(e.target.name,e.target.value)}
                />
                </div>
                <div id="upload-box" style={{marginTop:"8px", marginBottom:"12px", width:"50ch"}}>
                    <input type="file" id="fileUpload" onChange={(e) => setFile(e.target.files[0])} style = {{marginBottom:"12px"}}/>
                    {file && <ImageThumb image={file} />}
                </div>
                <Button variant="contained" id="mintNFT" onClick={handleUpload}>Mint</Button>
                
        </Box>
      </div>
    );
  }
  export default CreateNFT;        