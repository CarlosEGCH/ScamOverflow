import "../../styles/Profile.css"

import post1 from "../../assets/post1.png"
import eyeIcon from "../../assets/eye.svg"
import userCircle from "../../assets/user-profile-circle.svg"

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Spinner } from "@chakra-ui/react"

export default function Profile({cookies}){

    const params = useParams();

    const [user, setUser] = useState({});

    const [posts, setPosts] = useState([]);

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

    const getModerators = () => {
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
      })
      .catch((e) => {
        console.log("Something went wrong ", e);
      })
    }

    useEffect(() => {
        getModerators();
        getUserPosts();
    }, [])

    return(
        <>
            <div className="profile-wrapper">
                <div className="profile-content">
                    <div className="left-column">
                        <img src={userCircle} />
                        <p className="name">{user.name}</p>
                        <p className="occupation">{user.occupation}</p>
                        <p className="location">Madeira</p>
                        <p className="email">Email: {user.email}</p>
                        <p className="phone">Phone: (+351){user.phone}</p>
                    </div>
                    <div className="right-column">
                        <p className="title">Posts</p>
                        <div className="posts">
                            {loading ? <Spinner /> : posts.map((post, key) => {
                                return( <Post post={post} key={key} />)
                            })}
                        </div>
                    </div>
                </div>
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