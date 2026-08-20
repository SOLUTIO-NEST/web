import { useEffect } from "react";

export const SITE_NAME = "SOLUTIO NEST";
export const TITLE_SEPARATOR = "·";

/**
 * 페이지 제목을 동적으로 설정하는 커스텀 훅
 * @param pageTitle 현재 페이지 이름 (생략 시 기본 사이트명으로 설정)
 * @param exact true일 경우 사이트명 접미사 없이 입력한 제목 그대로 설정
 */
export function useDocumentTitle(pageTitle?: string, exact: boolean = false) {
  useEffect(() => {
    if (!pageTitle) {
      document.title = SITE_NAME;
    } else if (exact) {
      document.title = pageTitle;
    } else {
      document.title = `${pageTitle} ${TITLE_SEPARATOR} ${SITE_NAME}`;
    }
  }, [pageTitle, exact]);
}

/**
 * 경로(pathname)에 대응하는 기본 페이지 타이틀 맵
 */
export const ROUTE_TITLES: Record<string, string> = {
  "/": "SOLUTIO NEST",
  "/signup": "입단 신청",
  "/login": "로그인",
  "/study": "스터디",
  "/competition": "대회",
  "/history": "연혁",
  "/contact": "문의",
  "/admin/applications": "신청 관리",
  "/admin/blacklist": "블랙리스트 관리",
  "/admin/recruitments": "모집 공고 관리",
};

/**
 * 주어진 경로에 따른 전체 타이틀 문자열 반환
 */
export function getTitleForPathname(pathname: string): string {
  // 정확히 일치하는 경로 검색
  if (ROUTE_TITLES[pathname]) {
    const title = ROUTE_TITLES[pathname];
    return title === SITE_NAME ? SITE_NAME : `${title} ${TITLE_SEPARATOR} ${SITE_NAME}`;
  }

  // 하위 경로 매칭 (예: /study/seed 등)
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (route !== "/" && pathname.startsWith(route)) {
      return `${title} ${TITLE_SEPARATOR} ${SITE_NAME}`;
    }
  }

  return SITE_NAME;
}
