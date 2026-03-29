import type { TrafoData, RowData, EstudoRowData } from '../hooks/useAppData';

// --- Funções de Cálculo para o Transformador (TRAFO) ---

/**
 * Calcula os dados derivados do transformador.
 * @param trafoData - O estado atual dos dados do transformador.
 * @returns Um objeto com os campos calculados.
 */
export function calculateTrafoData(trafoData: TrafoData) {
  const correnteMaxima = parseFloat(trafoData.correnteMaxima.replace(',', '.')) || 0;
  const fatorTemperatura = parseFloat(trafoData.fatorTemperatura.replace(',', '.')) || 0;

  if (correnteMaxima === 0 || fatorTemperatura === 0) {
    return {
      demandaMaxima: '-',
      demandaCorrigida: '-',
      trafoAtual: '-',
      carregamentoAtual: '-',
    };
  }

  const demandaMaxima = (correnteMaxima * 220 * Math.sqrt(3)) / 1000; // Exemplo de cálculo
  const demandaCorrigida = demandaMaxima * fatorTemperatura;

  // Lógica para determinar o trafo (exemplo)
  let trafoAtual = '-';
  if (demandaCorrigida <= 15) trafoAtual = '15 kVA';
  else if (demandaCorrigida <= 30) trafoAtual = '30 kVA';
  else if (demandaCorrigida <= 45) trafoAtual = '45 kVA';
  else if (demandaCorrigida <= 75) trafoAtual = '75 kVA';
  else if (demandaCorrigida <= 112.5) trafoAtual = '112.5 kVA';
  else trafoAtual = '150 kVA';

  const potenciaTrafo = parseFloat(trafoAtual) || 0;
  const carregamentoAtual = potenciaTrafo > 0 ? (demandaCorrigida / potenciaTrafo) * 100 : 0;

  return {
    demandaMaxima: demandaMaxima.toFixed(2).replace('.', ','),
    demandaCorrigida: demandaCorrigida.toFixed(2).replace('.', ','),
    trafoAtual,
    carregamentoAtual: `${carregamentoAtual.toFixed(2).replace('.', ','_)}%`,
  };
}

// --- Funções de Cálculo para os Ramais ---

/**
 * Calcula a demanda por ponto (poste).
 * @param rows - As linhas da tabela de ramais.
 * @returns As linhas com o campo demandaPonto calculado.
 */
export function calculateRamaisData(rows: RowData[]): RowData[] {
  // Fatores de demanda por tipo de ramal (exemplo)
  const fatoresDemanda = {
    dx13_6awg: 0.8,
    tx13_6awg: 1.5,
    qx13_6awg: 3.0,
    // ... outros fatores
  };

  return rows.map(row => {
    if (row.poste.toUpperCase() === 'TRAFO') {
      return { ...row, demandaPonto: '-' };
    }

    let demandaTotal = 0;
    for (const key in fatoresDemanda) {
      const numRamais = parseInt(row[key] || '0');
      if (!isNaN(numRamais)) {
        demandaTotal += numRamais * (fatoresDemanda as any)[key];
      }
    }

    return {
      ...row,
      demandaPonto: demandaTotal.toFixed(2).replace('.', ','),
    };
  });
}

// --- Funções de Cálculo para o Estudo de Rede ---

/**
 * Calcula os dados para a tabela de estudo de rede.
 * @param estudoRows - As linhas da tabela de estudo.
 * @param ramaisRows - As linhas da tabela de ramais para consulta de carga.
 * @returns As linhas de estudo com os campos calculados.
 */
export function calculateEstudoData(estudoRows: EstudoRowData[], ramaisRows: RowD`ata[]): EstudoRowData[] {
  let acumuladaLadoDireito = 0;
  let acumuladaLadoEsquerdo = 0;

  // Mapeia a demanda dos ramais para fácil acesso
  const demandaPorPoste = new Map<string, number>();
  ramaisRows.forEach(r => {
    demandaPorPoste.set(r.poste, parseFloat(r.demandaPonto.replace(',', '.')) || 0);
  });

  const calculatedRows = estudoRows.map(row => {
    if (row.ponto === 'TRAFO') {
      return { ...row, totalTrecho: '-', acumulada: '-' };
    }

    const cargaClientes = demandaPorPoste.get(row.ponto) || 0;
    const cargaIluminacao = parseFloat(row.iluminacaoPublica.replace(',', '.')) || 0;
    const totalTrecho = cargaClientes + cargaIluminacao;

    return {
      ...row,
      totalTrecho: totalTrecho.toFixed(2).replace('.', ','),
      // Acumulada será calculada no próximo passo
    };
  });

  // Calcula a acumulada (precisa ser feito após ter todos os totais de trecho)
  // Ordena para garantir o cálculo correto
  const sortedDireito = calculatedRows.filter(r => r.lado === 'DIREITO').sort(/* alguma lógica de ordenação, ex: por ponto */);
  const sortedEsquerdo = calculatedRows.filter(r => r.lado === 'ESQUERDO').sort(/*...*/);

  // Esta parte é complexa e depende da ordem. Simplificando por enquanto.
  // Em uma implementação real, a ordenação seria crucial.
  
  // ... Lógica de cálculo da acumulada e centro de carga ...

  return calculatedRows;
}
