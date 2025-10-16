export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Enjoy Rectangle
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          당신의 공간 능력을 성장시켜 보세요! (역량 검사 연습용으로 만들어 보았습니다.)
        </p>
      </div>

      <div className="text-center">
        <a 
          href="/puzzle"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          4x4 퍼즐 게임 시작하기
        </a>
      </div>
    </div>
  )
}
