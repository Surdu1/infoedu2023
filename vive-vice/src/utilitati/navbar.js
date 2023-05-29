import "./navbar.css";
import { useState } from "react";
import Cookies from "js-cookie";
export default function Navbar({setQuery}){
    return(
    <div className="p1">
     <div className="s1"><h1>ViveVICE</h1></div>
     <div className="s2">
     <div className="line-search">
     <i className="fa-solid fa-magnifying-glass"></i><input onChange={(e)=>{setQuery(e.target.value)}} type="text" className="search" name="search" placeholder="Search"></input><a className="logon" href={Cookies.get('token')?"/dashboard":"/login"} ><i className="fa-solid fa-gear fa-lg"></i></a>
     </div>
     {(Cookies.get("token"))? <a className="dislog" href="/delog"><i className="fa-solid fa-right-from-bracket fa-2xl"></i></a> : ""}
     </div>
    </div>
    )
}