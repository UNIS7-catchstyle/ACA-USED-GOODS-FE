import { useEffect, useRef, useState } from "react";
import "./SettingCard.css";
import cameraIcon from "../../assets/icon/Camera.svg";
import ImageUploaderPreview from "./ImageUploaderPreview";
import { uploadImages } from "../../api/client";

function SettingCard({
	className = "",
	label = "판매품목 사진 등록",
	counting,
	maxCount = 20,
	accept = "image/*",
	initialImages = [],
	onRemoveInitialImage,
	onFilesChange,
	onUploadComplete,
	disabled = false,
}) {
	const fileInputRef = useRef(null);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState("");

	// Keep object URLs in sync with selected files and revoke stale ones to avoid memory leaks.
	useEffect(() => {
		const urls = selectedFiles.map((file) => URL.createObjectURL(file));
		setPreviewUrls(urls);

		return () => {
			urls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [selectedFiles]);

	const currentCount = initialImages.length + selectedFiles.length;
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

		const previousFiles = selectedFiles;
		const remainingSlots = maxCount - initialImages.length - previousFiles.length;
		const filesToUpload = files.slice(0, Math.max(remainingSlots, 0));
		if (filesToUpload.length === 0) {
			event.target.value = "";
			return;
		}

		const nextFiles = [...previousFiles, ...filesToUpload];
		setSelectedFiles(nextFiles);
		onFilesChange?.(nextFiles);
		setUploadError("");
		setIsUploading(true);

		uploadImages(filesToUpload)
			.then((urls) => onUploadComplete?.(urls))
			.catch((error) => {
				setSelectedFiles(previousFiles);
				onFilesChange?.(previousFiles);
				setUploadError(error.message || "이미지 업로드에 실패했습니다.");
			})
			.finally(() => setIsUploading(false));

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
					disabled={disabled || isUploading}
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

			{(initialImages.length > 0 || selectedFiles.length > 0) && (
				<div className="setting-card__image-section">
					{initialImages.map((url, index) => (
						<ImageUploaderPreview
							key={`initial-${url}-${index}`}
							src={url}
							onDelete={() => onRemoveInitialImage?.(index)}
							disabled={isUploading}
						/>
					))}
					{selectedFiles.map((file, index) => (
						<ImageUploaderPreview
							key={`${file.name}-${file.lastModified}-${index}`}
							src={previewUrls[index]}
							onDelete={() => handleRemoveFile(index)}
							disabled={isUploading}
						/>
					))}
				</div>
			)}

			{uploadError && <p className="setting-card__upload-error" role="alert">{uploadError}</p>}
		</div>
	);
}

export default SettingCard;
