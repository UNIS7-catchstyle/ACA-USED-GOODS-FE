import "./PolicyAgree.css";
import checkCircle from "../../assets/terms/check_circle.svg";
import checkCircleOn from "../../assets/terms/check_circle_on.svg";

const PROPERTY = {
	DEFAULT: "Default",
	SELECTED: "Selected",
};

function TermButton({
	label = "약관 동의 내용",
	property1 = PROPERTY.DEFAULT,
	onClick,
	className = "",
	name,
}) {
	const isSelected = property1 === PROPERTY.SELECTED;

	return (
		<button
			type="button"
			name={name}
			onClick={onClick}
			className={[
				"term-button",
				isSelected ? "term-button--selected" : "term-button--default",
				className,
			].join(" ").trim()}
			data-property1={property1}
		>
			<span className="term-button__left">
				<img
					className="term-button__check"
					src={isSelected ? checkCircleOn : checkCircle}
					alt=""
					aria-hidden="true"
				/>
				<span className="term-button__label">{label}</span>
			</span>
			<span className="term-button__arrow" aria-hidden="true" />
		</button>
	);
}

export default TermButton;