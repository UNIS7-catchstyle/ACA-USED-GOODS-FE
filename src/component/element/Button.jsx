import "./Button.css";
import roundIcon from "../../assets/plus-button/State=Default, style=round, Size=s.svg";
import opacityIcon from "../../assets/plus-button/State=Default, style=Opacity_icon, Size=s.svg";
import roundIconStyle from "../../assets/plus-button/State=default, style=roundIcon, Size=s.svg";
import checkCircle from "../../assets/terms/check_circle.svg";
import checkCircleOn from "../../assets/terms/check_circle_on.svg";
import sendIcon from "../../assets/icon/Send.svg";

const COMBO_CONFIG = {
    "default|primary|L": {
        button: { width: "335px", height: "52px", background: "#0B0E0F", borderRadius: "8px", padding: "10px 28px" },
        label: { color: "#FFFFFF", fontSize: "18px", fontWeight: 600, lineHeight: "26px", letterSpacing: "0" },
        contentType: "text",
    },
    "default|primary|M": {
        button: { width: "335px", height: "48px", background: "#0B0E0F", borderRadius: "8px", padding: "10px 28px" },
        label: { color: "#FFFFFF", fontSize: "18px", fontWeight: 600, lineHeight: "26px", letterSpacing: "0" },
        contentType: "text",
    },
    "default|secondary|M": {
        button: { width: "335px", height: "48px", background: "#ECEEF0", borderRadius: "8px", padding: "10px 28px" },
        label: { color: "#0B0E0F", fontSize: "18px", fontWeight: 600, lineHeight: "26px", letterSpacing: "0" },
        contentType: "text",
    },
    "inactive|primary|L": {
        button: { width: "335px", height: "52px", background: "#BABCBE", borderRadius: "8px", padding: "10px 28px" },
        label: { color: "#FFFFFF", fontSize: "18px", fontWeight: 600, lineHeight: "26px", letterSpacing: "0" },
        contentType: "text",
    },
    "default|secondary|L": {
        button: { width: "110px", height: "52px", background: "#ECEEF0", borderRadius: "8px", padding: "10px 28px" },
        label: { color: "#0B0E0F", fontSize: "18px", fontWeight: 600, lineHeight: "26px", letterSpacing: "0" },
        contentType: "text",
    },
    "default|terms|L": {
        button: {
            width: "335px",
            height: "52px",
            background: "#ECEEF0",
            borderRadius: "8px",
            padding: "10px 12px",
            justifyContent: "flex-start",
        },
        label: { color: "#0B0E0F", fontSize: "18px", fontWeight: 600, lineHeight: "26px", letterSpacing: "0" },
        contentType: "text",
    },
    "inactive|terms|L": {
        button: {
            width: "335px",
            height: "52px",
            background: "#F6F8FA",
            borderRadius: "8px",
            padding: "10px 12px",
            justifyContent: "flex-start",
        },
        label: { color: "#A1A3A5", fontSize: "18px", fontWeight: 600, lineHeight: "26px", letterSpacing: "0" },
        contentType: "text",
    },
    "inactive|icontext|L": {
        button: { width: "335px", height: "52px", background: "#ECEEF0", borderRadius: "8px", padding: "10px 12px", justifyContent: "flex-start", gap: "10px" },
        label: { color: "#A1A3A5", fontSize: "18px", fontWeight: 600, lineHeight: "26px", letterSpacing: "0" },
        contentType: "iconText",
    },
    "selected|icontext|L": {
        button: { width: "335px", height: "52px", background: "#ECEEF0", borderRadius: "8px", padding: "10px 12px", justifyContent: "flex-start", gap: "10px" },
        label: { color: "#0B0E0F", fontSize: "18px", fontWeight: 600, lineHeight: "26px", letterSpacing: "0" },
        contentType: "iconText",
    },
    "default|primary|S": {
        button: { width: "175.833px", height: "40px", background: "#0B0E0F", borderRadius: "6.667px", padding: "8.333px 23.333px" },
        label: { color: "#FFFFFF", fontSize: "14px", fontWeight: 700, lineHeight: "20px", letterSpacing: "-0.2px" },
        contentType: "text",
    },
    "default|secondary|S": {
        button: { width: "175.833px", height: "40px", background: "#ECEEF0", borderRadius: "8px", padding: "10px 28px" },
        label: { color: "#0B0E0F", fontSize: "14px", fontWeight: 700, lineHeight: "20px", letterSpacing: "-0.2px" },
        contentType: "text",
    },
    "default|secondary|XS": {
        button: { width: "48px", height: "30px", background: "#0B0E0F", borderRadius: "8px", padding: "4px 14px" },
        iconSrc: sendIcon,
        iconStyle: { width: "20px", height: "20px" },
        contentType: "icon",
    },
    "default|opacitytext|S": {
        button: {
            height: "32px",
            background: "rgba(0, 0, 0, 0.3)",
            border: "0.5px solid #D3D5D7",
            borderRadius: "999px",
            padding: "10px 12px",
        },
        label: { color: "#FFFFFF", fontSize: "14px", fontWeight: 500, lineHeight: "22px", letterSpacing: "-0.2px" },
        contentType: "text",
    },
    "default|roundtext|S": {
        button: { height: "32px", background: "#0B0E0F", border: "0.5px solid #D3D5D7", borderRadius: "999px", padding: "10px 12px" },
        label: { color: "#FFFFFF", fontSize: "14px", fontWeight: 500, lineHeight: "22px", letterSpacing: "-0.2px" },
        contentType: "text",
    },
    "default|opacityicon|S": {
        iconSrc: opacityIcon,
        iconStyle: { width: "32px", height: "32px" },
        contentType: "icon",
    },
    "default|roundicon|S": {
        iconSrc: roundIconStyle,
        iconStyle: { width: "32px", height: "32px" },
        contentType: "icon",
    },
    "default|roundicon|XS": {
        iconSrc: roundIconStyle,
        iconStyle: { width: "12px", height: "12px" },
        contentType: "icon",
    },
    "default|primary|XS": {
        button: { width: "auto", height: "auto", background: "#ECEEF0", borderRadius: "8px", padding: "4px 14px" },
        label: { color: "#0B0E0F", fontSize: "14px", fontWeight: 500, lineHeight: "22px", letterSpacing: "-0.2px" },
        contentType: "text",
    },
    "selected|primary|XS": {
        button: { width: "84px", height: "24px", background: "#0B0E0F", border: "0.5px solid #D3D5D7", borderRadius: "8px", padding: "10px 12px" },
        label: { color: "#FFFFFF", fontSize: "14px", fontWeight: 500, lineHeight: "22px", letterSpacing: "-0.2px" },
        contentType: "text",
    },
};

