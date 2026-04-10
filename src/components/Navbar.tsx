import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'About', href: '#hero' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
        { name: 'Resume', href: '/portfolio-media/GameDevCV.pdf', external: true }
    ];

    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1] as const
            }
        },
        open: {
            opacity: 1,
            y: "0%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1] as const
            }
        }
    };

    const linkVariants = {
        closed: { y: 20, opacity: 0 },
        open: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.1 + (i * 0.1),
                duration: 0.4,
                ease: [0.76, 0, 0.24, 1] as const
            }
        })
    };

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <a href="#" className={styles.logo}>
                    ZULFI
                </a>

                <div className={styles.desktopNav}>
                    {links.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.href} 
                            className={styles.navLink}
                            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ zIndex: 1002, position: 'relative' }}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className={styles.mobileMenuOverlay}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                        >
                            <div className={styles.mobileMenuContent}>
                                {links.map((link, i) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.href}
                                        className={styles.mobileLink}
                                        custom={i}
                                        variants={linkVariants}
                                        onClick={() => setIsOpen(false)}
                                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                    >
                                        {link.name}
                                        <ArrowUpRight size={24} className={styles.linkArrow} />
                                    </motion.a>
                                ))}
                            </div>

                            <motion.div
                                className={styles.mobileFooter}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                            >
                                <span>Based in Digital Space</span>
                                <span>&copy; 2026</span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
