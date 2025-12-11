export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-slate-800">Página no encontrada</h2>
                <p className="text-slate-500 max-w-md">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>
                <div className="pt-4">
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30"
                    >
                        Volver al Inicio
                    </a>
                </div>
            </div>
        </div>
    );
}
