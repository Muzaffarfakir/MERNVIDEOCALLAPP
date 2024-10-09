import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Signup() {
    let [name, SetName] = useState("");
    let [email, setEmail] = useState("");
    let [pass, setPass] = useState("");
    let [load, setLoad] = useState(false);
    let [otp, setotp] = useState("");
    let [des, setdesc] = useState('');
    let [otptime, setopttime] = useState(false);
    let [time, setime] = useState(60);
    let nav = useNavigate();
    let [namechange, SetNameChane] = useState(false);
    let [verifed, setemailVerified] = useState(false);
    let [required, setrequired] = useState(false);
    let [unclicbel, setunclibel] = useState(false);
    let [checkemail, setcheckemail] = useState(false);
    let regex = "/^[^\s@]+@[^\s@]+\.[^\s@]+$/";

    useEffect(() => {

    }, [load, otptime])

    function submit() {
        if (!name || !email || !pass || !otp || !des) {
            setrequired(true);
        } else {
            axios.post("https://mernvideocallapp.onrender.com/sign", { name, email, pass, otp, des }).then((res) => {
                if (res.data === "exist") {
                    setLoad(true);
                    alert("Email is Already in use !");
                    setTimeout(() => {
                        window.location.reload(true);

                    }, 2000);


                }
                else if (res.data === "e") {
                    setLoad(false);
                    alert("Succesfully Signup !");
                    setTimeout(() => {
                        nav("/login");
                    }, 2000)


                }

            });
            setrequired(false);

        }



        setLoad(false);
    }
    function v() {
        axios.post("https://mernvideocallapp.onrender.com/verify", { email, otp }).then((res) => {
            if (res.data == "invalid") {
                alert("Wrong Otp!");
            }
            else {
                setemailVerified(true);

            }
        })
        setemailVerified(false);


    }
    function emailvalidate(email) {
        let atsym = email.includes('@gmail.com');
        return atsym;


    }
    function getotp() {
        if (!emailvalidate(email)) {
            alert("Plzz Enter Validate Email !");
        }

        if (!email) {
            alert("Enter Email !")
        } else {
            axios.post("https://mernvideocallapp.onrender.com/otp", { email }).then((res) => {
                if (res.data == "sendOtp") {
                    setopttime(true);
                    SetNameChane(true);
                    setunclibel(true);

                    let inter = setInterval(() => {
                        setime(prev => {
                            if (prev <= 1) {
                                clearInterval(inter);
                                window.location.reload();
                            }
                            return prev - 1;


                        });



                    }, 1000);


                }
                else {
                    setopttime(false);
                    SetNameChane(false);
                    setunclibel(false)

                }
            })
            setopttime(false);
            SetNameChane(true);

        }
    }



    return (
        <>
            <h3 className="text-center ">
                Signup !
            </h3>
            <div className="mx-3 my-5">

                <div className="input-group mb-3  my-5">
                    <input onChange={(e) => { SetName(e.target.value) }} placeholder="Enter Your UserName! " type="text" className="form-control" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                {required ? (<p className="text-danger d-flex" style={{ justifyContent: "flex-end" }}>*required</p>
                ) : (null)}
                <div className="input-group mb-3 my-5">
                    <input onChange={(e) => { setEmail(e.target.value) }} placeholder="Enter Your Email! " type="email" className="form-control" aria-label="email" aria-describedby="email" />
                </div>
                {required ? (<p className="text-danger d-flex" style={{ justifyContent: "flex-end" }}>*required</p>
                ) : (null)}
                <div className="input-group mb-3 my-5">
                    <input onChange={(e) => { setPass(e.target.value) }} placeholder="Enter Your Passward! " type="password" className="form-control" aria-label="Username" aria-describedby="basic-addon1" />

                </div>
                {required ? (<p className="text-danger d-flex" style={{ justifyContent: "flex-end" }}>*required</p>
                ) : (null)}
                <div className="input-group mb-3 my-5">
                    <textarea onChange={(e) => { setdesc(e.target.value) }} placeholder="write about you! " rows={5} cols={40} type="email" className="form-control" aria-label="Username" aria-describedby="basic-addon1" />

                </div>
                {required ? (<p className="text-danger d-flex" style={{ justifyContent: "flex-end" }}>*required</p>
                ) : (null)}
                {verifed ? (<div className="float-left d-flex text-success" style={{ justifyContent: "flex-end" }}>Eamil is Verifed</div>
                ) : null}
                <div className="input-group mb-3 my-5">
                    <input onChange={(e) => { setotp(e.target.value) }} placeholder="Enter Otp! " type="number" className="form-control" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                {required ? (<p className="text-danger d-flex" style={{ justifyContent: "flex-end" }}>*required</p>
                ) : (null)}
                {otptime ? (<h6 className="float-right d-flex text-primary my-2 mx-3" > 00 : {time} sec</h6>
                ) : null}
            </div>

            <div className="d-flex rounded-pill  mx-3" style={{ width: "200px" }} >
                {!unclicbel ? (<button disabled onClick={submit} className="  mx-auto btn btn-secondary text-center ">Submit</button>
                ) : (<button onClick={submit} className="  mx-auto btn btn-secondary text-center ">Submit</button>
                )}
                {/* <button onClick={submit} className="  mx-auto btn btn-secondary text-center ">Submit</button> */}
                {namechange ? <button className=" mx-auto  btn btn-success " onClick={v}>Verify</button> : (
                    <button className=" mx-auto  btn btn-primary " onClick={getotp}>Get Otp</button>
                )}

            </div>
            {load ? (<h6 className="text-danger text-center my-3">Emaill is Already in use Plzz use diffrent Email!</h6>) : null}
            <div onClick={() => { nav("/login") }} className="my-5 text-center"><strong>I have Account <button className="btn btn-primary">Login </button></strong></div>

        </>
    )
}
