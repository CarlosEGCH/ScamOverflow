import "../styles/Dashboard.css"

import pageLogo from "../assets/scamoverflowlogo.png"
import pencilIcon from "../assets/pencil-03.svg"
import imageIcon from "../assets/image.svg"
import penIcon from "../assets/pen-tool-03.svg"
import userIcon from "../assets/user-profile-circle.svg"
import cartIcon from "../assets/cart.svg"
import phishingIcon from "../assets/user-profile-x.svg"
import cryptoIcon from "../assets/crypto.svg"
import hackingIcon from "../assets/hacking.svg"
import phoneIcon from "../assets/phone.svg"
import cardIcon from "../assets/card.svg"
import malwareIcon from "../assets/malware.svg"

import userCircle from "../assets/user-profile-circle.svg"

import { Button, Select, Textarea, Input } from '@chakra-ui/react'

import Posts from "./Posts/Posts.js"
import { useEffect, useState, useRef } from "react"

import { useNavigate } from "react-router-dom";

export default function Dashboard({cookies}){

    const [moderators, setModerators] = useState([]);

    const getModerators = () => {
        fetch(`http://localhost:8080/api/get-moderators`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        setModerators(data.users)
      })
      .catch((e) => {
        console.log("Something went wrong ", e);
      })
    }

    useEffect(() => {
        getModerators();
    }, [])

    return(
        <>
            <div className="dashboard-wrapper">
                <div className="dashboard-content">
                    <div className="left-column">
                        <div className="welcome">
                            <div className="header">
                                <p>Welcome to ScamOverflow!</p>
                            </div>
                            <div className="body">
                                <img src={pageLogo} />
                                <p>This platform provides the necessary information to help victims of online fraud by communicating with our experienced moderators.</p>
                            </div>
                            <div className="footer">
                                <p>Create an account, let us help you.</p>
                                <Button color={"white"} backgroundImage={"linear-gradient(180deg, #008CF8 0%, #9CD4FF 100%);"}>Start Now!</Button>
                            </div>
                        </div>
                        <div className="graph">
                        </div>
                    </div>
                    <div className="middle-column">
                        <Postcreation cookies={cookies} />
                        <div className="filter">
                            <Select color={"#558491"} borderColor={"#558491"}>
                                <option value='option1'>Popular</option>
                                <option value='option2'>Views</option>
                                <option value='option3'>Newest</option>
                            </Select>
                        </div>
                        <div className="posts">
                            <Posts />
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="register">
                            <p>Become an Associate</p>
                            <Button width={"120px"} margin={"20px 0px"} colorScheme={"blue"}>Register Here!</Button>
                        </div>
                        <div className="moderators">
                            <div className="header">
                                <p>Meet the moderators</p>
                            </div>
                            {moderators.map((mod, key) => {
                                return (<Moderator moderator={mod} key={key} />)
                            })}
                        </div>
                        <div className="categories">
                            <div className="header">
                                <p>Categories</p>
                            </div>
                            <div className="categories-list">
                                <div className="category">
                                    <img src={cartIcon} />
                                    <p className="name">Online Shopping</p>
                                </div>
                                <div className="category">
                                    <img src={phishingIcon} />
                                    <p className="name">Phishing and Identity Theft</p>
                                </div>
                                <div className="category">
                                    <img src={cryptoIcon} />
                                    <p className="name">Cryptocurrency Scams</p>
                                </div>
                                <div className="category">
                                    <img src={hackingIcon} />
                                    <p className="name">Hacking</p>
                                </div>
                                <div className="category">
                                    <img src={phoneIcon} />
                                    <p className="name">Fake Tech Support</p>
                                </div>
                                <div className="category">
                                    <img src={cardIcon} />
                                    <p className="name">Fake Online Prizes</p>
                                </div>
                                <div className="category">
                                    <img src={malwareIcon} />
                                    <p className="name">Malware Scams</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function Moderator({moderator}){

    const navigate = useNavigate();


    return(
        <>
            <div className="moderator-wrapper" onClick={() => {navigate("/profile/"+moderator._id)}}>
                <img src={userCircle} />
                <div className="moderator-info">
                    <p className="name">{moderator.name}</p>
                    <p className="occupation">{moderator.occupation}</p>
                </div>
            </div>
        </>
    )
}

function Postcreation({cookies}){

    const [post, setPost] = useState({title: "", description: ""});

    const [image, setImage] = useState({data: ""});

    const handlePostChange = (event) => {
        setPost((prevState) => {
            return {
            ...prevState,
            [event.target.name]: event.target.value,
        }
        })
    }

    const handleFileChange = (e) => {
        const img = {
        data: e.target.files[0],
        }
        setImage(img)
    }

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('file', image.data);

        await fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            body: formData,
            }).then(res => res.json())
            .then(async (data) => {
                    await fetch(`http://localhost:8080/api/create-post`, {
                    method: 'POST',
                    body: JSON.stringify({
                    title: post.title,
                    description: post.description,
                    image: data.filename
                }),
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get('Bearer')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                setPost({})
            })
            .catch((e) => {
                console.log('Something went wrong',e);
            })
            })
            .catch((e)=> {console.log('Image not uploaded', e)})
        }

        // Create a reference to the hidden file input element
        const hiddenFileInput = useRef(null);
        
        const handleClick = event => {
            hiddenFileInput.current.click();
        };

    return(
        <>
            <div className="post-creation">
                <div className="header">
                    <div className="share">
                        <img src={pencilIcon} />
                        <p>Share a Post</p>
                    </div>
                    <div className="upload" onClick={handleClick}>
                        <img src={imageIcon} />
                        <p>Upload an Image</p>
                        <input ref={hiddenFileInput} onChange={handleFileChange} type="file" id="file" style={{display: "none"}} />
                    </div>
                    <div className="write">
                        <img src={penIcon} />
                        <p>Write an Article</p>
                    </div>
                </div>
                <div className="body">
                    <Input name="title" onChange={handlePostChange} placeholder="Add a title for the post..." />
                    <div className="user">
                        <Textarea onChange={handlePostChange} border={"none"} placeholder={"Write your thoughts..."} name="description" />
                    </div>
                </div>
                <div className="footer">
                    <Button backgroundColor={"#1E2835"} color={"white"}>Discard</Button>
                    <Button backgroundColor={"#008CF8"} color={"white"} onClick={handleSubmit}>Publish</Button>
                </div>
            </div>
        </>
    )
}