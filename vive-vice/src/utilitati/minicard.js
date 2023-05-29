import {useState, useEffect, useRef} from "react";
import Cookies from "js-cookie";
import ReactPlayer from "react-player";
import axios from "axios";
export default function MiniCard({elemet}){
    const link = elemet
    const [url,setUrl] = useState("")
    const [vizionari,setVizionari] = useState("")

    async function getVideo(){
        const response = await axios.get(`http://localhost:5000/api/video/front/${link}`,{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
            responseType: 'blob',
        })
        console.log(response)
        const videoUrl = URL.createObjectURL(response.data);
        setUrl(videoUrl);
    }  
    async function Vizonari_Like(id){
        const resultat = await axios.post("http://localhost:5000/api/video/data",{id},{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
        });

        setVizionari(resultat.data);
    }
    const shooter = useRef(true)
    useEffect(()=>{
        if(shooter.current){
            shooter.current = false;
            getVideo();
            Vizonari_Like(elemet);
        }
    },[])
    return(<div className="mini_video"><a href={`http://localhost:3000/video?id=${elemet}`}>
    {url?<img src={url}  width={"100%"} height={"100%"}></img>:<img className="image_gif" src="soon.gif"></img>}
       <div><p className="descriere_mini">{vizionari.descriere}</p></div>
    </a></div>)
}