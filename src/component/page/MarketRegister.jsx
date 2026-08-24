import './MarketRegister.css'
import SettingCard from '../element/SettingCard'
import Tab from '../element/Tab'
import TextField from '../element/TextField'
import Button from '../element/Button'
import Modal from '../element/Modal'
import Dropdown from '../element/Dropdown'
import CloseIcon from '../../assets/close.svg'
import Dummy from '../../assets/Dummy.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function MarketRegister() {
    const navigate = useNavigate()
    const location = useLocation()
    const tabs = ["K-POP", "2D", "뮤지컬", "기타"];
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const isFormFilled = title.length > 0 && category.length > 0 && description.length > 0;
    const isEditMode = location.state?.mode === 'edit';

    return (
        <div className="marketregister">
            <div className="marketregister_header">
                <img className="marketregister_close" src={CloseIcon} alt="닫기" onClick={() => setIsCancelModalOpen(true)} />
                <div className="marketregister_header_title">{isEditMode ? "수정하기" : "마켓 등록하기"}</div>
                {isEditMode ? (
                    <Dropdown label="마켓 종료" />
                ) : (
                    <img className="marketregister_dummy" src={Dummy} alt="더미" />
                )}
            </div>
            {isCancelModalOpen && (
                <Modal
                    title="게시글 작성을 중단하시겠습니까?"
                    subtitle={<>중단하시면 입력하신<br />정보는 모두 초기화됩니다.</>}
                    contentClassName="marketregister_cancel_modal"
                    buttons={[
                        {
                            label: "취소",
                            variant: "secondary",
                            size: "M",
                            buttonStyle: { width: "100%" },
                            onClick: () => setIsCancelModalOpen(false),
                        },
                        {
                            label: "확인",
                            variant: "primary",
                            size: "M",
                            buttonStyle: { width: "100%" },
                            onClick: () => navigate(-1),
                        },
                    ]}
                />
            )}
            <div className="marketregister_container">
                <SettingCard />
                <div className="marketregister_formsection">
                    <div className='marketregister_container_title'>등록하려는 마켓의 카테고리를 선택해주세요</div>
                    <div className='marketregister_tabsection'>
                        {tabs.map((tabLabel, index) => (
                        <Tab
                            key={tabLabel}
                            style="Chips"
                            label={tabLabel}
                            state={selectedTabIndex === index ? "Selected" : "Default"}
                            onClick={() => setSelectedTabIndex(index)}
                        />
                    ))}
                    </div> 
                </div>
                <div className="marketregister_formsection">
                    <div className='marketregister_container_title'>마켓 제목을 입력해주세요</div>
                    <TextField
                        placeholder="마켓 제목(게시글 제목)을 입력해주세요"
                        showDeleteIcon={true}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="marketregister_formsection">
                    <div className='marketregister_container_title'>판매품목의 카테고리를 전부 입력해주세요</div>
                    <TextField
                        placeholder="엔시티 위시, F1, 국대 축구 등"
                        showDeleteIcon={true}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div className="marketregister_formsection">
                    <div className='marketregister_container_title'>자세한 설명을 입력해주세요</div>
                    <TextField
                        placeholder="게시글 본문에 들어갈 내용이에요.
구매자들을 위해 품목 상태에 대해 자세히 적어주세요 :)"
                        multiline={true}
                        showDeleteIcon={true}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>
            <div className="marketregister_buttonsection">
                <Button
                    state={isFormFilled ? "default" : "inactive"}
                    style="primary"
                    size="L"
                    label={isEditMode ? "수정하기" : "등록하기"}
                />
            </div>
        </div>
    )
}

export default MarketRegister;