import Experts from "../components/admin/Experts"
import News from "../components/admin/News"

export default function AdminPage() {
    return (
        <div className="min-h-screen p-10 mt-10">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">관리자 페이지</h1>
                    <p className="text-gray-600">카드 인사이트와 전문가 목록을 관리하세요</p>
                </div>

                <main className="flex gap-10 h-[calc(100vh-280px)] overflow-hidden">
                    <News />
                    <Experts />
                </main>
            </div>
        </div>
    )
}