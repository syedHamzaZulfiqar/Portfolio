import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './StickFight.module.css';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    decay: number;
    type?: 'spark' | 'ember' | 'smoke' | 'chakra' | 'dust' | 'lightning';
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

// Rigged Skeletal Pose for Naruto and Sasuke
interface NinjaPose {
    x: number;
    y: number;
    facing: number; // 1 = right, -1 = left
    rotation: number; // tumble / flip angle in radians
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
    chakraState: 'normal' | 'kyuubi' | 'sharingan';
    jutsuHand?: { x: number; y: number };
    hasRasengan?: boolean;
    hasChidori?: boolean;
    rasenganScale?: number;
    chidoriPower?: number;
    weapon?: {
        type: 'kusanagi' | 'kunai';
        hand: 'left' | 'right';
        angle: number;
        length: number;
        color: string;
        glowColor: string;
    };
}

export const StickFight: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const superClashRef = useRef(false);
    const animFrameRef = useRef<number | null>(null);

    // 38-second iconic Naruto vs Sasuke loop
    const TOTAL_DURATION = 38.0;

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
        let height = container.clientHeight || 230;

        // Ground level within the defined red region
        let groundY = Math.min(height - 45, Math.max(140, height * 0.70));
        let airY = Math.min(85, height * 0.38);

        const updateSize = () => {
            if (!container || !canvas || !ctx) return;
            width = container.clientWidth || window.innerWidth;
            height = container.clientHeight || 230;
            groundY = Math.min(height - 45, Math.max(140, height * 0.70));
            airY = Math.min(85, height * 0.38);

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

        // Particle Pools
        const particles: Particle[] = [];
        const shockwaves: Shockwave[] = [];
        const lightnings: LightningBolt[] = [];
        const slashArcs: SlashArc[] = [];

        const spawnSparks = (x: number, y: number, color = '#FFFFFF', count = 12, speedMult = 1.0) => {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = (2.0 + Math.random() * 4.5) * speedMult;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 0.5,
                    size: 1.5 + Math.random() * 2.2,
                    color,
                    alpha: 1,
                    decay: 0.02 + Math.random() * 0.035,
                    type: 'spark'
                });
            }
        };

        const spawnSmoke = (x: number, y: number, count = 10) => {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.0 + Math.random() * 3.0;
                particles.push({
                    x: x + (Math.random() - 0.5) * 16,
                    y: y + (Math.random() - 0.5) * 12,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed * 0.6 - 0.4,
                    size: 3.5 + Math.random() * 4.5,
                    color: 'rgba(230, 230, 240, 0.75)',
                    alpha: 0.9,
                    decay: 0.025 + Math.random() * 0.025,
                    type: 'smoke'
                });
            }
        };

        const spawnDust = (x: number, y: number, count = 6) => {
            for (let i = 0; i < count; i++) {
                const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
                const speed = 1.0 + Math.random() * 3.0;
                particles.push({
                    x: x + (Math.random() - 0.5) * 18,
                    y: y + (Math.random() - 0.5) * 4,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed * 0.4,
                    size: 2.5 + Math.random() * 3.0,
                    color: 'rgba(255, 255, 255, 0.4)',
                    alpha: 0.8,
                    decay: 0.035 + Math.random() * 0.03,
                    type: 'dust'
                });
            }
        };

        const spawnShockwave = (x: number, y: number, color = '#FFFFFF', maxRadius = 36, width = 2.5) => {
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
            const count = 5;
            const dx = (endX - startX) / count;
            const dy = (endY - startY) / count;

            for (let i = 1; i < count; i++) {
                const jitter = (Math.random() - 0.5) * 18;
                segments.push({
                    x: startX + dx * i + (Math.random() - 0.5) * 10,
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
                decay: 0.16 + Math.random() * 0.08
            });
        };

        const spawnSlashArc = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number, color = '#FFFFFF') => {
            slashArcs.push({
                cx,
                cy,
                radius,
                startAngle,
                endAngle,
                color,
                alpha: 1.0,
                decay: 0.07,
                width: 4.0
            });
        };

        let lastTime = performance.now();
        let timeline = 0;
        let lastCueTime = -1;

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

        // Generate Rigged Poses for Naruto (isNaruto = true) & Sasuke (isNaruto = false)
        const getPose = (time: number, isNaruto: boolean): NinjaPose => {
            const t = time % TOTAL_DURATION;
            const facing = isNaruto ? 1 : -1;

            let x = isNaruto ? width * 0.18 : width * 0.82;
            let y = groundY;
            let rotation = 0;
            let squashY = 1.0;
            let headAngle = 0;
            let headOffset = { x: 0, y: 0 };
            let torsoAngle = isNaruto ? 0.10 : -0.10;
            let leftUpperArm = isNaruto ? 0.5 : -0.4;
            let leftForearm = isNaruto ? 1.0 : -1.0;
            let rightUpperArm = isNaruto ? -0.3 : 0.4;
            let rightForearm = isNaruto ? 0.8 : -0.7;
            let leftThigh = isNaruto ? -0.3 : 0.25;
            let leftShin = isNaruto ? 0.5 : -0.45;
            let rightThigh = isNaruto ? 0.3 : -0.25;
            let rightShin = isNaruto ? 0.45 : -0.4;

            let chakraState: 'normal' | 'kyuubi' | 'sharingan' = 'normal';
            let jutsuHand: { x: number; y: number } | undefined;
            let hasRasengan = false;
            let hasChidori = false;
            let rasenganScale = 0;
            let chidoriPower = 0;
            let weapon: NinjaPose['weapon'] | undefined;

            // Ninja breathing idle
            const bounce = Math.sin(t * 7) * 1.2;
            y += bounce;

            // =========================================================================
            // STAGE 1: (0.0s - 5.0s) Standoff & Classic Ninja Run Forward Dash
            // =========================================================================
            if (t < 5.0) {
                if (t < 1.5) {
                    // Standoff stance
                    x = isNaruto ? width * 0.18 : width * 0.82;
                } else if (t >= 1.5 && t < 3.2) {
                    // Classic Ninja Run Sprint (leaning deep forward, arms swept back!)
                    const p = (t - 1.5) / 1.7;
                    x = isNaruto ? lerp(width * 0.18, width * 0.46, p) : lerp(width * 0.82, width * 0.54, p);
                    torsoAngle = isNaruto ? 0.65 : -0.65; // deep forward lean
                    leftUpperArm = isNaruto ? -1.3 : 1.3; // arms swept straight back
                    leftForearm = isNaruto ? 0.05 : -0.05;
                    rightUpperArm = isNaruto ? -1.3 : 1.3;
                    rightForearm = isNaruto ? 0.05 : -0.05;
                    // Running legs cycle
                    const runCycle = t * 24;
                    leftThigh = Math.sin(runCycle) * 0.9;
                    leftShin = Math.max(0, -Math.cos(runCycle) * 1.1);
                    rightThigh = -Math.sin(runCycle) * 0.9;
                    rightShin = Math.max(0, Math.cos(runCycle) * 1.1);
                } else {
                    // Initial Clash at center with Kunai vs Kusanagi!
                    x = isNaruto ? width * 0.46 : width * 0.54;
                    torsoAngle = isNaruto ? 0.35 : -0.35;
                    if (isNaruto) {
                        rightUpperArm = 1.4;
                        rightForearm = 0.2;
                        weapon = {
                            type: 'kunai',
                            hand: 'right',
                            angle: 0.4,
                            length: 12,
                            color: '#4A4A4A',
                            glowColor: '#FFFFFF'
                        };
                    } else {
                        leftUpperArm = -1.3;
                        leftForearm = -0.3;
                        weapon = {
                            type: 'kusanagi',
                            hand: 'left',
                            angle: -0.5,
                            length: 22,
                            color: '#E0E0E0',
                            glowColor: '#6A4C93'
                        };
                    }
                }
            }

            // =========================================================================
            // STAGE 2: (5.0s - 11.0s) High-Speed Taijutsu & Kusanagi Sword Duel
            // =========================================================================
            else if (t >= 5.0 && t < 11.0) {
                const p = (t - 5.0) / 6.0;
                if (!isNaruto) {
                    // Sasuke Kusanagi Sword Flurry
                    x = width * 0.54 + Math.sin(p * 20) * 10;
                    chakraState = 'sharingan';
                    weapon = {
                        type: 'kusanagi',
                        hand: 'left',
                        angle: -0.7 + Math.sin(t * 18) * 0.8,
                        length: 22,
                        color: '#E0E0E0',
                        glowColor: '#00F0FF'
                    };
                    leftUpperArm = -1.2 + Math.sin(t * 18) * 0.6;
                    torsoAngle = -0.4;
                } else {
                    // Naruto Parrying with Kunai & Ducking
                    x = width * 0.46 - Math.sin(p * 20) * 10;
                    weapon = {
                        type: 'kunai',
                        hand: 'right',
                        angle: 0.5 - Math.sin(t * 18) * 0.6,
                        length: 12,
                        color: '#4A4A4A',
                        glowColor: '#FFFFFF'
                    };
                    rightUpperArm = 1.2 - Math.sin(t * 18) * 0.5;
                    torsoAngle = 0.35;
                }
            }

            // =========================================================================
            // STAGE 3: (11.0s - 17.0s) Shadow Clone Feint & Sasuke Teleport Counter
            // =========================================================================
            else if (t >= 11.0 && t < 17.0) {
                const p = (t - 11.0) / 6.0;
                if (isNaruto) {
                    if (p < 0.5) {
                        // Naruto slides low along the ground
                        const slideP = p / 0.5;
                        x = lerp(width * 0.46, width * 0.58, slideP);
                        y = groundY + 5;
                        squashY = 0.75;
                        torsoAngle = -0.6;
                        rightThigh = 1.5;
                        leftThigh = -0.8;
                    } else {
                        // Recover back to left
                        const recP = (p - 0.5) / 0.5;
                        x = lerp(width * 0.58, width * 0.20, recP);
                        y = groundY;
                        torsoAngle = 0.2;
                    }
                } else {
                    chakraState = 'sharingan';
                    if (p < 0.4) {
                        x = width * 0.54;
                        torsoAngle = -0.3;
                    } else if (p >= 0.4 && p < 0.7) {
                        // Sasuke Sharingan Teleport behind Naruto!
                        const tpP = (p - 0.4) / 0.3;
                        x = lerp(width * 0.54, width * 0.78, tpP);
                        y = airY + 20;
                        torsoAngle = -0.5;
                        weapon = {
                            type: 'kusanagi',
                            hand: 'left',
                            angle: -1.2,
                            length: 22,
                            color: '#E0E0E0',
                            glowColor: '#70D6FF'
                        };
                    } else {
                        x = width * 0.80;
                        y = groundY;
                        torsoAngle = -0.2;
                    }
                }
            }

            // =========================================================================
            // STAGE 4: (17.0s - 24.0s) Kyuubi Shroud vs Chidori Lightning Awakening
            // =========================================================================
            else if (t >= 17.0 && t < 24.0) {
                if (isNaruto) {
                    x = width * 0.16;
                    y = groundY + 3;
                    squashY = 0.85;
                    torsoAngle = 0.45; // deep charging stance
                    chakraState = 'kyuubi';
                    leftUpperArm = 0.9;
                    leftForearm = 1.2;
                    rightUpperArm = 0.8;
                    rightForearm = 1.1;
                } else {
                    x = width * 0.84;
                    y = groundY + 3;
                    squashY = 0.85;
                    torsoAngle = -0.45;
                    chakraState = 'sharingan';
                    leftUpperArm = -0.8;
                    leftForearm = -1.2;
                    rightUpperArm = -0.9;
                    rightForearm = -1.1;
                }
            }

            // =========================================================================
            // STAGE 5: (24.0s - 33.0s) THE LEGENDARY RASENGAN VS CHIDORI RUN & CLASH!
            // =========================================================================
            else if (t >= 24.0 && t < 33.0) {
                const p = (t - 24.0) / 9.0;
                if (p < 0.28) {
                    // JUTSU FORMATION: Naruto Rasengan in right hand, Sasuke Chidori in left hand
                    const formP = p / 0.28;
                    if (isNaruto) {
                        x = width * 0.16;
                        y = groundY;
                        torsoAngle = -0.25; // pulling hand back
                        rightUpperArm = -0.6;
                        rightForearm = 1.7; // holding palm cupped
                        hasRasengan = true;
                        rasenganScale = formP;
                        chakraState = 'kyuubi';
                    } else {
                        x = width * 0.84;
                        y = groundY;
                        torsoAngle = 0.25;
                        leftUpperArm = 0.6;
                        leftForearm = -1.7; // left hand dropped down
                        hasChidori = true;
                        chidoriPower = formP;
                        chakraState = 'sharingan';
                    }
                } else if (p >= 0.28 && p < 0.50) {
                    // THE LEAP & SPRINT towards center!
                    const sprintP = (p - 0.28) / 0.22;
                    if (isNaruto) {
                        x = lerp(width * 0.16, width * 0.46, sprintP);
                        y = lerp(groundY, airY + 10, Math.sin(sprintP * Math.PI * 0.5)); // leaping into air
                        torsoAngle = 0.6; // thrusting forward
                        rightUpperArm = 1.5;
                        rightForearm = 0.1;
                        hasRasengan = true;
                        rasenganScale = 1.0;
                        chakraState = 'kyuubi';
                    } else {
                        x = lerp(width * 0.84, width * 0.54, sprintP);
                        y = lerp(groundY, airY + 10, Math.sin(sprintP * Math.PI * 0.5));
                        torsoAngle = -0.6;
                        leftUpperArm = -1.5;
                        leftForearm = -0.1;
                        hasChidori = true;
                        chidoriPower = 1.0;
                        chakraState = 'sharingan';
                    }
                } else {
                    // THE MID-AIR RASENGAN VS CHIDORI CLASH & COLLISION! (28.5s - 33.0s)
                    if (isNaruto) {
                        x = width * 0.47;
                        y = airY + 10;
                        torsoAngle = 0.55;
                        rightUpperArm = 1.55;
                        rightForearm = 0.05;
                        hasRasengan = true;
                        rasenganScale = 1.2;
                        chakraState = 'kyuubi';
                    } else {
                        x = width * 0.53;
                        y = airY + 10;
                        torsoAngle = -0.55;
                        leftUpperArm = -1.55;
                        leftForearm = -0.05;
                        hasChidori = true;
                        chidoriPower = 1.2;
                        chakraState = 'sharingan';
                    }
                }
            }

            // =========================================================================
            // STAGE 6: (33.0s - 38.0s) Detonation Blowback & Landing Reset
            // =========================================================================
            else {
                const p = (t - 33.0) / 5.0;
                if (p < 0.6) {
                    // Blown backwards in mid-air recovery flips
                    const blastP = p / 0.6;
                    if (isNaruto) {
                        x = lerp(width * 0.47, width * 0.18, blastP);
                        y = lerp(airY, groundY, blastP);
                        rotation = -blastP * Math.PI * 2;
                    } else {
                        x = lerp(width * 0.53, width * 0.82, blastP);
                        y = lerp(airY, groundY, blastP);
                        rotation = blastP * Math.PI * 2;
                    }
                } else {
                    // Slide to stop on ground
                    const landP = (p - 0.6) / 0.4;
                    x = isNaruto ? width * 0.18 : width * 0.82;
                    y = groundY;
                    rotation = 0;
                    torsoAngle = isNaruto ? lerp(0.4, 0.10, landP) : lerp(-0.4, -0.10, landP);
                }
            }

            // Super clash shake effect
            if (superClashRef.current) {
                const shakeX = (Math.random() - 0.5) * 10;
                const shakeY = (Math.random() - 0.5) * 8;
                x = clamp(x + shakeX, 15, width - 15);
                y += shakeY;
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
                chakraState,
                jutsuHand,
                hasRasengan,
                hasChidori,
                rasenganScale,
                chidoriPower,
                weapon
            };
        };

        // Draw 16-Bit Pixel-Art Naruto & Sasuke
        const drawNinja = (pose: NinjaPose, isNaruto: boolean, alpha = 1.0) => {
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
                chakraState,
                hasRasengan,
                hasChidori,
                rasenganScale = 1.0,
                chidoriPower = 1.0,
                weapon
            } = pose;

            ctx.save();
            ctx.globalAlpha = alpha;

            // Apply body rotation & landing squash
            ctx.translate(x, y - 12);
            if (Math.abs(rotation) > 0.01) {
                ctx.rotate(rotation);
            }
            if (squashY !== 1.0) {
                ctx.scale(1.0 + (1.0 - squashY) * 0.3, squashY);
            }
            ctx.translate(-x, -(y - 12));

            // Palettes
            // Naruto: Orange Gi `#FF7A00`, Black `#1E1E1E`, Yellow Hair `#FFE135`, Blue Headband `#1A2238`
            // Sasuke: Light Grey Shirt `#E2E2EA`, Purple Rope `#6A4C93`, Black Hair `#161622`, Dark Pants `#1D1D28`
            const skinColor = '#FFDFC4';
            const skinShadow = '#D4A373';

            const narutoOrange = '#FF7A00';
            const narutoBlack = '#1E1E1E';
            const narutoHair = '#FFE135';
            const narutoHeadband = '#1A2238';

            const sasukeShirt = '#E2E2EA';
            const sasukePants = '#1D1D28';
            const sasukeRope = '#6A4C93';
            const sasukeHair = '#161622';

            // 1. Kyuubi Chakra Shroud (Naruto) or Sharingan Aura (Sasuke)
            if (chakraState === 'kyuubi') {
                ctx.save();
                const auraHeight = 44;
                const auraWidth = 26;
                const grad = ctx.createRadialGradient(x, y - 14, 2, x, y - 14, auraWidth * 1.5);
                grad.addColorStop(0, 'rgba(255, 120, 0, 0.55)');
                grad.addColorStop(0.6, 'rgba(255, 50, 0, 0.25)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(x, y - 14, auraWidth * 1.3, auraHeight * 0.9, 0, 0, Math.PI * 2);
                ctx.fill();

                // Kyuubi flame strokes
                ctx.strokeStyle = '#FF5500';
                ctx.lineWidth = 2.0;
                ctx.shadowColor = '#FF3300';
                ctx.shadowBlur = 12;
                for (let i = -2; i <= 2; i++) {
                    const waveOffset = Math.sin(timeline * 22 + i * 1.4) * 4;
                    ctx.beginPath();
                    ctx.moveTo(x + i * 5.5, y + 3);
                    ctx.quadraticCurveTo(x + i * 6.5 + waveOffset, y - auraHeight * 0.5, x + i * 3.0 + waveOffset * 0.5, y - auraHeight - 6);
                    ctx.stroke();
                }
                ctx.restore();
            }

            // Bone Coordinates
            const hipX = x;
            const hipY = y - 12;

            const spineLength = 13;
            const neckX = hipX + Math.sin(torsoAngle) * spineLength * facing;
            const neckY = hipY - Math.cos(torsoAngle) * spineLength;

            const headCenterX = neckX + Math.sin(torsoAngle + headAngle) * 6.0 * facing + headOffset.x;
            const headCenterY = neckY - 6.0 + headOffset.y;

            // Helper: Draw Pixel Rect
            const drawPixelRect = (rx: number, ry: number, rw: number, rh: number, col: string, borderCol?: string) => {
                ctx.fillStyle = col;
                ctx.fillRect(Math.round(rx - rw / 2), Math.round(ry - rh / 2), rw, rh);
                if (borderCol) {
                    ctx.strokeStyle = borderCol;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(Math.round(rx - rw / 2) + 0.5, Math.round(ry - rh / 2) + 0.5, rw - 1, rh - 1);
                }
            };

            // Limb drawing function with pixel blocks
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

                const mainCol = isNaruto ? (isBack ? '#D05500' : narutoOrange) : (isArm ? (isBack ? '#C8C8D4' : sasukeShirt) : sasukePants);
                const subCol = isNaruto ? narutoBlack : (isArm ? skinColor : sasukePants);

                ctx.save();
                ctx.strokeStyle = mainCol;
                ctx.lineWidth = isArm ? 4.2 : 5.0;
                ctx.lineCap = 'square';
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(jointX, jointY);
                ctx.stroke();

                ctx.strokeStyle = isArm ? (isNaruto ? narutoOrange : subCol) : mainCol;
                ctx.lineWidth = isArm ? 3.5 : 4.2;
                ctx.beginPath();
                ctx.moveTo(jointX, jointY);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                // Hand / Foot block
                if (isArm) {
                    drawPixelRect(endX, endY, 3.5, 3.5, skinColor);
                } else {
                    const toeX = endX + facing * 3.0;
                    drawPixelRect(toeX, endY + 1, 5.5, 3.5, isNaruto ? '#1A2A44' : '#161622');
                }
                ctx.restore();

                // Weapon Rendering (Kusanagi Sword or Kunai)
                if (isArm && weapon) {
                    const wAngle = angle1 + angle2 + weapon.angle * facing;
                    const wEndX = endX + Math.sin(wAngle) * weapon.length * facing;
                    const wEndY = endY - Math.cos(wAngle) * weapon.length;

                    ctx.save();
                    ctx.strokeStyle = weapon.color;
                    ctx.lineWidth = weapon.type === 'kusanagi' ? 3.2 : 2.5;
                    ctx.shadowColor = weapon.glowColor;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(wEndX, wEndY);
                    ctx.stroke();

                    // White sharp edge
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(wEndX, wEndY);
                    ctx.stroke();
                    ctx.restore();
                }

                // RECORD JUTSU HAND POSITIONS
                if (isArm && !isBack) {
                    pose.jutsuHand = { x: endX, y: endY };
                }
            };

            // 1. Back Limbs
            drawRiggedLimb(neckX, neckY, leftUpperArmAngle, 7.0, leftForearmAngle, 6.5, true, true);
            drawRiggedLimb(hipX, hipY, leftThighAngle, 8.0, leftShinAngle, 8.0, false, true);

            // 2. Torso (Naruto Jacket or Sasuke Shinobi Shirt)
            ctx.save();
            const midTorsoX = (hipX + neckX) / 2;
            const midTorsoY = (hipY + neckY) / 2;

            if (isNaruto) {
                // Naruto Orange Tracksuit Jacket
                drawPixelRect(midTorsoX, midTorsoY, 10.5, 14, narutoOrange, '#D05500');
                // Black shoulder & collar panels
                drawPixelRect(neckX, neckY + 2.5, 9, 4, narutoBlack);
                // Uzumaki swirl badge
                drawPixelRect(midTorsoX - facing * 2, midTorsoY, 3, 3, '#FF0000');
            } else {
                // Sasuke Open-Chest Shirt & High Collar
                drawPixelRect(midTorsoX, midTorsoY, 10.5, 14, sasukeShirt, '#C8C8D4');
                // Purple rope belt (shimenawa knot)
                drawPixelRect(hipX, hipY - 1.5, 11, 3.5, sasukeRope, '#4C336A');
                // Uchiha high collar behind neck
                drawPixelRect(neckX - facing * 2.5, neckY - 2, 4, 6, sasukeShirt);
            }
            ctx.restore();

            // 3. Front Limbs
            drawRiggedLimb(hipX, hipY, rightThighAngle, 8.0, rightShinAngle, 8.0, false, false);
            drawRiggedLimb(neckX, neckY, rightUpperArmAngle, 7.0, rightForearmAngle, 6.5, true, false);

            // 4. Head & Face
            ctx.save();
            drawPixelRect(headCenterX, headCenterY, 10.5, 9.5, skinColor, skinShadow);

            const eyeX = headCenterX + facing * 2.2;
            const eyeY = headCenterY - 0.5;

            if (isNaruto) {
                // Naruto Blue Eyes & Whiskers
                drawPixelRect(eyeX, eyeY, 2.2, 2.2, '#FFFFFF');
                drawPixelRect(eyeX + facing * 0.4, eyeY, 1.4, 1.8, chakraState === 'kyuubi' ? '#FF2200' : '#0099FF');
                // Whiskers (3 small pixel dots on cheeks)
                drawPixelRect(headCenterX + facing * 2.0, headCenterY + 2, 2, 0.8, '#885533');
                drawPixelRect(headCenterX + facing * 2.0, headCenterY + 3.2, 2, 0.8, '#885533');

                // Leaf Village Forehead Protector (Hitai-ate)
                drawPixelRect(headCenterX, headCenterY - 3.8, 11, 3.2, narutoHeadband);
                drawPixelRect(headCenterX + facing * 1.5, headCenterY - 3.8, 4.5, 2.2, '#E0E0E0', '#888888'); // Metal plate
                // Spiky Yellow Hair Locks
                drawPixelRect(headCenterX, headCenterY - 6.5, 11, 4.5, narutoHair);
                drawPixelRect(headCenterX + facing * 2.5, headCenterY - 9.5, 5, 5, narutoHair);
                drawPixelRect(headCenterX - facing * 2.5, headCenterY - 8.5, 5, 4.5, narutoHair);
                drawPixelRect(headCenterX + facing * 5.5, headCenterY - 7.5, 3.5, 6, narutoHair);
            } else {
                // Sasuke Sharingan Eyes & Black Hair
                drawPixelRect(eyeX, eyeY, 2.2, 2.2, '#FFFFFF');
                drawPixelRect(eyeX + facing * 0.4, eyeY, 1.4, 1.8, chakraState === 'sharingan' ? '#FF0033' : '#111111');

                // Jet Black Uchiha Hair Spikes & Front Fringe
                drawPixelRect(headCenterX, headCenterY - 6.5, 11, 4.5, sasukeHair);
                drawPixelRect(headCenterX + facing * 2.0, headCenterY - 9.5, 5, 5.5, sasukeHair);
                drawPixelRect(headCenterX - facing * 3.5, headCenterY - 8.5, 5, 4.5, sasukeHair);
                // Front hair bang framing face
                drawPixelRect(headCenterX + facing * 4.5, headCenterY - 1, 3, 7, sasukeHair);
                drawPixelRect(headCenterX - facing * 5.0, headCenterY - 2, 4, 7, sasukeHair);
            }
            ctx.restore();

            // 5. DRAW JUTSU: RASENGAN (Naruto) or CHIDORI (Sasuke)
            const handPos = pose.jutsuHand || { x: x + facing * 12, y: y - 10 };

            if (isNaruto && hasRasengan && rasenganScale > 0.05) {
                // --- NARUTO'S RASENGAN ---
                ctx.save();
                const rRadius = 9.0 * rasenganScale;

                // Swirling blue outer glow
                const rGrad = ctx.createRadialGradient(handPos.x, handPos.y, 1, handPos.x, handPos.y, rRadius * 2.0);
                rGrad.addColorStop(0, '#FFFFFF');
                rGrad.addColorStop(0.35, '#00F0FF');
                rGrad.addColorStop(0.75, 'rgba(0, 150, 255, 0.5)');
                rGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = rGrad;
                ctx.beginPath();
                ctx.arc(handPos.x, handPos.y, rRadius * 2.0, 0, Math.PI * 2);
                ctx.fill();

                // Swirling Concentric Chakra Rings
                ctx.strokeStyle = '#00F0FF';
                ctx.lineWidth = 1.8;
                ctx.shadowColor = '#00F0FF';
                ctx.shadowBlur = 10;
                for (let r = 0; r < 3; r++) {
                    ctx.beginPath();
                    ctx.ellipse(
                        handPos.x,
                        handPos.y,
                        rRadius * (1.1 + r * 0.2),
                        rRadius * (0.5 + r * 0.15),
                        timeline * 18 + r * (Math.PI / 3),
                        0,
                        Math.PI * 2
                    );
                    ctx.stroke();
                }

                // Rotating Chakra Vortex Particles
                ctx.fillStyle = '#FFFFFF';
                for (let p = 0; p < 6; p++) {
                    const pAngle = timeline * 24 + p * (Math.PI / 3);
                    const px = handPos.x + Math.cos(pAngle) * (rRadius * 0.85);
                    const py = handPos.y + Math.sin(pAngle) * (rRadius * 0.85);
                    ctx.beginPath();
                    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }

            if (!isNaruto && hasChidori && chidoriPower > 0.05) {
                // --- SASUKE'S CHIDORI (1000 BIRDS) ---
                ctx.save();
                const cRadius = 10.0 * chidoriPower;

                // High-voltage blue/white core glow
                const cGrad = ctx.createRadialGradient(handPos.x, handPos.y, 1, handPos.x, handPos.y, cRadius * 2.2);
                cGrad.addColorStop(0, '#FFFFFF');
                cGrad.addColorStop(0.3, '#70D6FF');
                cGrad.addColorStop(0.7, 'rgba(0, 166, 255, 0.45)');
                cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = cGrad;
                ctx.beginPath();
                ctx.arc(handPos.x, handPos.y, cRadius * 2.2, 0, Math.PI * 2);
                ctx.fill();

                // Violent branching lightning bolts crackling around hand
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 1.8;
                ctx.shadowColor = '#00F0FF';
                ctx.shadowBlur = 12;
                for (let l = 0; l < 5; l++) {
                    const lAngle = (timeline * 30 + l * 1.3) % (Math.PI * 2);
                    const lLen = cRadius * (1.2 + Math.random() * 0.8);
                    const lx = handPos.x + Math.cos(lAngle) * lLen;
                    const ly = handPos.y + Math.sin(lAngle) * lLen;
                    ctx.beginPath();
                    ctx.moveTo(handPos.x, handPos.y);
                    ctx.lineTo(handPos.x + (lx - handPos.x) * 0.5 + (Math.random() - 0.5) * 8, handPos.y + (ly - handPos.y) * 0.5 + (Math.random() - 0.5) * 8);
                    ctx.lineTo(lx, ly);
                    ctx.stroke();
                }
                ctx.restore();
            }

            ctx.restore();
        };

        // Draw The Mid-Air Rasengan vs Chidori Clash Dome & Dimensional Distortion
        const drawRasenganChidoriClash = (nPose: NinjaPose, sPose: NinjaPose) => {
            const nHand = nPose.jutsuHand || { x: nPose.x + 12, y: nPose.y - 10 };
            const sHand = sPose.jutsuHand || { x: sPose.x - 12, y: sPose.y - 10 };

            const clashX = (nHand.x + sHand.x) / 2;
            const clashY = (nHand.y + sHand.y) / 2;

            ctx.save();
            // 1. Giant Iconic Dark Purple & Cyan Collision Sphere (Dimensional Flash)
            const clashRadius = 22 + Math.sin(timeline * 26) * 6;
            const clashGrad = ctx.createRadialGradient(clashX, clashY, 2, clashX, clashY, clashRadius * 2.2);
            clashGrad.addColorStop(0, '#FFFFFF');
            clashGrad.addColorStop(0.3, '#00F0FF'); // Rasengan Cyan
            clashGrad.addColorStop(0.65, '#6A4C93'); // Chidori Purple / Dark Uchiha Chakra
            clashGrad.addColorStop(0.9, 'rgba(10, 5, 20, 0.7)'); // Dimensional distortion dark ring
            clashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = clashGrad;
            ctx.beginPath();
            ctx.arc(clashX, clashY, clashRadius * 2.2, 0, Math.PI * 2);
            ctx.fill();

            // 2. Swirling Rasengan vortex lines connecting into collision
            ctx.strokeStyle = '#00F0FF';
            ctx.lineWidth = 2.2;
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 14;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.ellipse(clashX, clashY, clashRadius * 1.5, clashRadius * 0.6, timeline * 20 + i * (Math.PI / 4), 0, Math.PI * 2);
                ctx.stroke();
            }

            // 3. Chidori lightning arcs snapping across the full header
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2.0;
            ctx.shadowColor = '#70D6FF';
            ctx.shadowBlur = 12;
            for (let l = 0; l < 6; l++) {
                const boltAngle = timeline * 18 + l * (Math.PI / 3);
                const boltLen = clashRadius * 2.2 + Math.random() * 16;
                ctx.beginPath();
                ctx.moveTo(clashX, clashY);
                ctx.lineTo(clashX + Math.cos(boltAngle) * boltLen, clashY + Math.sin(boltAngle) * boltLen);
                ctx.stroke();
            }
            ctx.restore();

            // Continuous sparks spraying outward
            if (Math.random() < 0.85) {
                spawnSparks(clashX, clashY, Math.random() > 0.5 ? '#00F0FF' : '#70D6FF', 5, 2.5);
            }
            if (Math.random() < 0.45) {
                spawnLightning(clashX, clashY, clashX + (Math.random() - 0.5) * 80, clashY + (Math.random() - 0.5) * 60, '#00F0FF');
            }
        };

        // Main Animation Loop
        const render = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;

            const speedMultiplier = isHovered ? 1.35 : 1.0;
            timeline += dt * speedMultiplier;

            ctx.clearRect(0, 0, width, height);

            const t = timeline % TOTAL_DURATION;

            // --- Choreographed Audio-Visual Events ---
            // 1. Initial Dash Kunai vs Sword Clash (3.2s)
            if (t >= 3.2 && t < 3.35 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                const cx = width * 0.50;
                spawnSparks(cx, groundY - 10, '#FFFFFF', 16, 2.5);
                spawnShockwave(cx, groundY - 10, 'rgba(255, 255, 255, 0.9)', 26, 2.5);
            }

            // 2. Shadow Clone Smoke Poof (11.2s)
            if (t >= 11.2 && t < 11.35 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                spawnSmoke(width * 0.48, groundY - 14, 14);
                spawnShockwave(width * 0.48, groundY - 14, 'rgba(255, 255, 255, 0.7)', 22, 2.0);
            }

            // 3. Kyuubi & Chidori Awakening Surge (18.5s)
            if (t >= 18.5 && t < 18.75 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                spawnShockwave(width * 0.16, groundY, 'rgba(255, 120, 0, 0.9)', 36, 3.0);
                spawnShockwave(width * 0.84, groundY, 'rgba(0, 240, 255, 0.9)', 36, 3.0);
                spawnDust(width * 0.16, groundY, 8);
                spawnDust(width * 0.84, groundY, 8);
            }

            // 4. Kusanagi Slash Arc (8.2s)
            if (t >= 8.2 && t < 8.35 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                spawnSlashArc(width * 0.52, groundY - 12, 20, -Math.PI / 3, Math.PI / 3, '#70D6FF');
                spawnSparks(width * 0.52, groundY - 12, '#FFFFFF', 10, 2.0);
            }

            // 5. THE RASENGAN VS CHIDORI DETONATION EXPLOSION (32.6s)
            if (t >= 32.6 && t < 32.85 && Math.abs(t - lastCueTime) > 0.4) {
                lastCueTime = t;
                const midX = width * 0.50;
                const midY = airY + 10;
                spawnSparks(midX, midY, '#FFFFFF', 35, 4.5);
                spawnSparks(midX, midY, '#00F0FF', 30, 4.0);
                spawnSparks(midX, midY, '#6A4C93', 25, 3.5);
                spawnShockwave(midX, midY, '#FFFFFF', 65, 4.5);
                spawnShockwave(midX, midY, 'rgba(0, 240, 255, 0.85)', 48, 3.5);
            }

            // --- Super Clash Click Easter Egg ---
            if (superClashRef.current && Math.random() < 0.6) {
                const rx = width * (0.2 + Math.random() * 0.6);
                const ry = airY + Math.random() * 40;
                spawnSparks(rx, ry, Math.random() > 0.5 ? '#00F0FF' : '#FF7A00', 8, 3.0);
                spawnLightning(rx, ry, rx + (Math.random() - 0.5) * 80, ry + (Math.random() - 0.5) * 50);
            }

            const narutoPose = getPose(timeline, true);
            const sasukePose = getPose(timeline, false);

            // Ambient header guideline
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, groundY + 1);
            ctx.lineTo(width, groundY + 1);
            ctx.stroke();
            ctx.restore();

            // Draw Mid-Air Rasengan vs Chidori Clash if in Stage 5
            if (t >= 28.5 && t < 33.0) {
                drawRasenganChidoriClash(narutoPose, sasukePose);
            }

            // Draw 16-Bit Pixel-Art Naruto & Sasuke
            drawNinja(narutoPose, true);
            drawNinja(sasukePose, false);

            // Draw Slash Arcs
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
                ctx.shadowBlur = 12;
                ctx.globalAlpha = Math.max(0, arc.alpha);
                ctx.beginPath();
                ctx.arc(arc.cx, arc.cy, arc.radius, arc.startAngle, arc.endAngle);
                ctx.stroke();
                ctx.restore();
            }

            // Draw Shockwaves
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

            // Draw Lightning Bolts
            for (let i = lightnings.length - 1; i >= 0; i--) {
                const bolt = lightnings[i];
                bolt.alpha -= bolt.decay;
                if (bolt.alpha <= 0) {
                    lightnings.splice(i, 1);
                    continue;
                }
                ctx.save();
                ctx.strokeStyle = bolt.color;
                ctx.lineWidth = 1.8;
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
                ctx.lineWidth = 0.8;
                ctx.stroke();
                ctx.restore();
            }

            // Draw Particles (Sparks, Smoke, Dust)
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.type === 'smoke' ? -0.04 : (p.type === 'dust' ? -0.02 : 0.09);
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.shadowColor = p.color;
                ctx.shadowBlur = p.type === 'smoke' ? 8 : 4;
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
            className={styles.stickFightContainer}
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

export default StickFight;
