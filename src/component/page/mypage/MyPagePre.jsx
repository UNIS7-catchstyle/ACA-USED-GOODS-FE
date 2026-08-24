import './MyPagePre.css'
import GNB from '../../element/GNB'
import Tab from '../../element/Tab'
import Button from '../../element/Button'
import DragHandle from '../../../assets/icon/DragHandle.svg'
import TextField from '../../element/TextField'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn, logout } from '../../../utils/auth'
import { useState } from 'react'

function MyPagePre() {
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState(isLoggedIn)
    const [selectedTab, setSelectedTab] = useState('written')

    const handleLogout = () => {
        logout()
        setLoggedIn(false)
    }

    return (
        <div className="mypagepre">
            <div className="mypagepre_topsection">
                <div className="mypagepre_header">
                    {loggedIn ? (
                        <div className="mypagepre_title">닉네임</div>
                    ) : (
                        <div className="mypagepre_title">마이페이지</div>
                    )}
                    <img className="mypagepre_draghandle" src={DragHandle} alt="드래그 핸들" onClick={() => navigate('/setting-and-activity')} />
                </div>
                <div className="mypagepre_tabsection">
                    <Tab
                        style="Underbar"
                        label="내가 쓴 글"
                        state={selectedTab === 'written' ? 'Selected' : 'Default'}
                        onClick={() => setSelectedTab('written')}
                    />
                    <Tab
                        style="Underbar"
                        label="댓글 단 글"
                        state={selectedTab === 'commented' ? 'Selected' : 'Default'}
                        onClick={() => setSelectedTab('commented')}
                    />
                </div>
            </div>
            {loggedIn ? (
                <div className="mypagepre_content">
                    <div>
                        <div className="mypagepre_content-title">
                            {selectedTab === 'commented' ? (
                                <>
                                    아직 등록된 댓글이 없어요
                                </>
                            ) : (
                                <>
                                    아직 등록된 마켓이 없어요
                                </>
                            )}
                        </div>
                        <div className="mypagepre_content-body">
                            {selectedTab === 'commented' ? (
                                <>
                                    지금 바로 마켓에
                                    <br />
                                    댓글을 등록해 보세요!
                                </>
                            ) : (
                                <>
                                    지금 바로
                                    <br />
                                    마켓 정보를 등록해 보세요!
                                </>
                            )}
                        </div>
                    </div>
                    {selectedTab === 'written' && (
                        <Button
                            state="default"
                            style="primary"
                            size="S"
                            label="내 마켓 등록하기"
                            onClick={() => navigate('/market-register')}
                        />
                    )}
                    
                </div>
            ) : (
                <div className="mypagepre_content">
                    <div>
                        <div className="mypagepre_content-title">
                            로그인이 필요해요
                        </div>
                        <div className="mypagepre_content-body">
                            {selectedTab === 'commented' ? (
                                <>
                                    로그인 후 댓글 단 글을
                                    <br />
                                    조회할 수 있어요!
                                </>
                            ) : (
                                <>
                                    로그인 후 마켓 등록이
                                    <br />
                                    가능해요!
                                </>
                            )}
                        </div>
                    </div>
                    <Button
                        state="default"
                        style="primary"
                        size="S"
                        label="로그인/회원가입"
                        onClick={() => navigate('/login')}
                    />
                </div>
            )}
            <div className="mypagepre_gnb-wrapper">
                <GNB defaultSelected="mypage" />
            </div>
        </div>
    )
}

export default MyPagePre