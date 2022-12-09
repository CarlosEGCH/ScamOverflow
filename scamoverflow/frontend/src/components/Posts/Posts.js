import { useEffect, useState } from "react"
import "../../styles/Posts.css"

import { Button, Input, Spinner } from '@chakra-ui/react'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box
} from '@chakra-ui/react'

import jimmy from "../../assets/jimmy.png"
import postImage from "../../assets/twitter-hacker.jpg"
import commentIcon from "../../assets/annotation-typing.svg"
import eyeIcon from "../../assets/eye.svg" 
import userCircle from "../../assets/user-profile-circle.svg"

export default function Posts({cookies}){

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true)

    const getPosts = () => {

        setLoading(true);

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
        setLoading(false);        
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
            {loading ? "" : posts.map((post, key) => {
              return (<Post post={post} key={key} cookies={cookies} getPosts={getPosts} />)
            })}
        </div>
    )
}

function Post({post, cookies, getPosts}){

    const [comment, setComment] = useState("");

    const handleCommentChange = (e) => {
      setComment(e.target.value)
    }

    const handleCommentSubmit = () => {
        fetch(`http://localhost:8080/api/create-comment`, {
        method: 'POST',
        body: JSON.stringify({
            postid: post._id,
            comment: comment
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('Bearer')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setComment("");
        getPosts();
      })
      .catch((e) => {
        console.log("Something went wrong ", e);
      })
    }

    return(
        <>
            <div className="post-wrapper">
                <div className="header">
                    <img src={userCircle} />
                    <div className="info">
                        <p style={{color:"black", fontSize:"16px", fontWeight:"600"}}>{post.name}</p>
                        <p style={{color:"#558491", fontSize:"14px"}}>{post.occupation}</p>
                    </div>
                    <p style={{color:"#558491", fontSize:"14px", alignSelf:"center", visibility: "hidden"}}>October 22, 2022</p>
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
                    </div>
                </div>
                <Accordion allowToggle>
                    <AccordionItem>
                        <h2>
                        <AccordionButton>
                            <Box fontWeight={500} flex='1' textAlign='left'>
                                <p>Comments</p>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <div className="comment-section">
                                {post.comments.map((comment, key) => {
                                    return(<Comment key={key} comment={comment} />)
                                })}
                            </div>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                {cookies.get("Bearer") == undefined ? "" : 
                <div className="comment">
                    <Input value={comment} name="comment" onChange={handleCommentChange} backgroundColor={"#ECF3F6"} color={"#558491"} placeholder="Add a comment..."></Input>
                    <Button onClick={handleCommentSubmit} colorScheme={"blue"} backgroundColor={"#40ACFF"}>Send</Button>
                </div>}
            </div>
        </>
    )
}

function Comment({comment}){

    return(
        <>
        <div className="comment">
            <img src={userCircle} />
            <div className="content">
                <p>{comment.name}</p>
                <p>{comment.comment}</p>
            </div>
        </div>
        </>
    )
}