import { useEffect, useRef, useState } from "react";
import "./SettingCard.css";
import cameraIcon from "../../assets/icon/Camera.svg";
import ImageUploaderPreview from "./ImageUploaderPreview";

function SettingCard({
	className = "",
	label = "판매품목 사진 등록",
	counting,
	maxCount = 20,
	accept = "image/*",
	onFilesChange,
	disabled = false,
}) {
	const fileInputRef = useRef(null);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);

	// Keep object URLs in sync with selected files and revoke stale ones to avoid memory leaks.
	useEffect(() => {
		const urls = selectedFiles.map((file) => URL.createObjectURL(file));
		setPreviewUrls(urls);

		return () => {
			urls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [selectedFiles]);

	const currentCount = selectedFiles.length;
	const countingText = counting ?? `(${currentCount}/${maxCount})`;

	const handleCameraClick = () => {
		if (disabled) {
			return;
		}

		fileInputRef.current?.click();
	};

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files || []);
		if (files.length === 0) {
			return;
		}

		const nextFiles = [...selectedFiles, ...files].slice(0, maxCount);
		setSelectedFiles(nextFiles);
		onFilesChange?.(nextFiles);

		// Allow selecting the same file again on the next pick.
		event.target.value = "";
	};

	const handleRemoveFile = (index) => {
		const nextFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
		setSelectedFiles(nextFiles);
		onFilesChange?.(nextFiles);
	};

	return (
		<div className="setting-card-section">
			<div className={["setting-card", className].filter(Boolean).join(" ")}>
				<div className="setting-card__label-section">
					<span className="setting-card__label">{label}</span>
					<span className="setting-card__count">{countingText}</span>
				</div>

				<input
					ref={fileInputRef}
					type="file"
					className="setting-card__file-input"
					accept={accept}
					multiple
					disabled={disabled}
					onChange={handleFileChange}
				/>

				<button
					type="button"
					className="setting-card__camera-button"
					onClick={handleCameraClick}
					disabled={disabled}
					aria-label="사진 첨부"
				>
					<img src={cameraIcon} alt="" className="setting-card__camera-icon" aria-hidden="true" />
				</button>
			</div>

			{selectedFiles.length > 0 && (
				<div className="setting-card__image-section">
					{selectedFiles.map((file, index) => (
						<ImageUploaderPreview
							key={`${file.name}-${file.lastModified}-${index}`}
							src={previewUrls[index]}
							onDelete={() => handleRemoveFile(index)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default SettingCard;
