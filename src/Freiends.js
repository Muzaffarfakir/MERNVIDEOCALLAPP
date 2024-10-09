import axios from "axios";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
export default function Friend() {
    let socket = io("https://mernvideocallapp.onrender.com/", { transport: ["polling"] });
    let [freinds, setfreiends] = useState([]);
    let [chanename, setchanename] = useState(false);
    let [hide, sethide] = useState(false);
    let [inputvalue, setinputvalue] = useState("");
    let [h, seth] = useState([]);
    let [hidefreind, sethidefriend] = useState(false);
    function search() {
        sethide(true);
        seth(freinds.filter((name) => name.username.toLowerCase().includes(inputvalue.toLowerCase())));
    }

    function con(e, el) {

        switch (e.target.innerHTML) {
            case e.target.innerHTML = "Add":
                e.target.innerHTML = "Remove";
                e.target.style.color = "white";
                e.target.style.background = "red"
                socket.emit("req", `${JSON.parse(window.localStorage.getItem("Data")).username} Follow  You! `);
                axios.post("https://mernvideocallapp.onrender.com/addFreiend", { name: el.username, email: JSON.parse(window.localStorage.getItem("Data")).email }).then((res) => {
                    console.log(res.data)
                    if (res.data) {
                        sethidefriend(true);

                    }
                    else {
                        sethidefriend(false);
                    }

                })
                break;
            case e.target.innerHTML = "Remove":
                e.target.innerHTML = "Add";
                e.target.style.color = "white";
                e.target.style.background = "green";
                socket.emit("unreq", `${JSON.parse(window.localStorage.getItem("Data")).username} UnFollow You !`);
                axios.post("https://mernvideocallapp.onrender.com/RemoveFreiend", { name: el.username, email: JSON.parse(window.localStorage.getItem("Data")).email });
                break;
        }

    }
    function uncon(e) {
        setchanename(true);


        axios.post("https://mernvideocallapp.onrender.com/RemoveFreiend", { name: JSON.parse(window.localStorage.getItem("Data")).username, email: JSON.parse(window.localStorage.getItem("Data")).email })
        socket.emit("unreq", `${JSON.parse(window.localStorage.getItem("Data")).username} UnFollow You !`)
    }
    useEffect(() => {
        fetch("https://mernvideocallapp.onrender.com/dost").then((res) => res.json()).then((data) => {

            setfreiends(data.filter((name) => name._id !== JSON.parse(window.localStorage.getItem("Data"))._id));
        })
    }, [])

    return (
        <>
            <h3 className="text-center mb-3 my-3">Make Freinds Here !</h3>

            <div>
                <div className="d-flex my-5 mx-3">
                    <input onChange={(e) => { setinputvalue(e.target.value) }} className="form-control" placeholder="Enter Name here to find !" aria-label="Username" aria-describedby="basic-addon1" />
                    <button className="btn btn-primary" onClick={search}>Find</button>
                </div>
                {/* {!hidefreind ? (
                    <> */}
                {
                    !hide ? (
                        <>
                            {freinds.map((el) => {
                                return <div>
                                    <div style={{ justifyContent: "space-between" }} className=" mx-3 my-2 d-flex">
                                        <h4>{el.username}</h4>
                                        <div className="d-flex">
                                            <button className="btn float-right d-flex mx-1 btn-success" style={{ justifyContent: "space-between" }} onClick={(e) => { con(e, el) }}>Add</button>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            })}
                        </>

                    ) : (null)
                }
                {/* </>
                ) : (null)} */}

                <div>
                    {
                        h.map((el) => {

                            return <div style={{ justifyContent: "space-between" }} className=" mx-3 my-3 d-flex">
                                <h4>{el.username}</h4>
                                <div className="d-flex">
                                    <button className="btn float-right d-flex mx-3 btn-success" style={{ justifyContent: "space-between" }} onClick={(e) => { con(e, el) }}>Add</button>
                                </div>
                            </div>
                        })

                    }

                </div>



            </div >


        </>
    )
}
