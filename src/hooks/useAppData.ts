import { useState, useEffect, useRef } from 'react';
import { 
    calculateTrafoData,
    calculateRamaisData,
    calculateEstudoData 
} from '../services/calculations';
import type { TrafoData, RowData, EstudoRowData, ColumnDef } from './useAppData'; // Supondo que as interfaces estão aqui

const API_URL = 'http://localhost:3001/api/data';

// ... (interfaces e constantes de colunas) ...

export const useAppData = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [estudoRows, setEstudoRows] = useState<EstudoRowData[]>([]);
  const [trafoData, setTrafoData] = useState<TrafoData>({ /* ... estado inicial ... */ });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  
  // ... (outros estados) ...

  // Load data from backend on mount
  useEffect(() => {
    const loadData = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Aqui você processaria os dados recebidos do backend
            // Por enquanto, vamos manter a lógica de inicialização se não houver dados

            if (data && data.rows) {
                setRows(data.rows);
                setEstudoRows(data.estudoRows);
                setTrafoData(data.trafoData);
                setActiveRareColumns(data.activeRareColumns);
            } else {
                // Lógica inicial se o backend não retornar nada
                const initialRows = Array.from({ length: 5 }).map((_, i) => createEmptyRow(i === 0 ? 'TRAFO' : (i + 1).toString()));
                setRows(initialRows);
                setEstudoRows([createEmptyEstudoRow(true), createEmptyEstudoRow()]);
            }
        } catch (error) {
            console.error("Failed to load data from backend:", error);
            setSaveMessage('Erro ao carregar dados do servidor');
             // Fallback para localStorage ou dados iniciais se o backend falhar
        } finally {
            setIsInitialLoad(false);
        }
    };

    loadData();
  }, []);

  // Auto-save effect to backend
  useEffect(() => {
    if (isInitialLoad) return;

    const saveData = async () => {
        setSaveMessage('Salvando no servidor...');
        try {
            const fullData = { rows, estudoRows, trafoData, activeRareColumns };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fullData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setSaveMessage(result.message || 'Salvo no servidor');

        } catch (error) {
            console.error("Failed to save data to backend:", error);
            setSaveMessage('Erro ao salvar no servidor');
        } finally {
            setTimeout(() => setSaveMessage(''), 2000); // Limpa a mensagem
        }
    };

    const timeoutId = setTimeout(saveData, 1500); // Debounce para evitar requisições excessivas

    return () => clearTimeout(timeoutId);
  }, [rows, estudoRows, trafoData, activeRareColumns, isInitialLoad]);

  // ... (todos os outros useEffects de cálculo e handlers) ...
  
  // A função handleSave manual agora também usa a API
  const handleSave = async () => {
    setSaveMessage('Salvando manualmente...');
    try {
        const fullData = { rows, estudoRows, trafoData, activeRareColumns };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fullData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setSaveMessage(result.message || 'Salvo com sucesso!');

    } catch (error) {
        console.error("Failed to manually save data:", error);
        setSaveMessage('Erro ao salvar');
    } finally {
        setTimeout(() => setSaveMessage(''), 2000);
    }
  };


  // ... (resto do hook e return) ...
  return { rows, estudoRows, trafoData, saveMessage, handleSave, /* ... outros exports ... */ };
};
