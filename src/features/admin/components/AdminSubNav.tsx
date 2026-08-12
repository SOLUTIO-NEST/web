import { Link, useLocation } from "react-router-dom";
import { Users, ShieldAlert } from "lucide-react";

export default function AdminSubNav() {
  const { pathname } = useLocation();

  const tabs = [
    {
      label: "신청 관리",
      to: "/admin/applications",
      icon: Users,
    },
    {
      label: "블랙리스트 관리",
      to: "/admin/blacklist",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="flex items-center gap-2 mb-8 border-b border-neutral-200 pb-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.to;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all border ${
              isActive
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black"
            }`}
          >
            <Icon size={16} className={isActive ? "text-red-400" : "text-neutral-400"} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
