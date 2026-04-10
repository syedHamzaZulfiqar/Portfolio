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
    links: {
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
        thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop",
        media: [
            { type: 'image', url: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop", caption: 'Concept Art' }
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
        thumbnail: "/knife-hit.png",
        media: [
            { type: 'image', url: "/knife-hit.png", caption: 'Gameplay Screenshot' }
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
        thumbnail: "https://images.unsplash.com/photo-1614729939124-032f0b5610ce?q=80&w=1000&auto=format&fit=crop",
        media: [
            { type: 'image', url: "https://images.unsplash.com/photo-1614729939124-032f0b5610ce?q=80&w=1000&auto=format&fit=crop", caption: 'Placeholder' }
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
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
        media: [
            { type: 'image', url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", caption: 'Placeholder' }
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
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
        media: [
            { type: 'image', url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop", caption: 'Placeholder' }
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
        thumbnail: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1000&auto=format&fit=crop",
        media: [
            { type: 'image', url: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1000&auto=format&fit=crop", caption: 'Surviving Waves' }
        ],
        tags: ["Unity", "C#", "Physics System"],
        links: { play: "https://play.unity.com/en/games/07012e20-f364-45ed-9de0-27c8b3439f8e/unit-4-task-1" }
    }
];

export const experiences: PortfolioItem[] = [
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
            "Working under tight deadlines in a mentored environment taught me how to iterate rapidly on mechanics and deliver a highly refined product."
        ],
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
        media: [
            { type: 'image', url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop", caption: 'PopIt Gameplay mechanics' }
        ],
        tags: ["Unity", "C#", "Rapid Prototyping", "UI Elements"],
        links: { play: "#" }
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
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
        media: [
            { type: 'image', url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", caption: 'Puzzle System' }
        ],
        tags: ["Unity", "C#", "Performance Optimization", "Refactoring"],
        links: { play: "#" }
    }
];
