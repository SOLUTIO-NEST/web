import seedMd from "./seed.md?raw";
import branchMd from "./branch.md?raw";
import treeMd from "./tree.md?raw";

export interface StudyClass {
  id: string;
  label: string;
  description: string;
  content: string;
}

export const STUDY_CLASSES: StudyClass[] = [
  {
    id: "seed",
    label: "Seed",
    description: "기초 알고리즘",
    content: seedMd,
  },
  {
    id: "branch",
    label: "Branch",
    description: "핵심 자료구조",
    content: branchMd,
  },
  {
    id: "tree",
    label: "Tree",
    description: "고급 알고리즘",
    content: treeMd,
  },
];

export function getStudyClass(id: string): StudyClass | undefined {
  return STUDY_CLASSES.find((c) => c.id === id);
}
