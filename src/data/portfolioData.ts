export interface MediaItem {
    type: 'image' | 'video';
    url: string;
    caption?: string;
}

export interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    subtitle?: string; // e.g. company name, or date
    shortDescription: string;
    detailedDescription: string[];
    thumbnail: string;
    media: MediaItem[];
    tags: string[];
    links?: {
        play?: string;
        code?: string;
        demo?: string;
    };
}

export const projects: PortfolioItem[] = [
    {
        id: "horror-game",
        title: "Horror Game Prototype",
        category: "Featured Project",
        shortDescription: "An atmospheric horror game prototype built with advanced gameplay mechanics.",
        detailedDescription: [
            "This is my primary featured project: a tense horror game prototype.",
            "Detailed descriptions, screenshots, and videos showcasing the mechanics and atmosphere will be added soon."
        ],
        thumbnail: "/portfolio-media/pictures/horror game/Screenshot 2026-04-10 122616.png",
        media: [
            { type: 'image', url: "/portfolio-media/pictures/horror game/Screenshot 2026-04-10 122616.png", caption: 'Concept Art' },
            { type: 'image', url: "/portfolio-media/pictures/horror game/Screenshot 2026-04-10 122730.png", caption: 'Gameplay Screenshot 1' },
            { type: 'image', url: "/portfolio-media/pictures/horror game/Screenshot 2026-04-10 122752.png", caption: 'Gameplay Screenshot 2' },
            { type: 'image', url: "/portfolio-media/pictures/horror game/Screenshot 2026-04-10 122926.png", caption: 'Gameplay Screenshot 3' },
            { type: 'image', url: "/portfolio-media/pictures/horror game/Screenshot 2026-04-10 123639.png", caption: 'Gameplay Screenshot 4' },
            { type: 'video', url: "/portfolio-media/videos/horror game/Recording 2026-02-17 162901 - Trim.mp4", caption: 'Horror Game Video' }
        ],
        tags: ["Unity", "C#", "3D Game Design"],
        links: { code: "https://github.com/syedHamzaZulfiqar/Horror-Game" }
    },
    {
        id: "knife-hit-replica",
        title: "Knife Hit Replica",
        category: "Arcade Game",
        shortDescription: "An arcade game featuring rotating target mechanics, collision detection, and score tracking.",
        detailedDescription: [
            "Knife Hit Replica is an engaging arcade experience built entirely in Unity and C#.",
            "The core gameplay loop involves throwing knives at a rotating target without hitting any existing knives. It sounds simple, but implementing precise collision detection and gradually increasing the rotational speed provides a satisfying challenge.",
            "I focused heavily on physics and rigidbodies to ensure the impact felt snappy and realistic."
        ],
        thumbnail: "/portfolio-media/pictures/knife hit/Screenshot 2026-04-10 124048.png",
        media: [
            { type: 'image', url: "/portfolio-media/pictures/knife hit/Screenshot 2026-04-10 124048.png", caption: 'Gameplay Screenshot 1' },
            { type: 'image', url: "/portfolio-media/pictures/knife hit/Screenshot 2026-04-10 124111.png", caption: 'Gameplay Screenshot 2' },
            { type: 'video', url: "/portfolio-media/videos/knife hit/Recording 2026-04-10 124231.mp4", caption: 'Gameplay Video' }
        ],
        tags: ["Unity", "C#", "Physics"],
        links: { play: "https://play.unity.com/en/games/74b3e864-5268-40d2-a80a-d085fdcd63e2/knife-hit" }
    },
    {
        id: "slide-bar",
        title: "Slide Bar",
        category: "Hyper Casual",
        shortDescription: "A fast-paced interactive experience built in Unity.",
        detailedDescription: [
            "More details and screenshots coming soon for Slide Bar."
        ],
        thumbnail: "/portfolio-media/pictures/Slide Bar/Screenshot 2026-04-10 124705.png",
        media: [
            { type: 'image', url: "/portfolio-media/pictures/Slide Bar/Screenshot 2026-04-10 124705.png", caption: 'Gameplay 1' },
            { type: 'image', url: "/portfolio-media/pictures/Slide Bar/Screenshot 2026-04-10 124719.png", caption: 'Gameplay 2' },
            { type: 'image', url: "/portfolio-media/pictures/Slide Bar/Screenshot 2026-04-10 124737.png", caption: 'Gameplay 3' },
            { type: 'video', url: "/portfolio-media/videos/Slide Bar/Recording 2026-04-10 124801.mp4", caption: 'Gameplay Video' }
        ],
        tags: ["Unity", "C#"],
        links: { play: "https://play.unity.com/en/games/621d2463-9c59-4c20-9a04-cafcbcd08675/slide-bar" }
    },
    {
        id: "box-game",
        title: "Box Game",
        category: "Arcade",
        shortDescription: "An engaging block-based challenge.",
        detailedDescription: [
            "More details and screenshots coming soon for Box Game."
        ],
        thumbnail: "/portfolio-media/pictures/Box/Screenshot 2026-04-10 160946.png",
        media: [
            { type: 'image', url: "/portfolio-media/pictures/Box/Screenshot 2026-04-10 160946.png", caption: 'Screenshot 1' },
            { type: 'image', url: "/portfolio-media/pictures/Box/Screenshot 2026-04-10 161006.png", caption: 'Screenshot 2' },
            { type: 'image', url: "/portfolio-media/pictures/Box/Screenshot 2026-04-10 161020.png", caption: 'Screenshot 3' },
            { type: 'image', url: "/portfolio-media/pictures/Box/Screenshot 2026-04-10 161112.png", caption: 'Screenshot 4' },
            { type: 'video', url: "/portfolio-media/videos/Box/Recording 2026-04-10 161124.mp4", caption: 'Gameplay Video' }
        ],
        tags: ["Unity", "C#"],
        links: { play: "https://play.unity.com/en/games/6afa3e30-f670-4d76-af45-bcba08db6b2d/boxgame" }
    },
    {
        id: "hammer-the-ball",
        title: "Hammer The Ball",
        category: "Physics Game",
        shortDescription: "A physics-driven skill game.",
        detailedDescription: [
            "More details and screenshots coming soon for Hammer The Ball."
        ],
        thumbnail: "/portfolio-media/pictures/hammer the ball/Screenshot 2026-04-10 160315.png",
        media: [
            { type: 'image', url: "/portfolio-media/pictures/hammer the ball/Screenshot 2026-04-10 160315.png", caption: 'Gameplay 1' },
            { type: 'image', url: "/portfolio-media/pictures/hammer the ball/Screenshot 2026-04-10 160327.png", caption: 'Gameplay 2' },
            { type: 'video', url: "/portfolio-media/videos/hammer the ball/Recording 2026-04-10 160349.mp4", caption: 'Gameplay Video' }
        ],
        tags: ["Unity", "C#", "Physics"],
        links: { play: "https://play.unity.com/en/games/05dfc018-54d5-417f-8659-22e069afd310/hammer-the-ball" }
    },
    {
        id: "ball-smash",
        title: "Ball Smash",
        category: "Survival Game",
        shortDescription: "A physics-based survival game utilizing force-driven movement and a modular enemy spawning system.",
        detailedDescription: [
            "Ball Smash challenges players to survive as long as possible against endless waves of enemies.",
            "Instead of standard translation movement, the player controls a ball utilizing physics forces, making momentum and mass crucial gameplay factors.",
            "I developed a custom modular spawning system that increases wave difficulty over time, maintaining a smooth difficulty curve to keep players engaged."
        ],
        thumbnail: "/portfolio-media/pictures/ball smash/Screenshot 2026-04-10 155800.png",
        media: [
            { type: 'image', url: "/portfolio-media/pictures/ball smash/Screenshot 2026-04-10 155800.png", caption: 'Surviving Waves' },
            { type: 'video', url: "/portfolio-media/videos/ball smash/Recording 2026-04-10 155810.mp4", caption: 'Gameplay Video' }
        ],
        tags: ["Unity", "C#", "Physics System"],
        links: { play: "https://play.unity.com/en/games/07012e20-f364-45ed-9de0-27c8b3439f8e/unit-4-task-1" }
    }
];

