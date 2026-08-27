import './Scrap.css'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../element/Button';
import GNB from '../element/GNB'
import Tab from '../element/Tab'
import Dropdown from '../element/Dropdown'
import Post from '../element/Post'
import Footer from '../element/Footer'
import { isLoggedIn } from '../../utils/auth'
import { getScrappedMarkets } from '../../api/markets'

const CATEGORY_VALUES = ['KPOP', 'TWO_D', 'MUSICAL', 'ETC'];
const PAGE_SIZE = 20;

function Scrap() {
    const navigate = useNavigate();

    const tabs = ["K-POP", "2D", "뮤지컬", "기타"];
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [loggedIn] = useState(isLoggedIn);
    const [hideClosed, setHideClosed] = useState(false);
    const [markets, setMarkets] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasNext, setHasNext] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const loadMoreRef = useRef(null);

    useEffect(() => {
        if (!loggedIn) return undefined;

        const controller = new AbortController();
        setMarkets([]);
        setNextCursor(null);
        setHasNext(false);
        setErrorMessage('');
        setIsLoading(true);

        getScrappedMarkets({
            category: CATEGORY_VALUES[selectedTabIndex],
            excludeClosed: hideClosed,
            size: PAGE_SIZE,
            signal: controller.signal,
        })
            .then((response) => {
                const data = response.data ?? {};
                setMarkets(data.items ?? []);
                setTotalCount(data.totalCount ?? 0);
                setNextCursor(data.nextCursor ?? null);
                setHasNext(Boolean(data.hasNext));
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setErrorMessage(error.message || '스크랩한 마켓을 불러오지 못했어요.');
                }
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [loggedIn, selectedTabIndex, hideClosed]);

    useEffect(() => {
        if (!loggedIn || !hasNext || isLoading || !nextCursor || !loadMoreRef.current) return undefined;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;

            setIsLoading(true);
            getScrappedMarkets({
                category: CATEGORY_VALUES[selectedTabIndex],
                excludeClosed: hideClosed,
                cursor: nextCursor,
                size: PAGE_SIZE,
            })
                .then((response) => {
                    const data = response.data ?? {};
                    setMarkets((currentMarkets) => [...currentMarkets, ...(data.items ?? [])]);
                    setNextCursor(data.nextCursor ?? null);
                    setHasNext(Boolean(data.hasNext));
                })
                .catch((error) => setErrorMessage(error.message || '스크랩한 마켓을 더 불러오지 못했어요.'))
                .finally(() => setIsLoading(false));
        });

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [loggedIn, hasNext, isLoading, nextCursor, selectedTabIndex, hideClosed]);

    return (
        <div className="scrap">
            <div className="scrap_topsection">
                <div className="scrap_header">
                    <div className="scrap_title">스크랩</div>
                </div>
                {loggedIn && (
                <div className="scrap_tabsection">
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
                )}
            </div>
            
            {loggedIn ? (
                <>
                    <div className="scrap_headline">
                        <div className="scrap_total">총 {totalCount}개</div>
                        <Dropdown onChange={setHideClosed} />
                    </div>
                    <div className="scrap_feed" aria-live="polite">
                        {markets.map((market) => (
                            <Post
                                key={market.id}
                                marketId={market.id}
                                showLabel={Boolean(market.isClosed)}
                                hideClosed={hideClosed}
                                marketName={market.title}
                                artistName={market.itemCategories || market.category}
                                location=""
                                description={market.description}
                                bookmarkCount={market.scrapCount}
                                initialBookmarked={market.isScrapped}
                                images={market.thumbnails}
                            />
                        ))}
                        {!isLoading && !errorMessage && markets.length === 0 && (
                            <p className="scrap_message">스크랩한 마켓이 없어요.</p>
                        )}
                        {errorMessage && <p className="scrap_message scrap_message--error">{errorMessage}</p>}
                        <div ref={loadMoreRef} className="scrap_load-more" aria-hidden="true" />
                        {isLoading && <p className="scrap_message">불러오는 중...</p>}
                    </div>
                </>
            ) : (
                <div className="scrap_guest">
                    <div className="scrap_guest_content">
                        <div>
                            <div className="scrap_guest_content-title">
                                로그인이 필요해요
                            </div>
                            <div className="scrap_guest_content-body">
                                로그인 후 관심있는 마켓을
                                <br />
                                스크랩할 수 있어요.
                            </div>
                        </div>
                        <Button
                            state="default"
                            style="primary"
                            size="S"
                            label="로그인/회원가입"
                            onClick={() => navigate('/login')}
                        />
                    </div>
                    <div className="scrap_guest_footer">
                        <Footer />
                    </div>
                </div>
            )}
            <div className="scrap_gnb-wrapper">
                <GNB defaultSelected="bookmark" />
            </div>
        </div>
    )
}

export default Scrap