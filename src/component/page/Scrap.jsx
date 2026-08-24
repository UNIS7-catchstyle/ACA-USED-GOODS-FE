import './Scrap.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../element/Button';
import GNB from '../element/GNB'
import Tab from '../element/Tab'
import Dropdown from '../element/Dropdown'
import Post from '../element/Post'
import Footer from '../element/Footer'
import { isLoggedIn } from '../../utils/auth'

function Scrap() {
    const navigate = useNavigate();

    const tabs = ["K-POP", "2D", "뮤지컬", "기타"];
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [loggedIn] = useState(isLoggedIn);
    const [hideClosed, setHideClosed] = useState(false);

    return (
        <div className="scrap">
            <div className="scrap_topsection">
                <div className="scrap_header">
                    <div className="scrap_title">스크랩</div>
                </div>
                {loggedIn && (
                <div className="scrap_tabsection">
                    {tabs.map((tabLabel, index) => (
                    <Tab
                        key={tabLabel}
                        style="Chips"
                        label={tabLabel}
                        state={selectedTabIndex === index ? "Selected" : "Default"}
                        onClick={() => setSelectedTabIndex(index)}
                    />
                    ))}
                </div>
                )}
            </div>
            
            {loggedIn ? (
                <>
                    <div className="scrap_headline">
                        <div className="scrap_total">총 82개</div>
                        <Dropdown onChange={setHideClosed} />
                    </div>
                    <div className="scrap_feed">
                        <Post hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
                    </div>
                </>
            ) : (
                <div className="scrap_guest">
                    <div className="scrap_guest_content">
                        <div>
                            <div className="scrap_guest_content-title">
                                로그인이 필요해요
                            </div>
                            <div className="scrap_guest_content-body">
                                로그인 후 관심있는 마켓을
                                <br />
                                스크랩할 수 있어요.
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
                    <div className="scrap_guest_footer">
                        <Footer />
                    </div>
                </div>
            )}
            <div className="scrap_gnb-wrapper">
                <GNB defaultSelected="bookmark" />
            </div>
        </div>
    )
}

export default Scrap