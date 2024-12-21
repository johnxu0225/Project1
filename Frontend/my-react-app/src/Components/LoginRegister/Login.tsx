import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export const Login:React.FC = () => {

    //TODO: state stuff

    //we can use the useNavigate hook to navigate between components programatically
        //(which means we don't have to manually change the URL to switch components)
    const navigate = useNavigate()


    return(
        <>
            <h3>Login</h3>


            <Button onClick={()=>navigate("/teams")}>Login</Button>
            <Button onClick={()=>navigate("/register")}>Register</Button>

        </>
    )

}