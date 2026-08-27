import { useState } from "react";
import "./Bookmark.css";
import BookmarkDefault from "../../assets/GNB/BookmarkDefault.svg";
import BookmarkSelected from "../../assets/GNB/BookmarkSelected.svg";
import { scrapMarket, unscrapMarket } from "../../api/markets";
import { ApiError } from "../../api/client";

function Bookmark({ marketId, count = 0, initialBookmarked = false }) {
	const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
	const [scrapCount, setScrapCount] = useState(count);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleBookmarkToggle = async () => {
		if (!marketId || isSubmitting) return;

		setIsSubmitting(true);
		try {
			const response = isBookmarked
				? await unscrapMarket(marketId)
				: await scrapMarket(marketId);
			const data = response.data ?? {};
			setIsBookmarked(Boolean(data.isScrapped));
			if (typeof data.scrapCount === "number") {
				setScrapCount(data.scrapCount);
			}
		} catch (error) {
			if (error instanceof ApiError && error.status === 400) {
				alert(error.message || "본인 마켓은 스크랩할 수 없습니다.");
			} else if (error instanceof ApiError && error.status === 409) {
				alert(error.message || "이미 스크랩한 마켓입니다.");
			} else {
				alert("스크랩 처리 중 오류가 발생했습니다.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="post-card__bookmark-wrap">
			<button
				type="button"
				className="post-card__bookmark-button"
				onClick={(event) => {
					event.stopPropagation();
					handleBookmarkToggle();
				}}
				onKeyDown={(event) => event.stopPropagation()}
				aria-label="북마크 상태 전환"
				aria-pressed={isBookmarked}
				disabled={isSubmitting}
			>
				<img
					src={isBookmarked ? BookmarkSelected : BookmarkDefault}
					alt=""
					className="post-card__bookmark-icon"
				/>
			</button>
			<span className="post-card__bookmark-count">{scrapCount}</span>
		</div>
	);
}

export default Bookmark;
