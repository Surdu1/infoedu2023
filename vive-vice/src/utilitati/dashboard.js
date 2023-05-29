import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./dashboard.css";
import Cards from "./cards";
import USERSetting from "./user_setting";


export default function Dashboard(){
    if(Cookies.get("token") === undefined){
        window.location.replace('http://localhost:3000')
    } 
    const [videoUrl, setVideoUrl] = useState('');
    const [videoList,setVideoList] = useState([]);
    const [setting,setSetting] = useState(false);
    const[username,setUsername] = useState(Cookies.get('username'));
    let shooter = useRef(true);

    async function takeName(){
      shooter.current = false;
      const response = await axios.get("http://localhost:5000/api/get_video",{
      headers: {
        'x-access-token': Cookies.get('token'),
        "Access-Control-Allow-Origin": "*"
      }
    })
      setVideoList(response.data.video_num);
      setUsername(response.data.username)
      console.log(response.data.username)
   }


    useEffect(() => {
      if(shooter.current){
      takeName();
      }
    },[])
    
    
    return(<div className="dashoard">
    <div className="username-dashboard"><h1 className="user_name">{username}</h1><div style={{zIndex: "100"}} onClick={()=>{setSetting(!setting)}} className="setting-dash"><i  className="fa-solid fa-gear fa-2x"></i></div></div>
    <div className="cards1">
      {
        videoList.length? videoList.map((element,i)=>{
          return(<Cards key={i} takeName={takeName} element={element}/>)
        }) : <div className="none_text"><p>Nu exista inca continut</p></div>
      }
       {setting?<USERSetting  setSetting={setSetting} takeName={takeName}></USERSetting>: ""}
    </div>
    </div>)
}