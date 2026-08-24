import "./TextButton.css";

const TextButton = ({ style = "default", label = "아이디 찾기", onClick }) => {
	const isUnderBar = style === "underBar";

	return (
		<span className={`text-button ${isUnderBar ? "text-button--underbar" : "text-button--default"}`} onClick={onClick}>
			{label}
		</span>
	);
};

export default TextButton;
