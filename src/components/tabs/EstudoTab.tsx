import React from 'react';
import { Plus, Trash2, Activity } from 'lucide-react';
import { EstudoRowData, RowData } from '../hooks/useAppData';

interface EstudoTabProps {
  displayedEstudoRows: EstudoRowData[];
  rows: RowData[];
  handleEstudoChange: (id: string, field: keyof EstudoRowData, value: string) => void;
  handleAddEstudoRow: (afterId?: string, defaultLado?: string) => void;
  handleRemoveEstudoRow: (id: string) => void;
  activeTab: string;
}

export const EstudoTab: React.FC<EstudoTabProps> = ({ 
    displayedEstudoRows, 
    rows, 
    handleEstudoChange, 
    handleAddEstudoRow, 
    handleRemoveEstudoRow, 
    activeTab 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Table Container */}
      <div className="lg:col-span-3 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/90 text-white">
                <th rowSpan={2} className="p-3 text-xs font-semibold uppercase tracking-wider border-r border-slate-700 align-middle">Ponto</th>
                <th rowSpan={2} className="p-3 text-xs font-semibold uppercase tracking-wider border-r border-slate-700 align-middle">Trecho Montante</th>
                <th rowSpan={2} className="p-3 text-xs font-semibold uppercase tracking-wider border-r border-slate-700 align-middle">Comprimento (m)</th>
                <th colSpan={2} className="p-2 text-center text-xs font-bold tracking-wider border-r border-slate-700 uppercase border-b border-slate-700">Coordenadas UTM</th>
                <th colSpan={3} className="p-2 text-center text-xs font-bold tracking-wider border-r border-slate-700 uppercase border-b border-slate-700">Cargas</th>
                <th rowSpan={2} className="p-3 text-xs font-semibold uppercase tracking-wider border-r border-slate-700 align-middle">Acumulada</th>
                <th rowSpan={2} className="p-3 text-xs font-semibold uppercase tracking-wider border-r border-slate-700 align-middle">Dist. Centro Carga</th>
                <th rowSpan={2} className="p-3 text-xs font-semibold uppercase tracking-wider border-r border-slate-700 align-middle">Lado</th>
                <th rowSpan={2} className="p-3 w-12 text-center align-middle">Ações</th>
              </tr>
              <tr className="bg-slate-700/90 text-slate-200">
                <th className="p-2 text-center text-[10px] font-semibold tracking-wider border-r border-slate-600">X (LONG)</th>
                <th className="p-2 text-center text-[10px] font-semibold tracking-wider border-r border-slate-600">Y (LAT)</th>
                <th className="p-2 text-center text-[10px] font-semibold tracking-wider border-r border-slate-600">CLIENTES</th>
                <th className="p-2 text-center text-[10px] font-semibold tracking-wider border-r border-slate-600">ILUM. PÚBLICA</th>
                <th className="p-2 text-center text-[10px] font-semibold tracking-wider border-r border-slate-600">TOTAL TRECHO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {displayedEstudoRows.map((row, rowIndex) => {
                const isTrafo = row.ponto === 'TRAFO'; // The TRAFO row
                const ramalRow = rows.find(r => r.poste === row.ponto);
                const clientesValue = ramalRow?.demandaPonto || '0,00';
                
                return (
                  <tr key={row.id} className={`transition-colors group ${isTrafo ? 'bg-slate-200/60 border-b-2 border-slate-400/50 hover:bg-slate-300/60' : 'hover:bg-white/30'}`}>
                    <td className={`p-2 sticky left-0 z-10 border-r border-white/60 transition-colors ${isTrafo ? 'bg-slate-200/90 backdrop-blur-md group-hover:bg-slate-300/90' : 'bg-white/60 backdrop-blur-md group-hover:bg-white/80'}`}>
                      <input
                        type="text"
                        value={row.ponto}
                        onChange={(e) => handleEstudoChange(row.id, 'ponto', e.target.value)}
                        readOnly={isTrafo}
                        className={`w-16 border rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${isTrafo ? 'bg-slate-100/50 cursor-not-allowed text-center font-bold border-white/50' : 'bg-white/40 border-white/50 focus:ring-teal-400/50 focus:bg-white/80'}`}
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <input
                        type="text"
                        value={row.trechoMontante}
                        onChange={(e) => handleEstudoChange(row.id, 'trechoMontante', e.target.value)}
                        readOnly={isTrafo}
                        className={`w-20 border rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${isTrafo ? 'bg-slate-100/50 cursor-not-allowed text-center text-slate-400 border-white/50' : 'bg-white/40 border-white/50 focus:ring-teal-400/50 focus:bg-white/80'}`}
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <input
                        type="text"
                        value={row.comprimento}
                        onChange={(e) => handleEstudoChange(row.id, 'comprimento', e.target.value)}
                        readOnly={isTrafo}
                        className={`w-20 border rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 text-right ${isTrafo ? 'bg-slate-100/50 cursor-not-allowed text-center text-slate-400 border-white/50' : 'bg-white/40 border-white/50 focus:ring-teal-400/50 focus:bg-white/80'}`}
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <input
                        type="number"
                        value={row.coordX}
                        onChange={(e) => handleEstudoChange(row.id, 'coordX', e.target.value)}
                        className="w-24 border rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 text-right bg-white/40 border-white/50 focus:ring-teal-400/50 focus:bg-white/80"
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <input
                        type="number"
                        value={row.coordY}
                        onChange={(e) => handleEstudoChange(row.id, 'coordY', e.target.value)}
                        className="w-24 border rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 text-right bg-white/40 border-white/50 focus:ring-teal-400/50 focus:bg-white/80"
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <input
                        type="text"
                        readOnly
                        value={clientesValue}
                        className="w-20 border rounded-lg px-2 py-2 text-sm text-slate-500 text-center bg-slate-100/50 cursor-not-allowed border-white/50"
                        placeholder="0,00"
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <input
                        type="number"
                        value={row.iluminacaoPublica}
                        onChange={(e) => handleEstudoChange(row.id, 'iluminacaoPublica', e.target.value)}
                        className="w-20 border rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 text-right bg-white/40 border-white/50 focus:ring-teal-400/50 focus:bg-white/80"
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <input
                        type="text"
                        readOnly
                        value={row.totalTrecho}
                        className="w-20 border rounded-lg px-2 py-2 text-sm text-slate-500 text-center bg-slate-100/50 cursor-not-allowed border-white/50"
                        placeholder="Calc..."
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <input
                        type="text"
                        readOnly
                        value={row.acumulada}
                        className="w-20 border rounded-lg px-2 py-2 text-sm text-slate-500 text-center bg-slate-100/50 cursor-not-allowed border-white/50"
                        placeholder="Calc..."
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <input
                        type="text"
                        readOnly
                        value={row.distCentroCarga}
                        className="w-20 border rounded-lg px-2 py-2 text-sm text-slate-500 text-center bg-slate-100/50 cursor-not-allowed border-white/50"
                        placeholder="Calc..."
                      />
                    </td>
                    <td className="p-2 border-r border-white/40">
                      <select
                        value={row.lado}
                        onChange={(e) => handleEstudoChange(row.id, 'lado', e.target.value)}
                        disabled={isTrafo}
                        className={`w-24 border rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all ${isTrafo ? 'bg-slate-100/50 cursor-not-allowed border-white/50 text-slate-500' : 'bg-white/40 border-white/50 focus:ring-teal-400/50 focus:bg-white/80'}`}
                      >
                        <option value="DIREITO">DIREITO</option>
                        <option value="ESQUERDO">ESQUERDO</option>
                        {isTrafo && <option value="TRAFO">TRAFO</option>}
                      </select>
                    </td>
                    <td className="p-2 text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => handleAddEstudoRow(row.id, activeTab === 'lado_esquerdo' ? 'ESQUERDO' : activeTab === 'lado_direito' ? 'DIREITO' : undefined)}
                          className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-100 transition-colors"
                          title="Adicionar linha abaixo"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        {!isTrafo && (
                          <button 
                            onClick={() => handleRemoveEstudoRow(row.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 transition-colors"
                            title="Remover linha"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer Actions for Estudo de Rede */}
        <div className="p-4 bg-white/30 border-t border-white/60 flex justify-center mt-auto">
          <button 
            onClick={() => handleAddEstudoRow(undefined, activeTab === 'lado_esquerdo' ? 'ESQUERDO' : activeTab === 'lado_direito' ? 'DIREITO' : undefined)}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/60 hover:bg-white/90 border border-white/80 shadow-sm transition-all text-sm font-medium text-teal-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar Nova Linha
          </button>
        </div>
      </div>

      {/* Sidebar - Resumo */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden">
          <div className="bg-slate-800/90 text-white p-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <h2 className="font-semibold tracking-wide">RESULTADOS</h2>
          </div>
          
          <div className="p-4 flex flex-col gap-4">
            {/* Centro de Carga */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
              <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 text-center">Centro de Carga</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-white/60 px-3 py-1.5 rounded-lg border border-white">
                  <span className="text-xs font-semibold text-slate-500">X</span>
                  <span className="text-sm font-medium text-slate-700">-</span>
                </div>
                <div className="flex items-center justify-between bg-white/60 px-3 py-1.5 rounded-lg border border-white">
                  <span className="text-xs font-semibold text-slate-500">Y</span>
                  <span className="text-sm font-medium text-slate-700">-</span>
                </div>
              </div>
            </div>

            {/* Poste Ideal */}
            <div className="bg-white/50 border border-white/60 rounded-xl p-3 text-center">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Poste Ideal</h3>
              <div className="text-xl font-bold text-teal-600">-</div>
            </div>

            {/* Sub-circuitos */}
            <div className="bg-white/50 border border-white/60 rounded-xl p-3 text-center">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Sub-circuitos Sugeridos</h3>
              <div className="text-xl font-bold text-teal-600">-</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase">Atentar-se para CQT</div>
            </div>

            {/* Metros Rede Total */}
            <div className="bg-white/50 border border-white/60 rounded-xl p-3 text-center">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Metros Rede Total</h3>
              <div className="text-xl font-bold text-teal-600">- <span className="text-sm font-medium text-slate-500">m</span></div>
            </div>

            {/* Ramal (DMDI) */}
            <div className="bg-white/50 border border-white/60 rounded-xl p-3 text-center">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Ramal (DMDI)</h3>
              <div className="text-xl font-bold text-teal-600">-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
