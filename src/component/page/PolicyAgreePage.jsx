import Button from "../element/Button";
import PolicyAgree from "../element/PolicyAgree";
import CloseIcon from "../../assets/close.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { agreeToTerms } from "../../api/terms";
import { setAuthTokens } from "../../api/client";
import "./PolicyAgreePage.css";

function PolicyAgreePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const pendingAuth = location.state;

    useEffect(() => {
        // 로그인 응답으로 전달받은 임시 토큰이 없으면(직접 접근 등) 로그인부터 다시 진행하도록 한다.
        if (!pendingAuth?.accessToken) {
            navigate("/login", { replace: true });
        }
    }, [pendingAuth, navigate]);

    const [allTermButtonState, setAllTermButtonState] = useState("Inactive");
    const [termButtonState1, setTermButtonState1] = useState("Selected");
    const [termButtonState2, setTermButtonState2] = useState("Selected");
    const [termButtonState3, setTermButtonState3] = useState("Selected");
    const [termButtonState4, setTermButtonState4] = useState("Selected");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isRequiredTermsSelected =
        termButtonState1 === "Default" && termButtonState2 === "Default";

    return(
        <div className="policyagreepage">
            <div className="signup-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={ CloseIcon } alt="Close"
            onClick={() => navigate(-1)} 
            style={{ cursor: 'pointer' }} />            
            </div>
            
            <div className="signup-label">
                즐겁고 안전한 굿즈 거래를
                <br />
                시작하려면 약관 동의가 필요해요
            </div>
            <Button className="alltermbutton"
                variant="약관동의"
                label="전체 동의하기"
                state={allTermButtonState}
                onClick={() => {
                    if (allTermButtonState === "Inactive") {
                        setAllTermButtonState("Default");
                        setTermButtonState1("Default");
                        setTermButtonState2("Default");
                        setTermButtonState3("Default");
                        setTermButtonState4("Default");
                    } else {
                        setAllTermButtonState("Inactive");
                        setTermButtonState1("Selected");
                        setTermButtonState2("Selected");
                        setTermButtonState3("Selected");
                        setTermButtonState4("Selected");
                    }}}
             />
            <PolicyAgree className="termbutton_1"
            label="(필수)Email 및 SNS 광고성 정보 수신동의" property1={termButtonState1} onClick={() => {
                if (termButtonState1 === "Default") {
                    setTermButtonState1("Selected");
                } else {
                    setTermButtonState1("Default");
                }
            }} />
            <PolicyAgree className="termbutton_2"
            label="(필수)Email 및 SNS 광고성 정보 수신동의" property1={termButtonState2} onClick={() => {
                if (termButtonState2 === "Default") {
                    setTermButtonState2("Selected");
                } else {
                    setTermButtonState2("Default");
                }
            }} />
            <PolicyAgree className="termbutton_3"
            label="(선택)Email 및 SNS 광고성 정보 수신동의" property1={termButtonState3} onClick={() => {
                if (termButtonState3 === "Default") {
                    setTermButtonState3("Selected");
                } else {
                    setTermButtonState3("Default");
                }
            }} />
            <PolicyAgree className="termbutton_4"
            label="(선택)Email 및 SNS 광고성 정보 수신동의" property1={termButtonState4} onClick={() => {
                if (termButtonState4 === "Default") {
                    setTermButtonState4("Selected");
                } else {
                    setTermButtonState4("Default");
                }
            }} />
           
           <div className="button-section">
            <Button
            className="button"
            label="동의하고 시작하기"
            state={isRequiredTermsSelected && !isSubmitting ? "Default" : "Inactive"}
            onClick={async () => {
                if (!isRequiredTermsSelected || isSubmitting) return;

                setIsSubmitting(true);
                try {
                    await agreeToTerms({
                        requiredAgreed: isRequiredTermsSelected,
                        marketingEmailAgreed: termButtonState3 === "Default",
                        marketingSnsAgreed: termButtonState4 === "Default",
                        accessToken: pendingAuth?.accessToken,
                    });
                    setAuthTokens(pendingAuth);
                    navigate('/');
                } catch (error) {
                    alert(error.message || "약관 동의 처리에 실패했습니다.");
                } finally {
                    setIsSubmitting(false);
                }
            }}
        />
        </div>
       </div>
    );
}
export default PolicyAgreePage;