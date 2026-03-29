import React from 'react';
import { Save, Download, FileSpreadsheet, ArrowRight, ArrowLeft } from 'lucide-react';
import { UnifilarDiagram } from './components/UnifilarDiagram';
import { Relatorio } from './components/Relatorio';
import { useAppData, ColumnDef } from './hooks/useAppData'; 
import { RamaisTab } from './components/tabs/RamaisTab';
import { EstudoTab } from './components/tabs/EstudoTab';

const rareColumnsDef: ColumnDef[] = [
    { id: 'cc5', label: '5 CC', type: 'number', width: 'w-24' },
    { id: 'cc8', label: '8 CC', type: 'number', width: 'w-24' },
    { id: 'cc13', label: '13 CC', type: 'number', width: 'w-24' },
    { id: 'cc21', label: '21 CC', type: 'number', width: 'w-24' },
    { id: 'cc33', label: '33 CC', type: 'number', width: 'w-24' },
    { id: 'cc53', label: '53 CC', type: 'number', width: 'w-24' },
    { id: 'cc67', label: '67 CC', type: 'number', width: 'w-24' },
    { id: 'cc85', label: '85 CC', type: 'number', width: 'w-24' },
    { id: 'cc107', label: '107 CC', type: 'number', width: 'w-24' },
    { id: 'cc127', label: '127 CC', type: 'number', width: 'w-24' },
    { id: 'cc253', label: '253 CC', type: 'number', width: 'w-24' },
  ];

export default function App() {
  const appData = useAppData();
  const { 
    saveMessage, 
    handleExportCSV, 
    handleSave, 
    tabs, 
    activeTab, 
    setActiveTab, 
    currentTabIndex,
    getDisplayedEstudoRows,
    isEstudoTab,
    estudoRows,
    trafoData
  } = appData;

  const displayedEstudoRows = getDisplayedEstudoRows();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-teal-50 to-emerald-100 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 p-6 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 rounded-xl">
              <FileSpreadsheet className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestão de Ramais</h1>
              <p className="text-sm text-slate-500">Controle de ramais de clientes por poste</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {saveMessage && (
              <span className="text-sm font-medium text-teal-600 animate-pulse">
                {saveMessage}
              </span>
            )}
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 shadow-sm transition-all text-sm font-medium text-slate-700"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 border border-teal-400 shadow-md transition-all text-sm font-medium text-white"
            >
              <Save className="w-4 h-4" />
              Salvar Dados
            </button>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'bg-white/50 text-slate-600 hover:bg-white/80 border border-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content: Render active tab component */}
        {activeTab === 'ramais' && (
          <RamaisTab {...appData} rareColumnsDef={rareColumnsDef} />
        )}

        {isEstudoTab && (
          <EstudoTab 
            displayedEstudoRows={displayedEstudoRows}
            rows={appData.rows}
            handleEstudoChange={appData.handleEstudoChange}
            handleAddEstudoRow={appData.handleAddEstudoRow}
            handleRemoveEstudoRow={appData.handleRemoveEstudoRow}
            activeTab={activeTab}
          />
        )}

        {activeTab === 'diagrama' && (
          <div className="w-full h-[600px]">
            <UnifilarDiagram data={estudoRows} trafoAtual={trafoData.trafoAtual} />
          </div>
        )}

        {activeTab === 'relatorio' && (
          <Relatorio trafoData={trafoData} ramaisData={appData.rows} estudoRows={estudoRows} />
        )}

        {/* Global Footer Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}
            disabled={currentTabIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentTabIndex === 0 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-white/60 hover:bg-white/90 text-slate-700 shadow-sm border border-white/60'
            }`}
          >
            <ArrowLeft className="w-5 h-5" /> Voltar
          </button>

          <button
            onClick={() => setActiveTab(tabs[currentTabIndex + 1].id)}
            disabled={currentTabIndex === tabs.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentTabIndex === tabs.length - 1 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
            }`}
          >
            Avançar <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
