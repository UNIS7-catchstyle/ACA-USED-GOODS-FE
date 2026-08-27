import './MyPageBuyer.css';
import Dropdown from '../../element/Dropdown';
import Post from '../../element/Post';
import DragHandle from '../../../assets/icon/DragHandle.svg';
import GNB from '../../element/GNB';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getCommentedMarkets } from '../../../api/markets';
import { getMyInfo } from '../../../api/auth';

const PAGE_SIZE = 20;

function MyPageBuyer() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('닉네임');
    const [markets, setMarkets] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasNext, setHasNext] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hideClosed, setHideClosed] = useState(false);
    const loadMoreRef = useRef(null);

    useEffect(() => {
        getMyInfo()
            .then((response) => setNickname(response.data?.nickname ?? '닉네임'))
            .catch(() => setNickname('닉네임'));
    }, []);

    useEffect(() => {
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
    }, [hideClosed]);

    useEffect(() => {
        if (!hasNext || isLoading || !nextCursor || !loadMoreRef.current) return undefined;

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
    }, [hasNext, isLoading, nextCursor, hideClosed]);

    return (
        <div className="mypagebuyer">
            <div className="mypagebuyer_topsection">
                <div className="mypagebuyer_header">
                    <div className="mypagebuyer_title">{nickname}</div>
                    <img className="mypagebuyer_draghandle" src={DragHandle} alt="드래그 핸들" onClick={() => navigate('/setting-and-activity')} />
                </div>
                <div className="mypagebuyer_sectionheader">
                    <div className="mypagebuyer_label">댓글 단 글</div>
                    <Dropdown onChange={setHideClosed} />
                </div>
            </div>
            <div className="mypagebuyer_container">
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
                    <div className="mypagebuyer_empty-state">
                        <strong>아직 등록된 댓글이 없어요</strong>
                        <span>지금 바로 마켓에 
                            <br />댓글을 등록해 보세요!</span>
                    </div>
                )}
                {errorMessage && <p className="mypagebuyer_message mypagebuyer_message--error">{errorMessage}</p>}
                <div ref={loadMoreRef} className="mypagebuyer_load-more" aria-hidden="true" />
                {isLoading && <p className="mypagebuyer_message">불러오는 중...</p>}
            </div>
            <div className="mypagebuyer_gnb-wrapper">
                <GNB defaultSelected="mypage" />
            </div>
        </div>
    );
}

export default MyPageBuyer;