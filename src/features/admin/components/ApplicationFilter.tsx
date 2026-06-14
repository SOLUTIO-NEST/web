import { type ApplicantResponseDto } from "@/services/types";

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
  applications: ApplicantResponseDto[];
}

const FILTERS = [
  { key: "ALL", label: "전체", eng: "ALL" },
  { key: "PENDING", label: "대기중", eng: "PENDING" },
  { key: "ACCEPTED", label: "합격", eng: "ACCEPTED" },
  { key: "REJECTED", label: "불합격", eng: "REJECTED" },
] as const;

export default function ApplicationFilter({ filter, setFilter, applications }: Props) {
  const getCount = (status: string) => {
    if (status === "ALL") return applications.length;
    if (status === "ACCEPTED") return applications.filter((a) => a.isApprove === true).length;
    if (status === "REJECTED") return applications.filter((a) => a.isApprove === false).length;
    if (status === "PENDING") return applications.filter((a) => a.isApprove === null).length;
    return 0;
  };

  return (
    <div className="flex items-center gap-0 mb-6 border-b border-neutral-300">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => setFilter(f.key)}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            filter === f.key
              ? "border-black text-black"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          {f.label}
          <span
            className={`ml-2 text-[10px] font-bold tracking-wider ${
              filter === f.key ? "text-black/60" : "text-neutral-300"
            }`}
          >
            {getCount(f.key)}
          </span>
        </button>
      ))}
    </div>
  );
}
