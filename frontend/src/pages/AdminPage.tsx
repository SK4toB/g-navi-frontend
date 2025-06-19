import Experts from "../components/admin/Experts"
import News from "../components/admin/News"

export default function AdminPage() {
    return (
        <div className="h-full flex flex-col">
            <div className="text-center text-3xl font-bold mt-16">관리자 페이지</div>
            <main className="flex gap-10 px-20 flex-1 mb-6">
                <News />
                <Experts />
            </main>
        </div>
    )
}