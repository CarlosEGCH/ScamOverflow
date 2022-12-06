
import "../styles/Navbar.css"
import { useViewport } from '../hooks/responsive.js';

import messageIcon from "../assets/message-square-plus.svg"
import ticketIcon from "../assets/mail-03.svg"
import bellIcon from "../assets/bell-03.svg"
import userIcon from "../assets/user-profile-02.svg"
import pageLogo from "../assets/scamoverflowlogo.png"

export default function Navbar(){

  const { width } = useViewport();

    return(
        <>
            <div className="navbar-wrapper">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <img src={pageLogo} />
                        <p>ScamOverflow</p>
                    </div>
                    <div className="navbar-links">
                        <ul>
                            <li>
                                <img src={messageIcon} />
                                <p>Report Scam</p>
                            </li>
                            <li>
                                <img src={ticketIcon} />
                                <p>Tickets</p>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar-options">
                        <ul>
                            <li>
                                <img src={bellIcon} />
                            </li>
                            <li>
                                <img src={userIcon} />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}