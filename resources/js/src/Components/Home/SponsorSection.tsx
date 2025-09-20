import React, { useEffect } from "react";
import { Sponsor } from "@/types";

interface SponsorSectionProps {
    sponsors: Sponsor[];
}

const SponsorSection: React.FC<SponsorSectionProps> = ({ sponsors }) => {
    // Find PT.KAI sponsor (should be the first one with id: 1)
    const mainSponsor = sponsors.find(sponsor => sponsor.name === "PT. KAI");
    // Get all other sponsors
    const otherSponsors = sponsors.filter(sponsor => sponsor.name !== "PT. KAI");
    
    // Add floating animation styles
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes float-1 {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
            }
            
            @keyframes float-2 {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
                100% { transform: translateY(0px); }
            }
            
            @keyframes float-3 {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-12px); }
                100% { transform: translateY(0px); }
            }
            
            @keyframes float-4 {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
                100% { transform: translateY(0px); }
            }
            
            @keyframes float-5 {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
                100% { transform: translateY(0px); }
            }
            
            .float-main {
                animation: float-5 6s ease-in-out infinite;
            }
            
            .float-1 {
                animation: float-1 4s ease-in-out infinite;
            }
            
            .float-2 {
                animation: float-2 5s ease-in-out infinite;
            }
            
            .float-3 {
                animation: float-3 7s ease-in-out infinite;
            }
            
            .float-4 {
                animation: float-4 6s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="w-full py-12 px-4">
            <div className="text-center mb-12 opacity-0 animate-fadeIn">
                <h2 className="text-3xl font-airborne sm:text-4xl md:text-5xl font-bold">
                    <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                        OUR SPONSORS
                    </span>
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-red-500 mx-auto mt-4 rounded-full"></div>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto mt-6">
                    Proudly supported by industry leaders
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Main sponsor - PT.KAI with larger display */}
                {mainSponsor && (
                    <div className="flex justify-center mb-16 opacity-0 animate-fadeIn animation-delay-100">
                        <div className="transition-all duration-300 hover:scale-105 float-main">
                            <a href={mainSponsor.url} target="blank"><img 
                                src={mainSponsor.logo} 
                                alt={mainSponsor.name} 
                                className="h-24 sm:h-28 object-contain filter brightness-100 hover:brightness-110 transition-all duration-300" 
                            /></a>
                        </div>
                    </div>
                )}

                {/* Other sponsors in a grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 justify-items-center opacity-0 animate-fadeIn animation-delay-200">
                    {otherSponsors.map((sponsor, index) => (
                        <div 
                            key={sponsor.id} 
                            className={`transition-all duration-300 hover:scale-105 animation-delay-${(index + 3) * 100} float-${(index % 4) + 1}`}
                        >
                            <a href={sponsor.url} target="blank"><img 
                                src={sponsor.logo} 
                                alt={sponsor.name} 
                                className="h-16 sm:h-20 object-contain filter brightness-95 hover:brightness-105 transition-all duration-300" 
                            />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SponsorSection;
