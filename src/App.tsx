import React, { useState, useEffect, useRef } from 'react';
import { Plus, Save, Trash2, Download, FileSpreadsheet, Activity, ChevronUp, ChevronDown, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { UnifilarDiagram } from './components/UnifilarDiagram';
import { Relatorio } from './components/Relatorio';

interface TrafoData {
  correnteMaxima: string;
  demandaMaxima: string;
  fatorTemperatura: string;
  demandaCorrigida: string;
  trafoAtual: string;
  carregamentoAtual: string;
  dmdiRamal: string;
}

interface RowData {
  id: string;
  poste: string;
  demandaPonto: string;
  dx13_6awg: string;
  tx13_6awg: string;
  qx13_6awg: string;
  qx21_4awg: string;
  qx53_1_0: string;
  qx85_3_0: string;
  qx107_4_0: string;
  mmx70: string;
  mmx185: string;
  [key: string]: string | undefined;
}

export interface EstudoRowData {
  id: string;
  ponto: string;
  trechoMontante: string;
  comprimento: string;
  coordX: string;
  coordY: string;
  clientes: string;
  iluminacaoPublica: string;
  totalTrecho: string;
  acumulada: string;
  distCentroCarga: string;
  lado: string;
}

interface ColumnDef {
  id: string;
  label: string;
  type: string;
  width: string;
  readOnly?: boolean;
  highlight?: boolean;
  group?: string;
}

const columns: ColumnDef[] = [
  { id: 'poste', label: 'Nº do Poste', type: 'text', width: 'w-32' },
  { id: 'demandaPonto', label: 'DEMANDA PONTO', type: 'text', width: 'w-32', readOnly: true },
  { id: 'dx13_6awg', label: '13 DX 6 AWG', type: 'number', width: 'w-24', highlight: true, group: 'MONO' },
  { id: 'tx13_6awg', label: '13 TX 6 AWG', type: 'number', width: 'w-24', highlight: true, group: 'BIF' },
  { id: 'qx13_6awg', label: '13 QX 6 AWG', type: 'number', width: 'w-24', highlight: true, group: 'TRIF' },
  { id: 'qx21_4awg', label: '21 QX 4 AWG', type: 'number', width: 'w-24' },
  { id: 'qx53_1_0', label: '53 QX 1/0', type: 'number', width: 'w-24' },
  { id: 'qx85_3_0', label: '85 QX 3/0', type: 'number', width: 'w-24' },
  { id: 'qx107_4_0', label: '107 QX 4/0', type: 'number', width: 'w-24' },
  { id: 'mmx70', label: '70 MMX', type: 'number', width: 'w-24' },
  { id: 'mmx185', label: '185 MMX', type: 'number', width: 'w-24' },
];

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
  const [rows, setRows] = useState<RowData[]>([]);
  const [estudoRows, setEstudoRows] = useState<EstudoRowData[]>([]);
  const [trafoData, setTrafoData] = useState<TrafoData>({
    correnteMaxima: '',
    demandaMaxima: '',
    fatorTemperatura: '',
    demandaCorrigida: '',
    trafoAtual: '',
    carregamentoAtual: '',
    dmdiRamal: '',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [isTrafoExpanded, setIsTrafoExpanded] = useState(true);
  const [activeRareColumns, setActiveRareColumns] = useState<string[]>([]);
  const [showRareMenu, setShowRareMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('ramais');

  const tabs = [
    { id: 'ramais', label: 'Ramais' },
    { id: 'calculos', label: 'Estudo de Rede' },
    { id: 'lado_esquerdo', label: 'Lado 1 - Esquerdo' },
    { id: 'lado_direito', label: 'Lado 2 - Direito' },
    { id: 'diagrama', label: 'Diagrama Unifilar' },
    { id: 'relatorio', label: 'Relatório' }
  ];
  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowRareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load from local storage on mount
  useEffect(() => {
    const savedRows = localStorage.getItem('ramaisData');
    if (savedRows) {
      try {
        setRows(JSON.parse(savedRows));
      } catch (e) {
        console.error("Failed to parse saved rows");
      }
    } else {
      // Initial empty rows
      const initialRows = Array.from({ length: 5 }).map((_, i) => createEmptyRow(i === 0 ? 'TRAFO' : (i + 1).toString()));
      setRows(initialRows);
    }

    const savedEstudo = localStorage.getItem('estudoData');
    if (savedEstudo) {
      try {
        setEstudoRows(JSON.parse(savedEstudo));
      } catch (e) {
        console.error("Failed to parse saved estudo data");
      }
    } else {
      setEstudoRows([createEmptyEstudoRow(true), createEmptyEstudoRow()]);
    }

    const savedTrafo = localStorage.getItem('trafoData');
    if (savedTrafo) {
      try {
        setTrafoData(JSON.parse(savedTrafo));
      } catch (e) {
        console.error("Failed to parse saved trafo data");
      }
    }

    const savedRareCols = localStorage.getItem('activeRareColumns');
    if (savedRareCols) {
      try {
        setActiveRareColumns(JSON.parse(savedRareCols));
      } catch (e) {
        console.error("Failed to parse saved rare columns");
      }
    }

    setIsInitialLoad(false);
  }, []);

  // Sync Estudo rows with Ramais rows
  useEffect(() => {
    if (isInitialLoad) return;

    setEstudoRows(prevEstudo => {
      const newEstudo = [...prevEstudo];
      
      // Ensure TRAFO is always the first row
      if (newEstudo.length === 0 || newEstudo[0].ponto !== 'TRAFO') {
        newEstudo.unshift(createEmptyEstudoRow(true));
      }

      // Sync the rest of the rows based on 'poste' from ramais
      const ramaisPostes = rows.filter(r => r.poste && r.poste.toUpperCase() !== 'TRAFO').map(r => r.poste);
      
      // Keep existing rows that match ramais, add new ones
      const syncedEstudo = [newEstudo[0]]; // Keep TRAFO
      
      ramaisPostes.forEach(poste => {
        const existingRow = newEstudo.find(e => e.ponto === poste);
        if (existingRow) {
          syncedEstudo.push(existingRow);
        } else {
          const newRow = createEmptyEstudoRow();
          newRow.ponto = poste;
          const prevRow = syncedEstudo[syncedEstudo.length - 1];
          newRow.lado = prevRow?.lado === 'ESQUERDO' ? 'ESQUERDO' : 'DIREITO';
          if (prevRow) {
            newRow.trechoMontante = prevRow.ponto;
            newRow.comprimento = prevRow.comprimento;
          }
          syncedEstudo.push(newRow);
        }
      });

      // Keep any manually added rows in Estudo that aren't in Ramais
      const manualRows = newEstudo.filter(e => e.ponto !== 'TRAFO' && !ramaisPostes.includes(e.ponto));
      
      return [...syncedEstudo, ...manualRows];
    });
  }, [rows, isInitialLoad]);

  // Auto-save effect
  useEffect(() => {
    if (isInitialLoad) return;

    setSaveMessage('Salvando...');
    const timeoutId = setTimeout(() => {
      localStorage.setItem('ramaisData', JSON.stringify(rows));
      localStorage.setItem('estudoData', JSON.stringify(estudoRows));
      localStorage.setItem('trafoData', JSON.stringify(trafoData));
      localStorage.setItem('activeRareColumns', JSON.stringify(activeRareColumns));
      setSaveMessage('Salvo automaticamente');
      
      // Clear message after 2 seconds
      setTimeout(() => setSaveMessage(''), 2000);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [rows, estudoRows, trafoData, activeRareColumns, isInitialLoad]);

  const handleTrafoChange = (field: keyof TrafoData, value: string) => {
    setTrafoData(prev => ({ ...prev, [field]: value }));
  };

  const addRareColumn = (id: string) => {
    setActiveRareColumns(prev => [...prev, id]);
    setShowRareMenu(false);
  };

  const removeRareColumn = (id: string) => {
    setActiveRareColumns(prev => prev.filter(colId => colId !== id));
  };

  const visibleColumns = [
    ...columns,
    ...rareColumnsDef.filter(c => activeRareColumns.includes(c.id))
  ];

  const getDisplayedEstudoRows = () => {
    if (activeTab === 'lado_esquerdo') {
      return [...estudoRows].filter(r => r.ponto === 'TRAFO' || r.lado === 'ESQUERDO').sort((a, b) => {
        if (a.ponto === 'TRAFO') return -1;
        if (b.ponto === 'TRAFO') return 1;
        const valA = parseFloat(a.acumulada.replace(',', '.')) || 0;
        const valB = parseFloat(b.acumulada.replace(',', '.')) || 0;
        return valB - valA;
      });
    }
    if (activeTab === 'lado_direito') {
      return [...estudoRows].filter(r => r.ponto === 'TRAFO' || r.lado === 'DIREITO').sort((a, b) => {
        if (a.ponto === 'TRAFO') return -1;
        if (b.ponto === 'TRAFO') return 1;
        const valA = parseFloat(a.acumulada.replace(',', '.')) || 0;
        const valB = parseFloat(b.acumulada.replace(',', '.')) || 0;
        return valB - valA;
      });
    }
    return estudoRows;
  };

  const displayedEstudoRows = getDisplayedEstudoRows();
  const isEstudoTab = ['calculos', 'lado_esquerdo', 'lado_direito'].includes(activeTab);

  const createEmptyRow = (posteValue: string = ''): RowData => ({
    id: crypto.randomUUID(),
    poste: posteValue,
    demandaPonto: '',
    dx13_6awg: '',
    tx13_6awg: '',
    qx13_6awg: '',
    qx21_4awg: '',
    qx53_1_0: '',
    qx85_3_0: '',
    qx107_4_0: '',
    mmx70: '',
    mmx185: '',
  });

  const createEmptyEstudoRow = (isTrafo: boolean = false): EstudoRowData => ({
    id: crypto.randomUUID(),
    ponto: isTrafo ? 'TRAFO' : '',
    trechoMontante: isTrafo ? '-' : '',
    comprimento: isTrafo ? '-' : '',
    coordX: '',
    coordY: '',
    clientes: '',
    iluminacaoPublica: '',
    totalTrecho: '',
    acumulada: '',
    distCentroCarga: '',
    lado: isTrafo ? 'TRAFO' : 'DIREITO',
  });

  const handleAddRow = () => {
    setRows([...rows, createEmptyRow()]);
  };

  const handleRemoveRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleChange = (id: string, field: string, value: string) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleEstudoChange = (id: string, field: keyof EstudoRowData, value: string) => {
    setEstudoRows(estudoRows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleAddEstudoRow = (afterId?: string, defaultLado?: string) => {
    const newRow = createEmptyEstudoRow();
    
    if (afterId) {
      const index = estudoRows.findIndex(r => r.id === afterId);
      if (index >= 0) {
        const prevRow = estudoRows[index];
        newRow.lado = defaultLado || (prevRow.lado === 'ESQUERDO' ? 'ESQUERDO' : 'DIREITO');
        newRow.trechoMontante = prevRow.ponto;
        newRow.comprimento = prevRow.comprimento;
        const newRows = [...estudoRows];
        newRows.splice(index + 1, 0, newRow);
        setEstudoRows(newRows);
        return;
      }
    }

    const prevRow = estudoRows.length > 0 ? estudoRows[estudoRows.length - 1] : null;
    newRow.lado = defaultLado || (prevRow?.lado === 'ESQUERDO' ? 'ESQUERDO' : 'DIREITO');
    if (prevRow) {
      newRow.trechoMontante = prevRow.ponto;
      newRow.comprimento = prevRow.comprimento;
    }
    
    setEstudoRows([...estudoRows, newRow]);
  };

  const handleRemoveEstudoRow = (id: string) => {
    setEstudoRows(estudoRows.filter(row => row.id !== id));
  };

  const handleSave = () => {
    localStorage.setItem('ramaisData', JSON.stringify(rows));
    localStorage.setItem('estudoData', JSON.stringify(estudoRows));
    localStorage.setItem('trafoData', JSON.stringify(trafoData));
    localStorage.setItem('activeRareColumns', JSON.stringify(activeRareColumns));
    setSaveMessage('Salvo manualmente');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleExportCSV = () => {
    const headers = visibleColumns.map(c => c.label).join(',');
    const csvRows = rows.map(row => {
      return visibleColumns.map(c => row[c.id] || '').join(',');
    });
    const csvContent = [headers, ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ramais_por_poste.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-teal-50 to-emerald-100 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Glassmorphism */}
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

        {/* Main Content Grid */}
        {activeTab === 'ramais' && (
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
        )}

        {/* Tab Content: Calculos / Lados */}
        {isEstudoTab && (
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
        )}

        {/* Tab Content: Diagrama Unifilar */}
        {activeTab === 'diagrama' && (
          <div className="w-full h-[600px]">
            <UnifilarDiagram data={estudoRows} trafoAtual={trafoData.trafoAtual} />
          </div>
        )}

        {/* Tab Content: Relatório */}
        {activeTab === 'relatorio' && (
          <Relatorio trafoData={trafoData} ramaisData={rows} estudoRows={estudoRows} />
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
