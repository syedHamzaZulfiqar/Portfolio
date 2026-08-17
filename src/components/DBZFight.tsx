import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './DBZFight.module.css';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    decay: number;
    type?: 'spark' | 'ember' | 'smoke' | 'ki' | 'dust';
}

interface Shockwave {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    color: string;
    alpha: number;
    width: number;
}

interface LightningBolt {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    segments: { x: number; y: number }[];
    alpha: number;
    decay: number;
}

interface SlashArc {
    cx: number;
    cy: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    color: string;
    alpha: number;
    decay: number;
    width: number;
}

interface SkeletalPose {
    x: number;
    y: number;
    facing: number;
    rotation: number;
    squashY: number;
    torsoAngle: number;
    headAngle: number;
    headOffset: { x: number; y: number };
    leftUpperArmAngle: number;
    leftForearmAngle: number;
    rightUpperArmAngle: number;
    rightForearmAngle: number;
    leftThighAngle: number;
    leftShinAngle: number;
    rightThighAngle: number;
    rightShinAngle: number;
    isSuperSaiyan: boolean;
    saiyanLevel: number; // 1 = Gold/Emerald, 2 = SSGSS Cyan
    auraPower: number;
    beamOrigin?: { x: number; y: number };
    weapon?: {
        type: 'sword';
        hand: 'left' | 'right';
        twoHanded?: boolean;
        angle: number;
        length: number;
        color: string;
        glowColor: string;
    };
}

