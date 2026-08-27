import Button from "../element/Button";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getMyInfo, loginWithOAuth } from "../../api/auth";
import closeIcon from "../../assets/close.svg";
import logoImage from "../../assets/login/Logo.svg";
import dividerImage from "../../assets/login/Divider.svg";
import kakaoImage from "../../assets/login/Kakao.svg";
import googleImage from "../../assets/login/Google.svg";

const KAKAO_JAVASCRIPT_KEY = "241bd080540d6f5be3fa0ffd14ba4e14";
const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/1.43.1/kakao.min.js";
const GOOGLE_CLIENT_ID = "522035232294-fqsr2r5dtu0009b9hp54bisk8u4cpp61.apps.googleusercontent.com";
const GOOGLE_SDK_URL = "https://accounts.google.com/gsi/client";

function loadKakaoSdk() {
    if (typeof window.Kakao?.Auth?.login === "function") {
        return Promise.resolve(window.Kakao);
    }

    window.Kakao?.cleanup?.();
    delete window.Kakao;
    document.querySelectorAll('script[src*="kakao_js_sdk"]').forEach((script) => script.remove());

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = KAKAO_SDK_URL;
        script.async = true;
        script.onload = () => resolve(window.Kakao);
        script.onerror = () => reject(new Error("카카오 로그인 SDK를 불러오지 못했습니다."));
        document.head.appendChild(script);
    });
}

function loadGoogleSdk() {
    if (window.google?.accounts?.oauth2) {
        return Promise.resolve(window.google);
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = GOOGLE_SDK_URL;
        script.async = true;
        script.onload = () => resolve(window.google);
        script.onerror = () => reject(new Error("Google 로그인 SDK를 불러오지 못했습니다."));
        document.head.appendChild(script);
    });
}

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const navigateAfterLogin = async (authData) => {
        if (authData.needsTermsAgreement) {
            navigate("/policy-agree-page", {
                state: { accessToken: authData.accessToken, refreshToken: authData.refreshToken },
            });
            return;
        }

        const response = await getMyInfo();
        navigate(response.data?.hasMarket ? "/mypage-seller" : "/mypage-pre");
    };

    const handleKakaoLogin = async () => {
        setError("");
        setIsLoggingIn(true);

        try {
            const kakao = await loadKakaoSdk();
            if (!kakao?.isInitialized()) {
                kakao.init(KAKAO_JAVASCRIPT_KEY);
            }

            kakao.Auth.login({
                success: async ({ access_token: accessToken }) => {
                    try {
                        const authData = await loginWithOAuth("KAKAO", accessToken);
                        await navigateAfterLogin(authData);
                    } catch (loginError) {
                        setError(loginError.message || "로그인에 실패했습니다.");
                    } finally {
                        setIsLoggingIn(false);
                    }
                },
                fail: () => {
                    setError("카카오 로그인이 취소되었거나 실패했습니다.");
                    setIsLoggingIn(false);
                },
            });
        } catch (loginError) {
            setError(loginError.message || "로그인을 시작하지 못했습니다.");
            setIsLoggingIn(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setIsLoggingIn(true);

        try {
            const google = await loadGoogleSdk();
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: "openid email profile",
                callback: async (response) => {
                    if (response.error || !response.access_token) {
                        setError("Google 로그인이 취소되었거나 실패했습니다.");
                        setIsLoggingIn(false);
                        return;
                    }

                    try {
                        const authData = await loginWithOAuth("GOOGLE", response.access_token);
                        await navigateAfterLogin(authData);
                    } catch (loginError) {
                        setError(loginError.message || "로그인에 실패했습니다.");
                    } finally {
                        setIsLoggingIn(false);
                    }
                },
            });

            tokenClient.requestAccessToken({ prompt: "select_account" });
        } catch (loginError) {
            setError(loginError.message || "로그인을 시작하지 못했습니다.");
            setIsLoggingIn(false);
        }
    };

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
                        <img className="kakao" src={kakaoImage} alt="카카오로 로그인" onClick={isLoggingIn ? undefined : handleKakaoLogin} style={{ cursor: isLoggingIn ? 'wait' : 'pointer' }} />
                        <img className="google" src={googleImage} alt="Google로 로그인" onClick={isLoggingIn ? undefined : handleGoogleLogin} style={{ cursor: isLoggingIn ? 'wait' : 'pointer' }} />
                        {error && <p className="login-error" role="alert">{error}</p>}
            </div>
                </div>
        </>
    );
}
export default Login;