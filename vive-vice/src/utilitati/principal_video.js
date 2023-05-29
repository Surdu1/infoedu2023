import {useState, useEffect, useRef} from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import Cookies from "js-cookie";
export default function PrincipalVideo({element}){

    const[url,setUrl] = useState("");
    const[vizionari,setVizionari] = useState({descriere:" "});

    async function Vizonari_Like(id){
        const resultat = await axios.post("http://localhost:5000/api/video/data",{id},{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
        });

        setVizionari(resultat.data);
    }

    async function getVideo(){
        const response = await axios.get(`http://localhost:5000/api/video/front/${element}`,{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
            responseType: 'blob',
        })
        console.log(response)
        const videoUrl = URL.createObjectURL(response.data);
        setUrl(videoUrl);
    }  
    const shooter = useRef(true);
    useEffect(()=>{
        if(shooter.current){
            shooter.current = false;
            getVideo();
            Vizonari_Like(element)
        }
    },[])
    return(<div className="p_video">
       <a href={`http://localhost:3000/video?id=${element}`}>
       {url?<div className="img_edit"><img width={"100%"}  src={url}/></div>:<div className="img_edit mic"><img width={"100%"}  src={'soon1.gif'}/></div>}
       <p className="desc_p">{vizionari.descriere}</p>
       </a>
    </div>)
}