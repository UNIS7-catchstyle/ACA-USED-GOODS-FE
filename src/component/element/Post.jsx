import "./Post.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DummyPhoto from "../../assets/Dummy_Photo.png";
import DummyPhotoL from "../../assets/Dummy_Photo_L.png";
import Bookmark from "./Bookmark";

function Post({
	marketId,
	style = "M",
	showLabel = false,
	marketName = "플리마켓 이름입니다.",
	artistName = "엔시티 위시",
	location = "F1",
	description = "본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본...",
	bookmarkCount = 234,
	initialBookmarked = false,
	images,
	hideClosed = false,
	isOwner = false,
}) {
	const navigate = useNavigate();
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const isLargeStyle = style === "L";
	const shouldShowLabel = style === "M" && showLabel;

	if (hideClosed && showLabel) return null;

	const resolvedImages = images && images.length > 0 ? images : [DummyPhoto, DummyPhoto, DummyPhoto];
	const largeImages = images && images.length > 0 ? images : [DummyPhotoL];

	const previewImages = isLargeStyle
		? largeImages
		: resolvedImages.slice(0, 3);

	const handleImageScroll = (event) => {
		const slideWidth = event.currentTarget.clientWidth;
		if (!slideWidth) return;

		setActiveImageIndex(Math.round(event.currentTarget.scrollLeft / slideWidth));
	};

	return (
		<article
			className={`post-card ${isLargeStyle ? "post-card--large" : ""}`}
			onClick={() => navigate(`/post-detail/${marketId}`, { state: { showLabel, isOwner } })}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					navigate(`/post-detail/${marketId}`, { state: { showLabel, isOwner } });
				}
			}}
			role="link"
			tabIndex={0}
		>
			<div
				className={`post-card__image-row ${isLargeStyle ? "post-card__image-row--large" : ""}`}
				onScroll={isLargeStyle ? handleImageScroll : undefined}
				aria-label={isLargeStyle ? "게시물 이미지" : undefined}
			>
				{previewImages.map((imageSrc, index) => (
					<div className={`post-card__image ${isLargeStyle ? "post-card__image--large" : ""}`} key={`${imageSrc}-${index}`}>
						<img src={imageSrc} alt={`${marketName} 이미지 ${index + 1}`} draggable={false} />
					</div>
				))}
			</div>

			{isLargeStyle && previewImages.length > 1 && (
				<div className="post-card__indicator" aria-label={`현재 이미지 ${activeImageIndex + 1} / ${previewImages.length}`}>
					{previewImages.map((imageSrc, index) => (
						<span
							className={`post-card__indicator-dot ${index === activeImageIndex ? "post-card__indicator-dot--active" : ""}`}
							key={`${imageSrc}-indicator-${index}`}
						/>
					))}
				</div>
			)}

			<div className={`post-card__bottom ${isLargeStyle ? "post-card__bottom--large" : ""}`}>
				<div className={`post-card__headline-row ${isLargeStyle ? "post-card__headline-row--large" : ""}`}>
					<div className={`post-card__label-section ${isLargeStyle ? "post-card__label-section--large" : ""}`}>
						<div className="post-card__header">
							<h3 className={`post-card__title ${isLargeStyle ? "post-card__title--large" : ""}`}>{marketName}</h3>
							{shouldShowLabel && <span className="post-card__status-label">종료</span>}
						</div>
						<div className={`post-card__meta ${isLargeStyle ? "post-card__meta--large" : ""}`}>
							{artistName && <span className="post-card__meta-text">{artistName}</span>}
							{artistName && location && <span className="post-card__divider">,</span>}
							{location && <span className="post-card__meta-text">{location}</span>}
						</div>
					</div>

					<Bookmark marketId={marketId} count={bookmarkCount} initialBookmarked={initialBookmarked} />
				</div>

				<p className={`post-card__description ${isLargeStyle ? "post-card__description--large" : ""}`}>{description}</p>
			</div>
		</article>
	);
}

export default Post;
