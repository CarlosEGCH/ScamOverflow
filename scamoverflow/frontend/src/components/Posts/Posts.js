import { useState } from "react"
import "../../styles/Posts.css"

import { Button, Input } from '@chakra-ui/react'

import jimmy from "../../assets/jimmy.png"
import postImage from "../../assets/twitter-hacker.jpg"
import commentIcon from "../../assets/annotation-typing.svg"
import eyeIcon from "../../assets/eye.svg" 

export default function Posts(){

    const post = {
        image: jimmy,
        name: "Jimmy O Yang",
        occupation: "Student at Harvard",
        date: "October 22, 2022",
        views: 22,
        comments: 5
    }

    const [posts, setPosts] = useState([post,post,post]);

    return(
        <div className="posts-wrapper">
            {posts.map(post => {
              return (<Post post={post} />)
            })}
        </div>
    )
}

function Post({post}){

    return(
        <>
            <div className="post-wrapper">
                <div className="header">
                    <img src={post.image} />
                    <div className="info">
                        <p style={{color:"black", fontSize:"16px", fontWeight:"600"}}>{post.name}</p>
                        <p style={{color:"#558491", fontSize:"14px"}}>{post.occupation}</p>
                    </div>
                    <p style={{color:"#558491", fontSize:"14px", alignSelf:"center"}}>{post.date}</p>
                </div>
                <div className="body">
                    <p className="description">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium voluptates minima temporibus modi expedita numquam dolorem explicabo sed, fugiat doloribus eum ipsa saepe tempora veniam accusamus necessitatibus, corrupti corporis hic!
                    </p>
                    <img src={postImage} />
                </div>
                <div className="feedback">
                    <div className="views">
                        <img src={eyeIcon} />
                        <p>{post.views}</p>
                    </div>
                    <div className="comments">
                        <img src={commentIcon} />
                        <p>{post.comments}</p>
                    </div>
                </div>
                <div className="comment">
                    <Input backgroundColor={"#ECF3F6"} color={"#558491"} placeholder="Add a comment..."></Input>
                    <Button colorScheme={"blue"} backgroundColor={"#40ACFF"}>Send</Button>
                </div>
            </div>
        </>
    )
}