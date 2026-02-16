import Avatar from "@/assets/images/load-avatar.png";
import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { WeeklyCalendar } from "@/components/Home/WeeklyCalendar";
import { DailyContentGrid } from "@/components/Home/DailyContentGrid";
import { DailyAudioCard } from "@/components/Home/DailyAudioCard";
import { NightAudioModal } from "@/components/Home/NightAudioModal";
import { SOSModal } from "@/components/Home/SOSModal";
import { DailyMessageModal } from "@/components/Home/DailyMessageModal";

import { mockUser } from "@/lib/mockData";
import { Trophy, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { WeeklyTaskModal } from "@/components/Home/WeeklyTaskModal";
import { useCompletedItems } from "@/hooks/useCompletedItems";

import { useSelector } from "react-redux";
import { Acordeon } from "@/components/Home/Acordeon/Acordeon";

const Home: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());
    const { completed, markComplete } = useCompletedItems();
    const baseURL = import.meta.env.VITE_BASE_BACK;
    // Modal states
    const [nightAudioOpen, setNightAudioOpen] = useState(false);
    const [sosOpen, setSosOpen] = useState(false);
    const [dailyMessageOpen, setDailyMessageOpen] = useState(false);
    const [weeklyTaskOpen, setWeeklyTaskOpen] = useState(false);

    const { user } = useSelector((state: any) => state.user);

    const handleOpenModal = (modal: "nightAudio" | "sosEmotional" | "dailyMessage" | "weeklyTask") => {
        switch (modal) {
            case "nightAudio":
                setNightAudioOpen(true);
                break;
            case "sosEmotional":
                setSosOpen(true);
                break;
            case "dailyMessage":
                setDailyMessageOpen(true);
                break;
            case "weeklyTask":
                setWeeklyTaskOpen(true);
                break;
        }
    };

    return (
        <AppLayout>
            <div className="safe-top">
                {/* Header */}
                <header className="px-4 pt-4 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/perfil">
                            <img
                                src={user.photo ? baseURL + user.photo : Avatar}
                                alt={user?.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                            />
                        </Link>
                        <div>
                            <p className="text-sm text-muted-foreground">Hola,</p>
                            <h1 className="font-display font-semibold text-lg text-foreground">
                                {user?.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-accent/20 px-3 py-1.5 rounded-full">
                            <Trophy className="w-4 h-4 text-accent" />
                            <span className="text-sm font-semibold text-accent-foreground">
                                {mockUser.stats.daysActive}
                            </span>
                        </div>
                        <Link
                            to="/configuracion"
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                            <Settings className="w-5 h-5 text-muted-foreground" />
                        </Link>
                    </div>
                </header>

                {/* Weekly Calendar */}
                <WeeklyCalendar
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                />
                
                {/* Daily Content Grid */}
                <DailyContentGrid
                    completed={completed}
                    onOpenModal={handleOpenModal}
                />

                {/* Daily Audio */}
                <DailyAudioCard />
            </div>

            {/* Modals */}
            <NightAudioModal
                open={nightAudioOpen}
                onOpenChange={setNightAudioOpen}
                isCompleted={completed.nightAudio}
                onComplete={() => markComplete("nightAudio")}
            />

            <SOSModal
                open={sosOpen}
                onOpenChange={setSosOpen}
                isCompleted={completed.sosEmotional}
                onComplete={() => markComplete("sosEmotional")}
            />

            <DailyMessageModal
                open={dailyMessageOpen}
                onOpenChange={setDailyMessageOpen}
                isCompleted={completed.dailyMessage}
                onComplete={() => markComplete("dailyMessage")}
            />

            <WeeklyTaskModal
                open={weeklyTaskOpen}
                onOpenChange={setWeeklyTaskOpen}
                isCompleted={completed.weeklyTask}
                onComplete={() => markComplete("weeklyTask")}
            />
        </AppLayout>
    );
}

export default Home;