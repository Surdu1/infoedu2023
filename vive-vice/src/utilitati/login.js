import { useState ,useEffect,useRef} from "react";
import Cookie from "js-cookie";
import "./login.css";
import axios from "axios";
import ReactPlayer from "react-player";
import ReCAPTCHA from "react-google-recaptcha"
export default function Login(){
  
    const [btn,setBtn] = useState(false);
    const [username,setUsername] = useState("");
    const [uselog,setUselog] = useState("");
    const [paslog,setPaslog] = useState("")
    const [password,setPassword] = useState("");
    const [password1,setPassword1] = useState("");
    const [passerr,setPasserr] = useState(false);
    const [error,setError] = useState("");
    const [result,setResult] = useState("");
    const [token,setToken] = useState("");
   
    function Change(value){
        console.log(value);
    }
     
    async function TakeVideo(){
        const result = await axios.get(`http://localhost:5000/backgroud`,{
            responseType: 'blob',
        })
        const videoUrl = URL.createObjectURL(result.data);
        setResult(videoUrl);
    }

    const shooters = useRef(true);
    useEffect(()=>{
        if(shooters.current){
            shooters.current = false;
            TakeVideo();
        }
    },[])

    if(Cookie.get("username") != null){
        console.log(Cookie.get("username"));
        window.location.replace("http://localhost:3000/dashboard");   
    }


    async function submit(e){
        e.preventDefault();
        setError("");
    try{
        const result = await axios.post("http://localhost:5000/log-check",{
            username:uselog,
            password: paslog,
            token:token
        })
        if(result.data.error){
            setError(result.data.error)
        }else{
            const expirationTime = new Date();
            expirationTime.setTime(expirationTime.getTime() + 60 * 60 * 1000);
            Cookie.set('token',"Bearer " + result.data.token,{
                expires: expirationTime ,
                secure:true,
                path: "/",
                sameSite: false,
            });
            window.location.replace('/')
        }
    }catch(e){
        setError("A aparut o eroare,va rugam sa incercati din nou");
        }
    }

    async function adauga(e){
        e.preventDefault();
        setError("");
        if(password === password1){
          const result =  await axios.post('http://localhost:5000/autentificare',{username: username,password: password,token:token})
            if(result.data.error){
                setError(result.data.error)
            }else{
                const expirationTime = new Date();
                expirationTime.setTime(expirationTime.getTime() + 60 * 60 * 1000);
                Cookie.set('token',"Bearer " + result.data.token,{
                    expires: expirationTime ,
                    secure:true,
                    path: "/",
                    sameSite: false,
                });
                window.location.replace('/')
            }
        }else{
            setError("Valorile parolei trebuie sa fie identice");
        }
    }

    return(
    <div className="login">
        
        <div className="login-content">
            <div className="switch">
                <button onClick={()=>{setBtn(false);setError("")}} className={btn?"":"btn-active"}>Logare</button>
                <button onClick={()=>{setBtn(true);setError("")}} className={btn?"btn-active":""}>Autentificare</button>

            </div>
            <div className={btn? "log d": "log"}>
                <h1>Logare</h1>
                <form  onSubmit={(e) => submit(e)}>
                <input type="text" onChange={(e)=>{setUselog(e.target.value)}} name="username" placeholder="Username"/>
                <input type="password" onChange={(e)=>{setPaslog(e.target.value)}}  name="password" placeholder="Password"/>
                <ReCAPTCHA sitekey="6Lf4sEYmAAAAABcPhLLAVxdRqLg32CRKJ3JuIRbv" onChange={(t)=>{setToken(t)}} onExpired={(e)=>{setToken("")}}/>
                <button onClick={submit} type="submit">Trimite</button>
                </form>
            </div>
            <div className={btn? "log": "log d"}>
                <h1>Autentificare</h1>
                <form  onSubmit={(e) => adauga(e)}>
                <input type="text" onChange={(e)=>{setUsername(e.target.value)}} name="username" placeholder="Username"/>
                <input type="password" onChange={(e)=>{setPassword(e.target.value)}} name="password" placeholder="Password"/>
                <input type="password" onChange={(e)=>{setPassword1(e.target.value)}} name="password" placeholder="Password"/>
                <ReCAPTCHA sitekey="6Lf4sEYmAAAAABcPhLLAVxdRqLg32CRKJ3JuIRbv" onChange={(t)=>{setToken(t)}} onExpired={(e)=>{setToken("")}}/>
                <button type="submit">Trimite</button>
                </form>
            </div>
             <p className={error?"error":"error papa"}>{error}</p>
        </div>
        <div className="login_video_backgroud">
        <ReactPlayer
        url={result}
        playing={true}
        loop={true}
        muted={true}
        width="100%"
        height="100%"/>
        </div>
    </div>
    )
}