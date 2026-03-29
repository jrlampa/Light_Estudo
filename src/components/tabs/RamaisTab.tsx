import React from 'react';
import { Plus, Save, Trash2, Download, FileSpreadsheet, Activity, ChevronUp, ChevronDown, X } from 'lucide-react';
import { RowData, TrafoData, ColumnDef } from '../hooks/useAppData';

interface RamaisTabProps {
  rows: RowData[];
  trafoData: TrafoData;
  isTrafoExpanded: boolean;
  setIsTrafoExpanded: (isExpanded: boolean) => void;
  handleTrafoChange: (field: keyof TrafoData, value: string) => void;
  visibleColumns: ColumnDef[];
  rareColumnsDef: ColumnDef[];
  activeRareColumns: string[];
  removeRareColumn: (id: string) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  showRareMenu: boolean;
  setShowRareMenu: (show: boolean) => void;
  addRareColumn: (id: string) => void;
  handleChange: (id: string, field: string, value: string) => void;
  handleRemoveRow: (id: string) => void;
  handleAddRow: () => void;
}

export const RamaisTab: React.FC<RamaisTabProps> = ({ 
    rows,
    trafoData,
    isTrafoExpanded,
    setIsTrafoExpanded,
    handleTrafoChange,
    visibleColumns,
    rareColumnsDef,
    activeRareColumns,
    removeRareColumn,
    menuRef,
    showRareMenu,
    setShowRareMenu,
    addRareColumn,
    handleChange,
    handleRemoveRow,
    handleAddRow
}) => {
  return (
    <div className={`grid grid-cols-1 gap-6 ${isTrafoExpanded ? 'lg:grid-cols-4' : ''}`}>
      {/* Sidebar / Topbar - Leitura do Trafo */}
      <div className={`flex flex-col gap-4 ${isTrafoExpanded ? 'lg:col-span-1' : ''}`}>
        <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden transition-all duration-300">
          <div 
            className="bg-slate-800/90 text-white p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/90 transition-colors"
            onClick={() => setIsTrafoExpanded(!isTrafoExpanded)}
            title={isTrafoExpanded ? "Recolher painel" : "Expandir painel"}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" />
              <h2 className="font-semibold tracking-wide">LEITURA DO TRAFO</h2>
            </div>
            {isTrafoExpanded ? <ChevronUp className="w-5 h-5 text-slate-300" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
          </div>
          
          {isTrafoExpanded ? (
            <div className="p-4 flex flex-col gap-3">
            {/* User Inputs (Yellow) */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">Corrente Máxima</label>
              <input
                type="number"
                value={trafoData.correnteMaxima}
                onChange={(e) => handleTrafoChange('correnteMaxima', e.target.value)}
                className="w-full bg-yellow-100/80 border border-yellow-300/50 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-yellow-100 transition-all text-center font-medium"
                placeholder="Ex: 1073,53"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">Fator de Temperatura</label>
              <input
                type="number"
                value={trafoData.fatorTemperatura}
                onChange={(e) => handleTrafoChange('fatorTemperatura', e.target.value)}
                className="w-full bg-yellow-100/80 border border-yellow-300/50 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-yellow-100 transition-all text-center font-medium"
                placeholder="Ex: 1,20"
              />
            </div>

            <hr className="border-white/60 my-2" />

            {/* Calculated Fields (Read-only for now) */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">Demanda Máxima</label>
              <input
                type="text"
                readOnly
                value={trafoData.demandaMaxima}
                className="w-full bg-white/50 border border-white/50 rounded-lg px-3 py-2 text-sm text-slate-500 text-center cursor-not-allowed"
                placeholder="Calculado..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">Demanda Corrigida</label>
              <input
                type="text"
                readOnly
                value={trafoData.demandaCorrigida}
                className="w-full bg-white/50 border border-white/50 rounded-lg px-3 py-2 text-sm text-slate-500 text-center cursor-not-allowed"
                placeholder="Calculado..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">Trafo Atual</label>
              <input
                type="text"
                readOnly
                value={trafoData.trafoAtual}
                className="w-full bg-white/50 border border-white/50 rounded-lg px-3 py-2 text-sm text-slate-500 text-center cursor-not-allowed"
                placeholder="Calculado..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">Carregamento Atual</label>
              <input
                type="text"
                readOnly
                value={trafoData.carregamentoAtual}
                className="w-full bg-white/50 border border-white/50 rounded-lg px-3 py-2 text-sm text-slate-500 text-center cursor-not-allowed"
                placeholder="Calculado..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">DMDI (Ramal)</label>
              <input
                type="text"
                readOnly
                value={trafoData.dmdiRamal}
                className="w-full bg-white/50 border border-white/50 rounded-lg px-3 py-2 text-sm text-slate-500 text-center cursor-not-allowed"
                placeholder="Calculado..."
              />
            </div>

          </div>
          ) : (
            <div className="px-4 py-3 bg-white/30 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2"><span className="text-slate-500 text-xs font-semibold uppercase">Corrente Máx:</span> <span className="font-medium">{trafoData.correnteMaxima || '-'}</span></div>
              <div className="flex items-center gap-2"><span className="text-slate-500 text-xs font-semibold uppercase">Fator Temp:</span> <span className="font-medium">{trafoData.fatorTemperatura || '-'}</span></div>
              <div className="flex items-center gap-2"><span className="text-slate-500 text-xs font-semibold uppercase">Demanda Corrigida:</span> <span className="font-medium">{trafoData.demandaCorrigida || '-'}</span></div>
              <div className="flex items-center gap-2"><span className="text-slate-500 text-xs font-semibold uppercase">Trafo Atual:</span> <span className="font-medium">{trafoData.trafoAtual || '-'}</span></div>
              <div className="flex items-center gap-2"><span className="text-slate-500 text-xs font-semibold uppercase">Carregamento:</span> <span className="font-medium">{trafoData.carregamentoAtual || '-'}</span></div>
              <div className="flex items-center gap-2"><span className="text-slate-500 text-xs font-semibold uppercase">DMDI:</span> <span className="font-medium">{trafoData.dmdiRamal || '-'}</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Main Table Container - Glassmorphism */}
      <div className={`rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden flex flex-col ${isTrafoExpanded ? 'lg:col-span-3' : ''}`}>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
          <thead>
            {/* Top Header Row for Groups */}
            <tr className="bg-slate-800/90 text-white">
              <th colSpan={2} className="p-2 border-r border-slate-700"></th>
              <th colSpan={3} className="p-2 text-center text-xs font-bold tracking-wider border-r border-slate-700 uppercase">
                Nº de ramais ATUAL
              </th>
              <th colSpan={6 + activeRareColumns.length} className="p-2"></th>
              <th colSpan={2} className="p-2"></th>
            </tr>
            {/* Sub Header Row for Specific Groups (MONO, BIF, TRIF) */}
            <tr className="bg-slate-700/90 text-slate-200">
              <th colSpan={2} className="p-1 border-r border-slate-600"></th>
              <th className="p-1 text-center text-[10px] font-semibold tracking-wider border-r border-slate-600">MONO</th>
              <th className="p-1 text-center text-[10px] font-semibold tracking-wider border-r border-slate-600">BIF</th>
              <th className="p-1 text-center text-[10px] font-semibold tracking-wider border-r border-slate-600">TRIF</th>
              <th colSpan={6 + activeRareColumns.length} className="p-1"></th>
              <th colSpan={2} className="p-1"></th>
            </tr>
            <tr className="bg-white/50 border-b border-white/60">
              {visibleColumns.map((col, index) => (
                <th 
                  key={col.id} 
                  className={`p-3 text-xs font-semibold uppercase tracking-wider ${index === 0 ? 'sticky left-0 bg-white/80 backdrop-blur-md z-10 border-r border-white/60' : ''} ${col.width} ${col.highlight ? 'bg-emerald-100/50 text-emerald-800 border-x border-emerald-200/50' : 'text-slate-600'} relative group/th`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span>{col.label}</span>
                    {/* Show remove button for rare columns */}
                    {rareColumnsDef.some(r => r.id === col.id) && (
                      <button 
                        onClick={() => removeRareColumn(col.id)}
                        className="opacity-0 group-hover/th:opacity-100 p-0.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Remover coluna"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              
              {/* Plus Button Column */}
              <th className="p-3 w-12 text-center relative" ref={menuRef}>
                <button 
                  onClick={() => setShowRareMenu(!showRareMenu)}
                  className="p-1.5 rounded-lg bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors shadow-sm border border-teal-200"
                  title="Adicionar ramal antigo (CC)"
                >
                  <Plus className="w-4 h-4" />
                </button>
                
                {showRareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-xl shadow-xl rounded-xl border border-slate-200 p-2 z-50 w-48 flex flex-col gap-1 text-left">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Ramais Antigos (CC)</div>
                    <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
                      {rareColumnsDef.filter(c => !activeRareColumns.includes(c.id)).map(c => (
                        <button 
                          key={c.id} 
                          onClick={() => addRareColumn(c.id)} 
                          className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors"
                        >
                          {c.label}
                        </button>
                      ))}
                      {rareColumnsDef.filter(c => !activeRareColumns.includes(c.id)).length === 0 && (
                        <div className="px-3 py-2 text-xs text-slate-500 italic">Todos adicionados</div>
                      )}
                    </div>
                  </div>
                )}
              </th>

              <th className="p-3 w-12 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-white/30 transition-colors group">
                {visibleColumns.map((col, colIndex) => (
                  <td 
                    key={`${row.id}-${col.id}`} 
                    className={`p-2 ${colIndex === 0 ? 'sticky left-0 bg-white/60 backdrop-blur-md z-10 border-r border-white/60 group-hover:bg-white/80 transition-colors' : ''} ${col.highlight ? 'bg-emerald-50/30 border-x border-emerald-100/30' : ''}`}
                  >
                    <input
                      type={col.type}
                      value={row[col.id] || ''}
                      onChange={(e) => handleChange(row.id, col.id, e.target.value)}
                      readOnly={col.readOnly}
                      className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 
                        ${col.type === 'number' ? 'text-right' : ''} 
                        ${col.readOnly ? 'bg-slate-100/50 cursor-not-allowed text-center text-slate-500 border-white/50' : 
                          col.highlight ? 'bg-emerald-100/40 border-emerald-300/50 focus:ring-emerald-400/50 focus:bg-emerald-50/80 font-medium' : 
                          'bg-white/40 border-white/50 focus:ring-teal-400/50 focus:bg-white/80'}`}
                      placeholder={colIndex === 0 ? 'Ex: 1, TRAFO...' : (col.readOnly ? '-' : '-')}
                    />
                  </td>
                ))}
                <td className="p-2"></td> {/* Empty cell for the + column */}
                <td className="p-2 text-center">
                  <button 
                    onClick={() => handleRemoveRow(row.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 transition-colors"
                    title="Remover linha"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
        {/* Footer Actions */}
        <div className="p-4 bg-white/30 border-t border-white/60 flex justify-center mt-auto">
          <button 
            onClick={handleAddRow}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/60 hover:bg-white/90 border border-white/80 shadow-sm transition-all text-sm font-medium text-teal-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar Novo Poste
          </button>
        </div>
      </div>
    </div>
  );
}
