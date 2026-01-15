import { type Application } from "@/services/api";

interface Props {
    filter: string;
    setFilter: (filter: string) => void;
    applications: Application[];
}

export default function ApplicationFilter({ filter, setFilter, applications }: Props) {
    const getCount = (status: string) => {
        if (status === 'ALL') return applications.length;
        return applications.filter(a => a.status === status).length;
    };

    return (
        <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
            {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${filter === f
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {f === 'ALL' ? '전체' : f === 'PENDING' ? '대기중' : f === 'ACCEPTED' ? '합격' : '불합격'}
                    <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">
                        {getCount(f)}
                    </span>
                </button>
            ))}
        </div>
    );
}
