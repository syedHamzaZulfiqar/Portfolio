import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import Magnetic from './ui/Magnetic';
import styles from './Contact.module.css';

const Contact = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);

    return (
        <section id="contact" className={styles.section} ref={container}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.mask}>
                        <motion.h2
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className={styles.title}
                        >
                            Let's Work
                        </motion.h2>
                    </div>
                    <div className={styles.mask}>
                        <motion.h2
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className={styles.title}
                        >
                            Together
                        </motion.h2>
                    </div>
                </div>

                <motion.div style={{ y }} className={styles.content}>
                    <div className={styles.ctaWrapper}>
                        <Magnetic>
                            <a href="mailto:syedhamzazulfiqarbu@gmail.com" className={styles.emailBtn}>
                                <span className={styles.btnText}>Get in touch</span>
                                <Mail className={styles.btnIcon} size={28} />
                            </a>
                        </Magnetic>
                    </div>

                    <div className={styles.footerInfo}>
                        <div className={styles.infoGroup}>
                            <span className={styles.label}>CONTACT DETAILS</span>
                            <a href="mailto:syedhamzazulfiqarbu@gmail.com" className={styles.link}>syedhamzazulfiqarbu@gmail.com</a>
                            <span className={styles.subText}>Lahore, Pakistan</span>
                        </div>

                        <div className={styles.infoGroup}>
                            <span className={styles.label}>SOCIALS</span>
                            <div className={styles.socialLinks}>
                                <a href="https://linkedin.com" target="_blank" className={styles.socialLink}>LinkedIn <ArrowUpRight size={14} /></a>
                                <a href="https://play.unity.com" target="_blank" className={styles.socialLink}>Unity Play <ArrowUpRight size={14} /></a>
                                <a href="https://github.com" target="_blank" className={styles.socialLink}>GitHub <ArrowUpRight size={14} /></a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className={styles.copyright}>
                    <span>&copy; {new Date().getFullYear()} Syed Hamza Zulfiqar. All rights reserved.</span>
                    <span className={styles.location}>Based in Lahore, Pakistan</span>
                </div>
            </div>
        </section>
    );
};

export default Contact;
