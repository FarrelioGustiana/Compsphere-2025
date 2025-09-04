import { Partner } from "@/types";
import { motion } from "framer-motion";

interface SponsorsProps {
    sponsors: Partner[];
}

const Sponsors = ({ sponsors }: SponsorsProps) => {
    const partners = [
        ...sponsors,
        ...sponsors,
        ...sponsors,
        ...sponsors,
        ...sponsors,
    ];
    return (
        <div className="w-full flex h-20 items-center relative overflow-hidden">
            {partners.map((sponsor, index) => (
                <motion.img
                    key={`sponsor-${index}`}
                    src={sponsor.logo}
                    alt={sponsor.name}
                    initial={{ left: "-50px" }}
                    animate={{ left: "95%" }}
                    transition={{
                        duration: 12,
                        delay:
                            (12 / partners.length) *
                            (partners.length - index) *
                            -1 *
                            3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute h-16"
                />
            ))}
        </div>
    );
};

export default Sponsors;
