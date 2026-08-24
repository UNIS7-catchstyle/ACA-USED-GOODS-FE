import './PostDetail.css';
import Post from '../element/Post';
import Comment from '../element/Comment';
import TextField from '../element/TextField';
import Button from '../element/Button';
import ArrowBackIcon from '../../assets/arrow_back.svg';
import image1 from '../../assets/Dummy_Photo_L.png';
import image2 from '../../assets/Dummy_Photo_L.png';
import image3 from '../../assets/Dummy_Photo_L.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { addComment, getComments } from '../../utils/comments';

function PostDetail() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const showLabel = Boolean(state?.showLabel);
    const isOwner = Boolean(state?.isOwner);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(getComments);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCommentSubmit = () => {
        const trimmedComment = comment.trim();
        if (!trimmedComment) return;

        const newComment = addComment(trimmedComment);
        setComments((currentComments) => [...currentComments, newComment]);
        setComment('');
    };

    return (
        <div className="post-detail">
            <div className="post-detail_header">
                <img src={ArrowBackIcon} alt="뒤로가기" className="post-detail_back-icon" onClick={() => navigate(-1)}/>
                {showLabel ? (
                    <span className="post-detail_status-label">종료</span>
                ) : isOwner ? (
                    <Button
                        label="수정"
                        state="default"
                        style="primary"
                        size="XS"
                        onClick={() => navigate('/market-register', { state: { mode: 'edit' } })}
                    />
                ) : null}
            </div>
            <Post style="L" images={[image1, image2, image3]} />
            <div className="post-detail_divider"/>
            <div className="post-detail_comment">
                <Comment style="comment" />
                <Comment showImage={true} style="comment" />
                <Comment showImage={true} style="reply" />
                {comments.map((newComment) => (
                    <Comment key={newComment.id} body={newComment.body} style="comment" />
                ))}
            </div>
            <div className="post-detail_textfield">
                <TextField
                    variant="comment"
                    showButton={true}
                    placeholder="댓글을 입력하세요."
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    onButtonClick={handleCommentSubmit}
                />
            </div>
        </div>
    )
}

export default PostDetail;