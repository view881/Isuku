import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Printer, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  X
} from 'lucide-react';
import { Order, FulfillmentStatus, PaymentStatus } from '../../types';

interface AdminOrdersProps {
  orders: Order[];
  onRefresh: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === 'all' || o.fulfillmentStatus === filterStatus;
    const matchQuery = !searchQuery ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.phone.includes(searchQuery) ||
      (o.customer.organizationName && o.customer.organizationName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchQuery;
  });

  const handleUpdateStatus = async (orderNumber: string, newStatus: FulfillmentStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote || `Status updated to ${newStatus.replace(/_/g, ' ')}`,
          actor: 'Operations Desk'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        setStatusNote('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const statuses: { label: string; value: string }[] = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending Confirmation', value: 'pending_confirmation' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Processing at Masoro', value: 'processing' },
    { label: 'Out for Delivery', value: 'out_for_delivery' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Order Fulfillment & Dispatch
          </h1>
          <p className="text-xs text-slate-500">
            Track customer shipments, update fulfillment milestones, verify payments, and export delivery notes.
          </p>
        </div>
        <div className="text-xs font-mono-nums font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Total Queue: {orders.length} Orders
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by order number (ISP-...), customer name, phone, hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {statuses.map(st => (
            <button
              key={st.value}
              onClick={() => setFilterStatus(st.value)}
              className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterStatus === st.value
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                <th className="py-3 px-4 font-semibold">Order #</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Total (RWF)</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Fulfillment</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono-nums font-bold text-slate-900">
                      #{ord.orderNumber}
                      <div className="text-[10px] text-slate-400 font-sans">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ord.customer.fullName}</div>
                      {ord.customer.organizationName && (
                        <div className="text-[11px] text-slate-600 font-medium">{ord.customer.organizationName}</div>
                      )}
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {ord.customer.district}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5 max-w-xs">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="text-[11px] text-slate-700 truncate">
                            {item.quantity}x {item.name} ({item.size})
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono-nums font-bold text-slate-900">
                      {ord.totalRwf.toLocaleString()} RWF
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-[11px] capitalize font-semibold text-slate-700">
                        {ord.paymentMethod.replace(/_/g, ' ')}
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${ord.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        ord.fulfillmentStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.fulfillmentStatus === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.fulfillmentStatus === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.fulfillmentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold cursor-pointer text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono-nums text-slate-400 block uppercase">Order Detail Management</span>
                <h2 className="text-lg font-bold font-mono-nums text-slate-900 font-heading">
                  #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer:</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrder.customer.fullName}</div>
                {selectedOrder.customer.organizationName && (
                  <div className="text-slate-700 font-medium">{selectedOrder.customer.organizationName}</div>
                )}
                <div className="text-slate-500 mt-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.customer.phone}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery Address:</span>
                <div className="text-slate-700 mt-0.5">{selectedOrder.customer.deliveryAddress}</div>
                <div className="text-emerald-800 font-semibold mt-0.5">{selectedOrder.customer.district}</div>
                {selectedOrder.customerNotes && (
                  <div className="text-[11px] text-amber-800 italic mt-1">Note: "{selectedOrder.customerNotes}"</div>
                )}
              </div>
            </div>

            {/* Itemized Snapshot */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                Purchased Snapshot
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden font-mono-nums">
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center bg-white">
                    <span className="font-sans font-medium text-slate-800">{i.quantity}x {i.name} ({i.size})</span>
                    <span className="font-bold text-slate-900">{i.subtotalRwf.toLocaleString()} RWF</span>
                  </div>
                ))}
                <div className="p-3 bg-slate-50 flex justify-between font-bold text-slate-900">
                  <span className="font-sans">Grand Total:</span>
                  <span className="text-emerald-800 text-sm">{selectedOrder.totalRwf.toLocaleString()} RWF</span>
                </div>
              </div>
            </div>

            {/* Status Transition Control */}
            <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                Transition Fulfillment Status
              </span>
              <div className="flex flex-wrap gap-2">
                {(['confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'] as FulfillmentStatus[]).map(st => (
                  <button
                    key={st}
                    disabled={updating || selectedOrder.fulfillmentStatus === st}
                    onClick={() => handleUpdateStatus(selectedOrder.orderNumber, st)}
                    className={`px-3 py-1.5 rounded-lg font-semibold capitalize cursor-pointer transition-colors ${
                      selectedOrder.fulfillmentStatus === st
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Set {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Optional milestone note (e.g. Dispatched with rider David on motorcycle RA-410)..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                Milestone History
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedOrder.timeline.map((evt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50">
                    <span className="font-semibold text-slate-800 capitalize">{evt.status.replace(/_/g, ' ')}: <span className="font-normal text-slate-600">{evt.note}</span></span>
                    <span className="text-[10px] text-slate-400 font-mono-nums shrink-0 ml-2">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
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
