import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Building2, MessageSquare, CheckCircle, Clock, Plus, Tag } from 'lucide-react';
import { Lead, LeadStatus } from '../../types';

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (leadId: string, status: LeadStatus) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchLeads();
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (leadId: string) => {
    if (!newNote.trim() || !selectedLead) return;
    const updatedNotes = [...(selectedLead.notes || []), newNote.trim()];
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
      setSelectedLead({ ...selectedLead, notes: updatedNotes });
      setNewNote('');
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Sales Pipeline & Lead CRM
          </h1>
          <p className="text-xs text-slate-500">
            Qualified contacts automatically captured from the AI Sales Agent, wholesale quotation forms, and direct customer interactions.
          </p>
        </div>
        <div className="text-xs font-mono-nums font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          {leads.length} Tracked Leads
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                <th className="py-3 px-4 font-semibold">Contact / Business</th>
                <th className="py-3 px-4 font-semibold">Customer Type</th>
                <th className="py-3 px-4 font-semibold">Volume Requirement</th>
                <th className="py-3 px-4 font-semibold">Source</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{l.name}</div>
                    {l.organization && (
                      <div className="text-[11px] text-slate-700 font-medium">{l.organization}</div>
                    )}
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono-nums">
                      <Phone className="w-3 h-3 text-slate-400" /> {l.phone}
                    </div>
                  </td>

                  <td className="py-3 px-4 capitalize font-medium text-slate-700">
                    {l.customerType.replace(/_/g, ' ')}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{l.estimatedVolume || 'General inquiry'}</div>
                    {l.interestProduct && (
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{l.interestProduct}</div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                      {l.source.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={l.status}
                      onChange={(e: any) => handleUpdateStatus(l.id, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer border ${
                        l.status === 'converted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : l.status === 'qualified'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : l.status === 'lost'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLead(l)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded font-semibold cursor-pointer"
                    >
                      Follow-up
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Follow-Up Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lead Profile</span>
                <h3 className="text-base font-bold text-slate-900 font-heading">{selectedLead.name}</h3>
                {selectedLead.organization && (
                  <div className="text-xs text-emerald-800 font-medium">{selectedLead.organization}</div>
                )}
              </div>
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedLead.name)}%2C%20following%20up%20from%20Isuku%20Pure%20Sales.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>

            {/* Existing Notes */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Activity & Interaction Logs
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                      {note}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 italic">No notes logged yet.</div>
                )}
              </div>
            </div>

            {/* Add note */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <label className="font-semibold text-slate-700 block">Add Follow-up Note:</label>
              <textarea
                rows={2}
                placeholder="e.g. Called client; sent price card for 6x 20L jerrycans..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
              />
              <button
                onClick={() => handleAddNote(selectedLead.id)}
                disabled={!newNote.trim()}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                Save Activity Note
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
