import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, BrowserRouter,HashRouter , Route, Routes } from "react-router-dom"
import Signup from "./Signup";
import Login from "./Login";
import Profile from "./Profile";
import { useCookies } from "react-cookie"
import Friend from "./Freiends";
import Home from "./Home";
export default function Navbar() {
    let [cokkies, setcokkies, removecokies] = useCookies(["access_token"]);
    return (
        <>
            <HashRouter >
                <div className="d-flex  my-3 ">


                        <div className="mx-2  rounded-pill d-flex ">
                            <h4 onClick={() => {
                                document.body.style.background = "white";
                                document.body.style.color = "black"
                            }} className="mx-2 btn bg-light text-black rounded-pill">Day</h4>
                            <h4 onClick={() => {
                                document.body.style.background = "black";
                                document.body.style.color = "white";
                                document.body.style.opacity = "0.8"
                            }} className="btn bg-dark text-white rounded-pill ">Night</h4>

                        </div>

                    {/* <h3 className="text-center d-flex mx-auto">Chatty</h3> */}
                    <Link style={{ borderRadius: "10px", textAlign: "center", width: "58px", height: "32px", background: "#00A4CCFF" }} className="border text-black  text-decoration-none mx-3 " to={"/"}>Home </Link>
                    <Link style={{ borderRadius: "10px", textAlign: "center", width: "68px", height: "32px", background: "#00A4CCFF" }} className=" border text-black text-decoration-none mx-3" to={"/dost"}>Friends</Link>
                    {/* <Link style={{ borderRadius: "10px", textAlign: "center", width: "58px", height: "32px", background: "#00A4CCFF" }} className="border text-black text-decoration-none mx-3 " to={"/Sign"}>Signup </Link> */}
                    {!cokkies.access_token ? (< Link style={{ borderRadius: "10px", textAlign: "center", width: "58px", height: "32px", background: "#00A4CCFF" }} className="border text-black text-decoration-none  mx-3" to={"/login"}>Login </Link>
                    ) : (<Link style={{ borderRadius: "10px", textAlign: "center", width: "58px", height: "32px", background: "#00A4CCFF" }} className="border text-black text-decoration-none  mx-3" to={"/profile"}>Profile </Link>

                    )}
                    {/* <Link style={{ borderRadius: "10px", textAlign: "center", width: "58px", height: "32px", background: "#00A4CCFF" }} className="border text-black text-decoration-none d-none mx-3" to={"/login"}>Login </Link> */}
                    {/* // <Link style={{ borderRadius: "10px", textAlign: "center", width: "58px", height: "32px", background: "#00A4CCFF" }} className="border text-black text-decoration-none d-none mx-3" to={"/profile"}>Profile </Link> */}

                </div>
                <hr />
                <Routes>
                    <Route path="/Sign" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dost" element={<Friend />} />
                    <Route path="/" element={<Home />} />

                </Routes>

            </HashRouter  >

        </>
    )
}
