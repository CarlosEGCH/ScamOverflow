
import { useViewport } from '../hooks/responsive.js';


export default function Navbar(){

  const { width } = useViewport();

    return(
        <>
            <div>
                <p>Navbar! {width > 900 ? "Desktop" : "Mobile"}</p>
            </div>
        </>
    )
}