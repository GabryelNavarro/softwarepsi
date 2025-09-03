import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function ListaPacientesAgGrid({ fetchRows }) {
  const [rowData, setRowData] = useState([]);
  const [totalTempo, setTotalTempo] = useState(0);
  const [totalValor, setTotalValor] = useState(0);
  const gridApiRef = useRef(null);

  useEffect(() => {
    (async () => {
      const data = await fetchRows();
      setRowData(data || []);
    })();
  }, [fetchRows]);

  const columnDefs = [
    { field: 'nome', headerName: 'Nome', filter: true, flex: 1 },
    { field: 'plano', headerName: 'Plano', filter: true, flex: 1 },
    { field: 'idade', headerName: 'Idade', filter: 'agNumberColumnFilter', flex: 0.5 },
    { field: 'data', headerName: 'Data', filter: 'agDateColumnFilter', flex: 1 },
    { field: 'cid', headerName: 'CID', filter: true, flex: 1 },
    { field: 'valor_paciente', headerName: 'Valor', filter: 'agNumberColumnFilter', flex: 1 },
    { field: 'tempo_atendimento', headerName: 'Tempo (min)', filter: 'agNumberColumnFilter', flex: 1 },
  ];

  const updateTotals = () => {
    if (!gridApiRef.current) return;
    let somaTempo = 0;
    let somaValor = 0;
    gridApiRef.current.forEachNodeAfterFilterAndSort((node) => {
      somaTempo += Number(node.data?.tempo_atendimento) || 0;
      somaValor += Number(node.data?.valor_paciente) || 0;
    });
    setTotalTempo(somaTempo);
    setTotalValor(somaValor);
  };

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={(params) => {
            gridApiRef.current = params.api;
            updateTotals();
          }}
          onFilterChanged={updateTotals}
          onSortChanged={updateTotals}
        />
      </div>

      <div style={{ marginTop: 16, fontWeight: 'bold' }}>
        <p>Total de tempo de atendimento: {totalTempo} minutos</p>
        <p>Total Bruto: {totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </div>
    </div>
  );
}