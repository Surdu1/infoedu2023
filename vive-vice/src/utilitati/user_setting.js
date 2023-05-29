import Cookies from "js-cookie"
import {useState,useEffect, useRef} from "react"
import axios from "axios"
export default function USERSetting({takeName,setSetting}){
const shooter = useRef(true);
const[date,setDate] = useState({})
const[nume,setNume] = useState()
const[email,setemail] = useState()
const[telefon,setTelefon] = useState()
const[schimba_username,setSchimba_username] = useState(false);
const[schimba_email,setSchimba_email] = useState(false);
const[schimba_telefon,setSchimba_telefon] = useState(false);
const[verificare,setVerificare] = useState("null");

async function verify(){
    const result = await axios.get('http://localhost:5000/date_utilizator',{
        headers: {
            'x-access-token': Cookies.get('token')
        }
    });
    setDate(result.data);
}

useEffect(()=>{
if(shooter.current){
    shooter.current = false;
    verify();
}
},[])

async function sendUsername(){
    const result = await axios.post('http://localhost:5000/change_data',{username: nume},{
        headers: {
            'x-access-token': Cookies.get('token')
        }
    });
    setVerificare(result.data.check);
    verify();
    setSchimba_username(false);
    setSchimba_email(false);
    setSchimba_telefon(false);
    takeName()
}

async function sendEmail(){
    const result = await axios.post('http://localhost:5000/change_data',{email: email},{
        headers: {
            'x-access-token': Cookies.get('token')
        }
    });
    setVerificare(result.data.check);
    verify();
    setSchimba_username(false);
    setSchimba_email(false);
    setSchimba_telefon(false);
    takeName()
}

async function sendTelefon(){
    const result = await axios.post('http://localhost:5000/change_data',{telefon: telefon},{
        headers: {
            'x-access-token': Cookies.get('token')
        }
    });
    setVerificare(result.data.check);
    verify();
    setSchimba_username(false);
    setSchimba_email(false);
    setSchimba_telefon(false);
    takeName();
}

    return(<div className="setari_pop_up">
       {console.log(date.username)} <div className="exit-setting" onClick={()=>{setSetting(false)}}><i className="fa-solid fa-circle-xmark fa-2xl"></i></div>
        {Object.keys(date).length? <div className="user_setting">
        <form>
            {schimba_username?
             <div className="sw_pricipal">
             <div className="dpf"><p >Nume utiliztor: </p><textarea defaultValue={date.username||""} onChange={(e)=>{setNume(e.target.value)}} required></textarea><button type="button" onClick={()=>{sendUsername()}}>Trimite</button></div><button className="button_de_switch" type="button" onClick={()=>{setSchimba_username(false)}}><i className="fa-solid fa-backward"></i></button></div>:
             <div className="dpl"><div className="dpl_inside"><p>Nume utilizator:</p><p> {date.username}</p></div><button type="button" onClick={()=>{setSchimba_username(true);setNume(date.username)}}><i className="fa-solid fa-pen-to-square fa-lg"></i></button></div>
             }
             {schimba_email?
             <div className="sw_pricipal">
             <div className="dpf"><p >Email: </p><textarea defaultValue={date.email||""} onChange={(e)=>{setemail(e.target.value)}} required></textarea><button type="button" onClick={()=>{sendEmail()}}>Trimite</button></div><button className="button_de_switch" type="button" onClick={()=>{setSchimba_email(false)}}><i className="fa-solid fa-backward"></i></button></div>:
             <div className="dpl"><div className="dpl_inside"><p>Email:</p><p> {date.email}</p></div><button type="button" onClick={()=>{setSchimba_email(true);setemail(date.email)}}><i className="fa-solid fa-pen-to-square fa-lg"></i></button></div>
             }
              {schimba_telefon?
             <div className="sw_pricipal">
             <div className="dpf"><p >Numar telefon: </p><textarea defaultValue={date.telefon||""} onChange={(e)=>{setTelefon(e.target.value)}} required></textarea><button type="button" onClick={()=>{sendTelefon()}}>Trimite</button></div><button className="button_de_switch" type="button" onClick={()=>{setSchimba_telefon(false)}}><i className="fa-solid fa-backward"></i></button></div>:
             <div className="dpl"><div className="dpl_inside"><p>Numar telefon:</p><p> {date.telefon}</p></div><button type="button" onClick={()=>{setSchimba_telefon(true);setTelefon(date.telefon)}}><i className="fa-solid fa-pen-to-square fa-lg"></i></button></div>
             }
            <a href="/schimba_parola"><button className="parola_schimbare" type="button">Schimba Parola</button></a>
            {verificare != "null" ?verificare? <p>Datele au fost modificate cu succes</p>: <p>A apaut o problema,va rugam incercati din nou</p>: ""}
        </form>
        </div>: <div className="image_load"><img src="https://i.gifer.com/origin/f5/f5baef4b6b6677020ab8d091ef78a3bc_w200.webp"/><p style={{fontFamily: 'Lato',fontWeight: 900,fontSize:"2.5vmax"}}>Loading...</p></div>}
    </div>)
}