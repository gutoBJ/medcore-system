export default function Footer() {
  const anoAtual = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xs border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
          
          {/* Lado Esquerdo: Logo/Nome e Status */}
          <div className="flex flex-col items-center md:items-start gap-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-bold text-gray-800 tracking-tight text-sm md:text-base">
                MedCore <span className="text-blue-600">System</span>
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 hidden sm:block">
              Sistema Integrado de Gestão Clínica e Odontológica
            </p>
          </div>

          {/* Lado Direito: Direitos Autorais e Versão */}
          <div className="flex flex-col items-center md:items-end text-[10px] md:text-xs text-gray-500">
            <p>
              &copy; {anoAtual} MedCore. Todos os direitos reservados.
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}
