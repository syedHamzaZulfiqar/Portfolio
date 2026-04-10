import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Github } from 'lucide-react';
import { projects, experiences } from '../data/portfolioData';
import type { PortfolioItem } from '../data/portfolioData';
import styles from './DetailsPage.module.css';

const DetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<PortfolioItem | null>(null);

    useEffect(() => {
        // Scroll to top exactly when a details page loads
        window.scrollTo(0, 0);
        
        // Find in projects
        let found = projects.find(p => p.id === id);
        if (!found) {
            // Find in experiences
            found = experiences.find(e => e.id === id);
        }
        setItem(found || null);
    }, [id]);

    if (!item) {
        return (
            <div className={styles.notFound}>
                <h2>Project Not Found</h2>
                <Link to="/" className={styles.backLink}><ArrowLeft size={20} /> Back to Home</Link>
            </div>
        );
    }

    return (
        <main className={styles.detailsMain}>
            <div className={`container ${styles.container}`}>
                <div className={styles.topNav}>
                    <Link to="/" className={styles.backBtn}>
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </Link>
                </div>
                
                <header className={styles.header}>
                    <div className={styles.tags}>
                        <span className={styles.category}>{item.category}</span>
                    </div>
                    <h1 className={styles.title}>{item.title}</h1>
                    {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
                </header>

                <div className={styles.heroVisual}>
                    <img src={item.thumbnail} alt={item.title} className={styles.heroBlob} />
                </div>

                <div className={styles.content}>
                    <div className={styles.descriptionBlock}>
                        <h2>Overview</h2>
                        <div className={styles.textStack}>
                            {item.detailedDescription.map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))}
                        </div>
                    </div>
                    
                    <aside className={styles.sidebar}>
                        <div className={styles.sideGroup}>
                            <h3>Technologies</h3>
                            <div className={styles.techTags}>
                                {item.tags.map(t => (
                                    <span key={t} className={styles.techTag}>{t}</span>
                                ))}
                            </div>
                        </div>

                        {(item.links?.play || item.links?.code) && (
                            <div className={styles.sideGroup}>
                                <h3>Links</h3>
                                <div className={styles.actionButtons}>
                                    {item.links.play && (
                                        <a href={item.links.play} target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
                                            <Play size={18} /> Play Game
                                        </a>
                                    )}
                                    {item.links.code && (
                                        <a href={item.links.code} target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn}>
                                            <Github size={18} /> View Source
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>

                {item.media && item.media.length > 0 && (
                    <div className={styles.lowerGallery}>
                        <h2>Photos & Videos</h2>
                        <div className={styles.mediaGrid}>
                            {item.media.map((m, idx) => (
                                <div key={idx} className={styles.mediaItem}>
                                    {m.type === 'image' ? (
                                        <img src={m.url} alt={m.caption || item.title} className={styles.mediaBlob} />
                                    ) : (
                                        <video src={m.url} controls className={styles.mediaBlob} />
                                    )}
                                    {m.caption && <p className={styles.caption}>{m.caption}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </main>
    );
};

export default DetailsPage;
