import styles from './MeshGradient.module.css';

const MeshGradient = () => {
    return (
        <div className={styles.container}>
            <div className={styles.blob} />
            <div className={styles.blob2} />
            <div className={styles.blob3} />
            <div className={styles.glass} />
        </div>
    );
};

export default MeshGradient;
