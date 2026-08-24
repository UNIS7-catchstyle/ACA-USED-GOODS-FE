import './Footer.css';
import Logo from '../../assets/login/Logo.svg';
import Insta from '../../assets/footer/BrandIcon_Insta.svg';
import Twitter from '../../assets/footer/BrandIcon_Twitter.svg';
import Thread from '../../assets/footer/BrandIcon_Thread.svg';

const SOCIAL_ITEMS = [
    { key: 'thread', label: 'Thread', icon: Thread, href: 'https://www.threads.com/@imyour.aca' },
    { key: 'twitter', label: 'X', icon: Twitter, href: 'https://x.com/ACA__official' },
    { key: 'instagram', label: 'Instagram', icon: Insta, href: 'https://www.instagram.com/imyour.aca?igsi=MWkxNzdsZWFuOG9uYg==' },
];

function Footer() {
    return (
        <footer className="footer" aria-label="사이트 푸터">
            <div className="footer__container">
                <div className="footer__header">
                    <img className="footer__logo" src={Logo} alt="ACA" />

                    <div className="footer__socials" aria-label="소셜 링크">
                        {SOCIAL_ITEMS.map((item) => (
                            <a
                                key={item.key}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="footer__social-image-button"
                                aria-label={item.label}
                            >
                                <img
                                    src={item.icon}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="footer__donation">
                    <p className="footer__donation-title">아카 후원하기</p>
                    <p className="footer__donation-account">카카오뱅크 3333-37-9163546 아카</p>
                </div>

                <p className="footer__copyright">Copyright © 2026 ACA. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;