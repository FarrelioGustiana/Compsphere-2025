// import { Partner } from "@/types";

// interface SponsorsProps {
//     sponsors: Partner[];
// }

// const Sponsors = ({ sponsors }: SponsorsProps) => {
//     const firstHalf = sponsors.slice(0, Math.ceil(sponsors.length / 2));
//     const secondHalf = sponsors.slice(Math.ceil(sponsors.length / 2));

//     const firstRowLogos = [...firstHalf, ...firstHalf];
//     const secondRowLogos = [...secondHalf, ...secondHalf];

//     return (
//         <div className="w-full py-8">
//             {/* First row - left to right */}
//             <div className="marquee-container h-28 mb-8">
//                 <div className="marquee-left">
//                     {firstRowLogos.map((sponsor, index) => (
//                         <div
//                             key={`sponsor-row1-${index}`}
//                             className="sponsor-card"
//                         >
//                             <img
//                                 src={sponsor.logo}
//                                 alt={sponsor.name}
//                                 className="sponsor-image"
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Second row - right to left */}
//             <div className="marquee-container h-28">
//                 <div className="marquee-right">
//                     {secondRowLogos.map((sponsor, index) => (
//                         <div
//                             key={`sponsor-row2-${index}`}
//                             className="sponsor-card"
//                         >
//                             <img
//                                 src={sponsor.logo}
//                                 alt={sponsor.name}
//                                 className="sponsor-image"
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Sponsors;
