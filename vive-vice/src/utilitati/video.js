import { BrowserRouter as Router, Switch, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect , useRef, useState, useTransition } from 'react';
import ReactPlayer from 'react-player';
import clipboardCopy from 'clipboard-copy';
import MiniCard from './minicard';
import './video.css';
export default function Video(){
    const[result,setResult] = useState();
    const[vizionari,setVizionari] = useState({like: 0, view: 0,comentari: []})
    const[liked ,setLiked] = useState(false);
    const[other,setOther] = useState([])
    const[comentatiu,setComentariu] = useState("");
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const[adauga,setAdauga] = useState(false);

    async function getOhterVideo(){
        const result = await axios.get(`http://localhost:8000/get_video_nelogat`)
        setOther(result.data);
        console.log(result.data);
    }
    async function sendComment(){
        if(comentatiu){
            const res = await axios.post("http://localhost:5000/api/add_coment",{comentariu: comentatiu, id:id},{
                headers: {
                    'x-access-token': Cookies.get('token'),
                }
            })
            if(res.data.status){
            setAdauga(false)
            setComentariu("");
            Vizonari_Like(id)
            }
        }
        setAdauga(false)
    }

    async function like(id){
        if(Cookies.get('token')){
        const result = await axios.post(`http://localhost:5000/api/like`,{id:id},{
            headers: {
                'x-access-token': Cookies.get('token'),
            }
        })
        if(result.data.success){
        Vizonari_Like(id)
        }
        }
    } 


    const handleShare = async () => {
          try {
            if (navigator.share) {
              await navigator.share({
                title: 'Shared via ViveVice',
                text: 'Trimite link-ul',
                url: 'http://localhost:3000/video' + location.search,
              });
            } else {
              console.log('Web Share API not supported.');
            }
          } catch (error) {
            console.error('Error sharing:', error);
          }
    }

    async function getVideo(){
        const result = await axios.get(`http://localhost:5000/api/video_geter/${id}`,{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
            responseType: 'blob',
        })
        const videoUrl = URL.createObjectURL(result.data);
        setResult(videoUrl);
    }  


    async function Vizonari_Like(id){
        const resultat = await axios.post("http://localhost:5000/api/video/data",{id},{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
        });
        if(resultat.data.like_user){
            setLiked(true)
        }else{
            setLiked(false)
        }
        setVizionari(resultat.data);
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

    const shooter = useRef(true)
    useEffect(()=>{
        if(shooter.current){
            shooter.current = false
            getVideo();
            Vizonari_Like(id);
            getOhterVideo()
        }
    },[])
    return(<div class="render_video">
        <div className='all_container'>
            <div className='video_con'>
                <div className='expend'>
                {result?<ReactPlayer onPlay={()=>vizionare(id)} url={result} width={"100%"} height={"100%"} controls></ReactPlayer>:<img className="image_gif_mare" src="soon.gif"></img>}
                <div className='video_info_container'><div onClick={()=>{like(id)}} className={liked?"active subvideo": "subvideo"}><i className="fa-solid fa-heart fa-lg"/> &nbsp; <p>{vizionari.like || 0}</p></div><p><i className="fa-solid fa-eye"></i> {vizionari.view || 0}</p></div> 
                <p className='des_video'>{vizionari.descriere}</p>
                <div className="share_button" onClick={()=>{handleShare()}}><button>Trimite <i className="fa-solid fa-share fa-lg"></i></button></div>
                </div>
                <hr></hr>
                <div className="comentari_video">
                <h1 className='com_title'>Comenatri</h1>
                {Cookies.get('token')?
                <div className="adauga_comentariu">
                    {adauga?<div className='subsubvideo'><textarea onChange={(e)=>{setComentariu(e.target.value)}}></textarea><button onClick={()=>{sendComment()}}>Trimite</button></div>:<button className='button_switch_com' onClick={()=>{setAdauga(true)}}><i className="fa-solid fa-plus fa-xl"></i></button>}
                </div>
                :
                ""
                }
                {
                    vizionari.comentari.map((com,i)=>{
                       return(<div key={i} className="comenatriu"><p className='comcom'>{com.comentariu}</p><p className='comuser'>{com.user}</p></div>);
                    })
                }
            </div>
            </div>
            <div className='continut_alaturat'>
            {
              other.map((others,i)=>{
                console.log(others != id)
                if(others != id){
                return(<MiniCard key={i} elemet={others}></MiniCard>)
                }
              })
            }
            </div>
        </div>
    </div>)
}