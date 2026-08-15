import axios, { AxiosError } from "axios";

/**
 * HTTP 상태 코드별 기본 사용자 친화적 메시지 매핑
 */
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "요청 데이터가 올바르지 않습니다.",
  401: "로그인이 필요하거나 인증이 만료되었습니다.",
  403: "해당 작업을 수행할 권한이 없습니다.",
  404: "요청하신 대상을 찾을 수 없습니다.",
  409: "요청이 현재 서버 상태와 충돌하여 처리할 수 없습니다.",
  500: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  502: "서버 게이트웨이 오류가 발생했습니다.",
  503: "현재 서버 점검 중이거나 일시적으로 서비스를 이용할 수 없습니다.",
  504: "서버 응답 시간이 초과되었습니다.",
};

/**
 * 다양한 형태의 에러 객체(AxiosError, Error, string 등)로부터
 * 사용자에게 노출하기 적합한 한국어 메시지를 추출합니다.
 *
 * 우선순위:
 * 1. 백엔드 응답 본문의 메시지 (response.data.message 또는 detail)
 * 2. 네트워크 단절 / 타임아웃 오류 안내
 * 3. HTTP 상태 코드별 매핑 메시지
 * 4. 제공된 fallback 메시지 또는 기본 오류 메시지
 */
export function getErrorMessage(error: unknown, fallbackMessage = "요청 처리 중 오류가 발생했습니다."): string {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === "string") {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; detail?: string; error?: string }>;

    // 1. 백엔드에서 전달된 커스텀 에러 메시지
    const backendMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.detail ||
      axiosError.response?.data?.error;

    if (backendMessage && typeof backendMessage === "string" && backendMessage.trim()) {
      return backendMessage;
    }

    // 2. 네트워크 오류 / 타임아웃
    if (axiosError.code === "ERR_NETWORK" || axiosError.message === "Network Error") {
      return "서버와 연결할 수 없습니다. 네트워크 연결 상태를 확인해주세요.";
    }
    if (axiosError.code === "ECONNABORTED" || axiosError.message.includes("timeout")) {
      return "서버 응답 시간이 초과되었습니다. 다시 시도해주세요.";
    }

    // 3. HTTP 상태 코드 기반 메시지
    const status = axiosError.response?.status;
    if (status && HTTP_STATUS_MESSAGES[status]) {
      return HTTP_STATUS_MESSAGES[status];
    }
  }

  if (error instanceof Error && error.message) {
    // raw axios 메시지나 technical 문자열 필터링
    if (!error.message.startsWith("AxiosError") && !error.message.startsWith("Request failed with status code")) {
      return error.message;
    }
  }

  return fallbackMessage;
}
