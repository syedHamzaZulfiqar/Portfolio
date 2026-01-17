import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import styles from './Projects.module.css';

const projects = [
    {
        title: "Ethereal Engine",
        category: "Game Engine",
        description: "A physically based rendering engine built with C++ and Vulkan.",
        image: "https://images.unsplash.com/photo-1614726365723-498aa67c5f7b?q=80&w=1000&auto=format&fit=crop",
        tags: ["C++", "Vulkan", "GLSL"],
        links: { demo: "#", code: "#" }
    },
    {
        title: "Neural Nexus",
        category: "AI Simulation",
        description: "Real-time crowd simulation using flow fields and neural networks.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
        tags: ["Unity", "C#", "Compute Shaders"],
        links: { demo: "#", code: "#" }
    },
    {
        title: "Cyberpunk UI Kit",
        category: "Interface Design",
        description: "A diegetic user interface system for immersive VR experiences.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
        tags: ["Figma", "React", "Three.js"],
        links: { demo: "#", code: "#" }
    },
    {
        title: "Void Drifter",
        category: "Indie Game",
        description: "Atmospheric space exploration game featuring procedural generation.",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
        tags: ["Unreal Engine", "Blueprints", "C++"],
        links: { demo: "#", code: "#" }
    },
];

const Projects = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

    return (
        <section ref={targetRef} id="projects" className={styles.scrollSection}>
            <div className={styles.horizontalScrollWrapper}>
                <motion.div
                    style={{ x }}
                    className={styles.cardsContainer}
                >
                    {projects.map((project, index) => (
                        <div key={index} className={styles.projectCard}>
                            <div className={styles.cardImage}>
                                <img src={project.image} alt={project.title} />
                                <div className={styles.overlay} />
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.category}>{project.category}</span>
                                    <div className={styles.links}>
                                        <a href={project.links.code} className={styles.iconLink}><Github size={20} /></a>
                                        <a href={project.links.demo} className={styles.iconLink}><ArrowUpRight size={20} /></a>
                                    </div>
                                </div>
                                <h3 className={styles.cardTitle}>{project.title}</h3>
                                <p className={styles.cardDesc}>{project.description}</p>
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