export const DBZFight: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const superClashRef = useRef(false);
    const animFrameRef = useRef<number | null>(null);

    const TOTAL_DURATION = 50.0;

    const triggerSuperClash = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        superClashRef.current = true;
        setTimeout(() => {
            superClashRef.current = false;
        }, 600);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || 750;

        let tierHeader = 52;
        let tierMidAir = 220;
        let tierGround = Math.min(height - 80, Math.max(460, height * 0.72));

        const updateSize = () => {
            if (!container || !canvas || !ctx) return;
            width = container.clientWidth || window.innerWidth;
            height = container.clientHeight || 750;
            tierHeader = 52;
            tierMidAir = Math.min(260, height * 0.35);
            tierGround = Math.min(height - 80, Math.max(460, height * 0.72));

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };

        updateSize();

        const resizeObserver = new ResizeObserver(() => {
            updateSize();
        });
        resizeObserver.observe(container);

        const particles: Particle[] = [];
        const shockwaves: Shockwave[] = [];
        const lightnings: LightningBolt[] = [];
        const slashArcs: SlashArc[] = [];

        const spawnSparks = (x: number, y: number, color = '#FFFFFF', count = 14, speedMult = 1.0) => {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = (2.0 + Math.random() * 5.0) * speedMult;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 0.6,
                    size: 1.6 + Math.random() * 2.4,
                    color,
                    alpha: 1,
                    decay: 0.018 + Math.random() * 0.035,
                    type: 'spark'
                });
            }
        };

        const spawnDust = (x: number, y: number, count = 8) => {
            for (let i = 0; i < count; i++) {
                const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.0;
                const speed = 1.0 + Math.random() * 3.5;
                particles.push({
                    x: x + (Math.random() - 0.5) * 20,
                    y: y + (Math.random() - 0.5) * 6,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed * 0.5,
                    size: 2.8 + Math.random() * 3.5,
                    color: 'rgba(255, 255, 255, 0.45)',
                    alpha: 0.8,
                    decay: 0.03 + Math.random() * 0.03,
                    type: 'dust'
                });
            }
        };

        const spawnKiEmbers = (x: number, y: number, color = '#FFD700', count = 4) => {
            for (let i = 0; i < count; i++) {
                const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
                const speed = 1.5 + Math.random() * 3.5;
                particles.push({
                    x: x + (Math.random() - 0.5) * 22,
                    y: y + (Math.random() - 0.5) * 10,
                    vx: Math.cos(angle) * speed * 0.35,
                    vy: Math.sin(angle) * speed,
                    size: 2.0 + Math.random() * 2.5,
                    color,
                    alpha: 0.95,
                    decay: 0.025 + Math.random() * 0.03,
                    type: 'ember'
                });
            }
        };

        const spawnShockwave = (x: number, y: number, color = '#FFFFFF', maxRadius = 38, width = 2.5) => {
            shockwaves.push({
                x,
                y,
                radius: 4,
                maxRadius,
                color,
                alpha: 0.95,
                width
            });
        };

        const spawnLightning = (startX: number, startY: number, endX: number, endY: number, color = '#00F0FF') => {
            const segments: { x: number; y: number }[] = [{ x: startX, y: startY }];
            const count = 6;
            const dx = (endX - startX) / count;
            const dy = (endY - startY) / count;

            for (let i = 1; i < count; i++) {
                const jitter = (Math.random() - 0.5) * 22;
                segments.push({
                    x: startX + dx * i + (Math.random() - 0.5) * 12,
                    y: startY + dy * i + jitter
                });
            }
            segments.push({ x: endX, y: endY });

            lightnings.push({
                startX,
                startY,
                endX,
                endY,
                color,
                segments,
                alpha: 1.0,
                decay: 0.14 + Math.random() * 0.08
            });
        };

        const spawnSlashArc = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number, color = '#00F0FF') => {
            slashArcs.push({
                cx,
                cy,
                radius,
                startAngle,
                endAngle,
                color,
                alpha: 1.0,
                decay: 0.065,
                width: 5.0
            });
        };

        let lastTime = performance.now();
        let timeline = 0;
        let lastCueTime = -1;

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

        const getPose = (time: number, isF1: boolean): SkeletalPose => {
            const t = time % TOTAL_DURATION;
            const facing = isF1 ? 1 : -1;

            let x = isF1 ? width * 0.22 : width * 0.78;
            let y = tierHeader;
            let rotation = 0;
            let squashY = 1.0;
            let headAngle = 0;
            let headOffset = { x: 0, y: 0 };
            let torsoAngle = isF1 ? 0.08 : -0.08;
            let leftUpperArm = isF1 ? 0.6 : -0.4;
            let leftForearm = isF1 ? 1.0 : -1.0;
            let rightUpperArm = isF1 ? -0.3 : 0.4;
            let rightForearm = isF1 ? 0.8 : -0.7;
            let leftThigh = isF1 ? -0.3 : 0.25;
            let leftShin = isF1 ? 0.5 : -0.45;
            let rightThigh = isF1 ? 0.3 : -0.25;
            let rightShin = isF1 ? 0.45 : -0.4;

            let isSuperSaiyan = false;
            let saiyanLevel = 1;
            let auraPower = 0;
            let beamOrigin: { x: number; y: number } | undefined;
            let weapon: SkeletalPose['weapon'] | undefined;

            const bounce = Math.sin(t * 7) * 1.5;
            y += bounce;

            // STAGE 1: (0.0s - 7.0s) Header Skirmish
            if (t < 7.0) {
                y = tierHeader;
                if (t < 1.5) {
                    x = isF1 ? width * 0.20 : width * 0.80;
                } else if (t >= 1.5 && t < 2.5) {
                    const p = (t - 1.5) / 1.0;
                    if (isF1) {
                        x = lerp(width * 0.20, width * 0.46, p);
                        if (p < 0.4) {
                            torsoAngle = -0.3;
                            rightUpperArm = -0.7;
                            rightForearm = 2.1;
                        } else {
                            torsoAngle = 0.45;
                            rightUpperArm = 1.55;
                            rightForearm = 0.05;
                            leftUpperArm = -0.5;
                        }
                    } else {
                        x = lerp(width * 0.80, width * 0.54, p);
                        if (p > 0.4) {
                            headAngle = -0.6;
                            headOffset = { x: 5, y: -2 };
                            torsoAngle = -0.45;
                            leftUpperArm = -0.8;
                        }
                    }
                } else if (t >= 2.5 && t < 4.2) {
                    const p = (t - 2.5) / 1.7;
                    if (!isF1) {
                        x = width * 0.54;
                        if (p < 0.6) {
                            torsoAngle = -0.55;
                            rightThigh = -1.8;
                            rightShin = -0.1;
                            leftThigh = 0.3;
                            leftShin = 0.8;
                        }
                    } else {
                        x = width * 0.46;
                        if (p < 0.6) {
                            y = tierHeader + 6;
                            squashY = 0.8;
                            torsoAngle = 0.55;
                            leftThigh = 0.8;
                            leftShin = 1.1;
                            rightThigh = 0.7;
                            rightShin = 1.0;
                        }
                    }
                } else {
                    const p = (t - 4.2) / 2.8;
                    if (isF1) {
                        x = width * 0.46;
                        if (p < 0.5) {
                            y = tierHeader + 6;
                            torsoAngle = -0.6;
                            rightThigh = 1.6;
                            rightShin = 0.1;
                        }
                    } else {
                        if (p < 0.6) {
                            const tripP = p / 0.6;
                            x = lerp(width * 0.54, width * 0.65, tripP);
                            y = tierHeader - Math.sin(tripP * Math.PI) * 18;
                            rotation = tripP * Math.PI * 1.5;
                        } else {
                            const landP = (p - 0.6) / 0.4;
                            x = width * 0.65;
                            y = tierHeader;
                            rotation = lerp(Math.PI * 1.5, 0, landP);
                            torsoAngle = -0.2;
                        }
                    }
                }
            }

            // STAGE 2: (7.0s - 14.0s) Downward Chase & Ground Impact
            else if (t >= 7.0 && t < 14.0) {
                const p = (t - 7.0) / 7.0;
                if (!isF1) {
                    if (p < 0.4) {
                        const fallP = p / 0.4;
                        x = lerp(width * 0.65, width * 0.78, fallP);
                        y = lerp(tierHeader, tierGround, fallP * fallP);
                        rotation = fallP * Math.PI * 3;
                    } else if (p >= 0.4 && p < 0.65) {
                        const bounceP = (p - 0.4) / 0.25;
                        x = lerp(width * 0.78, width * 0.84, bounceP);
                        y = tierGround - Math.sin(bounceP * Math.PI) * 26;
                        rotation = Math.PI * 3 + bounceP * Math.PI;
                    } else {
                        const recP = (p - 0.65) / 0.35;
                        x = width * 0.84;
                        y = tierGround;
                        squashY = recP < 0.3 ? 0.75 : 1.0;
                        rotation = 0;
                        torsoAngle = -0.3;
                    }
                } else {
                    if (p < 0.3) {
                        x = width * 0.48;
                        y = tierHeader - Math.sin((p / 0.3) * Math.PI) * 18;
                        torsoAngle = 1.2;
                        rightThigh = 1.7;
                        rightShin = 0.05;
                    } else if (p >= 0.3 && p < 0.7) {
                        const diveP = (p - 0.3) / 0.4;
                        x = lerp(width * 0.48, width * 0.60, diveP);
                        y = lerp(tierHeader, tierGround, diveP * diveP);
                        rotation = diveP * Math.PI * 2;
                    } else {
                        x = width * 0.60;
                        y = tierGround + 4;
                        squashY = 0.75;
                        rotation = 0;
                        torsoAngle = 0.7;
                        leftThigh = -0.9;
                        leftShin = 1.2;
                        rightThigh = 0.9;
                        rightShin = 1.1;
                    }
                }
            }

            // STAGE 3: (14.0s - 22.0s) Heavy Melee Brawl on Ground
            else if (t >= 14.0 && t < 22.0) {
                const p = (t - 14.0) / 8.0;
                y = tierGround;

                if (p < 0.4) {
                    const subP = p / 0.4;
                    if (!isF1) {
                        x = width * 0.76;
                        if (subP < 0.5) {
                            torsoAngle = -0.5;
                            leftUpperArm = -1.5;
                            leftForearm = 0.1;
                        } else {
                            torsoAngle = -0.3;
                            rightUpperArm = -1.4;
                            rightForearm = -1.4;
                        }
                    } else {
                        x = width * 0.66;
                        if (subP < 0.5) {
                            torsoAngle = 0.85;
                            headAngle = 0.6;
                            y = tierGround - 8;
                        } else {
                            const liftP = (subP - 0.5) / 0.5;
                            y = tierGround - Math.sin(liftP * Math.PI) * 38;
                            torsoAngle = -0.6;
                            headAngle = -0.8;
                        }
                    }
                } else if (p >= 0.4 && p < 0.8) {
                    const subP = (p - 0.4) / 0.4;
                    if (isF1) {
                        const dropP = subP;
                        x = lerp(width * 0.66, width * 0.74, dropP);
                        y = tierGround - 24 + dropP * 22;
                        rotation = 0.35;
                        torsoAngle = 0.8;
                        rightThigh = 1.6;
                        leftThigh = 1.5;
                    } else {
                        const hitP = subP;
                        x = lerp(width * 0.76, width * 0.88, hitP);
                        y = tierGround;
                        torsoAngle = -0.7;
                        headAngle = -0.5;
                    }
                } else {
                    x = isF1 ? width * 0.56 : width * 0.86;
                    y = tierGround;
                    torsoAngle = isF1 ? 0.2 : -0.2;
                }
            }

            // STAGE 4: (22.0s - 30.0s) Super Saiyan Awakening
            else if (t >= 22.0 && t < 30.0) {
                const p = (t - 22.0) / 8.0;
                y = tierGround;

                if (p < 0.25) {
                    const dashP = p / 0.25;
                    x = isF1 ? lerp(width * 0.56, width * 0.22, dashP) : lerp(width * 0.86, width * 0.82, dashP);
                    torsoAngle = isF1 ? -0.4 : 0.4;
                } else {
                    x = isF1 ? width * 0.22 : width * 0.82;
                    y = tierGround + 4;
                    squashY = 0.85;
                    torsoAngle = isF1 ? 0.4 : -0.4;
                    leftUpperArm = isF1 ? 1.0 : -1.0;
                    leftForearm = isF1 ? 1.3 : -1.3;
                    rightUpperArm = isF1 ? 0.9 : -0.9;
                    rightForearm = isF1 ? 1.2 : -1.2;
                    leftThigh = isF1 ? -0.8 : 0.8;
                    rightThigh = isF1 ? 0.8 : -0.8;

                    isSuperSaiyan = true;
                    saiyanLevel = isF1 ? 2 : 1;
                    auraPower = Math.min(1.0, (p - 0.25) / 0.4);
                }
            }

            // STAGE 5: (30.0s - 38.0s) Energy Sword Duel
            else if (t >= 30.0 && t < 38.0) {
                const p = (t - 30.0) / 8.0;
                isSuperSaiyan = true;
                saiyanLevel = isF1 ? 2 : 1;
                auraPower = 0.9;

                weapon = {
                    type: 'sword',
                    hand: isF1 ? 'right' : 'left',
                    twoHanded: true,
                    angle: isF1 ? -0.8 + Math.sin(t * 16) * 0.7 : 0.8 - Math.sin(t * 16) * 0.7,
                    length: 26,
                    color: isF1 ? '#00F0FF' : '#A3B18A',
                    glowColor: isF1 ? '#00A6FF' : '#8A9A5B'
                };

                if (p < 0.3) {
                    const leapP = p / 0.3;
                    x = isF1 ? lerp(width * 0.22, width * 0.44, leapP) : lerp(width * 0.82, width * 0.56, leapP);
                    y = lerp(tierGround, tierMidAir, Math.sin(leapP * Math.PI * 0.5));
                    torsoAngle = isF1 ? 0.4 : -0.4;
                    rightUpperArm = isF1 ? 1.4 : -0.5;
                    leftUpperArm = isF1 ? -0.5 : -1.4;
                } else if (p >= 0.3 && p < 0.75) {
                    x = isF1 ? width * 0.46 : width * 0.54;
                    y = tierMidAir + Math.sin(t * 22) * 3;
                    torsoAngle = isF1 ? 0.35 : -0.35;
                    rightUpperArm = isF1 ? 1.5 : -0.6;
                    leftUpperArm = isF1 ? -0.6 : -1.5;
                } else {
                    const disP = (p - 0.75) / 0.25;
                    x = isF1 ? lerp(width * 0.46, width * 0.16, disP) : lerp(width * 0.54, width * 0.84, disP);
                    y = tierMidAir - Math.sin(disP * Math.PI) * 32;
                    rotation = isF1 ? -disP * Math.PI * 2 : disP * Math.PI * 2;
                }
            }

            // STAGE 6: (38.0s - 46.0s) Kamehameha vs Galick Gun
            else if (t >= 38.0 && t < 46.0) {
                const p = (t - 38.0) / 8.0;
                isSuperSaiyan = true;
                saiyanLevel = isF1 ? 2 : 1;
                auraPower = 1.0;

                if (isF1) {
                    x = width * 0.14;
                    y = tierHeader + 12;
                } else {
                    x = width * 0.86;
                    y = tierGround;
                }

                if (p < 0.3) {
                    if (isF1) {
                        torsoAngle = -0.3;
                        rightUpperArm = -0.7;
                        rightForearm = 1.7;
                        leftUpperArm = -0.8;
                        leftForearm = 1.6;
                    } else {
                        torsoAngle = 0.3;
                        leftUpperArm = 0.8;
                        leftForearm = -1.7;
                        rightUpperArm = 0.7;
                        rightForearm = -1.6;
                    }
                } else {
                    if (isF1) {
                        torsoAngle = 0.55;
                        rightUpperArm = 1.55;
                        rightForearm = 0.05;
                        leftUpperArm = 1.5;
                        leftForearm = 0.08;
                        leftThigh = -0.6;
                        rightThigh = 0.7;
                    } else {
                        torsoAngle = -0.55;
                        leftUpperArm = -1.55;
                        leftForearm = -0.05;
                        rightUpperArm = -1.5;
                        rightForearm = -0.08;
                        leftThigh = 0.6;
                        rightThigh = -0.7;
                    }
                }
            }

            // STAGE 7: (46.0s - 50.0s) Reset
            else {
                const p = (t - 46.0) / 4.0;
                if (p < 0.6) {
                    const blastP = p / 0.6;
                    if (isF1) {
                        x = lerp(width * 0.14, width * 0.20, blastP);
                        y = tierHeader - Math.sin(blastP * Math.PI) * 22;
                        rotation = -blastP * Math.PI * 2;
                    } else {
                        x = lerp(width * 0.86, width * 0.80, blastP);
                        y = lerp(tierGround, tierHeader, blastP);
                        rotation = blastP * Math.PI * 2;
                    }
                } else {
                    const landP = (p - 0.6) / 0.4;
                    isSuperSaiyan = landP < 0.5;
                    auraPower = Math.max(0, 1 - landP * 2);
                    x = isF1 ? width * 0.20 : width * 0.80;
                    y = tierHeader;
                    rotation = 0;
                    torsoAngle = isF1 ? lerp(0.4, 0.08, landP) : lerp(-0.4, -0.08, landP);
                }
            }

            if (superClashRef.current) {
                const shakeX = (Math.random() - 0.5) * 12;
                const shakeY = (Math.random() - 0.5) * 10;
                x = clamp(x + shakeX, 20, width - 20);
                y += shakeY;
                auraPower = 1.0;
                isSuperSaiyan = true;
            }

            return {
                x,
                y,
                facing,
                rotation,
                squashY,
                torsoAngle,
                headAngle,
                headOffset,
                leftUpperArmAngle: leftUpperArm,
                leftForearmAngle: leftForearm,
                rightUpperArmAngle: rightUpperArm,
                rightForearmAngle: rightForearm,
                leftThighAngle: leftThigh,
                leftShinAngle: leftShin,
                rightThighAngle: rightThigh,
                rightShinAngle: rightShin,
                isSuperSaiyan,
                saiyanLevel,
                auraPower,
                beamOrigin,
                weapon
            };
        };

        const drawPixelFighter = (pose: SkeletalPose, isF1: boolean, alpha = 1.0) => {
            const {
                x,
                y,
                facing,
                rotation,
                squashY,
                torsoAngle,
                headAngle,
                headOffset,
                leftUpperArmAngle,
                leftForearmAngle,
                rightUpperArmAngle,
                rightForearmAngle,
                leftThighAngle,
                leftShinAngle,
                rightThighAngle,
                rightShinAngle,
                isSuperSaiyan,
                saiyanLevel,
                auraPower,
                weapon
            } = pose;

            ctx.save();
            ctx.globalAlpha = alpha;

            ctx.translate(x, y - 14);
            if (Math.abs(rotation) > 0.01) {
                ctx.rotate(rotation);
            }
            if (squashY !== 1.0) {
                ctx.scale(1.0 + (1.0 - squashY) * 0.3, squashY);
            }
            ctx.translate(-x, -(y - 14));

            const skinColor = '#FFDFC4';
            const skinShadow = '#D4A373';
            const giColor = isF1 ? '#FF7A00' : '#8A9A5B';
            const giShadow = isF1 ? '#C65500' : '#596C47';
            const underColor = isF1 ? '#1D2A44' : '#222222';
            const bootColor = isF1 ? '#1D2A44' : '#1A1A1A';
            const bootTrim = isF1 ? '#FF7A00' : '#8A9A5B';
            const hairBase = isF1 ? '#1A1A24' : '#1E1E1E';
            const hairSSJ = saiyanLevel === 2 ? '#00F0FF' : (isF1 ? '#FFD700' : '#B8E986');
            const hairCurrent = isSuperSaiyan ? hairSSJ : hairBase;

            if (isSuperSaiyan && auraPower > 0.05) {
                ctx.save();
                const auraColor = saiyanLevel === 2 ? 'rgba(0, 240, 255,' : 'rgba(255, 215, 0,';
                const auraGlow = saiyanLevel === 2 ? 'rgba(0, 166, 255,' : 'rgba(255, 140, 0,';

                const auraHeight = 52 * auraPower;
                const auraWidth = 28 * auraPower;

                const grad = ctx.createRadialGradient(x, y - 18, 2, x, y - 18, auraWidth * 1.6);
                grad.addColorStop(0, `${auraColor} ${0.55 * auraPower})`);
                grad.addColorStop(0.5, `${auraGlow} ${0.30 * auraPower})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(x, y - 16, auraWidth * 1.4, auraHeight * 0.9, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = `${auraColor} ${0.85 * auraPower})`;
                ctx.lineWidth = 2.4;
                ctx.shadowColor = saiyanLevel === 2 ? '#00F0FF' : '#FFD700';
                ctx.shadowBlur = 14 * auraPower;

                for (let i = -2; i <= 2; i++) {
                    const waveOffset = Math.sin(timeline * 20 + i * 1.3) * 5;
                    ctx.beginPath();
                    ctx.moveTo(x + i * 6.5, y + 4);
                    ctx.quadraticCurveTo(
                        x + i * 7.5 + waveOffset,
                        y - auraHeight * 0.55,
                        x + i * 3.5 + waveOffset * 0.5,
                        y - auraHeight - 8
                    );
                    ctx.stroke();
                }
                ctx.restore();
            }

            const hipX = x;
            const hipY = y - 13;

            const spineLength = 14;
            const neckX = hipX + Math.sin(torsoAngle) * spineLength * facing;
            const neckY = hipY - Math.cos(torsoAngle) * spineLength;

            const headCenterX = neckX + Math.sin(torsoAngle + headAngle) * 6.5 * facing + headOffset.x;
            const headCenterY = neckY - 6.5 + headOffset.y;

            pose.beamOrigin = {
                x: neckX + Math.sin(rightUpperArmAngle) * 9.5 * facing + Math.sin(rightUpperArmAngle + rightForearmAngle) * 9.0 * facing,
                y: neckY + Math.cos(rightUpperArmAngle) * 9.5 + Math.cos(rightUpperArmAngle + rightForearmAngle) * 9.0
            };

            const drawPixelRect = (rx: number, ry: number, rw: number, rh: number, col: string, borderCol?: string) => {
                ctx.fillStyle = col;
                ctx.fillRect(Math.round(rx - rw / 2), Math.round(ry - rh / 2), rw, rh);
                if (borderCol) {
                    ctx.strokeStyle = borderCol;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(Math.round(rx - rw / 2) + 0.5, Math.round(ry - rh / 2) + 0.5, rw - 1, rh - 1);
                }
            };

            const drawRiggedLimb = (
                startX: number,
                startY: number,
                angle1: number,
                len1: number,
                angle2: number,
                len2: number,
                isArm: boolean,
                isBack: boolean
            ) => {
                const jointX = startX + Math.sin(angle1) * len1 * facing;
                const jointY = startY + Math.cos(angle1) * len1;

                const endX = jointX + Math.sin(angle1 + angle2) * len2 * facing;
                const endY = jointY + Math.cos(angle1 + angle2) * len2;

                const mainCol = isArm ? (isBack ? giShadow : giColor) : (isBack ? giShadow : giColor);
                const subCol = isArm ? (isBack ? skinShadow : skinColor) : bootColor;

                ctx.save();
                ctx.strokeStyle = mainCol;
                ctx.lineWidth = isArm ? 4.5 : 5.5;
                ctx.lineCap = 'square';
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(jointX, jointY);
                ctx.stroke();

                ctx.strokeStyle = isArm ? subCol : mainCol;
                ctx.lineWidth = isArm ? 3.5 : 4.5;
                ctx.beginPath();
                ctx.moveTo(jointX, jointY);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                drawPixelRect(jointX, jointY, 3, 3, isArm ? skinColor : giColor);

                if (isArm) {
                    drawPixelRect(endX, endY, 4, 4, skinColor, skinShadow);
                } else {
                    const toeX = endX + facing * 3.5;
                    drawPixelRect(toeX, endY + 1, 6, 4, bootColor);
                    drawPixelRect(toeX, endY + 1, 4, 1.5, bootTrim);
                }
                ctx.restore();

                if (isArm && weapon && (!isBack || weapon.twoHanded)) {
                    const wAngle = angle1 + angle2 + weapon.angle * facing;
                    const wEndX = endX + Math.sin(wAngle) * weapon.length * facing;
                    const wEndY = endY - Math.cos(wAngle) * weapon.length;

                    ctx.save();
                    ctx.strokeStyle = weapon.color;
                    ctx.lineWidth = 4.5;
                    ctx.shadowColor = weapon.glowColor;
                    ctx.shadowBlur = 14;
                    ctx.beginPath();
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(wEndX, wEndY);
                    ctx.stroke();

                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2.0;
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(wEndX, wEndY);
                    ctx.stroke();

                    drawPixelRect(endX, endY, 5, 3, '#D4A373');
                    ctx.restore();
                }
            };

            drawRiggedLimb(neckX, neckY, leftUpperArmAngle, 7.5, leftForearmAngle, 7.0, true, true);
            drawRiggedLimb(hipX, hipY, leftThighAngle, 8.5, leftShinAngle, 8.5, false, true);

            ctx.save();
            const midTorsoX = (hipX + neckX) / 2;
            const midTorsoY = (hipY + neckY) / 2;

            drawPixelRect(midTorsoX, midTorsoY, 11, 15, giColor, giShadow);
            drawPixelRect(neckX, neckY + 3, 5, 5, underColor);
            drawPixelRect(hipX, hipY - 2, 12, 3.5, underColor, isF1 ? '#FFD700' : '#8A9A5B');
            ctx.restore();

            drawRiggedLimb(hipX, hipY, rightThighAngle, 8.5, rightShinAngle, 8.5, false, false);
            drawRiggedLimb(neckX, neckY, rightUpperArmAngle, 7.5, rightForearmAngle, 7.0, true, false);

            ctx.save();
            drawPixelRect(headCenterX, headCenterY, 11, 10, skinColor, skinShadow);

            const eyeX = headCenterX + facing * 2.5;
            const eyeY = headCenterY - 0.5;
            drawPixelRect(eyeX, eyeY, 2.5, 2.5, '#FFFFFF');
            drawPixelRect(eyeX + facing * 0.5, eyeY, 1.5, 2.0, isF1 ? '#00A6FF' : '#222222');
            drawPixelRect(eyeX, eyeY - 2.5, 3.5, 1.2, isSuperSaiyan ? hairCurrent : '#111111');

            ctx.fillStyle = hairCurrent;
            if (isSuperSaiyan) {
                ctx.shadowColor = hairCurrent;
                ctx.shadowBlur = 10;
            }

            drawPixelRect(headCenterX, headCenterY - 7, 12, 5, hairCurrent);
            drawPixelRect(headCenterX + facing * 3, headCenterY - 11, 6, 6, hairCurrent);
            drawPixelRect(headCenterX - facing * 3, headCenterY - 9, 6, 5, hairCurrent);
            drawPixelRect(headCenterX + facing * 6, headCenterY - 8, 4, 7, hairCurrent);
            drawPixelRect(headCenterX - facing * 6, headCenterY - 4, 5, 8, hairCurrent);
            drawPixelRect(headCenterX - facing * 8, headCenterY - 1, 4, 6, hairCurrent);
            ctx.restore();

            ctx.restore();
        };

        const drawBeamStruggle = (f1Pose: SkeletalPose, f2Pose: SkeletalPose, t: number) => {
            const p = (t - 38.0) / 8.0;
            const f1Origin = f1Pose.beamOrigin || { x: f1Pose.x + 14, y: f1Pose.y - 12 };
            const f2Origin = f2Pose.beamOrigin || { x: f2Pose.x - 14, y: f2Pose.y - 12 };

            if (p < 0.3) {
                const chargeScale = p / 0.3;
                const chargeRadius = 7 + chargeScale * 15;

                ctx.save();
                const grad1 = ctx.createRadialGradient(f1Origin.x, f1Origin.y, 2, f1Origin.x, f1Origin.y, chargeRadius * 2.2);
                grad1.addColorStop(0, '#FFFFFF');
                grad1.addColorStop(0.35, '#00F0FF');
                grad1.addColorStop(0.8, 'rgba(0, 166, 255, 0.45)');
                grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = grad1;
                ctx.beginPath();
                ctx.arc(f1Origin.x, f1Origin.y, chargeRadius * 2.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#00F0FF';
                ctx.lineWidth = 2.2;
                ctx.shadowColor = '#00F0FF';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.ellipse(f1Origin.x, f1Origin.y, chargeRadius * 1.6, chargeRadius * 0.7, timeline * 10, 0, Math.PI * 2);
                ctx.stroke();

                const grad2 = ctx.createRadialGradient(f2Origin.x, f2Origin.y, 2, f2Origin.x, f2Origin.y, chargeRadius * 2.2);
                grad2.addColorStop(0, '#FFFFFF');
                grad2.addColorStop(0.35, '#8A9A5B');
                grad2.addColorStop(0.8, 'rgba(163, 177, 138, 0.45)');
                grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = grad2;
                ctx.beginPath();
                ctx.arc(f2Origin.x, f2Origin.y, chargeRadius * 2.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#A3B18A';
                ctx.lineWidth = 2.2;
                ctx.shadowColor = '#8A9A5B';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.ellipse(f2Origin.x, f2Origin.y, chargeRadius * 1.6, chargeRadius * 0.7, -timeline * 10, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                return;
            }

            const clashProgress = (p - 0.3) / 0.7;
            const midX = (f1Origin.x + f2Origin.x) / 2;
            const midY = (f1Origin.y + f2Origin.y) / 2;

            const struggleOscX = Math.sin(timeline * 16) * (width * 0.05);
            const struggleOscY = Math.cos(timeline * 14) * 20;
            const clashX = midX + struggleOscX;
            const clashY = midY + struggleOscY;

            const drawBeam = (
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                mainColor: string,
                outerGlow: string,
                beamThickness: number
            ) => {
                ctx.save();
                ctx.strokeStyle = outerGlow;
                ctx.lineWidth = beamThickness * 3.2;
                ctx.shadowColor = outerGlow;
                ctx.shadowBlur = 26;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                ctx.strokeStyle = mainColor;
                ctx.lineWidth = beamThickness * 1.7;
                ctx.shadowColor = mainColor;
                ctx.shadowBlur = 14;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = Math.max(2.4, beamThickness * 0.68);
                ctx.shadowColor = '#FFFFFF';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                ctx.strokeStyle = mainColor;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                const dist = Math.hypot(x2 - x1, y2 - y1);
                const steps = Math.floor(dist / 16);
                const angle = Math.atan2(y2 - y1, x2 - x1);

                for (let i = 0; i <= steps; i++) {
                    const stepDist = (i / steps) * dist;
                    const spiralOffset = Math.sin(timeline * 26 + i * 0.9) * (beamThickness * 1.35);
                    const sx = x1 + Math.cos(angle) * stepDist - Math.sin(angle) * spiralOffset;
                    const sy = y1 + Math.sin(angle) * stepDist + Math.cos(angle) * spiralOffset;

                    if (i === 0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.stroke();
                ctx.restore();
            };

            const beamThickness = 8.0 + Math.sin(timeline * 22) * 2.2;

            drawBeam(f1Origin.x, f1Origin.y, clashX, clashY, '#00F0FF', 'rgba(0, 166, 255, 0.7)', beamThickness);
            drawBeam(f2Origin.x, f2Origin.y, clashX, clashY, '#8A9A5B', 'rgba(163, 177, 138, 0.7)', beamThickness);

            ctx.save();
            const clashRadius = 20 + Math.sin(timeline * 25) * 6 + clashProgress * 8;
            const clashGrad = ctx.createRadialGradient(clashX, clashY, 3, clashX, clashY, clashRadius * 2.5);
            clashGrad.addColorStop(0, '#FFFFFF');
            clashGrad.addColorStop(0.35, '#00F0FF');
            clashGrad.addColorStop(0.65, '#8A9A5B');
            clashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = clashGrad;
            ctx.beginPath();
            ctx.arc(clashX, clashY, clashRadius * 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2.0;
            for (let i = 0; i < 8; i++) {
                const rAngle = timeline * 16 + i * (Math.PI / 4);
                const rLen = clashRadius * 2.2 + Math.random() * 12;
                ctx.beginPath();
                ctx.moveTo(clashX, clashY);
                ctx.lineTo(clashX + Math.cos(rAngle) * rLen, clashY + Math.sin(rAngle) * rLen);
                ctx.stroke();
            }
            ctx.restore();

            if (Math.random() < 0.85) {
                spawnSparks(clashX, clashY, Math.random() > 0.5 ? '#00F0FF' : '#A3B18A', 5, 2.2);
            }
            if (Math.random() < 0.45) {
                spawnLightning(clashX, clashY, clashX + (Math.random() - 0.5) * 90, clashY + (Math.random() - 0.5) * 70, '#00F0FF');
            }
        };

        const render = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;

            const speedMultiplier = isHovered ? 1.35 : 1.0;
            timeline += dt * speedMultiplier;

            ctx.clearRect(0, 0, width, height);

            const t = timeline % TOTAL_DURATION;

            if (t >= 2.0 && t < 2.15 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                const cx = width * 0.50;
                spawnSparks(cx, tierHeader - 12, '#FFFFFF', 16, 2.5);
                spawnShockwave(cx, tierHeader - 12, 'rgba(255, 255, 255, 0.9)', 28, 2.5);
            }

            if (t >= 8.6 && t < 8.8 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                const cx = width * 0.78;
                spawnSparks(cx, tierGround, '#FFFFFF', 20, 3.0);
                spawnDust(cx, tierGround, 12);
                spawnShockwave(cx, tierGround, 'rgba(255, 255, 255, 0.8)', 36, 3);
            }

            if (t >= 15.5 && t < 15.7 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                const cx = width * 0.70;
                spawnSparks(cx, tierGround - 16, '#8A9A5B', 18, 2.8);
                spawnShockwave(cx, tierGround - 16, 'rgba(138, 154, 91, 0.9)', 30, 2.5);
            }

            if (t >= 24.8 && t < 25.05 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                spawnShockwave(width * 0.22, tierGround, 'rgba(0, 240, 255, 0.9)', 48, 3.5);
                spawnShockwave(width * 0.82, tierGround, 'rgba(255, 215, 0, 0.9)', 48, 3.5);
                spawnSparks(width * 0.22, tierGround, '#00F0FF', 25, 3.5);
                spawnSparks(width * 0.82, tierGround, '#FFD700', 25, 3.5);
                spawnDust(width * 0.22, tierGround, 10);
                spawnDust(width * 0.82, tierGround, 10);
            }

            if (t >= 32.8 && t < 33.0 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                const cx = width * 0.50;
                spawnSparks(cx, tierMidAir, '#00F0FF', 22, 3.0);
                spawnShockwave(cx, tierMidAir, 'rgba(0, 240, 255, 0.9)', 36, 3);
                spawnSlashArc(cx, tierMidAir, 26, -Math.PI / 3, Math.PI / 3, '#00F0FF');
                spawnSlashArc(cx, tierMidAir, 26, Math.PI * 0.6, Math.PI * 1.3, '#A3B18A');
            }

            if (t >= 45.6 && t < 45.85 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                const midX = width * 0.50;
                const midY = (tierHeader + tierGround) / 2;
                spawnSparks(midX, midY, '#FFFFFF', 35, 4.5);
                spawnSparks(midX, midY, '#00F0FF', 30, 4.0);
                spawnSparks(midX, midY, '#8A9A5B', 30, 4.0);
                spawnShockwave(midX, midY, '#FFFFFF', 65, 4.5);
                spawnShockwave(midX, midY, 'rgba(0, 240, 255, 0.85)', 50, 3.5);
            }

            if (superClashRef.current && Math.random() < 0.6) {
                const rx = width * (0.15 + Math.random() * 0.7);
                const ry = Math.random() * (tierGround - 20);
                spawnSparks(rx, ry, Math.random() > 0.5 ? '#00F0FF' : '#FFD700', 10, 3.2);
                spawnLightning(rx, ry, rx + (Math.random() - 0.5) * 100, ry + (Math.random() - 0.5) * 80);
            }

            const f1Pose = getPose(timeline, true);
            const f2Pose = getPose(timeline, false);

            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, tierHeader + 1);
            ctx.lineTo(width, tierHeader + 1);
            ctx.stroke();
            ctx.restore();

            if (f1Pose.isSuperSaiyan && Math.random() < 0.45) {
                spawnKiEmbers(f1Pose.x, f1Pose.y, f1Pose.saiyanLevel === 2 ? '#00F0FF' : '#FFD700', 2);
            }
            if (f2Pose.isSuperSaiyan && Math.random() < 0.45) {
                spawnKiEmbers(f2Pose.x, f2Pose.y, '#8A9A5B', 2);
            }

            if (f1Pose.isSuperSaiyan && f1Pose.auraPower > 0.7 && Math.random() < 0.16) {
                spawnLightning(
                    f1Pose.x + (Math.random() - 0.5) * 16,
                    f1Pose.y - 20 + Math.random() * 12,
                    f1Pose.x + (Math.random() - 0.5) * 36,
                    f1Pose.y + 4,
                    f1Pose.saiyanLevel === 2 ? '#00F0FF' : '#FFD700'
                );
            }
            if (f2Pose.isSuperSaiyan && f2Pose.auraPower > 0.7 && Math.random() < 0.16) {
                spawnLightning(
                    f2Pose.x + (Math.random() - 0.5) * 16,
                    f2Pose.y - 20 + Math.random() * 12,
                    f2Pose.x + (Math.random() - 0.5) * 36,
                    f2Pose.y + 4,
                    '#B8E986'
                );
            }

            if (t >= 38.0 && t < 46.0) {
                drawBeamStruggle(f1Pose, f2Pose, t);
            }

            drawPixelFighter(f1Pose, true);
            drawPixelFighter(f2Pose, false);

            for (let i = slashArcs.length - 1; i >= 0; i--) {
                const arc = slashArcs[i];
                arc.alpha -= arc.decay;
                if (arc.alpha <= 0) {
                    slashArcs.splice(i, 1);
                    continue;
                }
                ctx.save();
                ctx.strokeStyle = arc.color;
                ctx.lineWidth = arc.width;
                ctx.shadowColor = arc.color;
                ctx.shadowBlur = 14;
                ctx.globalAlpha = Math.max(0, arc.alpha);
                ctx.beginPath();
                ctx.arc(arc.cx, arc.cy, arc.radius, arc.startAngle, arc.endAngle);
                ctx.stroke();
                ctx.restore();
            }

            for (let i = shockwaves.length - 1; i >= 0; i--) {
                const s = shockwaves[i];
                s.radius += 1.6;
                s.alpha -= 0.035;
                if (s.alpha <= 0 || s.radius >= s.maxRadius) {
                    shockwaves.splice(i, 1);
                    continue;
                }
                ctx.save();
                ctx.strokeStyle = s.color;
                ctx.globalAlpha = Math.max(0, s.alpha);
                ctx.lineWidth = s.width;
                ctx.shadowColor = s.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            for (let i = lightnings.length - 1; i >= 0; i--) {
                const bolt = lightnings[i];
                bolt.alpha -= bolt.decay;
                if (bolt.alpha <= 0) {
                    lightnings.splice(i, 1);
                    continue;
                }
                ctx.save();
                ctx.strokeStyle = bolt.color;
                ctx.lineWidth = 2.0;
                ctx.globalAlpha = Math.max(0, bolt.alpha);
                ctx.shadowColor = bolt.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                bolt.segments.forEach((pt, idx) => {
                    if (idx === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                });
                ctx.stroke();

                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 0.9;
                ctx.stroke();
                ctx.restore();
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.type === 'ember' ? -0.05 : (p.type === 'dust' ? -0.02 : 0.10);
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.shadowColor = p.color;
                ctx.shadowBlur = p.type === 'ember' ? 10 : 4;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            animFrameRef.current = requestAnimationFrame(render);
        };

        animFrameRef.current = requestAnimationFrame(render);

        return () => {
            resizeObserver.disconnect();
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [isHovered]);

    return (
        <div 
            ref={containerRef}
            className={styles.dbzFightContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={triggerSuperClash}
            aria-hidden="true"
        >
            <canvas 
                ref={canvasRef} 
                className={styles.canvas} 
            />
        </div>
    );
};

export default DBZFight;