export const experiences: PortfolioItem[] = [
    {
        id: "mizo-studio-intern",
        title: "Game Developer Intern",
        category: "Internship",
        subtitle: "Mizo Studio • April 2026 – June 2026",
        shortDescription: "Developed 'Snake Escape' hyper-casual game, optimized simulation mechanics, and built a police chase game.",
        detailedDescription: [
            "Developed 'Snake Escape,' a hyper-casual puzzle game where players unscramble and tap snakes to help them escape, focusing on intuitive gameplay and smooth interactions.",
            "Designed and implemented a custom Level Designer and created over 70 levels stored in JSON format, facilitating rapid content expansion for 'Snake Escape'.",
            "Contributed to a simulation game for 2-3 weeks, resolving critical physics and collider bugs, updating the UI for better user experience, and performing comprehensive project-wide code cleanup.",
            "Built an 'RCC Police Chase' game utilizing Realistic Car Controller (RCC) and Enemy RCC AI, while also implementing Cinemachine and Timeline to create cinematic cutscenes."
        ],
        thumbnail: "/portfolio-media/pictures/intern work/mizo_thumbnail.png",
        media: [],
        tags: ["Unity", "C#", "RCC", "Level Design", "JSON", "Cinemachine", "Timeline"],
    },
    {
        id: "airidev-intern",
        title: "3D Game Developer Intern",
        category: "Internship",
        subtitle: "Airidev • September 2025 \u2013 October 2025",
        shortDescription: "Developed a hyper-casual 'Pop-It' style game prototype using Unity and C#.",
        detailedDescription: [
            "During my internship at Airidev, I was tasked with developing a hyper-casual 'Pop-It' style game prototype from scratch using Unity and C#.",
            "I built core gameplay loops, handled complex object interactions, and programmed smooth player controls.",
            "To enhance user engagement, I integrated custom UI systems, responsive particle effects, and polished animations.",
            "Working under tight deadlines in a mentored environment taught me how to iterate rapidly on mechanics and deliver a highly refined product.",
            "In addition to Pop-It, I also developed the 'Donut' game prototype, expanding my expertise in rapid prototyping and interactive design."
        ],
        thumbnail: "/portfolio-media/pictures/intern work/pop it/Screenshot 2026-04-10 155534.png",
        media: [
            { type: 'image', url: "/portfolio-media/pictures/intern work/donut/Screenshot 2025-08-25 224840.png", caption: 'Donut Game' },
            { type: 'image', url: "/portfolio-media/pictures/intern work/donut/Screenshot 2026-04-10 155550.png", caption: 'Donut Game 2' },
            { type: 'video', url: "/portfolio-media/videos/intern/donut/donut video.mp4", caption: 'Donut Video' },
            { type: 'video', url: "/portfolio-media/videos/intern/donut/intern test - Trim.mp4", caption: 'Donut Gameplay Test' },
            { type: 'image', url: "/portfolio-media/pictures/intern work/pop it/Screenshot 2025-09-09 212512.png", caption: 'Pop It Game 1' },
            { type: 'image', url: "/portfolio-media/pictures/intern work/pop it/Screenshot 2025-09-12 201026.png", caption: 'Pop It Game 2' },
            { type: 'image', url: "/portfolio-media/pictures/intern work/pop it/Screenshot 2026-04-10 155534.png", caption: 'Pop It Game 3' },
            { type: 'video', url: "/portfolio-media/videos/intern/pop it/Recording 2025-09-19 174115.mp4", caption: 'Pop It Video' },
            { type: 'video', url: "/portfolio-media/videos/intern/pop it/Recording 2026-04-10 150702.mp4", caption: 'Pop It Gameplay Test' }
        ],
        tags: ["Unity", "C#", "Rapid Prototyping", "UI Elements"],
    },
    {
        id: "word-car-puzzle",
        title: "Word Car Puzzle Game",
        category: "Client Project",
        subtitle: "2025",
        shortDescription: "Created a car-based word matching game featuring drag-and-drop mechanics.",
        detailedDescription: [
            "This client project required building a car-based word matching game.",
            "I successfully implemented drag-and-drop mechanics merged with slot-based placement to create the puzzle logic.",
            "Beyond the new features, a massive portion of the job involved optimizing and refactoring a legacy Unity codebase. I resolved highly disorganized systems and squashed various logic bugs to get the game performing smoothly."
        ],
        thumbnail: "/portfolio-media/pictures/Client work/WhatsApp Image 2026-04-10 at 3.53.13 PM.jpeg",
        media: [
            { type: 'image', url: "/portfolio-media/pictures/Client work/WhatsApp Image 2026-04-10 at 3.53.13 PM.jpeg", caption: 'Puzzle System' },
            { type: 'video', url: "/portfolio-media/videos/client work/word.mp4", caption: 'Puzzle Gameplay Video' }
        ],
        tags: ["Unity", "C#", "Performance Optimization", "Refactoring"],
    }
];
