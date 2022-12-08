import "../../styles/Profile.css"

import userImage from "../../assets/cr7.jpg"
import post1 from "../../assets/post1.png"
import eyeIcon from "../../assets/eye.svg"

export default function Profile(){


    return(
        <>
            <div className="profile-wrapper">
                <div className="profile-content">
                    <div className="left-column">
                        <img src={userImage} />
                        <p className="name">Cristiano Ronaldo</p>
                        <p className="occupation">Sales Manager and Administrator</p>
                        <p className="location">Madeira</p>
                        <p className="email">Email: test@gmail.com</p>
                        <p className="phone">Phone: (+351)123123123</p>
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