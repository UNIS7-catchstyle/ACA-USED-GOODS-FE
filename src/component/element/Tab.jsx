import './Tab.css';

function Tab({
    label = "그룹 활동명",
    state = "Default",
    style = "Underbar",
    onClick
}) {
    const isSelected = state === "Selected" || state === "Selected+new";
    
    const hasNewBadge = state === "Default+new" || state === "Selected+new";
    const isRecentSearches = style === "recentSearches";
    
    // Chips 스타일 클래스 생성
    let containerClass = "cs-tap";
    let labelClass = "cs-tap__label";
    let badgeClass = "";
    
    if (isRecentSearches) {
        containerClass += " cs-tap--recent-searches";
        labelClass += " cs-tap__label--recent-searches";
        badgeClass = "cs-tap__badge--recent-searches";
    } else if (style === "Chips") {
        containerClass += " cs-tap--chips";
        
        if (isSelected) {
            containerClass += " cs-tap--chips-selected";
            labelClass += " cs-tap__label--chips-selected";
        } else {
            labelClass += " cs-tap__label--chips-default";
        }
    } else {
        // Underbar 스타일
        containerClass += " cs-tap--underbar";
        
        if (isSelected) {
            containerClass += " cs-tap--underbar-selected";
            labelClass += " cs-tap__label--underbar-selected";
        } else {
            containerClass += " cs-tap--underbar-default";
            labelClass += " cs-tap__label--underbar-default";
        }
    }
    
    const handleClick = () => {
        if (typeof onClick === "function") {
            onClick(!isSelected);
        }
    };
    
    return (
        <div 
            className={containerClass}
            onClick={handleClick}
        >
            <div className={labelClass}>
                {label}
            </div>
            {isRecentSearches ? (
                <div className={badgeClass}>
                    <img 
                        src={deleteIcon} 
                        alt="delete" 
                        className="cs-tap__recent-searches-delete-icon"
                    />
                </div>
            ) : hasNewBadge && (
                <div className="cs-tap__badge">
                    <img 
                        src={newBadge} 
                        alt="new" 
                        className="cs-tap__badge-icon"
                    />
                </div>
            )}
        </div>
    );
}

export default Tab;