import Tab from "../element/Tab";
import Dropdown from "../element/Dropdown";
import Post from "../element/Post";
import GNB from "../element/GNB";
import Button from "../element/Button";
import Footer from "../element/Footer";
import "./Home.css";
import { useState } from "react";
import Logo from "../../assets/login/Logo.svg";
import Dummy from "../../assets/Dummy.png";

function Home() {
    const tabs = ["K-POP", "2D", "뮤지컬", "기타"];
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const is2DSelected = selectedTabIndex === 1;
    const isMusicalSelected = selectedTabIndex === 2;
    const isEmptyTabSelected = is2DSelected || isMusicalSelected;
    const [hideClosed, setHideClosed] = useState(false);

    return (
        <div className={`home ${isEmptyTabSelected ? "home--empty-state" : ""}`}>
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
                    {is2DSelected && (
                        <>
                            <img src={Dummy} alt="Dummy" className="home_dummy" />
                            <img src={Dummy} alt="Dummy" className="home_dummy" />
                        </>
                    )}
                    {isMusicalSelected && (
                        <>
                            <img src={Dummy} alt="Dummy" className="home_dummy" />
                            <img src={Dummy} alt="Dummy" className="home_dummy" />
                        </>
                    )}
                </div>
            </div>

            {isEmptyTabSelected ? (
                <div className="home_empty-state">
                    <p className="home_empty-title">
                        {is2DSelected ? "현재 준비된 마켓이 없어요." : "아직 등록된 마켓이 없어요"}
                    </p>
                    <p className={is2DSelected ? "home_empty-description" : "home_empty-description-2"}>
                        {is2DSelected ? (
                            <>
                                찾으시는 굿즈가 없다면,
                                <br />
                                다른 카테고리의 마켓들을 둘러보세요!
                            </>
                        ) : (
                            <>
                                지금 바로
                                <br />
                                마켓 정보를 등록해 보세요!
                            </>
                        )}
                    </p>
                    {is2DSelected && (
                        <div className="home_empty-footer">
                            <Footer />
                        </div>
                    )}
                    {isMusicalSelected && (
                        <Button
                            state="default"
                            style="primary"
                            size="S"
                            label="내 마켓 등록하기"
                        />
                    )}
                </div>
            ) : (
                <>
                    <div className="home_headline">
                        <div className="home_total">총 82개</div>
                        <Dropdown onChange={setHideClosed} />
                    </div>
                    <div className="home_feed">
                        <Post showLabel={true} hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
                        <Post hideClosed={hideClosed} />
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