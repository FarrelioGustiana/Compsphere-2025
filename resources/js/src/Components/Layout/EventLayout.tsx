import Navigation from "@/src/Components/Layout/Navigation";

const EventLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative z-10">
            <Navigation />
            {children}
        </div>
    );
};

export default EventLayout;
