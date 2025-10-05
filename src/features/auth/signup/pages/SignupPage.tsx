export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-50">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-10">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-purple-700">
          SOLUTIO 회원가입
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-semibold mb-2">이름</label>
            <input
              type="text"
              placeholder="홍길동"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 학번 */}
          <div>
            <label className="block text-sm font-semibold mb-2">학번</label>
            <input
              type="text"
              placeholder="202211441"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 소속학과 */}
          <div>
            <label className="block text-sm font-semibold mb-2">소속 학과</label>
            <input
              type="text"
              placeholder="컴퓨터공학부"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-semibold mb-2">전화번호</label>
            <input
              type="tel"
              placeholder="010-1234-5678"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 백준 아이디 */}
          <div>
            <label className="block text-sm font-semibold mb-2">백준 아이디</label>
            <input
              type="text"
              placeholder="minjuj"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 디스코드 아이디 */}
          <div>
            <label className="block text-sm font-semibold mb-2">디스코드 아이디</label>
            <input
              type="text"
              placeholder="mingmingmon#1234"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 메인 언어 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">메인 언어 (하나만 선택)</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                선택하세요
              </option>
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
              <option>JavaScript</option>
              <option>Kotlin</option>
              <option>C</option>
            </select>
          </div>

          {/* 제출 버튼 */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-purple-600 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
