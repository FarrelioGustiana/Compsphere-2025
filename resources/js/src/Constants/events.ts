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
            "A Hackathon Competition where individuals or teams collaborate to create a solution for a given problem or case study.",
        icon: Zap,
        color: "from-red-500 to-pink-500",
        date: "2-4 Oktober 2025",
    },
    {
        name: "Talksphere",
        description:
            "A festival celebrating the talents and accomplishments of the faculty of computer science, featuring mesmerizing performance and awarding sessions",
        icon: Users,
        color: "from-blue-500 to-cyan-500",
        date: "13 Oktober 2025",
    },
    {
        name: "FestSphere",
        description:
            "Introducing and spreading knowledge related to the latest technological advancements.",
        icon: Lightbulb,
        color: "from-purple-500 to-indigo-500",
        date: "14 Oktober 2025",
    },
    {
        name: "Exposphere",
        description:
            "Presenting real-world tech applications through student work.",
        icon: Globe,
        color: "from-green-500 to-teal-500",
        date: "12-14 Oktober 2025",
    },
];
