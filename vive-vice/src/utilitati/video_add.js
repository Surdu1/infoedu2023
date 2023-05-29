import Cookies from "js-cookie";
import "./video_add.css";
import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from "react-player";
export default function VideoAdd(){

    
if(!(Cookies.get("token"))){
    window.location.replace("http://localhost:3000");
}

const [video, setVideo] = useState(null);
const [description, setDescription] = useState('');
const [success,setSuccess] = useState(null);
const [url,setUrl] = useState("");
const [image,setImage] = useState("");

const handleImage = (event) =>{
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target.result;
      setImage(base64String);
    };

    reader.readAsDataURL(file);
  }

}


const handleFileChange = (event) => {
  const file = event.target.files[0];
  setUrl(URL.createObjectURL(file));
  setVideo(file);
};

const handleDescriptionChange = (event) => {
  setDescription(event.target.value);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('video', video);
  formData.append('thumbnail',image)
  formData.append('description', description);

  try {
    await axios.post('http://localhost:5000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': Cookies.get('token')
      }
    }).then((response)=>{
      console.log(response.data.success);
      if(response.data.success) {
        setSuccess(true);
        window.location.replace("http://localhost:3000/dashboard")
      }
    });
  } catch (error) {
    setSuccess(false);
  }

};


///

const playerRef = useRef(null);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

const handleSeek = (event) => {
  const time = parseFloat(event.target.value);
  setCurrentTime(time);
  playerRef.current.seekTo(time);
};

const handleProgress = (state) => {
  setCurrentTime(state.playedSeconds);
  setDuration(state.loadedSeconds);
};


///
return(
<div className="video_add">
<form onSubmit={handleSubmit}>
      <div className="kill">
      {!url?<div style={{width: "100%",display:"flex",justifyContent:'center',alignItems:'center'}}><input id="fileInput" type="file" className="video_input" onChange={handleFileChange} required/><label for="fileInput" class="file-label">Adauga videoclipul</label></div>:<div className="video_con_pol"> <ReactPlayer onProgress={handleProgress} width={"100%"}  height={"100%"} ref={playerRef} url={url} controls></ReactPlayer></div>}
      </div>
      {url?<div className="olk"><textarea value={description} onChange={handleDescriptionChange} required/><button type="submit">Upload</button></div>:""}
</form>
{success !== null?success=== false?<p>A aparut o eroare va rugam sa incercati din nou</p>:"":""}
</div>
)
}