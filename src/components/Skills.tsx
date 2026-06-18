import { motion } from "framer-motion";
import {
  SiCplusplus,
  SiUnity,
  SiGithub,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiCanva,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { Zap, Cpu, Rocket } from "lucide-react";
import styles from "./Skills.module.css";

const skillRows = [
  {
    id: 1,
    direction: 1,
    speed: 40,
    items: [
      { name: "Unity", icon: <SiUnity /> },
      { name: "C#", icon: <TbBrandCSharp /> },
      { name: "C++", icon: <SiCplusplus /> },
      { name: "JavaScript", icon: <SiJavascript /> },
      { name: "HTML5", icon: <SiHtml5 /> },
      { name: "CSS3", icon: <SiCss3 /> },
      { name: "Game Design", icon: <Zap /> },
    ],
  },
  {
    id: 2,
    direction: -1,
    speed: 50,
    items: [
      { name: "AI (NavMesh)", icon: <Cpu /> },
      { name: "Physics", icon: <Rocket /> },
      { name: "UI Systems", icon: <Zap /> },
      { name: "Cinemachine", icon: <Rocket /> },
      { name: "Canva", icon: <SiCanva /> },
      { name: "Git/GitHub", icon: <SiGithub /> },
      { name: "Level Design", icon: <Zap /> },
      { name: "Optimization", icon: <Rocket /> },
    ],
  },
];

const MarqueeRow = ({
  items,
  direction,
  speed,
}: {
  items: any[];
  direction: number;
  speed: number;
}) => {
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
          repeat: Infinity,
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
          <h2 className={styles.title}>
            The Technical <span className={styles.outline}>Arsenal</span>
          </h2>
          <p className={styles.description}>
            A curated collection of languages, frameworks, and tools used to
            engineer immersive digital realities.
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
