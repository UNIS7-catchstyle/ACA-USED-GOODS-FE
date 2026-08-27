import './Dropdown.css';
import { useState } from 'react';
import CheckIcon from '../../assets/terms/check_circle.svg';
import UncheckIcon from '../../assets/terms/check_circle_on.svg';

function Dropdown({ onChange, label = '종료 제외', checked, disabled = false }) {
    const [internalChecked, setInternalChecked] = useState(false);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const handleToggle = () => {
        if (disabled) return;
        const nextIsChecked = !isChecked;
        if (!isControlled) setInternalChecked(nextIsChecked);
        onChange?.(nextIsChecked);
    };

    return (
        <div className="dropdown">
            <button type="button" className="dropdown_button" onClick={handleToggle} disabled={disabled}>
                <text className="dropdown_label">{label}</text>
                <img src={isChecked ? CheckIcon : UncheckIcon} alt="체크 상태" />
            </button>
        </div>
    );
}

export default Dropdown;