import { type ApplicantResponseDto } from "@/services/types";

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
  applications: ApplicantResponseDto[];
}

function isUnassignedClass(raw: string | null | undefined): boolean {
  if (!raw || raw === "미정" || raw === "미배정") return true;
  const upper = raw.toUpperCase();
  return !["SEED", "BRANCH", "TREE"].includes(upper);
}

const FILTERS = [
  { key: "ALL", label: "전체", eng: "ALL" },
  { key: "PENDING", label: "미처리", eng: "PENDING" },
  { key: "APPROVED", label: "합격", eng: "APPROVED" },
  { key: "REJECTED", label: "불합격", eng: "REJECTED" },
  { key: "UNASSIGNED_CLASS", label: "반 미정", eng: "UNASSIGNED_CLASS" },
] as const;

export default function ApplicationFilter({ filter, setFilter, applications }: Props) {
  const getCount = (status: string) => {
    if (status === "ALL") return applications.length;
    if (status === "PENDING") return applications.filter((a) => a.passStatus === "PENDING").length;
    if (status === "APPROVED" || status === "ACCEPTED") return applications.filter((a) => a.passStatus === "APPROVED").length;
    if (status === "REJECTED") return applications.filter((a) => a.passStatus === "REJECTED").length;
    if (status === "UNASSIGNED_CLASS") return applications.filter((a) => isUnassignedClass(a.classLevel)).length;
    return 0;
  };

  return (
    <div className="bg-white border border-neutral-200 px-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm h-[58px]">
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          const count = getCount(f.key);
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded ${
                  isActive ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
        <span className="text-xs font-bold text-neutral-500">
          총 <span className="text-black font-extrabold">{applications.length}</span>명 신청됨
        </span>
      </div>
    </div>
  );
}
