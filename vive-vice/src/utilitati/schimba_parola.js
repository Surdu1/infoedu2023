import Cookies from "js-cookie";
import { useEffect,useState,useRef } from "react";
import './schimba_parola.css'
import axios from "axios";
export default function SchimbaParola(){
    const[password, setPassword] = useState()
    const[resultat, setResultat] = useState(false)
    const[error, setError] = useState(false)
    const[error1, setError1] = useState(false)
    const[nou, setNou] = useState();
    const[nou1, setNou1] = useState();

    if(!(Cookies.get('token'))){
        window.location.replace('http://localhost:3000');
    }
     async function validare(e){
         e.preventDefault();
         document.getElementById("input").value = "";
         const result = await axios.post('http://localhost:5000/verificare_parola',{password: password},{
            headers: {
                'x-access-token': Cookies.get('token'),
             }
        });
          setResultat(result.data.verificare);
          console.log(result.data.error)
          setError(result.data.error);
        
        }
        
     async function sendData(e){
        e.preventDefault();
        if(nou == nou1){
            const result = await axios.post('http://localhost:5000/insert_password',{password:nou},{
                headers:{
                    'x-access-token': Cookies.get('token')
                }
            })
            console.log(result)
            if(result.data.success){
                window.location.replace("/")
            }
        }
        else{
            setError1(true);
        }
     }


    return(<div className="chage-password">
        <div className="chage-password_panel">
            {resultat?
                <form onSubmit={(e)=>{sendData(e)}}>
                <input type="text" placeholder="Introdu parola noua" onChange={(e)=>{setNou(e.target.value)}} required></input>
                <input type="text"  placeholder="Introdu parola noua din nou" onChange={(e)=>{setNou1(e.target.value)}} required></input>
                <button type="submit">Treci la urmatorul pas</button>
                {error1? <p>Parolele trebuie sa se potriveasca</p>: ""}
                </form>
            :
            <form onSubmit={(e)=>{validare(e)}}>
                <input id="input" type="password"  placeholder="Introdu parola curenta" onChange={(e)=>{setPassword(e.target.value)}} required></input>
                <button type="submit">Treci la urmatorul pas</button>
                {error? <p>Parola este gresita</p>: ""}
            </form>
             }
        </div>
    </div>)
}