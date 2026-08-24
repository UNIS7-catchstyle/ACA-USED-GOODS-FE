import './MyPageBuyer.css';
import Dropdown from '../../element/Dropdown';
import Post from '../../element/Post';
import DragHandle from '../../../assets/icon/DragHandle.svg';
import GNB from '../../element/GNB';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getComments } from '../../../utils/comments';
function MyPageBuyer() {
    const navigate = useNavigate();
    const [comments] = useState(getComments);
    const [hideClosed, setHideClosed] = useState(false);

    return (
        <div className="mypagebuyer">
            <div className="mypagebuyer_topsection">
                <div className="mypagebuyer_header">
                    <div className="mypagebuyer_title">닉네임</div>
                    <img className="mypagebuyer_draghandle" src={DragHandle} alt="드래그 핸들" onClick={() => navigate('/setting-and-activity')} />
                </div>
                <div className="mypagebuyer_sectionheader">
                    <div className="mypagebuyer_label">댓글 단 글</div>
                    <Dropdown onChange={setHideClosed} />
                </div>
            </div>
            <div className="mypagebuyer_container">
                {comments.length === 0 ? (
                    <div className="mypagebuyer_empty-state">
                        <strong>아직 등록된 댓글이 없어요</strong>
                        <span>지금 바로 마켓에 
                            <br />댓글을 등록해 보세요!</span>
                    </div>
                ) : (
                    comments.map((comment) => <Post key={comment.id} hideClosed={hideClosed} />)
                )}
            </div>
            <div className="mypagebuyer_gnb-wrapper">
                <GNB defaultSelected="mypage" />
            </div>
        </div>
    );
}

export default MyPageBuyer;