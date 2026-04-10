import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { experiences } from '../data/portfolioData';
import styles from './Experience.module.css';

const Experience = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section id="experience" className={styles.section} ref={sectionRef}>
            <div className={`container ${styles.container}`}>
                <div className={styles.header}>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={styles.title}
                    >
                        Work <span className={styles.outline}>Experience</span>
                    </motion.h2>
                </div>
                
                <motion.div style={{ y }} className={styles.timeline}>
                    {experiences.map((exp, index) => (
                        <motion.div 
                            key={exp.id}
                            className={styles.item}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className={styles.marker} />
                            <div className={styles.content}>
                                <div className={styles.timeHeader}>
                                    <h3>{exp.title}</h3>
                                    <span className={styles.company}>{exp.subtitle}</span>
                                </div>
                                <p>{exp.shortDescription}</p>
                                <div style={{ marginTop: '1.5rem' }}>
                                    <Link to={`/experience/${exp.id}`} className={styles.detailsLink}>
                                        View Details <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Experience;
