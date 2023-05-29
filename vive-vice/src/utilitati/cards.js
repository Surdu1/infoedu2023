import ReactPlayer from 'react-player';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useState,useEffect,useRef } from 'react';


export default function Cards({element,takeName}) {
    let shooter = useRef(true);
    const[result,setResult] = useState();
    const[vizionai,setVizionai] = useState();
    const[setting,setSetting] = useState(true);
    const[descriere,setDescriere] = useState("");
    const[error,setError] = useState("");
    const[success,setSuccess] = useState(false)
    const[istoken,setToken] = useState("");
    const filename = element.filename;
    async function TakeVideo(){
        const result = await axios.get(`http://localhost:5000/api/video/${filename}`,{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
            responseType: 'blob',
        })
        const videoUrl = URL.createObjectURL(result.data);
        setResult(videoUrl);
    }
    async function Vizonari_Like(filename){
        const result = await axios.post("http://localhost:5000/video_data",{filename},{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
        });
        console.log(result.data);
        setVizionai(result.data);
    }

    useEffect(()=>{
        if(shooter.current){
        shooter.current = false;
        TakeVideo();
        Vizonari_Like(filename);
        }
    },[])

    async function DeleteVideo(filename){
        const result = await axios.post("http://localhost:5000/api/delete_video",{id:filename},{
            headers:{
                'x-access-token': Cookies.get('token'),
            }
        })
        if(result.data.success){
        window.location.reload(false);
        }
    }

    async function Modicia(){
        const result =  await axios.post("http://localhost:5000/api/video_update_descriere",{descriere: descriere,id: filename},{
            headers:{
                'x-access-token': Cookies.get('token'),
            }
        })

        if(result.data.success === false) {
            if(result.data.error){
                setError(result.data.error)
            }
            if(result.data.token === false){
                window.location.replace("http://localhost:3000/delog")
            }
        }else{
            setSuccess(true)
            Vizonari_Like(filename)
        }
    }

    const lool = useRef(true)
    async function vizionare(filename){
        if(lool.current){
            lool.current = false;
        await axios.post("http://localhost:5000/add_view",{id: filename},{
            headers: {
                'x-access-token': Cookies.get('token'),
            }
        })
    }
    }

    return( <div className="card1">
        <div className='setting'><div className={setting?'rotate_gear': "rotate_gear true"} onClick={()=>{setSetting(!setting);setSuccess(false);setError("")}}><i className="fa-solid fa-gear fa-xl"></i></div></div>
        <div className={setting?'container_video_card':'container_video_card papa'}>{result? <ReactPlayer onPlay={()=>{vizionare(filename)}} className="video1" url={result} width={'100%'} height={'100%'}  controls /> : <div className='image'><img src="https://i.gifer.com/origin/f5/f5baef4b6b6677020ab8d091ef78a3bc_w200.webp"/></div>} 
        <div class="decrip"><p className='descriere1'>{element.description.length > 50 ? element.description.substring(0, 50).concat('...') : element.description}</p></div>
        <div class="class_video">
        {vizionai?<div className='info_video'><p><i className="fa-solid fa-eye"></i> {vizionai.views || 0}</p>
        <p><i className="fa-solid fa-heart fa-lg"></i> {vizionai.like||0}</p></div>:""}
        <a className='redicet_video' href={`/video?id=${filename}`}><button title='Urmareste videoclipul direct in pagina'><i className="fa-solid fa-arrow-right fa-lg"></i></button></a>
        </div>
        </div>
        <div className={setting?"card_setting papa":"card_setting"}>
            <div className="data_info">
            <p>Descriere</p>
            <textarea defaultValue={element.description} onChange={(e)=>{setDescriere(e.target.value)}}></textarea>
            <button onClick={()=>{setError("");setSuccess(false);Modicia();takeName()}} className='data_info_b1'>Modifica</button>
            </div>
            <button onClick={()=>{DeleteVideo(filename)}} className='data_info_b2'>Delete</button>
            <div className={error || success? "error_succes_message":"error_succes_message disno"} id={success?"success":error?"error":""}  >
                {error?<p>{error}</p>:""}
                {success?<p>Modicicarea a fost realizata cu succes</p>: ""}
            </div>
        </div>
    </div>);
}