import "./SettingCardList.css";
import arrowNextSmall from "../../assets/icon/ArrowNext_Small.svg";

function SettingCardList({ label = "이용약관", className = "", onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={["setting-card-list", className].filter(Boolean).join(" ")}
		>
			<span className="setting-card-list__label">{label}</span>
			<img src={arrowNextSmall} alt="" className="setting-card-list__icon" aria-hidden="true" />
		</button>
	);
}

export default SettingCardList;
