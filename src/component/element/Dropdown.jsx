import './Dropdown.css';
import { useState } from 'react';
import CheckIcon from '../../assets/terms/check_circle.svg';
import UncheckIcon from '../../assets/terms/check_circle_on.svg';

function Dropdown({ onChange, label = '종료 제외' }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked((prev) => {
            const nextIsChecked = !prev;
            onChange?.(nextIsChecked);
            return nextIsChecked;
        });
    };

    return (
        <div className="dropdown">
            <button type="button" className="dropdown_button" onClick={handleToggle}>
                <text className="dropdown_label">{label}</text>
                <img src={isChecked ? CheckIcon : UncheckIcon} alt="체크 상태" />
            </button>
        </div>
    );
}

export default Dropdown;