import "../../styles/Profile.css"

import eyeIcon from "../../assets/eye.svg"
import userCircle from "../../assets/user-profile-circle.svg"
import editIcon from "../../assets/edit-03.svg"

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { FormControl, FormLabel, Input, Spinner, useDisclosure } from "@chakra-ui/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react'

export default function Profile({cookies}){

    const params = useParams();

    const [user, setUser] = useState({});

    const [posts, setPosts] = useState([]);

    const [edit, setEdit] = useState({name: "", occupation: "", email: "", phone: ""});

    const [owner, setOwner] = useState(false);

    const [loading, setLoading] = useState(true);

    const getUserPosts = () => {

        fetch(`http://localhost:8080/api/get-user-posts`, {
            method: 'POST',
            body: JSON.stringify({
            userid: params.userid
            }),
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
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

    const getUser = () => {
        fetch(`http://localhost:8080/api/get-user`, {
        method: 'POST',
        body: JSON.stringify({
          profileId: params.userid
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('Bearer')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setOwner(data.owner);
        setEdit(data.user)
      })
      .catch((e) => {
        console.log("Something went wrong ", e);
      })
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleEditChange = (event) => {
      setEdit((prevState) => {
        return {
        ...prevState,
        [event.target.name]: event.target.value,
      }
      })
    }

    const handleEditSubmit = () => {

        setLoading(true)

        fetch(`http://localhost:8080/api/edit-profile`, {
        method: 'POST',
        body: JSON.stringify({
            userid: user._id,
            name: edit.name,
            email: edit.email,
            occupation: edit.occupation,
            phone: edit.phone
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
        setEdit(data.user)
        setLoading(false)
    })
      .catch((e) => {
        console.log("Something went wrong ", e);
      })
    }

    useEffect(() => {
        getUser();
        getUserPosts();
    }, [])

    return(
        <>
            <div className="profile-wrapper">
                {loading ? "" : 
                <div className="profile-content">
                    <div className="left-column">
                        <img src={userCircle} />
                        <p className="name">{user.name}</p>
                        <p className="occupation">{user.occupation}</p>
                        <p className="location">Madeira</p>
                        <p className="email">Email: {user.email}</p>
                        <p className="phone">Phone: {user.phone}</p>
                        {owner ? <img onClick={onOpen} src={editIcon} style={{marginRight: "200px"}} /> : ""}
                    </div>
                    <div className="right-column">
                        <p className="title">Posts</p>
                        <div className="posts">
                            {loading ? <Spinner /> : posts.map((post, key) => {
                                return( <Post post={post} key={key} />)
                            })}
                        </div>
                    </div>
                </div>}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Edit Profile Data:</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                        <FormLabel>Name: {user.name}</FormLabel>
                        <Input onChange={handleEditChange} name="name" value={edit.name} placeholder='Name...' />
                        </FormControl>

                        <FormControl mt={4}>
                        <FormLabel>Occupation: {user.occupation}</FormLabel>
                        <Input onChange={handleEditChange} name="occupation" value={edit.occupation} placeholder='Occupation...' />
                        </FormControl>

                        <FormControl mt={4}>
                        <FormLabel>Email: {user.email}</FormLabel>
                        <Input onChange={handleEditChange} name="email" value={edit.email} placeholder='Email...' />
                        </FormControl>

                        <FormControl mt={4}>
                        <FormLabel>Phone: {user.phone}</FormLabel>
                        <Input onChange={handleEditChange} name="phone" value={edit.phone} placeholder='Phone...' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                        </Button>
                        <Button variant='ghost' onClick={() => {onClose(); handleEditSubmit();}}>Save</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}

function Post({post}){


    return(
        <>
            <div className="post-wrapper">
                <p className="title">{post.title}</p>
                <img className="post-image" src={require("../../../../backend/src/public/"+post.image)} />
                <p className="description">
                    {post.description}
                </p>
                <div className="feedback">
                    <img src={eyeIcon} />
                </div>
            </div>
        </>
    )
}