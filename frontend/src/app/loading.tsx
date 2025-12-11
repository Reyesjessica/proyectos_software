export default function Loading() {
    return (
        <div className="min-h-screen bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                <p className="text-emerald-700 font-bold animate-pulse">Cargando...</p>
            </div>
        </div>
    );
}
