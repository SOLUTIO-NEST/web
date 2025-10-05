import Navbar from "@/components/layout/Navbar";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-purple-50 relative">
      {/* 🔹 홈으로 돌아가기 버튼 (은은하게, 좌측 상단 고정) */}
      
      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>

      {/* 🔹 회원가입 카드 */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-10">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-purple-700">
          회원가입
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-semibold mb-2">이름</label>
            <input
              type="text"
              placeholder="솔부엉이"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 학번 */}
          <div>
            <label className="block text-sm font-semibold mb-2">학번</label>
            <input
              type="text"
              placeholder="2025xxxxx"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 소속학과 */}
          <div>
            <label className="block text-sm font-semibold mb-2">소속 학과</label>
            <input
              type="text"
              placeholder="컴퓨터공학전공"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-semibold mb-2">전화번호</label>
            <input
              type="tel"
              placeholder="010-1234-5678"
              maxLength={13} // 010-1234-5678 형태 기준
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 남기기
                if (value.length < 4) {
                  e.target.value = value;
                } else if (value.length < 8) {
                  e.target.value = `${value.slice(0, 3)}-${value.slice(3)}`;
                } else {
                  e.target.value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>


          {/* 백준 아이디 */}
          <div>
            <label className="block text-sm font-semibold mb-2">백준 아이디</label>
            <input
              type="text"
              placeholder="sowlsowl"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* 메인 언어 */}
          <div>
            <label className="block text-sm font-semibold mb-2">메인 언어 (하나만 선택)</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                선택하세요
              </option>
              <option>C</option>
              <option>C++</option>
              <option>Java</option>
              <option>Python</option>
              <option>JavaScript</option>
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
