import { useEffect, useState } from "react"
import "../../styles/Posts.css"

import { Button, Input, requiredChakraThemeKeys } from '@chakra-ui/react'

import jimmy from "../../assets/jimmy.png"
import postImage from "../../assets/twitter-hacker.jpg"
import commentIcon from "../../assets/annotation-typing.svg"
import eyeIcon from "../../assets/eye.svg" 
import userCicle from "../../assets/user-profile-circle.svg"

export default function Posts(){

    const post = {
        image: jimmy,
        name: "Jimmy O Yang",
        occupation: "Student at Harvard",
        date: "October 22, 2022",
        views: 22,
        comments: 5
    }

    const [posts, setPosts] = useState([]);

    const getPosts = () => {

        fetch(`http://localhost:8080/api/get-posts`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);        
      })
      .catch((e) => {
        console.log("Something went wrong ", e);
      })

    }

    useEffect(() => {
        getPosts()
    }, [])

    return(
        <div className="posts-wrapper">
            {posts.map((post, key) => {
              return (<Post post={post} key={key} />)
            })}
        </div>
    )
}

function Post({post}){

    return(
        <>
            <div className="post-wrapper">
                <div className="header">
                    <img src={userCicle} />
                    <div className="info">
                        <p style={{color:"black", fontSize:"16px", fontWeight:"600"}}>{post.name}</p>
                        <p style={{color:"#558491", fontSize:"14px"}}>{post.occupation}</p>
                    </div>
                    <p style={{color:"#558491", fontSize:"14px", alignSelf:"center"}}>{post.date}</p>
                </div>
                <div className="body">
                    <p style={{fontSize: "22px", fontWeight: "500"}}>{post.title}</p>
                    <img src={require("../../../../backend/src/public/"+post.image)} />
                    <p className="description">
                        {post.description}
                    </p>
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