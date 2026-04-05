import { useState, useEffect } from 'react'
import { X, Save, Calendar, UserPlus, Info, CheckCircle2, AlertCircle } from 'lucide-react'

const StudentForm = ({ isOpen, onClose, onSave, student = null, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'Other',
    parent_notes: '',
    is_active: true,
  })

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        date_of_birth: student.date_of_birth || '',
        gender: student.gender || 'Other',
        parent_notes: student.parent_notes || '',
        is_active: student.is_active ?? true,
      })
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'Other',
        parent_notes: '',
        is_active: true,
      })
    }
  }, [student, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {student ? 'Edit Student' : 'Enroll New Student'}
              </h2>
              <p className="text-sm text-slate-500">
                {student ? 'Update existing student details' : 'Fill in the details to register a new student'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {/* Auto-gen Notice */}
            {!student && (
              <div className="flex items-start gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-indigo-900">Admission Number</p>
                  <p className="text-indigo-700/80">Will be automatically generated: ADM-{new Date().getFullYear()}-XXXX</p>
                </div>
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">First Name</label>
                <input
                  required
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="e.g., Abdullah"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Last Name</label>
                <input
                  required
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="e.g., Omar"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* DOB & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Parent Notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Parent/Admin Notes</label>
              <textarea
                name="parent_notes"
                value={formData.parent_notes}
                onChange={handleChange}
                rows="3"
                placeholder="Important information about medical conditions, family, etc."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              ></textarea>
            </div>

            {/* Status Switch */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-1 rounded-full ${formData.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Active Status</p>
                  <p className="text-xs text-slate-500">Students must be active to appear in attendance sheets.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  className="sr-only peer"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {student ? 'Update Record' : 'Enroll Student'}
                </>
              )}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentForm
