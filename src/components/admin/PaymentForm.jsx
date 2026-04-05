import { useState } from 'react'
import { X, AlertCircle, CreditCard } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Cheque', 'Online']

const formatMonth = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const PaymentForm = ({ feeRecord, onClose, onSaved }) => {
  const { profile } = useAuth()
  const [form, setForm] = useState({
    amount_paid: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'Cash',
    reference_no: '',
    notes: '',
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const paidSoFar = (feeRecord.payments || []).reduce((s, p) => s + Number(p.amount_paid), 0)
  const balance = Number(feeRecord.amount_due) - paidSoFar

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const amount = Number(form.amount_paid)
    if (!amount || amount <= 0) {
      setError('Payment amount must be greater than 0.')
      return
    }

    setSubmitting(true)
    const { error: dbError } = await supabase.from('payments').insert([{
      fee_record_id: feeRecord.id,
      amount_paid: amount,
      payment_date: form.payment_date,
      payment_method: form.payment_method || null,
      reference_no: form.reference_no || null,
      notes: form.notes || null,
      received_by_profile_id: profile?.id,
    }])
    setSubmitting(false)

    if (dbError) {
      setError(dbError.message)
    } else {
      onSaved()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Record Payment</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Fee record summary */}
        <div className="px-6 pt-5 pb-2">
          <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Month</span>
              <span className="font-bold text-slate-800">{formatMonth(feeRecord.billing_month)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Due</span>
              <span className="font-bold text-slate-800">PKR {Number(feeRecord.amount_due).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Paid So Far</span>
              <span className="font-bold text-emerald-600">PKR {paidSoFar.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-0.5">
              <span className="font-semibold text-slate-600">Balance</span>
              <span className="font-black text-red-600">PKR {balance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Amount Paid (PKR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount_paid}
              onChange={e => setForm(f => ({ ...f, amount_paid: e.target.value }))}
              placeholder={`e.g. ${balance.toLocaleString()}`}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.payment_date}
              onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Payment Method</label>
            <select
              value={form.payment_method}
              onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Reference No. (optional)</label>
            <input
              type="text"
              value={form.reference_no}
              onChange={e => setForm(f => ({ ...f, reference_no: e.target.value }))}
              placeholder="e.g. TXN-001234"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Notes (optional)</label>
            <input
              type="text"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any additional notes"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Saving...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm
