import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Magnetic from './ui/Magnetic';
import styles from './Hero.module.css';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 250]);
    const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section id="hero" className={styles.hero} ref={ref}>
            <div className={`container ${styles.heroContainer}`}>

                {/* Left Content */}
                <motion.div
                    className={styles.content}
                    style={{ y: yText, opacity }}
                >
                    <div className={styles.capsule}>
                        <span className={styles.availableDot} />
                        <span>Available for New Projects</span>
                    </div>

                    <div className={styles.maskContainer}>
                        <motion.h1
                            className={styles.title}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            Syed Hamza
                        </motion.h1>
                    </div>

                    <div className={styles.maskContainer}>
                        <motion.h1
                            className={`${styles.title} ${styles.outline}`}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            Zulfiqar
                        </motion.h1>
                    </div>

                    <motion.p
                        className={styles.description}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Hamza is a 3D Game Developer and Computer Science student dedicated to bringing interactive concepts to life. With professional experience in Unity and C#, he specializes in crafting engaging gameplay loops, from hyper-casual prototypes to advanced NavMesh AI and physics based systems. A certified developer and technical problem-solver, Hamza blends precision coding with creative game design to turn ambitious ideas into seamless reality.
                    </motion.p>

                    <motion.div
                        className={styles.ctaGroup}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <Magnetic>
                            <a href="#projects" className={styles.primaryBtn}>
                                View Projects
                            </a>
                        </Magnetic>
                    </motion.div>
                </motion.div>

                {/* Right Visual / Image */}
                <motion.div
                    className={styles.heroImageWrapper}
                    style={{ y: yImage }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                >
                    <div className={styles.imageBackdrop} />
                    <img src="/profile.png" alt="Syed Hamza Zulfiqar" className={styles.profileImage} />
                    <div className={styles.gradientOverlay} />
                </motion.div>

            </div>

            <motion.div
                className={styles.scrollBadge}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <span>SCROLL</span>
                <ArrowDown size={14} />
            </motion.div>
        </section>
    );
};

export default Hero;
