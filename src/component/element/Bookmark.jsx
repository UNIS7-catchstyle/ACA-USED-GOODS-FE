import { useState } from "react";
import "./Bookmark.css";
import BookmarkDefault from "../../assets/GNB/BookmarkDefault.svg";
import BookmarkSelected from "../../assets/GNB/BookmarkSelected.svg";

function Bookmark({ count = 0, initialBookmarked = false }) {
	const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

	const handleBookmarkToggle = () => {
		setIsBookmarked((prev) => !prev);
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
			>
				<img
					src={isBookmarked ? BookmarkSelected : BookmarkDefault}
					alt=""
					className="post-card__bookmark-icon"
				/>
			</button>
			<span className="post-card__bookmark-count">{count}</span>
		</div>
	);
}

export default Bookmark;
