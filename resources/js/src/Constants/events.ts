import React from "react";
import { Zap, Users, Lightbulb, Globe, LucideProps } from "lucide-react";

export interface EventItem {
    name: string;
    description: string;
    icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    color: string;
    date: string;
}

export const events: EventItem[] = [
    {
        name: "Hacksphere",
        description:
            "Kompetisi hackathon untuk mengembangkan solusi inovatif menggunakan teknologi terdepan",
        icon: Zap,
        color: "from-red-500 to-pink-500",
        date: "12-14 Oktober 2025",
    },
    {
        name: "Talksphere",
        description:
            "Sesi presentasi dan diskusi dengan para ahli teknologi dan inovator terkemuka",
        icon: Users,
        color: "from-blue-500 to-cyan-500",
        date: "13 Oktober 2025",
    },
    {
        name: "FestSphere",
        description:
            "Festival teknologi dengan berbagai aktivitas menarik dan showcase produk inovatif",
        icon: Lightbulb,
        color: "from-purple-500 to-indigo-500",
        date: "14 Oktober 2025",
    },
    {
        name: "Exposphere",
        description:
            "Pameran teknologi dan startup showcase untuk memamerkan inovasi terbaru",
        icon: Globe,
        color: "from-green-500 to-teal-500",
        date: "12-14 Oktober 2025",
    },
];