const STYLE_CLASS_MAP = {
    primary: "primary",
    secondary: "secondary",
    icontext: "icon_text",
    roundicon: "round",
    roundtext: "round_text",
    opacityicon: "opacity_icon",
    opacitytext: "opacity_text",
    terms: "terms",
};

function normalizeState(value) {
    const normalized = String(value || "default").toLowerCase();
    if (["default", "inactive", "selected"].includes(normalized)) {
        return normalized;
    }
    return "default";
}

function normalizeSize(value) {
    const normalized = String(value || "L").toUpperCase();
    if (["L", "M", "S", "XS"].includes(normalized)) {
        return normalized;
    }
    return "L";
}

function normalizeStyle(value) {
    const normalized = String(value || "primary").toLowerCase().replace(/[_\s-]/g, "");
    if (normalized === "약관동의" || normalized === "terms") {
        return "terms";
    }
    if (normalized === "round") {
        return "roundicon";
    }
    if (["primary", "secondary", "icontext", "roundicon", "roundtext", "opacityicon", "opacitytext"].includes(normalized)) {
        return normalized;
    }
    return "primary";
}

function normalizeCombo(state, style, size) {
    let nextState = state;
    let nextStyle = style;
    let nextSize = size;

    if (nextStyle === "icontext") {
        nextSize = "L";
        if (nextState !== "inactive" && nextState !== "selected") {
            nextState = "inactive";
        }
    }

    if (nextStyle === "roundtext" || nextStyle === "opacitytext" || nextStyle === "opacityicon") {
        nextState = "default";
        nextSize = "S";
    }

    if (nextStyle === "roundicon") {
        nextState = "default";
        if (nextSize !== "S" && nextSize !== "XS") {
            nextSize = "S";
        }
    }

    if (nextStyle === "terms") {
        nextSize = "L";
        nextState = nextState === "inactive" ? "inactive" : "default";
    }

    if (nextStyle === "secondary") {
        nextState = "default";
        if (!["L", "M", "S", "XS"].includes(nextSize)) {
            nextSize = "L";
        }
    }

    if (nextStyle === "primary") {
        if (nextState === "inactive" && nextSize !== "L") {
            nextSize = "L";
        }
        if (nextState === "selected") {
            nextSize = "XS";
        }
    }

    return { state: nextState, style: nextStyle, size: nextSize };
}

