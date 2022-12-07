import "../styles/Dashboard.css"

import pageLogo from "../assets/scamoverflowlogo.png"
import pencilIcon from "../assets/pencil-03.svg"
import imageIcon from "../assets/image.svg"
import penIcon from "../assets/pen-tool-03.svg"
import userIcon from "../assets/user-profile-circle.svg"

import { Button, Select, Textarea } from '@chakra-ui/react'

import Posts from "./Posts/Posts.js"

export default function Dashboard(){

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
                        <div className="post-creation">
                            <div className="header">
                                <div className="share">
                                    <img src={pencilIcon} />
                                    <p>Share a Post</p>
                                </div>
                                <div className="upload">
                                    <img src={imageIcon} />
                                    <p>Upload an Image</p>
                                </div>
                                <div className="write">
                                    <img src={penIcon} />
                                    <p>Write an Article</p>
                                </div>
                            </div>
                            <div className="body">
                                <div className="user">
                                    <img src={userIcon} />
                                    <Textarea border={"none"} placeholder={"Write your thoughts..."} />
                                </div>
                            </div>
                            <div className="footer">
                                <Button backgroundColor={"#1E2835"} color={"white"}>Discard</Button>
                                <Button backgroundColor={"#008CF8"} color={"white"}>Publish</Button>
                            </div>
                        </div>
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
                            Register
                        </div>
                        <div className="moderators">
                            Moderators
                        </div>
                        <div className="categories">
                            Categories
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}