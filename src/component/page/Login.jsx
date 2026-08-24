import Button from "../element/Button";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import closeIcon from "../../assets/close.svg";
import logoImage from "../../assets/login/Logo.svg";
import dividerImage from "../../assets/login/Divider.svg";
import kakaoImage from "../../assets/login/Kakao.svg";
import googleImage from "../../assets/login/Google.svg";

function Login() {
    const navigate = useNavigate();

    return (
        <>
            <img className="close-icon" src={closeIcon} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}/>
            <div className="logo-with-slogan">
                <img className="logo" src={logoImage}/>
                <div className="slogan">덕질로 벌고 덕질로 쓰자</div>
                <div className="login-section">
                    <div className="divider-section">
                        <img src={dividerImage} />
                        <div className="label">로그인/회원가입</div>
                        <img src={dividerImage} />
                    </div>
                    <img className="kakao" src={kakaoImage} onClick={() => navigate('/policy-agree-page', { state: { role: 'seller' } })} style={{ cursor: 'pointer' }} />
                    <img className="google" src={googleImage} onClick={() => navigate('/policy-agree-page', { state: { role: 'buyer' } })} style={{ cursor: 'pointer' }} />
            </div>
                </div>
        </>
    );
}
export default Login;