import TReact, { useState } from "react"
import { json, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cookies, useCookies } from "react-cookie";
export default function Login() {
    let [email, setEmail] = useState("");
    let [pass, setPass] = useState("");
    let [load, setload] = useState(false);
    let nav = useNavigate();
    let [required, setrequired] = useState(false);
    let [_, setcokkies] = useCookies();
    function login() {
        if (!email || !pass) {
            setrequired(true);
        } else {
            axios.post("https://mernvideocallapp.onrender.com/login", { email, pass }).then((res) => {
                if (res.data.mess == "valid") {
                    setload(false);
                    nav("/profile")
                    console.log(res);
                    // let token = window.localStorage.setItem("token", res.data.d);
                    setcokkies("access_token", res.data.token, { path: '/', expires: new Date(Date.now() + 3 * 86400 * 1000) });
                    let userDtaa = window.localStorage.setItem("Data", JSON.stringify(res.data.data));

                } else {
                    setload(true);
                }
            })
            setload(false);
            setrequired(false);

        }
    }


    return (
        <>
            <div className="mx-3 my-5">

                <div className="input-group mb-3  my-5">
                    <input onChange={(e) => { setEmail(e.target.value) }} placeholder="Enter Your Email! " type="text" className="form-control" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                {required ? (<p className="text-danger d-flex" style={{ justifyContent: "flex-end" }}>*required</p>
                ) : (null)}
                <div className="input-group mb-3 my-5">
                    <input onChange={(e) => { setPass(e.target.value) }} placeholder="Enter Your Passward! " type="password" className="form-control" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                {required ? (<p className="text-danger d-flex" style={{ justifyContent: "flex-end" }}>*required</p>
                ) : (null)}
                {load ? (<h6 className="d-flex text-danger" style={{ justifyContent: "flex-end" }}>Invalid credentials Try Again</h6>
                ) : (null)}

            </div>
            <div className="d-flex">
                <button className="  mx-auto btn btn-primary text-center " onClick={login}>Login</button>

            </div>


            <div onClick={() => { nav("/sign") }} className="my-5 text-center"><strong>I Don't have Account <button className="btn btn-primary">Signup </button></strong></div>

        </>
    )
}
