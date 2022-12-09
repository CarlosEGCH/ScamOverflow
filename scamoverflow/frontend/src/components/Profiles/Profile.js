import "../../styles/Profile.css"

import post1 from "../../assets/post1.png"
import eyeIcon from "../../assets/eye.svg"
import userCircle from "../../assets/user-profile-circle.svg"

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Profile({cookies}){

    const params = useParams();

    const [user, setUser] = useState({});

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
                            <Post />
                            <Post />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function Post(){


    return(
        <>
            <div className="post-wrapper">
                <p className="title">Phishing Cases</p>
                <img className="post-image" src={post1} />
                <p className="description">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam eveniet saepe repellat, inventore at sunt laudantium repudiandae ea exercitationem laboriosam praesentium unde eum nulla mollitia magni enim, omnis consectetur magnam.
                </p>
                <div className="feedback">
                    <img src={eyeIcon} />
                </div>
            </div>
        </>
    )
}