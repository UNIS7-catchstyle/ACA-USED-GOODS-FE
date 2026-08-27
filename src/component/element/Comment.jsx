import "./Comment.css";
import LeadingIcon from "../../assets/icon/Leading.svg";
import DummyPhotoL from "../../assets/Dummy_Photo_L.png";

function Comment({
	className = "",
	body = "댓글 내용입니다.댓글 내용입니다.댓글 내용입니다.댓글 내용입니다.댓글 내용입니다.",
	showImage = false,
	imageUrl,
	style = "reply",
	time = "7시",
	userName = "닉네임",
	onReplyClick,
}) {
	const isReply = style === "reply";

	return (
		<article
			className={`comment-card comment-card--${isReply ? "reply" : "comment"} ${className}`.trim()}
		>
			{isReply && (
				<div className="comment-card__leading" aria-hidden="true">
					<img src={LeadingIcon} alt="" />
				</div>
			)}

			<div className={`comment-card__container ${isReply ? "comment-card__container--reply" : ""}`.trim()}>
				<div className="comment-card__label-section">
					<strong className="comment-card__user-name">{userName}</strong>
					<span className="comment-card__time">{time}</span>
				</div>

				<div className="comment-card__content">
					<p className="comment-card__body">{body}</p>
					{(showImage || imageUrl) && (
						<div className="comment-card__image-wrap">
							<img src={imageUrl || DummyPhotoL} alt="댓글 첨부 이미지" className="comment-card__image" />
						</div>
					)}
				</div>

				<button type="button" className="comment-card__reply-button" onClick={onReplyClick}>
					답글
				</button>
			</div>
		</article>
	);
}

export default Comment;
