import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    let nav = useNavigate();
    let [cokkies, setcokkies, removecokies] = useCookies(["access_token"]);
    let [emoji, setemoji] = useState([]);

    let ar = ['e0-6-grinning-face-with-smiling-eyes',
        'e0-6-beaming-face-with-smiling-eyes',
        'e1-0-slightly-smiling-face',
        'e0-6-smiling-face-with-smiling-eyes',
        'e1-0-smiling-face-with-halo',
        'e11-0-smiling-face-with-hearts',
        'e0-6-smiling-face-with-heart-eyes',
        'e0-6-smiling-face',
        'e1-0-kissing-face-with-smiling-eyes',
        'e13-0-smiling-face-with-tear',
        'e1-0-smiling-face-with-open-hands',
        'e1-0-smiling-face-with-sunglasses',
        'e1-0-smiling-face-with-horns',
        'e0-6-grinning-cat-with-smiling-eyes',
        'e0-6-smiling-cat-with-heart-eyes']

    function Logout() {
        removecokies("access_token")
        window.localStorage.clear();
        nav("/login")

    }
   
    
    useEffect(() => {

        fetch(`https://emoji-api.com/emojis/e0-6-beaming-face-with-smiling-eyes?access_key=d0cebcb8a85b317c108b5af34815c8ea4eb83a6a`).then((res) => res.json()).then((data) => {
            console.log(data);
            setemoji(data);
        })

    }, [])
    let arr = [];
    arr.push(JSON.parse(window.localStorage.getItem("Data")));

    return (
        <>
            <div>
                {emoji.map((el) => {
                    return <div className=" my-5  w-50 text-center mx-auto d-flex ">
                        <h1 className="text-center d-flex mx-auto my-3" style={{ fontSize: "10rem" }}>{el.character}</h1>
                    </div>

                })}


                {
                    arr.map((el) => {
                        return < div >

                            <h4 className="my-3 mx-3">{el.username}</h4>
                            <p className="mx-3 mb-3">{el.des}</p>




                        </div >

                    })
                }

                <button className="btn mx-3 my-5 btn-danger " onClick={Logout}
                >Logout</button>
                <hr />


            </div>

        </>
    )
}