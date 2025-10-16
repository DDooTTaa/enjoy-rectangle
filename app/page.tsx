export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Enjoy Rectangle에 오신 것을 환영합니다!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          React와 Next.js로 구축된 현대적인 웹 애플리케이션입니다.
          TypeScript와 Tailwind CSS를 사용하여 개발되었습니다.
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
