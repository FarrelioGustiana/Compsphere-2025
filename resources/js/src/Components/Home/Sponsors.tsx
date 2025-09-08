import { Partner } from "@/types";
import { useEffect } from "react";

interface SponsorsProps {
    sponsors: Partner[];
}

// CSS for the marquee animation
const marqueeStyles = `
@keyframes marquee-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

@keyframes marquee-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
}

.marquee-container {
    overflow: hidden;
    position: relative;
    width: 100%;
}

.marquee-left {
    display: flex;
    animation: marquee-left 30s linear infinite;
    width: max-content;
}

.marquee-right {
    display: flex;
    animation: marquee-right 30s linear infinite;
    width: max-content;
}

.sponsor-card {
    flex: 0 0 auto;
    margin-right: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(31, 41, 55, 0.5);
    border-radius: 0.5rem;
    padding: 1rem;
    height: 6rem;
    width: 16rem;
    border: 1px solid rgba(59, 130, 246, 0.2);
    transition: border-color 0.3s;
    cursor: pointer;
}

.sponsor-card:hover {
    border-color: rgba(59, 130, 246, 0.5);
}

.sponsor-image {
    max-height: 4rem;
    max-width: 100%;
    object-fit: contain;
    filter: brightness(1.1) contrast(1.25);
}
`;

const Sponsors = ({ sponsors }: SponsorsProps) => {
    // Split sponsors into two rows
    const firstHalf = sponsors.slice(0, Math.ceil(sponsors.length / 2));
    const secondHalf = sponsors.slice(Math.ceil(sponsors.length / 2));
    
    // Add style tag to document head
    useEffect(() => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = marqueeStyles;
        document.head.appendChild(styleTag);
        
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);
    
    // Create duplicated arrays for continuous scrolling
    const firstRowLogos = [...firstHalf, ...firstHalf];
    const secondRowLogos = [...secondHalf, ...secondHalf];
    
    return (
        <div className="w-full py-8">
            {/* First row - left to right */}
            <div className="marquee-container h-28 mb-8">
                <div className="marquee-left">
                    {firstRowLogos.map((sponsor, index) => (
                        <div
                            key={`sponsor-row1-${index}`}
                            className="sponsor-card"
                        >
                            <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                className="sponsor-image"
                            />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Second row - right to left */}
            <div className="marquee-container h-28">
                <div className="marquee-right">
                    {secondRowLogos.map((sponsor, index) => (
                        <div
                            key={`sponsor-row2-${index}`}
                            className="sponsor-card"
                        >
                            <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                className="sponsor-image"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sponsors;
