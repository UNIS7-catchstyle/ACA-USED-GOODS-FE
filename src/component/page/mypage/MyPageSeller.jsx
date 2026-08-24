import './MyPageSeller.css';
import Dropdown from '../../element/Dropdown';
import DragHandle from '../../../assets/icon/DragHandle.svg'
import Dummy from '../../../assets/Dummy.png';
import image1 from '../../../assets/Dummy_Photo_L.png';
import image2 from '../../../assets/Dummy_Photo_L.png';
import image3 from '../../../assets/Dummy_Photo_L.png';
import Tab from '../../element/Tab'
import GNB from '../../element/GNB'
import Post from '../../element/Post'
import Button from '../../element/Button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getComments } from '../../../utils/comments'

function MyPageSeller() {
    const navigate = useNavigate()
    const [selectedTab, setSelectedTab] = useState('written')
    const [comments] = useState(getComments)
    const [hideClosed, setHideClosed] = useState(false)

    return (
        <div className="mypageseller">
            <div className="mypageseller_topsection">
                <div className="mypageseller_header">
                    <div className="mypageseller_title">닉네임</div>
                    <img className="mypageseller_draghandle" src={DragHandle} alt="드래그 핸들" onClick={() => navigate('/setting-and-activity')} />
                </div>
                <div className="mypageseller_tabsection">
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
            {selectedTab === 'written' ? (
                <>
                    <div className="mypageseller_container">
                        <Post style="L" images={[image1, image2, image3]} isOwner />
                        <Button
                            label="수정하기"
                            state="default"
                            style="secondary"
                            size="M"
                            onClick={() => navigate('/market-register', { state: { mode: 'edit' } })}
                        />
                    </div>
                </>
            ) : (
                <>
                    {comments.length === 0 ? (
                        <div className="mypageseller_empty-state">
                            <strong>아직 등록된 댓글이 없어요</strong>
                            <span>지금 바로 마켓에 
                                <br />댓글을 등록해 보세요!</span>
                        </div>
                    ) : (
                        <>
                            <div className="home_headline">
                                <img src={Dummy} alt="Dummy" />
                                <Dropdown onChange={setHideClosed} />
                            </div>
                            <div className="home_feed">
                                {comments.map((comment) => <Post key={comment.id} hideClosed={hideClosed} />)}
                            </div>
                        </>
                    )}
                </>
            )}
            <div className="mypageseller_gnb-wrapper">
                <GNB defaultSelected="mypage" />
            </div>
        </div>
    );
}

export default MyPageSeller;