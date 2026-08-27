import Tab from "../element/Tab";
import Dropdown from "../element/Dropdown";
import Post from "../element/Post";
import GNB from "../element/GNB";
import "./Home.css";
import { useEffect, useRef, useState } from "react";
import Logo from "../../assets/login/Logo.svg";
import Dummy from "../../assets/Dummy.png";
import { getMarkets } from "../../api/markets";

const CATEGORY_VALUES = ["KPOP", "TWO_D", "MUSICAL", "ETC"];
const PAGE_SIZE = 20;

function Home() {
    const tabs = ["K-POP", "2D", "뮤지컬", "기타"];
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [hideClosed, setHideClosed] = useState(false);
    const [markets, setMarkets] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasNext, setHasNext] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const loadMoreRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        setMarkets([]);
        setNextCursor(null);
        setHasNext(false);
        setErrorMessage("");
        setIsLoading(true);

        getMarkets({
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
                if (error.name !== "AbortError") {
                    setErrorMessage(error.message || "마켓을 불러오지 못했어요.");
                }
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [selectedTabIndex, hideClosed]);

    useEffect(() => {
        if (!hasNext || isLoading || !nextCursor || !loadMoreRef.current) return undefined;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;

            setIsLoading(true);
            getMarkets({
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
                .catch((error) => setErrorMessage(error.message || "마켓을 더 불러오지 못했어요."))
                .finally(() => setIsLoading(false));
        });

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNext, isLoading, nextCursor, selectedTabIndex, hideClosed]);

    const isEmpty = !isLoading && !errorMessage && markets.length === 0;

    return (
        <div className={`home ${isEmpty ? "home--empty-state" : ""}`}>
            <div className="home_topsection">
                <div className="home_header">
                    <img src={Logo} alt="Logo" className="home_logo" />
                    <img src={Dummy} alt="Dummy" className="home_dummy" />
                </div>
                <div className="home_tabsection">
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

            {isEmpty ? (
                <div className="home_empty-state">
                    <p className="home_empty-title">
                        아직 등록된 마켓이 없어요.
                    </p>
                    <p className="home_empty-description">
                        다른 카테고리의 마켓들을 둘러보세요!
                    </p>
                </div>
            ) : (
                <>
                    <div className="home_headline">
                        <div className="home_total">총 {totalCount}개</div>
                        <Dropdown onChange={setHideClosed} />
                    </div>
                    <div className="home_feed" aria-live="polite">
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
                        {errorMessage && <p className="home_message home_message--error">{errorMessage}</p>}
                        <div ref={loadMoreRef} className="home_load-more" aria-hidden="true" />
                        {isLoading && <p className="home_message">불러오는 중...</p>}
                    </div>
                </>
            )}

            <div className="home_gnb-wrap">
                <GNB />
            </div>
        </div>
    );
}

export default Home;