import './MyPagePre.css'
import GNB from '../../element/GNB'
import Tab from '../../element/Tab'
import Button from '../../element/Button'
import Dropdown from '../../element/Dropdown'
import Post from '../../element/Post'
import DragHandle from '../../../assets/icon/DragHandle.svg'
import TextField from '../../element/TextField'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../../../utils/auth'
import { useEffect, useRef, useState } from 'react'
import { getMyInfo } from '../../../api/auth'
import { getCommentedMarkets } from '../../../api/markets'

const PAGE_SIZE = 20

function MyPagePre() {
    const navigate = useNavigate()
    const [loggedIn] = useState(isLoggedIn)
    const [selectedTab, setSelectedTab] = useState('written')
    const [myInfo, setMyInfo] = useState(null)
    const [markets, setMarkets] = useState([])
    const [nextCursor, setNextCursor] = useState(null)
    const [hasNext, setHasNext] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [hideClosed, setHideClosed] = useState(false)
    const loadMoreRef = useRef(null)

    useEffect(() => {
        if (!loggedIn) return undefined

        const controller = new AbortController()

        getMyInfo()
            .then((response) => {
                const data = response.data
                setMyInfo(data)
                if (data?.hasMarket) {
                    navigate('/mypage-seller', { replace: true })
                }
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setMyInfo(null)
                }
            })

        return () => controller.abort()
    }, [loggedIn, navigate])

    useEffect(() => {
        if (!loggedIn || selectedTab !== 'commented') return undefined

        const controller = new AbortController()
        setMarkets([])
        setNextCursor(null)
        setHasNext(false)
        setErrorMessage('')
        setIsLoading(true)

        getCommentedMarkets({
            excludeClosed: hideClosed,
            size: PAGE_SIZE,
            signal: controller.signal,
        })
            .then((response) => {
                const data = response.data ?? {}
                setMarkets(data.items ?? [])
                setNextCursor(data.nextCursor ?? null)
                setHasNext(Boolean(data.hasNext))
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setErrorMessage(error.message || '댓글 단 글을 불러오지 못했어요.')
                }
            })
            .finally(() => setIsLoading(false))

        return () => controller.abort()
    }, [loggedIn, selectedTab, hideClosed])

    useEffect(() => {
        if (selectedTab !== 'commented' || !hasNext || isLoading || !nextCursor || !loadMoreRef.current) return undefined

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return

            setIsLoading(true)
            getCommentedMarkets({
                excludeClosed: hideClosed,
                cursor: nextCursor,
                size: PAGE_SIZE,
            })
                .then((response) => {
                    const data = response.data ?? {}
                    setMarkets((currentMarkets) => [...currentMarkets, ...(data.items ?? [])])
                    setNextCursor(data.nextCursor ?? null)
                    setHasNext(Boolean(data.hasNext))
                })
                .catch((error) => setErrorMessage(error.message || '댓글 단 글을 더 불러오지 못했어요.'))
                .finally(() => setIsLoading(false))
        })

        observer.observe(loadMoreRef.current)
        return () => observer.disconnect()
    }, [selectedTab, hasNext, isLoading, nextCursor, hideClosed])

    return (
        <div className="mypagepre">
            <div className="mypagepre_topsection">
                <div className="mypagepre_header">
                    {loggedIn ? (
                        <div className="mypagepre_title">{myInfo?.nickname ?? '닉네임'}</div>
                    ) : (
                        <div className="mypagepre_title">마이페이지</div>
                    )}
                    <img className="mypagepre_draghandle" src={DragHandle} alt="드래그 핸들" onClick={() => navigate('/setting-and-activity')} />
                </div>
                <div className="mypagepre_tabsection">
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
            {loggedIn && selectedTab === 'commented' && !isLoading && !errorMessage && markets.length > 0 ? (
                <div className="mypagepre_container">
                    <div className="mypagepre_dropdown-wrapper">
                        <Dropdown onChange={setHideClosed} />
                    </div>
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
                    <div ref={loadMoreRef} className="mypagepre_load-more" aria-hidden="true" />
                    {isLoading && <p className="mypagepre_message">불러오는 중...</p>}
                </div>
            ) : loggedIn ? (
                <div className="mypagepre_content">
                    <div>
                        <div className="mypagepre_content-title">
                            {selectedTab === 'commented' ? (
                                errorMessage || <>아직 등록된 댓글이 없어요</>
                            ) : (
                                <>
                                    아직 등록된 마켓이 없어요
                                </>
                            )}
                        </div>
                        <div className="mypagepre_content-body">
                            {selectedTab === 'commented' ? (
                                !errorMessage && (
                                    <>
                                        지금 바로 마켓에
                                        <br />
                                        댓글을 등록해 보세요!
                                    </>
                                )
                            ) : (
                                <>
                                    지금 바로
                                    <br />
                                    마켓 정보를 등록해 보세요!
                                </>
                            )}
                        </div>
                    </div>
                    {selectedTab === 'written' && (
                        <Button
                            state="default"
                            style="primary"
                            size="S"
                            label="내 마켓 등록하기"
                            onClick={() => navigate('/market-register')}
                        />
                    )}
                    
                </div>
            ) : (
                <div className="mypagepre_content">
                    <div>
                        <div className="mypagepre_content-title">
                            로그인이 필요해요
                        </div>
                        <div className="mypagepre_content-body">
                            {selectedTab === 'commented' ? (
                                <>
                                    로그인 후 댓글 단 글을
                                    <br />
                                    조회할 수 있어요!
                                </>
                            ) : (
                                <>
                                    로그인 후 마켓 등록이
                                    <br />
                                    가능해요!
                                </>
                            )}
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
            )}
            <div className="mypagepre_gnb-wrapper">
                <GNB defaultSelected="mypage" />
            </div>
        </div>
    )
}

export default MyPagePre