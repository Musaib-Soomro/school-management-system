import { useState, useEffect, useMemo } from 'react'
import { Plus, CreditCard, AlertCircle, ChevronDown, RefreshCw, X, Search, BookOpen } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AdminLayout from '../../components/layouts/AdminLayout'
import FeeLedger from '../../components/admin/FeeLedger'
import PaymentForm from '../../components/admin/PaymentForm'

const STATUS_STYLES = {
  paid:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border border-amber-200',
  unpaid:  'bg-red-50 text-red-700 border border-red-200',
}

const formatMonth = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount || 0)

const EMPTY_FEE_FORM = { billing_month: '', amount_due: '', notes: '' }

const FeesPage = () => {
  const { profile } = useAuth()

  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [classes, setClasses] = useState([])
  const [classFilter, setClassFilter] = useState('')

  const [feeRecords, setFeeRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Add fee record form
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [feeForm, setFeeForm] = useState(EMPTY_FEE_FORM)
  const [feeFormError, setFeeFormError] = useState(null)
  const [feeFormSubmitting, setFeeFormSubmitting] = useState(false)

  // Sub-modals
  const [paymentFeeRecord, setPaymentFeeRecord] = useState(null)
  const [ledgerFeeRecord, setLedgerFeeRecord] = useState(null)

  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedStudentId) {
      fetchFeeRecords()
    } else {
      setFeeRecords([])
    }
  }, [selectedStudentId])

  const fetchStudents = async () => {
    setStudentsLoading(true)
    const { data } = await supabase
      .from('students')
      .select(`
        id, first_name, last_name, admission_no,
        enrollments:student_class_enrollments(class_id)
      `)
      .eq('is_active', true)
      .order('first_name')
    setStudents(data || [])
    setStudentsLoading(false)
  }

  const fetchClasses = async () => {
    const { data } = await supabase
      .from('classes')
      .select('id, name, academic_year')
      .eq('is_active', true)
      .order('name')
    setClasses(data || [])
  }

  const fetchFeeRecords = async () => {
    setLoading(true)
    setError(null)
    const { data, error: dbError } = await supabase
      .from('fee_records')
      .select(`
        *,
        payments(id, amount_paid, payment_date, payment_method, reference_no, notes)
      `)
      .eq('student_id', selectedStudentId)
      .order('billing_month', { ascending: false })

    if (dbError) {
      setError('Failed to load fee records. Please try again.')
    } else {
      setFeeRecords(data || [])
    }
    setLoading(false)
  }

  const handleAddFeeRecord = async (e) => {
    e.preventDefault()
    setFeeFormError(null)

    if (!feeForm.billing_month) {
      setFeeFormError('Billing month is required.')
      return
    }
    if (feeForm.amount_due === '' || Number(feeForm.amount_due) < 0) {
      setFeeFormError('Amount due must be 0 or more.')
      return
    }

    setFeeFormSubmitting(true)
    const { error: dbError } = await supabase.from('fee_records').insert([{
      student_id: selectedStudentId,
      billing_month: feeForm.billing_month + '-01',
      amount_due: Number(feeForm.amount_due),
      status: 'unpaid',
      notes: feeForm.notes || null,
      created_by_profile_id: profile?.id,
    }])
    setFeeFormSubmitting(false)

    if (dbError) {
      if (dbError.code === '23505') {
        setFeeFormError('A fee record for this month already exists for this student.')
      } else {
        setFeeFormError(dbError.message)
      }
    } else {
      setIsAddFormOpen(false)
      setFeeForm(EMPTY_FEE_FORM)
      fetchFeeRecords()
    }
  }

  const closeAddForm = () => {
    setIsAddFormOpen(false)
    setFeeForm(EMPTY_FEE_FORM)
    setFeeFormError(null)
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId)

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = !searchTerm ||
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.admission_no.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = !classFilter ||
        (s.enrollments || []).some(e => e.class_id === classFilter)
      return matchesSearch && matchesClass
    })
  }, [students, searchTerm, classFilter])
  const totalDue = feeRecords.reduce((sum, r) => sum + Number(r.amount_due), 0)
  const totalPaid = feeRecords.reduce(
    (sum, r) => sum + (r.payments || []).reduce((s, p) => s + Number(p.amount_paid), 0),
    0
  )
  const outstanding = totalDue - totalPaid
  const unpaidCount = feeRecords.filter(r => r.status !== 'paid').length

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase">
            <CreditCard className="w-4 h-4" />
            Finance
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fee Management</h1>
          <p className="text-slate-500 max-w-lg">
            Record monthly fee obligations and track payment history for each student.
          </p>
        </div>

        {/* Student selector */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-700">Find Student</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name or ADM no."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Class filter */}
            <div className="relative md:col-span-1">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={classFilter}
                onChange={e => { setClassFilter(e.target.value); setSelectedStudentId('') }}
                className="w-full appearance-none pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.academic_year})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Student dropdown */}
            <div className="relative md:col-span-1">
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                disabled={studentsLoading}
                className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60"
              >
                <option value="">
                  {studentsLoading
                    ? 'Loading...'
                    : filteredStudents.length === 0
                    ? 'No students match'
                    : `— Select student (${filteredStudents.length}) —`}
                </option>
                {filteredStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name} ({s.admission_no})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {(searchTerm || classFilter) && (
            <button
              onClick={() => { setSearchTerm(''); setClassFilter(''); setSelectedStudentId('') }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>

        {selectedStudentId && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Records</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{feeRecords.length}</p>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Due</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalDue)}</p>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Collected</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outstanding</p>
                <p className="text-2xl font-black text-red-600 mt-1">{formatCurrency(outstanding)}</p>
                {unpaidCount > 0 && (
                  <p className="text-xs text-red-400 mt-1 font-medium">{unpaidCount} record{unpaidCount > 1 ? 's' : ''} pending</p>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
                <button onClick={fetchFeeRecords} className="ml-auto underline hover:no-underline text-sm">
                  Try Again
                </button>
              </div>
            )}

            {/* Fee records table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">
                  Fee Records —{' '}
                  <span className="text-indigo-600">
                    {selectedStudent?.first_name} {selectedStudent?.last_name}
                  </span>
                </h2>
                <button
                  onClick={() => setIsAddFormOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Fee Record
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Loading...
                </div>
              ) : feeRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <CreditCard className="w-10 h-10" />
                  <p className="font-medium">No fee records yet.</p>
                  <p className="text-sm">Click "Add Fee Record" to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Billing Month</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Due</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Paid So Far</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feeRecords.map(record => {
                        const paidSoFar = (record.payments || []).reduce((s, p) => s + Number(p.amount_paid), 0)
                        const balance = Number(record.amount_due) - paidSoFar
                        return (
                          <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-800">{formatMonth(record.billing_month)}</td>
                            <td className="px-6 py-4 text-right text-slate-700">{formatCurrency(record.amount_due)}</td>
                            <td className="px-6 py-4 text-right text-emerald-700 font-medium">{formatCurrency(paidSoFar)}</td>
                            <td className="px-6 py-4 text-right font-bold">
                              {balance > 0 ? (
                                <span className="text-red-600">{formatCurrency(balance)}</span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[record.status]}`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {record.status !== 'paid' && (
                                  <button
                                    onClick={() => setPaymentFeeRecord(record)}
                                    className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
                                  >
                                    Record Payment
                                  </button>
                                )}
                                <button
                                  onClick={() => setLedgerFeeRecord(record)}
                                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                  History
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add fee record modal */}
      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">Add Fee Record</h2>
              <button onClick={closeAddForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddFeeRecord} className="p-6 space-y-5">
              <p className="text-sm text-slate-500">
                Student:{' '}
                <span className="font-bold text-slate-800">
                  {selectedStudent?.first_name} {selectedStudent?.last_name}
                </span>
              </p>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Billing Month <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={feeForm.billing_month}
                  onChange={e => setFeeForm(f => ({ ...f, billing_month: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Amount Due (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={feeForm.amount_due}
                  onChange={e => setFeeForm(f => ({ ...f, amount_due: e.target.value }))}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Notes (optional)</label>
                <input
                  type="text"
                  value={feeForm.notes}
                  onChange={e => setFeeForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="e.g. Monthly tuition fee"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {feeFormError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {feeFormError}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeAddForm}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={feeFormSubmitting}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                >
                  {feeFormSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record payment modal */}
      {paymentFeeRecord && (
        <PaymentForm
          feeRecord={paymentFeeRecord}
          onClose={() => setPaymentFeeRecord(null)}
          onSaved={() => { setPaymentFeeRecord(null); fetchFeeRecords() }}
        />
      )}

      {/* Payment history modal */}
      {ledgerFeeRecord && (
        <FeeLedger
          feeRecord={ledgerFeeRecord}
          onClose={() => setLedgerFeeRecord(null)}
          onPaymentRecorded={() => { setLedgerFeeRecord(null); fetchFeeRecords() }}
        />
      )}
    </AdminLayout>
  )
}

export default FeesPage
