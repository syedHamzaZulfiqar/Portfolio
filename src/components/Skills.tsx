import { motion } from 'framer-motion';
import {
    SiCplusplus, SiUnity, SiTypescript, SiUnrealengine, SiPython, SiWebgl, SiReact,
    SiOpengl, SiNodedotjs, SiNextdotjs, SiBlender, SiVite, SiPostgresql,
    SiTailwindcss, SiFigma, SiGithub, SiRust
} from 'react-icons/si';
import { Zap, Cpu, Rocket, Terminal } from 'lucide-react';
import styles from './Skills.module.css';

const skillRows = [
    {
        id: 1,
        direction: 1,
        speed: 40,
        items: [
            { name: "C++", icon: <SiCplusplus /> },
            { name: "Unity", icon: <SiUnity /> },
            { name: "TypeScript", icon: <SiTypescript /> },
            { name: "Unreal Engine", icon: <SiUnrealengine /> },
            { name: "Python", icon: <SiPython /> },
            { name: "WebGL", icon: <SiWebgl /> },
            { name: "React", icon: <SiReact /> }
        ]
    },
    {
        id: 2,
        direction: -1,
        speed: 50,
        items: [
            { name: "OpenGL", icon: <SiOpengl /> },
            { name: "Node.js", icon: <SiNodedotjs /> },
            { name: "Shaders", icon: <Zap /> },
            { name: "Next.js", icon: <SiNextdotjs /> },
            { name: "Optimization", icon: <Rocket /> },
            { name: "System Design", icon: <Cpu /> },
            { name: "Blender", icon: <SiBlender /> }
        ]
    },
    {
        id: 3,
        direction: 1,
        speed: 45,
        items: [
            { name: "PostgreSQL", icon: <SiPostgresql /> },
            { name: "Tailwind", icon: <SiTailwindcss /> },
            { name: "Figma", icon: <SiFigma /> },
            { name: "Vite", icon: <SiVite /> },
            { name: "Rust", icon: <SiRust /> },
            { name: "Architecture", icon: <Terminal /> },
            { name: "GitHub", icon: <SiGithub /> }
        ]
    }
];

const MarqueeRow = ({ items, direction, speed }: { items: any[], direction: number, speed: number }) => {
    // We duplicate items to create seamless loop
    const duplicatedItems = [...items, ...items, ...items, ...items];

    return (
        <div className={styles.marqueeContainer}>
            <motion.div
                className={styles.marqueeTrack}
                initial={{ x: direction > 0 ? "-20%" : "0%" }}
                animate={{ x: direction > 0 ? "0%" : "-20%" }}
                transition={{
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity
                }}
            >
                {duplicatedItems.map((item, idx) => (
                    <div key={`${item.name}-${idx}`} className={styles.skillChip}>
                        <span className={styles.icon}>{item.icon}</span>
                        <span className={styles.name}>{item.name}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const Skills = () => {
    return (
        <section id="skills" className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className={styles.label}>CAPABILITIES</span>
                    <h2 className={styles.title}>The Technical <span className={styles.outline}>Arsenal</span></h2>
                    <p className={styles.description}>
                        A curated collection of languages, frameworks, and tools used to engineer immersive digital realities.
                    </p>
                </motion.div>

                <div className={styles.marquees}>
                    {skillRows.map((row) => (
                        <MarqueeRow
                            key={row.id}
                            items={row.items}
                            direction={row.direction}
                            speed={row.speed}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
