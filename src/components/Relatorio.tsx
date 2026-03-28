import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download } from 'lucide-react';
import { EstudoRowData } from '../App';
import { UnifilarDiagram } from './UnifilarDiagram';

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

interface RelatorioProps {
  trafoData: TrafoData;
  ramaisData: RowData[];
  estudoRows: EstudoRowData[];
}

export const Relatorio: React.FC<RelatorioProps> = ({ trafoData, ramaisData, estudoRows }) => {
  const relatorioRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    if (!relatorioRef.current) return;
    
    const opt = {
      margin:       15,
      filename:     'memorial_descritivo.pdf',
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(relatorioRef.current).save();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-end mb-4">
        <button 
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all font-medium"
        >
          <Download className="w-4 h-4" />
          Baixar PDF
        </button>
      </div>

      <div className="overflow-x-auto w-full flex justify-center pb-8">
        <div 
          ref={relatorioRef} 
          className="w-[210mm] min-h-[297mm] bg-white text-black p-10 shadow-lg shrink-0"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-8">
            <div className="flex items-center gap-2">
              {/* Light Logo Approximation */}
              <div className="relative w-12 h-12 rounded-full border-[4px] border-[#00ff00] flex items-center justify-center">
                <div className="absolute w-8 h-8 text-[#00ff00]">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-4xl font-black text-[#00ff00] tracking-tighter leading-none">Light</span>
                <span className="text-[10px] text-[#eab308] font-bold mt-1">Serviços de Eletricidade S.A</span>
              </div>
            </div>
            
            {/* im3 Logo Approximation */}
            <div className="flex items-end relative">
              <div className="absolute w-2 h-2 bg-[#84cc16] rounded-full top-1 left-1"></div>
              <span className="text-5xl font-black text-[#000080] tracking-tighter">im3</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-8 uppercase">Memorial Descritivo - Projeto de Rede de Distribuição</h1>

          {/* Section 1: Objetivo */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-slate-300 mb-2">1. Objetivo</h2>
            <p className="text-sm text-justify leading-relaxed">
              O presente memorial descritivo tem por finalidade apresentar os cálculos e o dimensionamento da rede de distribuição de energia elétrica, incluindo o estudo de carregamento do transformador, dimensionamento dos ramais e análise de queda de tensão nos trechos da rede, garantindo o fornecimento de energia com qualidade e segurança, em conformidade com as normas técnicas vigentes da concessionária Light Serviços de Eletricidade S.A.
            </p>
          </div>

          {/* Section 2: Dados do Transformador */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-slate-300 mb-2">2. Dados do Transformador</h2>
            <table className="w-full text-sm border-collapse border border-slate-300">
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-100 w-1/2">Corrente Máxima Medida (A)</td>
                  <td className="border border-slate-300 p-2 text-center">{trafoData.correnteMaxima || '-'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-100">Fator de Temperatura</td>
                  <td className="border border-slate-300 p-2 text-center">{trafoData.fatorTemperatura || '-'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-100">Demanda Máxima (kVA)</td>
                  <td className="border border-slate-300 p-2 text-center">{trafoData.demandaMaxima || '-'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-100">Demanda Corrigida (kVA)</td>
                  <td className="border border-slate-300 p-2 text-center">{trafoData.demandaCorrigida || '-'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-100">Transformador Atual (kVA)</td>
                  <td className="border border-slate-300 p-2 text-center">{trafoData.trafoAtual || '-'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-100">Carregamento Atual (%)</td>
                  <td className="border border-slate-300 p-2 text-center">{trafoData.carregamentoAtual || '-'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-100">DMDI Ramal (kVA)</td>
                  <td className="border border-slate-300 p-2 text-center">{trafoData.dmdiRamal || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Resumo dos Ramais */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-slate-300 mb-2">3. Levantamento de Cargas e Ramais</h2>
            <p className="text-sm mb-2">A tabela abaixo apresenta o levantamento dos ramais de ligação e a demanda calculada por poste:</p>
            <table className="w-full text-[10px] border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-1">Poste</th>
                  <th className="border border-slate-300 p-1">Demanda (kVA)</th>
                  <th className="border border-slate-300 p-1">DX 1x3 6AWG</th>
                  <th className="border border-slate-300 p-1">TX 1x3 6AWG</th>
                  <th className="border border-slate-300 p-1">QX 1x3 6AWG</th>
                  <th className="border border-slate-300 p-1">QX 2x1 4AWG</th>
                  <th className="border border-slate-300 p-1">QX 5x3 1/0</th>
                  <th className="border border-slate-300 p-1">QX 8x5 3/0</th>
                  <th className="border border-slate-300 p-1">QX 10x7 4/0</th>
                </tr>
              </thead>
              <tbody>
                {ramaisData.filter(r => r.poste).map((row, i) => (
                  <tr key={i}>
                    <td className="border border-slate-300 p-1 text-center font-semibold">{row.poste}</td>
                    <td className="border border-slate-300 p-1 text-center">{row.demandaPonto || '-'}</td>
                    <td className="border border-slate-300 p-1 text-center">{row.dx13_6awg || '-'}</td>
                    <td className="border border-slate-300 p-1 text-center">{row.tx13_6awg || '-'}</td>
                    <td className="border border-slate-300 p-1 text-center">{row.qx13_6awg || '-'}</td>
                    <td className="border border-slate-300 p-1 text-center">{row.qx21_4awg || '-'}</td>
                    <td className="border border-slate-300 p-1 text-center">{row.qx53_1_0 || '-'}</td>
                    <td className="border border-slate-300 p-1 text-center">{row.qx85_3_0 || '-'}</td>
                    <td className="border border-slate-300 p-1 text-center">{row.qx107_4_0 || '-'}</td>
                  </tr>
                ))}
                {ramaisData.filter(r => r.poste).length === 0 && (
                  <tr>
                    <td colSpan={9} className="border border-slate-300 p-2 text-center text-gray-500">Nenhum ramal cadastrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Section 4: Estudo de Rede */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-slate-300 mb-2">4. Estudo de Rede e Queda de Tensão</h2>
            <p className="text-sm mb-2">O estudo de rede detalha os trechos, comprimentos e a carga acumulada para verificação da queda de tensão e dimensionamento dos condutores:</p>
            <table className="w-full text-[10px] border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-1">Ponto</th>
                  <th className="border border-slate-300 p-1">Trecho Montante</th>
                  <th className="border border-slate-300 p-1">Comp. (m)</th>
                  <th className="border border-slate-300 p-1">Clientes (kVA)</th>
                  <th className="border border-slate-300 p-1">Ilum. Púb.</th>
                  <th className="border border-slate-300 p-1">Total Trecho</th>
                  <th className="border border-slate-300 p-1">Acumulada</th>
                  <th className="border border-slate-300 p-1">Lado</th>
                </tr>
              </thead>
              <tbody>
                {estudoRows.filter(r => r.ponto).map((row, i) => {
                  const isTrafo = row.ponto === 'TRAFO';
                  const ramalRow = ramaisData.find(r => r.poste === row.ponto);
                  const clientesValue = ramalRow ? ramalRow.demandaPonto : '';
                  return (
                    <tr key={i} className={isTrafo ? "bg-slate-50 font-bold" : ""}>
                      <td className="border border-slate-300 p-1 text-center">{row.ponto}</td>
                      <td className="border border-slate-300 p-1 text-center">{row.trechoMontante || '-'}</td>
                      <td className="border border-slate-300 p-1 text-center">{row.comprimento || '-'}</td>
                      <td className="border border-slate-300 p-1 text-center">{clientesValue || '-'}</td>
                      <td className="border border-slate-300 p-1 text-center">{row.iluminacaoPublica || '-'}</td>
                      <td className="border border-slate-300 p-1 text-center">{row.totalTrecho || '-'}</td>
                      <td className="border border-slate-300 p-1 text-center">{row.acumulada || '-'}</td>
                      <td className="border border-slate-300 p-1 text-center">{row.lado || '-'}</td>
                    </tr>
                  );
                })}
                {estudoRows.filter(r => r.ponto).length === 0 && (
                  <tr>
                    <td colSpan={8} className="border border-slate-300 p-2 text-center text-gray-500">Nenhum estudo cadastrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Section 5: Diagrama Unifilar */}
          <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
            <h2 className="text-lg font-bold border-b border-slate-300 mb-2">5. Diagrama Unifilar</h2>
            <p className="text-sm mb-2">Representação gráfica da rede de distribuição e seus trechos:</p>
            <div className="w-full h-[500px] border border-slate-300 rounded-lg overflow-hidden">
              <UnifilarDiagram data={estudoRows} trafoAtual={trafoData.trafoAtual} isReport={true} />
            </div>
          </div>

          {/* Section 6: Conclusão */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-slate-300 mb-2">6. Conclusão</h2>
            <p className="text-sm text-justify leading-relaxed">
              Com base nos dados levantados e nos cálculos apresentados neste memorial, conclui-se que o dimensionamento da rede atende aos critérios técnicos exigidos. O transformador especificado ({trafoData.trafoAtual || 'N/A'}) apresenta capacidade adequada para suprir a demanda máxima corrigida de {trafoData.demandaCorrigida || 'N/A'} kVA, com um carregamento de {trafoData.carregamentoAtual || 'N/A'}%, garantindo a confiabilidade do sistema elétrico.
            </p>
          </div>

          {/* Footer Signatures */}
          <div className="mt-20 flex justify-around">
            <div className="text-center">
              <div className="w-48 border-t border-black mb-2 mx-auto"></div>
              <p className="text-sm font-bold">Projetista Responsável</p>
              <p className="text-xs">CREA/CAU:</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-t border-black mb-2 mx-auto"></div>
              <p className="text-sm font-bold">Aprovação Light</p>
              <p className="text-xs">Data: ___/___/_____</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
