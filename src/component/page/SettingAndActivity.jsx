import './SettingAndActivity.css';
import SettingCardList from '../element/SettingCardList';
import Button from '../element/Button';
import TextButton from '../element/TextButton';
import Modal from '../element/Modal';
import Dummy from '../../assets/Dummy.png'
import ArrowBack from '../../assets/arrow_back.svg'
import { isLoggedIn, logout } from '../../utils/auth'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SettingAndActivity() {
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState(isLoggedIn)
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
    const [isLogoutDoneOpen, setIsLogoutDoneOpen] = useState(false)
    const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false)
    const [isWithdrawDoneOpen, setIsWithdrawDoneOpen] = useState(false)

    const handleLogout = () => {
        logout()
        setLoggedIn(false)
        setIsLogoutConfirmOpen(false)
        setIsLogoutDoneOpen(true)
    }

    const handleWithdraw = () => {
        logout()
        setLoggedIn(false)
        setIsWithdrawConfirmOpen(false)
        setIsWithdrawDoneOpen(true)
    }

    return (
        <div className="setting-and-activity">
            <div className="setting-and-activity-container">
                <div className="setting-and-activity-header">
                    <img className="setting-and-activity-back" src={ArrowBack} alt="뒤로가기" onClick={() => navigate(-1)} />
                    <div className="setting-and-activity-header-title">설정 및 활동</div>
                    <img className="setting-and-activity-dummy" src={Dummy} alt="더미" />
                </div>
                <div className="setting-and-activity-content">
                    <SettingCardList />
                    <SettingCardList label="아카 스텝에게 문의하기" />
                </div>
            </div>
                {loggedIn ? (
                    <div className="setting-and-activity-settingfooter">
                        <TextButton label="회원탈퇴" onClick={() => setIsWithdrawConfirmOpen(true)} />
                        <TextButton label="로그아웃" style="underBar" onClick={() => setIsLogoutConfirmOpen(true)} />
                    </div>
                ) : (
                    <div className="setting-and-activity-buttonsection">
                        <Button label="로그인하기" onClick={() => navigate('/login')} />
                    </div>
                )}
                {isLogoutConfirmOpen && (
                    <Modal
                        title="정말 로그아웃하시겠습니까?"
                        subtitle={<>로그아웃해도 마켓 정보는<br />안전하게 보관돼요.</>}
                        contentClassName="logout-modal-content"
                        buttons={[
                            {
                                label: "로그아웃",
                                variant: "secondary",
                                size: "M",
                                buttonStyle: { width: "100%" },
                                onClick: handleLogout,
                            },
                            {
                                label: "취소",
                                variant: "primary",
                                size: "M",
                                buttonStyle: { width: "100%" },
                                onClick: () => setIsLogoutConfirmOpen(false),
                            },
                        ]}
                    />
                )}
                {isLogoutDoneOpen && (
                    <Modal
                        title="로그아웃되었습니다."
                        subtitle={null}
                        contentClassName="logout-modal-content"
                        buttons={[
                            {
                                label: "확인",
                                variant: "primary",
                                size: "M",
                                buttonStyle: { width: "100%" },
                                onClick: () => setIsLogoutDoneOpen(false),
                            },
                        ]}
                    />
                )}
                {isWithdrawConfirmOpen && (
                    <Modal
                        title="정말 탈퇴하시겠습니까?"
                        subtitle={<>계정을 탈퇴하면 활동 기록과<br />마켓 데이터가 삭제돼요.</>}
                        contentClassName="logout-modal-content"
                        buttons={[
                            {
                                label: "탈퇴하기",
                                variant: "secondary",
                                size: "M",
                                buttonStyle: { width: "100%" },
                                onClick: handleWithdraw,
                            },
                            {
                                label: "취소",
                                variant: "primary",
                                size: "M",
                                buttonStyle: { width: "100%" },
                                onClick: () => setIsWithdrawConfirmOpen(false),
                            },
                        ]}
                    />
                )}
                {isWithdrawDoneOpen && (
                    <Modal
                        title="탈퇴가 완료되었습니다."
                        subtitle={null}
                        contentClassName="logout-modal-content"
                        buttons={[
                            {
                                label: "확인",
                                variant: "primary",
                                size: "M",
                                buttonStyle: { width: "100%" },
                                onClick: () => setIsWithdrawDoneOpen(false),
                            },
                        ]}
                    />
                )}
        </div>
    );
}

export default SettingAndActivity;