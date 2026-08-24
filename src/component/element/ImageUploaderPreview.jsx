import "./ImageUploaderPreview.css";
import DeleteIcon from "../../assets/icon/Delete.svg";

function ImageUploaderPreview({ src, alt = "업로드한 이미지 미리보기", onDelete }) {
	return (
		<div className="image-uploader-preview">
			<img className="image-uploader-preview__image" src={src} alt={alt} />
			<button
				type="button"
				className="image-uploader-preview__delete"
				onClick={onDelete}
				aria-label="이미지 삭제"
			>
				<img src={DeleteIcon} alt="" />
			</button>
		</div>
	);
}

export default ImageUploaderPreview;
