import { Github, Linkedin, Mail } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.topSection}>
                    <div className={styles.brand}>
                        <h3>SYED <span style={{ color: 'var(--color-primary)' }}>HAMZA</span></h3>
                        <p>Building immersive digital experiences and game systems.</p>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.column}>
                            <h4>Navigation</h4>
                            <a href="#about">About</a>
                            <a href="#projects">Projects</a>
                            <a href="#skills">Skills</a>
                            <a href="#contact">Contact</a>
                        </div>
                        <div className={styles.column}>
                            <h4>Socials</h4>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </div>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.bottomSection}>
                    <p>&copy; {new Date().getFullYear()} Syed Hamza Zulfiqar. All rights reserved.</p>
                    <div className={styles.socialIcons}>
                        <a href="https://github.com" aria-label="Github"><Github size={20} /></a>
                        <a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        <a href="mailto:hello@example.com" aria-label="Email"><Mail size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
