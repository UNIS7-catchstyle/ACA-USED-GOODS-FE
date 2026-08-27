import "./TextField.css";
import { useRef, useState } from "react";
import PhotoIcon from "../../assets/icon/Photo_Icon.svg";
import DeleteGrayIcon from "../../assets/icon/Delete_Gray.svg";
import Button from "./Button";

function TextField({
	className = "",
	variant = "default",
	multiline = false,
	placeholder = "플레이스홀더 내용입니다",
	value,
	defaultValue = "",
	onChange,
	onPhotoSelect,
	photoDisabled = false,
	showDeleteIcon = true,
	showButton = false,
	onButtonClick,
}) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef(null);
	const fileInputRef = useRef(null);

	const currentValue = isControlled ? value : internalValue;
	const hasValue = currentValue.length > 0;
	const isComment = variant === "comment";
	const isEnteringQuery = isFocused || hasValue;

	const handleChange = (event) => {
		if (!isControlled) setInternalValue(event.target.value);
		onChange?.(event);
	};

	const handleClear = () => {
		if (!isControlled) setInternalValue("");
		onChange?.({ target: { value: "" } });
		inputRef.current?.focus();
	};

	const handlePhotoChange = (event) => {
		const file = event.target.files?.[0];
		if (file) onPhotoSelect?.(file);
		event.target.value = "";
	};

	const boxStateClass = isComment ? "textfield__box--comment" : isFocused || hasValue ? "textfield__box--outline" : "textfield__box--filled";

	return (
		<div className={`textfield ${className}`.trim()}>
			<div className={`textfield__box ${boxStateClass}`}>
				{multiline ? (
					<textarea
						ref={inputRef}
						className="textfield__input textfield__input--multiline"
						placeholder={placeholder}
						value={currentValue}
						onChange={handleChange}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
					/>
				) : (
					<input
						ref={inputRef}
						type="text"
						className="textfield__input"
						placeholder={placeholder}
						value={currentValue}
						onChange={handleChange}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
					/>
				)}

				{isComment && (
					<>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="textfield__file-input"
							disabled={photoDisabled}
							onChange={handlePhotoChange}
							hidden
						/>
						<button type="button" className="textfield__icon textfield__icon--button" onClick={() => fileInputRef.current?.click()} disabled={photoDisabled} aria-label="사진 첨부">
							<img src={PhotoIcon} alt="" />
						</button>
					</>
				)}
				{!isComment && showDeleteIcon && hasValue && (
					<button type="button" className="textfield__icon textfield__icon--button" onClick={handleClear} aria-label="입력 내용 삭제">
						<img src={DeleteGrayIcon} alt="" />
					</button>
				)}
				{showButton && isEnteringQuery && (
					<Button state="default" style="secondary" size="XS" onClick={onButtonClick} />
				)}
			</div>
		</div>
	);
}

export default TextField;
