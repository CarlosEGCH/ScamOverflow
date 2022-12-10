import { useEffect, useState } from "react"
import "../../styles/Posts.css"

import { Button, FormControl, FormLabel, Input, Spinner, useDisclosure } from '@chakra-ui/react'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box
} from '@chakra-ui/react'

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select
} from '@chakra-ui/react'

import commentIcon from "../../assets/annotation-typing.svg"
import eyeIcon from "../../assets/eye.svg" 
import userCircle from "../../assets/user-profile-circle.svg"
import dotsIcon from "../../assets/dot-vertical.svg"
import reportIcon from "../../assets/alert-circle.svg"

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

    const handleDeletePost = () => {
        fetch(`http://localhost:8080/api/delete-post`, {
        method: 'POST',
        body: JSON.stringify({
            postid: post._id,
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(res => res.json())
      .then(data => {
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
                    <Menu>
                    <MenuButton style={{marginLeft: "auto"}}>
                        <img src={dotsIcon} style={{width: "25px"}} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
                    </MenuList>
                    </Menu>
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

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [report, setReport] = useState("");

    const handleReportChange = (e) => {
      setReport(e.target.value)
    }

    const handleSubmitReport = () => {
        fetch(`http://localhost:8080/api/report-comment`, {
            method: 'POST',
            body: JSON.stringify({
            commentid: comment._id,
            reason: report
            }),
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.success)            
        })
        .catch((e) => {
            console.log("Something went wrong ", e);
      })
    }

    return(
        <>
        <div className="comment">
            <img src={userCircle} />
            <div className="content">
                <p>{comment.name}</p>
                <p>{comment.comment}</p>
            </div>
            <Menu>
            <MenuButton style={{marginLeft: "auto"}}>
                <img src={reportIcon} style={{width: "20px"}} />
            </MenuButton>
            <MenuList>
                <MenuItem onClick={onOpen}>Report Comment</MenuItem>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Report Comment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p style={{marginBottom: "10px"}}>Comment: {comment.comment}</p>
                        <div style={{marginBottom: "10px"}}>
                            <p style={{fontWeight: "500"}}>Reports: </p>
                            <p>Misinformation: {comment.misinformation}</p>
                            <p>Bad Language: {comment.badlanguage}</p>
                            <p>Spam: {comment.spam}</p>
                        </div>
                        <Select value={report} name="report" onChange={handleReportChange} placeholder='Select Report Reason'>
                            <option value='misinformation'>Misinformation</option>
                            <option value='badlanguage'>Bad Language</option>
                            <option value='spam'>Spam</option>
                        </Select>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                        Ban User
                        </Button>
                        <Button variant='ghost' onClick={() => {onClose(); handleSubmitReport();}}>Report</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </MenuList>
            </Menu>
        </div>
        </>
    )
}