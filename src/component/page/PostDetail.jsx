import './PostDetail.css';
import Post from '../element/Post';
import Comment from '../element/Comment';
import TextField from '../element/TextField';
import Button from '../element/Button';
import ArrowBackIcon from '../../assets/arrow_back.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { uploadImages } from '../../api/client';
import { createComment, getComments as fetchComments, getMarketDetail } from '../../api/markets';
import ImageUploaderPreview from '../element/ImageUploaderPreview';

function formatCommentTime(createdAt) {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return '';

    const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMinutes < 1) return '방금';
    if (diffMinutes < 60) return `${diffMinutes}분`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일`;
}

function PostDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const [market, setMarket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const showLabel = Boolean(market?.isClosed ?? state?.showLabel);
    const isOwner = Boolean(market?.isOwner ?? state?.isOwner);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [replyTarget, setReplyTarget] = useState(null);
    const [commentImage, setCommentImage] = useState(null);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState('');
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
    const commentImageRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const loadMarketDetail = useCallback((signal) => {
        setIsLoading(true);
        setErrorMessage('');

        return getMarketDetail(id, { signal })
            .then((response) => {
                setMarket(response.data ?? {});
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setErrorMessage(error.status === 404 ? '존재하지 않는 게시글입니다.' : (error.message || '게시글을 불러오지 못했어요.'));
                }
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    const loadComments = useCallback((signal) => {
        return fetchComments(id, { signal })
            .then((response) => setComments(response.data ?? []))
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setComments([]);
                }
            });
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();
        loadMarketDetail(controller.signal);
        loadComments(controller.signal);
        return () => controller.abort();
    }, [loadMarketDetail, loadComments]);

    useEffect(() => () => {
        if (commentImageRef.current?.previewUrl) URL.revokeObjectURL(commentImageRef.current.previewUrl);
    }, []);

    const handlePhotoSelect = (file) => {
        const previewUrl = URL.createObjectURL(file);
        if (commentImageRef.current?.previewUrl) URL.revokeObjectURL(commentImageRef.current.previewUrl);
        commentImageRef.current = { previewUrl, url: '' };
        setCommentImage({ previewUrl, url: '' });
        setImageUploadError('');
        setIsImageUploading(true);

        uploadImages([file])
            .then(([url]) => {
                if (!url) throw new Error('이미지 업로드 응답이 올바르지 않습니다.');
                const nextImage = { previewUrl, url };
                commentImageRef.current = nextImage;
                setCommentImage(nextImage);
            })
            .catch((error) => {
                URL.revokeObjectURL(previewUrl);
                commentImageRef.current = null;
                setCommentImage(null);
                setImageUploadError(error.message || '이미지 업로드에 실패했습니다.');
            })
            .finally(() => setIsImageUploading(false));
    };

    const handlePhotoDelete = () => {
        if (isImageUploading) return;
        if (commentImageRef.current?.previewUrl) URL.revokeObjectURL(commentImageRef.current.previewUrl);
        commentImageRef.current = null;
        setCommentImage(null);
    };

    const handleReplyClick = (targetComment) => {
        setReplyTarget({ id: targetComment.id, nickname: targetComment.author?.nickname ?? '닉네임' });
    };

    const handleReplyCancel = () => setReplyTarget(null);

    const handleCommentSubmit = () => {
        const trimmedComment = comment.trim();
        if (!trimmedComment || isImageUploading || isCommentSubmitting || (!commentImage?.url && commentImage)) return;

        setIsCommentSubmitting(true);
        createComment(id, {
            content: trimmedComment,
            imageUrl: commentImage?.url || undefined,
            parentId: replyTarget?.id,
        })
            .then(() => loadComments())
            .then(() => {
                setComment('');
                setReplyTarget(null);
                if (commentImageRef.current?.previewUrl) URL.revokeObjectURL(commentImageRef.current.previewUrl);
                commentImageRef.current = null;
                setCommentImage(null);
                setImageUploadError('');
            })
            .catch((error) => {
                alert(error.status === 400 ? '잘못된 답글 대상입니다.' : (error.message || '댓글 등록에 실패했습니다.'));
            })
            .finally(() => setIsCommentSubmitting(false));
    };

    if (isLoading) {
        return <div className="post-detail post-detail_message">불러오는 중...</div>;
    }

    if (errorMessage || !market) {
        return <div className="post-detail post-detail_message">{errorMessage || '게시글을 불러오지 못했어요.'}</div>;
    }

    return (
        <div className="post-detail">
            <div className="post-detail_header">
                <img src={ArrowBackIcon} alt="뒤로가기" className="post-detail_back-icon" onClick={() => navigate("/")}/>
                {showLabel ? (
                    <span className="post-detail_status-label">종료</span>
                ) : isOwner ? (
                    <Button
                        label="수정"
                        state="default"
                        style="primary"
                        size="XS"
                        onClick={() => navigate('/market-register', { state: { mode: 'edit', marketId: market.id } })}
                    />
                ) : null}
            </div>
            <Post
                style="L"
                marketId={market.id}
                marketName={market.title}
                artistName={market.itemCategories || market.category}
                location=""
                description={market.description}
                bookmarkCount={market.scrapCount}
                initialBookmarked={market.isScrapped}
                images={market.images}
            />
            <div className="post-detail_divider"/>
            <div className="post-detail_comment">
                {comments.map((existingComment) => (
                    <div key={existingComment.id}>
                        <Comment
                            body={existingComment.content}
                            showImage={Boolean(existingComment.imageUrl)}
                            imageUrl={existingComment.imageUrl}
                            userName={existingComment.author?.nickname ?? '닉네임'}
                            time={formatCommentTime(existingComment.createdAt)}
                            style="comment"
                            onReplyClick={() => handleReplyClick(existingComment)}
                        />
                        {Array.isArray(existingComment.children) && existingComment.children
                            .filter((child) => typeof child === 'object' && child !== null)
                            .map((childComment) => (
                                <Comment
                                    key={childComment.id}
                                    body={childComment.content}
                                    showImage={Boolean(childComment.imageUrl)}
                                    imageUrl={childComment.imageUrl}
                                    userName={childComment.author?.nickname ?? '닉네임'}
                                    time={formatCommentTime(childComment.createdAt)}
                                    style="reply"
                                    onReplyClick={() => handleReplyClick(existingComment)}
                                />
                            ))}
                    </div>
                ))}
            </div>
            <div className="post-detail_textfield">
                {replyTarget && (
                    <div className="post-detail_reply-target">
                        <span>{replyTarget.nickname}님에게 답글 작성 중</span>
                        <button type="button" onClick={handleReplyCancel}>취소</button>
                    </div>
                )}
                <TextField
                    variant="comment"
                    showButton={true}
                    placeholder={replyTarget ? '답글을 입력하세요.' : '댓글을 입력하세요.'}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    onPhotoSelect={handlePhotoSelect}
                    photoDisabled={isImageUploading}
                    onButtonClick={handleCommentSubmit}
                />
                {commentImage && (
                    <ImageUploaderPreview
                        src={commentImage.previewUrl}
                        onDelete={handlePhotoDelete}
                        disabled={isImageUploading}
                    />
                )}
                {imageUploadError && <p className="post-detail_image-error" role="alert">{imageUploadError}</p>}
            </div>
        </div>
    )
}

export default PostDetail;