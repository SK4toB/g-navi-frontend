import Experts from "../components/admin/Experts"
import News from "../components/admin/News"

export default function AdminPage() {
    return (
        <div className="h-full flex flex-col">
            <div className="text-center text-2xl font-bold py-8">Admin Page</div>
            <main className="flex gap-10 px-20 flex-1">
                <News />
                <Experts />
            </main>
        </div>
    )
}