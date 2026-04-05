import { useState } from 'react'
import { X, Receipt, Plus } from 'lucide-react'
import PaymentForm from './PaymentForm'

const STATUS_STYLES = {
  paid:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border border-amber-200',
  unpaid:  'bg-red-50 text-red-700 border border-red-200',
}

const formatMonth = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const FeeLedger = ({ feeRecord, onClose, onPaymentRecorded }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const payments = feeRecord.payments || []
  const paidSoFar = payments.reduce((s, p) => s + Number(p.amount_paid), 0)
  const balance = Number(feeRecord.amount_due) - paidSoFar

  if (showPaymentForm) {
    return (
      <PaymentForm
        feeRecord={feeRecord}
        onClose={() => setShowPaymentForm(false)}
        onSaved={onPaymentRecorded}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Receipt className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Payment History</h2>
              <p className="text-xs text-slate-500">{formatMonth(feeRecord.billing_month)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Summary */}
        <div className="px-6 pt-5 pb-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due</p>
              <p className="text-sm font-black text-slate-800 mt-0.5">PKR {Number(feeRecord.amount_due).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Collected</p>
              <p className="text-sm font-black text-emerald-700 mt-0.5">PKR {paidSoFar.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Balance</p>
              <p className="text-sm font-black text-red-700 mt-0.5">PKR {balance.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[feeRecord.status]}`}>
              {feeRecord.status}
            </span>
            {feeRecord.status !== 'paid' && (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Record Payment
              </button>
            )}
          </div>
        </div>

        {/* Payments list */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Receipt className="w-10 h-10" />
              <p className="text-sm font-medium">No payments recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((p, i) => (
                <div key={p.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Payment #{i + 1}</p>
                    <p className="font-bold text-slate-800">PKR {Number(p.amount_paid).toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDate(p.payment_date)} · {p.payment_method || 'Cash'}
                    </p>
                    {p.reference_no && (
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">Ref: {p.reference_no}</p>
                    )}
                    {p.notes && (
                      <p className="text-xs text-slate-400 mt-0.5">{p.notes}</p>
                    )}
                  </div>
                  <span className="text-emerald-500 text-xl font-black leading-none mt-0.5">✓</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeeLedger
