import Navbar from "./navbar"
import NewOne from "./new_one"
import "./principal.css"
import { useState, useEffect, useRef} from "react"
import Cookies from "js-cookie"
import axios from "axios"
import PrincipalVideo from "./principal_video"
export default function Principal(){
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [query,setQuery] = useState("");

    async function init(){
       const result =  await axios.post("http://localhost:8000/get_video_id");
       setData(result.data)
    }
    useEffect(() => {
    async function search(){
        if(query != ""){
        const result = await axios.post("http://localhost:5000/search",{query:query});
        console.log(result.data)
        setData1(result.data.result)
        }
    }
    search();
    },[query])

    const shooters = useRef(true)
    useEffect(()=>{
        if(shooters.current){
            shooters.current = false
            init()
        }
    },[])
    return(
    <div className="principal">
    <Navbar setQuery={setQuery}/>

    {!query? <div className="cards">{(Cookies.get("token"))?  <NewOne/> : ""}
    {data.map((element,i) => {
        return(<PrincipalVideo key={i} element={element}></PrincipalVideo>)
    })}</div> : <div className="cards">{(Cookies.get("token"))?  <NewOne/> : ""}
    {data1.map((element,i) => {
        return(<PrincipalVideo key={i} element={element}></PrincipalVideo>)
    })}</div> }
 
    </div>
    )
}
