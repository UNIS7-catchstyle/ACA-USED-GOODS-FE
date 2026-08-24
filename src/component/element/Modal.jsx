import './Modal.css';
import Button from './Button';

function Modal({
    onClose,
    title = "비밀번호 변경 완료",
    subtitle = "변경된 비밀번호로 로그인해주세요",
    buttonLabel = "완료",
    buttonVariant = "Primary",
    buttonClassName = "modal-button",
    buttons = null, // [{label, variant, className, buttonStyle, onClick}, ...]
    contentClassName = "",
    copyClassName = "",
    titleClassName = "",
    subtitleClassName = "",
    buttonsClassName = "",
    children = null,
}) {
    // 버튼 배열 제공되지 않으면 기존 호환성 유지
    const buttonsList = buttons || [{
        label: buttonLabel,
        variant: buttonVariant,
        className: buttonClassName,
        onClick: onClose
    }];

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="find-password-modal-title">
            <div className={["modal-content", contentClassName].join(" ").trim()}>
                <div className={["modal-copy", copyClassName].join(" ").trim()}>
                    <div id="find-password-modal-title" className={["modal-title", titleClassName].join(" ").trim()}>{title}</div>
                    {subtitle !== null && subtitle !== undefined && subtitle !== "" && (
                        <div className={["modal-subtitle", subtitleClassName].join(" ").trim()}>{subtitle}</div>
                    )}
                </div>
                {children}
                <div className={["modal-buttons", buttonsClassName].join(" ").trim()}>
                    {buttonsList.map((btn, index) => (
                        <Button
                            key={index}
                            label={btn.label}
                            variant={btn.variant || "Primary"}
                            size={btn.size || "M"}
                            state={btn.state || "Default"}
                            className={btn.className || "modal-button"}
                            buttonStyle={btn.buttonStyle}
                            onClick={btn.onClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Modal;