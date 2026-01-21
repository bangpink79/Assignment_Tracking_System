import { Clock, Send, CheckCircle } from 'lucide-react';

function StatsBar({ assignments }) {
    const getCount = (status) =>
        assignments.filter(a => a.status === status).length;

    const stats = [
        {
            label: 'Pending',
            count: getCount('Pending'),
            Icon: Clock,
            className: 'pending'
        },
        {
            label: 'In Progress',
            count: getCount('In Progress'),
            Icon: Send,
            className: 'inprogress'
        },
        {
            label: 'Completed',
            count: getCount('Completed'),
            Icon: CheckCircle,
            className: 'completed'
        },
    ];

    return (
        <div className="stats-bar">
            {stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                    <stat.Icon className={`stat-icon ${stat.className}`} />
                    <div>
                        <p className="stat-count">{stat.count}</p>
                        <p className="stat-label">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsBar;