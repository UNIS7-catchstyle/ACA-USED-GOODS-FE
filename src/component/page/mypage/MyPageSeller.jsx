import './MyPageSeller.css';
import Dropdown from '../../element/Dropdown';
import DragHandle from '../../../assets/icon/DragHandle.svg'
import Dummy from '../../../assets/Dummy.png';
import Tab from '../../element/Tab'
import GNB from '../../element/GNB'
import Post from '../../element/Post'
import Button from '../../element/Button'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getCommentedMarkets, getMyMarket } from '../../../api/markets'
import { getMyInfo } from '../../../api/auth'

const PAGE_SIZE = 20;

function MyPageSeller() {
    const navigate = useNavigate()
    const [nickname, setNickname] = useState('닉네임')
    const [selectedTab, setSelectedTab] = useState('written')
    const [markets, setMarkets] = useState([])
    const [nextCursor, setNextCursor] = useState(null)
    const [hasNext, setHasNext] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [hideClosed, setHideClosed] = useState(false)
    const loadMoreRef = useRef(null)
    const [myMarket, setMyMarket] = useState(null)
    const [myMarketLoading, setMyMarketLoading] = useState(false)
    const [myMarketError, setMyMarketError] = useState('')

    useEffect(() => {
        getMyInfo()
            .then((response) => setNickname(response.data?.nickname ?? '닉네임'))
            .catch(() => setNickname('닉네임'));
    }, []);

    useEffect(() => {
        if (selectedTab !== 'written') return undefined;

        const controller = new AbortController();
        setMyMarketLoading(true);
        setMyMarketError('');

        getMyMarket({ signal: controller.signal })
            .then((response) => setMyMarket(response.data ?? null))
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setMyMarket(null);
                    setMyMarketError(error.message || '등록한 마켓을 불러오지 못했어요.');
                }
            })
            .finally(() => setMyMarketLoading(false));

        return () => controller.abort();
    }, [selectedTab]);

    useEffect(() => {
        if (selectedTab !== 'commented') return undefined;

        const controller = new AbortController();
        setMarkets([]);
        setNextCursor(null);
        setHasNext(false);
        setErrorMessage('');
        setIsLoading(true);

        getCommentedMarkets({
            excludeClosed: hideClosed,
            size: PAGE_SIZE,
            signal: controller.signal,
        })
            .then((response) => {
                const data = response.data ?? {};
                setMarkets(data.items ?? []);
                setNextCursor(data.nextCursor ?? null);
                setHasNext(Boolean(data.hasNext));
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setErrorMessage(error.message || '댓글 단 글을 불러오지 못했어요.');
                }
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [selectedTab, hideClosed]);

    useEffect(() => {
        if (selectedTab !== 'commented' || !hasNext || isLoading || !nextCursor || !loadMoreRef.current) return undefined;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;

            setIsLoading(true);
            getCommentedMarkets({
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
                .catch((error) => setErrorMessage(error.message || '댓글 단 글을 더 불러오지 못했어요.'))
                .finally(() => setIsLoading(false));
        });

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [selectedTab, hasNext, isLoading, nextCursor, hideClosed]);


    return (
        <div className="mypageseller">
            <div className="mypageseller_topsection">
                <div className="mypageseller_header">
                    <div className="mypageseller_title">{nickname}</div>
                    <img className="mypageseller_draghandle" src={DragHandle} alt="드래그 핸들" onClick={() => navigate('/setting-and-activity')} />
                </div>
                <div className="mypageseller_tabsection">
                    <Tab
                        style="Underbar"
                        label="내가 쓴 글"
                        state={selectedTab === 'written' ? 'Selected' : 'Default'}
                        onClick={() => setSelectedTab('written')}
                    />
                    <Tab
                        style="Underbar"
                        label="댓글 단 글"
                        state={selectedTab === 'commented' ? 'Selected' : 'Default'}
                        onClick={() => setSelectedTab('commented')}
                    />
                </div>
            </div>
            {selectedTab === 'written' ? (
                <>
                    {myMarketLoading && !myMarket ? (
                        <p className="mypageseller_message">불러오는 중...</p>
                    ) : myMarketError ? (
                        <p className="mypageseller_message mypageseller_message--error">{myMarketError}</p>
                    ) : myMarket ? (
                        <div className="mypageseller_container">
                            <Post
                                style="L"
                                marketId={myMarket.id}
                                showLabel={Boolean(myMarket.isClosed)}
                                marketName={myMarket.title}
                                artistName={myMarket.itemCategories || myMarket.category}
                                location=""
                                description={myMarket.description}
                                bookmarkCount={myMarket.scrapCount}
                                initialBookmarked={myMarket.isScrapped}
                                images={myMarket.thumbnails}
                                isOwner
                            />
                            <Button
                                label="수정하기"
                                state="default"
                                style="secondary"
                                size="M"
                                onClick={() => navigate('/market-register', { state: { mode: 'edit', marketId: myMarket.id } })}
                            />
                        </div>
                    ) : (
                        <div className="mypageseller_empty-state">
                            <strong>아직 등록된 마켓이 없어요</strong>
                            <span>지금 바로 마켓을 <br />등록해 보세요!</span>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {!isLoading && !errorMessage && markets.length === 0 ? (
                        <div className="mypageseller_empty-state">
                            <strong>아직 등록된 댓글이 없어요</strong>
                            <span>지금 바로 마켓에 
                                <br />댓글을 등록해 보세요!</span>
                        </div>
                    ) : (
                        <>
                            <div className="home_headline">
                                <img src={Dummy} alt="Dummy" />
                                <Dropdown onChange={setHideClosed} />
                            </div>
                            <div className="home_feed">
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
                                {errorMessage && <p className="mypageseller_message mypageseller_message--error">{errorMessage}</p>}
                                <div ref={loadMoreRef} className="mypageseller_load-more" aria-hidden="true" />
                                {isLoading && <p className="mypageseller_message">불러오는 중...</p>}
                            </div>
                        </>
                    )}
                </>
            )}
            <div className="mypageseller_gnb-wrapper">
                <GNB defaultSelected="mypage" />
            </div>
        </div>
    );
}

export default MyPageSeller;