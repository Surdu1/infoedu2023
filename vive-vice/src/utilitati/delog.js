import Cookies from "js-cookie";
export default function delog(){
    Cookies.remove("token");
    window.location.replace("http://localhost:3000");  
}