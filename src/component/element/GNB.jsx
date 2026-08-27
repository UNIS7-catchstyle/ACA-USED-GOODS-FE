import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GNB.css";

import HomeDefault from "../../assets/GNB/HomeDefault.svg";
import HomeSelected from "../../assets/GNB/HomeSelected.svg";
import BookmarkDefault from "../../assets/GNB/BookmarkDefault.svg";
import BookmarkSelected from "../../assets/GNB/BookmarkSelected.svg";
import MyPageDefault from "../../assets/GNB/MyPageDefault.svg";
import MyPageSelected from "../../assets/GNB/MyPageSelected.svg";

const GNB_ITEMS = [
	{
		key: "home",
		label: "홈",
		defaultIcon: HomeDefault,
		selectedIcon: HomeSelected,
		path: "/",
	},
	{
		key: "bookmark",
		label: "스크랩",
		defaultIcon: BookmarkDefault,
		selectedIcon: BookmarkSelected,
		path: "/scrap",
	},
	{
		key: "mypage",
		label: "마이",
		defaultIcon: MyPageDefault,
		selectedIcon: MyPageSelected,
		path: "/mypage-pre",
	},
];

function GNB({ defaultSelected = "home", onChange }) {
	const location = useLocation();
	const navigate = useNavigate();
	const myPagePath = "/mypage-pre";
	const initialSelected = GNB_ITEMS.some((item) => item.key === defaultSelected)
		? defaultSelected
		: "home";

	const [selectedKey, setSelectedKey] = useState(initialSelected);

	useEffect(() => {
		const nextSelected =
			location.pathname === "/scrap"
				? "bookmark"
				: location.pathname === "/"
					? "home"
					: initialSelected;

		if (nextSelected !== selectedKey) {
			setSelectedKey(nextSelected);
		}
	}, [location.pathname, initialSelected, selectedKey]);

	const handleSelect = (nextKey) => {
		const nextItem = GNB_ITEMS.find((item) => item.key === nextKey);
		if (!nextItem) {
			return;
		}

		if (nextKey === selectedKey) {
			return;
		}

		setSelectedKey(nextKey);
		navigate(nextKey === "mypage" ? myPagePath : nextItem.path);

		if (typeof onChange === "function") {
			onChange(nextKey);
		}
	};

	return (
		<nav className="gnb" aria-label="하단 내비게이션">
			{GNB_ITEMS.map((item) => {
				const isSelected = item.key === selectedKey;

				return (
					<button
						key={item.key}
						type="button"
						className={[
							"gnb__item",
							isSelected ? "gnb__item--selected" : "gnb__item--default",
						].join(" ")}
						aria-current={isSelected ? "page" : undefined}
						onClick={() => handleSelect(item.key)}
					>
						<img
							className="gnb__icon"
							src={isSelected ? item.selectedIcon : item.defaultIcon}
							alt=""
							aria-hidden="true"
						/>
						<span className="gnb__label">{item.label}</span>
					</button>
				);
			})}
		</nav>
	);
}

export default GNB;
