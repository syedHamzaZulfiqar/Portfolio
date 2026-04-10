import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/portfolioData';
import styles from './Projects.module.css';

const Projects = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

    return (
        <section ref={targetRef} id="projects" className={styles.scrollSection}>
            <div className={styles.horizontalScrollWrapper}>
                <div className={styles.sectionHeader}>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={styles.title}
                    >
                        Personal <span className={styles.outline}>Projects</span>
                    </motion.h2>
                </div>
                <motion.div
                    style={{ x }}
                    className={styles.cardsContainer}
                >
                    {projects.map((project) => (
                        <div key={project.id} className={styles.projectCard}>
                            <div className={styles.cardImage} onClick={() => navigate(`/project/${project.id}`)} style={{ cursor: 'pointer' }}>
                                <img src={project.thumbnail} alt={project.title} />
                                <div className={styles.overlay} />
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.category}>{project.category}</span>
                                    <div className={styles.links}>
                                        {project.links?.code && <a href={project.links.code} target="_blank" rel="noopener noreferrer" className={styles.iconLink}><Github size={20} /></a>}
                                        {project.links?.play && <a href={project.links.play} target="_blank" rel="noopener noreferrer" className={styles.iconLink}><ArrowUpRight size={20} /></a>}
                                    </div>
                                </div>
                                <h3 className={styles.cardTitle} onClick={() => navigate(`/project/${project.id}`)} style={{ cursor: 'pointer' }}>
                                    {project.title}
                                </h3>
                                <p className={styles.cardDesc}>{project.shortDescription}</p>
                                <div className={styles.tags}>
                                    {project.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
