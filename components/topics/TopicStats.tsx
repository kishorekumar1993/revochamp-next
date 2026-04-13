import { BookOpen, CheckCircle2, Clock } from "lucide-react";

interface Props {
  topicCount: number;
  completedCount: number;
  totalHours: number;
}

export default function TopicStats({ topicCount, completedCount, totalHours }: Props) {
  const stats = [
    { 
      label: "Topics", 
      value: `${topicCount}+`, 
      icon: <BookOpen className="w-5 h-5 text-blue-500" />, 
      bgColor: "bg-blue-50" 
    },
    { 
      label: "Completed", 
      value: completedCount, 
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, 
      bgColor: "bg-emerald-50" 
    },
    { 
      label: "Hours", 
      value: `${Math.round(totalHours)}+`, 
      icon: <Clock className="w-5 h-5 text-orange-500" />, 
      bgColor: "bg-orange-50" 
    },
  ];

  return (
    <div className="w-full py-6">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="flex items-center gap-5 p-8 transition-colors hover:bg-gray-50/50 group"
            >
              {/* Icon Container */}
              <div className={`flex-shrink-0 w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                {stat.icon}
              </div>

              {/* Text Content */}
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-tight">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}