import { ActivityIcon, ClockIcon, BarChart3Icon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  const completionRate =
    recentSessionsCount > 0
      ? Math.min(100, Math.round((activeSessionsCount / recentSessionsCount) * 100))
      : 0;

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="card bg-base-100 border-2 border-primary/20 hover:border-primary/30">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">Active Sessions</p>
              <h3 className="text-3xl font-black mt-1">{activeSessionsCount}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-primary/10">
              <ActivityIcon className="size-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border-2 border-accent/20 hover:border-accent/30">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">Recent Sessions</p>
              <h3 className="text-3xl font-black mt-1">{recentSessionsCount}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-accent/10">
              <ClockIcon className="size-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border-2 border-secondary/20 hover:border-secondary/30">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">Activity Ratio</p>
              <h3 className="text-3xl font-black mt-1">{completionRate}%</h3>
            </div>
            <div className="p-3 rounded-2xl bg-secondary/10">
              <BarChart3Icon className="size-6 text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
