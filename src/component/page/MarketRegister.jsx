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
import { useEffect, useState } from 'react'
import { createMarket, getMarketDetail, getMarketRegistrationStatus, updateMarket } from '../../api/markets'

const CATEGORY_VALUES = ["KPOP", "TWO_D", "MUSICAL", "ETC"];

function MarketRegister() {
    const navigate = useNavigate()
    const location = useLocation()
    const tabs = ["K-POP", "2D", "뮤지컬", "기타"];
    const isEditMode = location.state?.mode === 'edit';
    const marketId = location.state?.marketId;
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [itemCategories, setItemCategories] = useState("");
    const [description, setDescription] = useState("");
    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const [files, setFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isClosed, setIsClosed] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const isImagesReady = imageUrls.every((url) => url !== null);
    const hasImage = existingImageUrls.length > 0 || imageUrls.length > 0;
    const isFormFilled = title.length > 0 && itemCategories.length > 0 && description.length > 0 && hasImage && isImagesReady;

    useEffect(() => {
        if (!isEditMode || !marketId) return undefined;

        const controller = new AbortController();
        setIsLoading(true);

        getMarketDetail(marketId, { signal: controller.signal })
            .then((response) => {
                const market = response.data ?? {};
                setTitle(market.title ?? "");
                setItemCategories(market.itemCategories ?? "");
                setDescription(market.description ?? "");
                setExistingImageUrls(market.images ?? []);
                setIsClosed(Boolean(market.isClosed));
                const categoryIndex = CATEGORY_VALUES.indexOf(market.category);
                setSelectedTabIndex(categoryIndex >= 0 ? categoryIndex : 0);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setErrorMessage(error.message || "마켓 정보를 불러오지 못했습니다.");
                }
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [isEditMode, marketId]);

    useEffect(() => {
        if (isEditMode) return undefined;

        const controller = new AbortController();
        setIsLoading(true);

        getMarketRegistrationStatus({ signal: controller.signal })
            .then((response) => {
                if (!response.data?.open) {
                    alert("마켓 등록 기간이 마감되었습니다.");
                    navigate(-1);
                }
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setErrorMessage(error.message || "마켓 등록 가능 여부를 확인하지 못했습니다.");
                }
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [isEditMode, navigate]);

    const handleFilesChange = (nextFiles) => {
        setImageUrls((prevUrls) => {
            if (nextFiles.length > files.length) {
                return [...prevUrls, ...new Array(nextFiles.length - files.length).fill(null)];
            }

            return files
                .map((file, index) => ({ file, url: prevUrls[index] }))
                .filter(({ file }) => nextFiles.includes(file))
                .map(({ url }) => url);
        });
        setFiles(nextFiles);
    };

    const handleUploadComplete = (urls) => {
        setImageUrls((prevUrls) => {
            const nextUrls = [...prevUrls];
            let urlIndex = 0;

            for (let index = 0; index < nextUrls.length && urlIndex < urls.length; index += 1) {
                if (nextUrls[index] === null) {
                    nextUrls[index] = urls[urlIndex];
                    urlIndex += 1;
                }
            }

            return nextUrls;
        });
    };

    const handleRemoveInitialImage = (index) => {
        setExistingImageUrls((prevUrls) => prevUrls.filter((_, urlIndex) => urlIndex !== index));
    };

    const handleToggleClosed = async (nextIsClosed) => {
        if (!isEditMode || !marketId || isClosing) return;

        setIsClosing(true);
        setErrorMessage("");

        const payload = {
            category: CATEGORY_VALUES[selectedTabIndex],
            title,
            itemCategories,
            description,
            imageUrls: [...existingImageUrls, ...imageUrls],
            isClosed: nextIsClosed,
        };

        try {
            await updateMarket(marketId, payload);
            setIsClosed(nextIsClosed);
        } catch (error) {
            if (error.status === 403) {
                alert("작성자만 수정할 수 있습니다.");
            } else {
                alert(error.message || "마켓 종료 상태 변경에 실패했습니다.");
            }
        } finally {
            setIsClosing(false);
        }
    };

    const handleSubmit = async () => {
        if (!isFormFilled || isSubmitting) return;

        setIsSubmitting(true);
        setErrorMessage("");

        const payload = {
            category: CATEGORY_VALUES[selectedTabIndex],
            title,
            itemCategories,
            description,
            imageUrls: [...existingImageUrls, ...imageUrls],
            isClosed,
        };

        try {
            const response = isEditMode
                ? await updateMarket(marketId, payload)
                : await createMarket(payload);
            navigate(`/post-detail/${isEditMode ? marketId : response.data?.id}`);
        } catch (error) {
            if (error.status === 403) {
                alert(isEditMode ? "작성자만 수정할 수 있습니다." : "마켓 등록 기간이 마감되었습니다.");
            } else if (error.status === 409) {
                alert("이미 등록한 마켓이 있습니다.");
            } else {
                setErrorMessage(error.message || (isEditMode ? "마켓 수정에 실패했습니다." : "마켓 등록에 실패했습니다."));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="marketregister marketregister_message">불러오는 중...</div>;
    }

    return (
        <div className="marketregister">
            <div className="marketregister_header">
                <img className="marketregister_close" src={CloseIcon} alt="닫기" onClick={() => setIsCancelModalOpen(true)} />
                <div className="marketregister_header_title">{isEditMode ? "수정하기" : "마켓 등록하기"}</div>
                {isEditMode ? (
                    <Dropdown label="마켓 종료" checked={isClosed} onChange={handleToggleClosed} disabled={isClosing} />
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
                <SettingCard
                    initialImages={existingImageUrls}
                    onRemoveInitialImage={handleRemoveInitialImage}
                    onFilesChange={handleFilesChange}
                    onUploadComplete={handleUploadComplete}
                />
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
                        value={itemCategories}
                        onChange={(e) => setItemCategories(e.target.value)}
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
            {errorMessage && <div className="marketregister_error">{errorMessage}</div>}
            <div className="marketregister_buttonsection">
                <Button
                    state={isFormFilled && !isSubmitting ? "default" : "inactive"}
                    style="primary"
                    size="L"
                    label={isEditMode ? "수정하기" : "등록하기"}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    )
}

export default MarketRegister;