function Button({
    label = "로그인",
    size = "L",
    state = "Default",
    variant = "Primary",
    style: styleType,
    buttonStyle,
    name = "login",
    onClick,
    className = "",
}) {
    const normalizedState = normalizeState(state);
    const normalizedSize = normalizeSize(size);
    const normalizedStyle = normalizeStyle(typeof styleType === "string" ? styleType : variant);
    const normalizedCombo = normalizeCombo(normalizedState, normalizedStyle, normalizedSize);
    const comboKey = `${normalizedCombo.state}|${normalizedCombo.style}|${normalizedCombo.size}`;
    const comboConfig = COMBO_CONFIG[comboKey] || COMBO_CONFIG["default|primary|L"];

    const isTerms = normalizedCombo.style === "terms";
    const isIconOnly = comboConfig.contentType === "icon";
    const isIconText = comboConfig.contentType === "iconText";
    const iconSrc = comboConfig.iconSrc || roundIcon;
    const checkIconSrc = normalizedCombo.state === "selected" ? checkCircle : checkCircleOn;
    const cssVariantClassName = STYLE_CLASS_MAP[normalizedCombo.style] || "primary";

    const isDisabled = normalizedCombo.state === "inactive" && !isTerms;

    function handleOnClick(e) {
        if (isDisabled) {
            return;
        }

        if (typeof onClick === "function") {
            onClick(e);
            return;
        }

        console.log(e.target.name);
    }

    return (
        <button
            type="button"
            name={name}
            onClick={handleOnClick}
            disabled={isDisabled}
            style={{ ...comboConfig.button, ...buttonStyle }}
            className={[
                "cs-button",
                `cs-button--${cssVariantClassName}`,
                `cs-button--${normalizedCombo.size.toLowerCase()}`,
                `cs-button--${normalizedCombo.state}`,
                className,
            ].join(" ").trim()}
        >
            {isIconOnly ? (
                <img
                    className="cs-button__icon"
                    src={iconSrc}
                    style={comboConfig.iconStyle}
                    alt=""
                    aria-hidden="true"
                />
            ) : isIconText ? (
                <>
                    <img src={checkIconSrc} alt="" aria-hidden="true" style={{ width: "24px", height: "24px", flexShrink: 0 }} />
                    <span className="cs-button__label" style={comboConfig.label}>{label}</span>
                </>
            ) : (
                <>
                    {isTerms && <span className="cs-button__check" aria-hidden="true">✓</span>}
                    <span className="cs-button__label" style={comboConfig.label}>{isTerms ? "전체 동의하기" : label}</span>
                </>
            )}
        </button>
    );
}

export default Button;