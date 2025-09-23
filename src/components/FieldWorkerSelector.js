import React from "react";
import { useSelection } from "../contexts/SelectionContext";

export default function FieldWorkerSelector() {
  const { workers, selectedWorker, setSelectedWorker } = useSelection();
  return (
    <div className="bg-white p-3 rounded shadow mb-4 flex items-center gap-4">
      <div>
        <label className="text-xs text-gray-500">Field Worker</label>
        <select className="border rounded px-2 py-1" value={selectedWorker||""} onChange={e=>setSelectedWorker(e.target.value)}>
          {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>
      <div className="text-sm text-gray-500">(Map selection overrides sector)</div>
    </div>
  );
}