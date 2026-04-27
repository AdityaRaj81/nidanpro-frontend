import { FileText, Clock, CheckCircle, Users } from 'lucide-react';

export default function Dashboard() {
  const statCards = [
    {
      title: 'Total Reports',
      icon: FileText,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Reports',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Verified Reports',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Patients',
      icon: Users,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary">Backend-driven dashboard cards and feeds will render here.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
                  <div className="mt-2 h-8 w-20 rounded bg-slate-100" />
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-semibold">Recent Reports Feed</h2>
          </div>
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-text-primary font-medium">No feed data loaded</p>
            <p className="text-sm text-text-secondary mt-1">
              Recent report items from backend will be shown in this section.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-h3 font-semibold mb-4">Module Placeholder</h2>
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-text-primary font-medium">Action widgets will appear here</p>
            <p className="text-sm text-text-secondary mt-1">
              This block is reserved for backend-enabled quick actions and counters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}