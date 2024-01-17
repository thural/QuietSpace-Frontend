import {useState} from "react"
import Overlay from "../Overlay"
import styles from "./styles/loginFormStyles"
import {useDispatch} from "react-redux"
import {authenticate, overlay, signup} from "../../redux/formViewReducer"
import {LOGIN_URL} from "../../constants/ApiPath"
import {fetchLogin} from "../../api/authRequests"
import {loadAuth} from "../../redux/authReducer"


const LoginForm = () => {

    const dispatch = useDispatch();
    const classes = styles();

    const [formData, setFormData] = useState({email: '', password: ''});

    const handleChange = (event) => {
        const {name, value} = event.target
        setFormData({...formData, [name]: value})
    }

    const handleLoginForm = async (event) => {
        event.preventDefault();
        try {
            const response = await fetchLogin(LOGIN_URL, formData);
            const responseData = await response.json();
            dispatch(loadAuth(responseData));
            dispatch(overlay());
            dispatch(authenticate())
        } catch (error) {
            console.log("error from login form on submit: ", error)
        }
    }

    return (
        <>
            <div className={classes.login}>
                <h1>Login</h1>
                <form
                    className='login form'
                    onSubmit={handleLoginForm}>

                    <div className="login input">
                        <input
                            type='text'
                            name='email'
                            placeholder="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type='password'
                            name='password'
                            placeholder="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type='submit'>login</button>
                </form>
                <h3>don't have an account?</h3>
                <button type='button' onClick={() => dispatch(signup())}>signup</button>
            </div>
        </>
    )
}

export default LoginForm