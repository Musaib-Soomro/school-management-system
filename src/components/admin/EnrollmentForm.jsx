import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { X, Search, Check, Plus, Loader2, AlertCircle } from 'lucide-react'

const EnrollmentForm = ({ classId, existingStudentIds, onClose, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const searchTimeout = useRef(null)

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
      searchTimeout.current = setTimeout(() => {
        handleSearch()
      }, 300)
    } else {
      setSearchResults([])
    }
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current) }
  }, [searchTerm])

  const handleSearch = async () => {
    try {
      setSearching(true)
      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name, admission_no')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,admission_no.ilike.%${searchTerm}%`)
        .eq('is_active', true)
        .limit(10)
      
      if (error) throw error
      setSearchResults(data)
    } catch (err) {
      console.error('Error searching students:', err)
    } finally {
      setSearching(false)
    }
  }

  const handleEnroll = async (studentId) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('student_class_enrollments')
        .insert({
          class_id: classId,
          student_id: studentId
        })
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('Student is already enrolled in this class.')
        }
        throw error
      }
      
      // Update local state to show 'Enrolled'
      setSearchResults(prev => prev.map(s => s.id === studentId ? { ...s, enrolled: true } : s))
      onSuccess()
    } catch (err) {
      console.error('Error enrolling student:', err)
      // Rule 5: Never use alert() for form error handling
      setError(err.message || 'Failed to enroll student.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Enroll Student</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search by name or admission no..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden min-h-[300px] bg-slate-50/30">
              {searching ? (
                <div className="p-20 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  <p className="text-sm font-medium text-slate-400">Searching students...</p>
                </div>
              ) : searchTerm && searchResults.length === 0 ? (
                <div className="p-20 text-center text-slate-500 italic">
                  No students found matching "{searchTerm}".
                </div>
              ) : !searchTerm ? (
                <div className="p-20 text-center text-slate-400 flex flex-col items-center gap-3">
                  <div className="p-4 bg-slate-100 rounded-full">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium">Type to search students...</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {searchResults.map((s) => {
                    const isAlreadyEnrolled = existingStudentIds.includes(s.id) || s.enrolled
                    return (
                      <div key={s.id} className="flex items-center justify-between p-4 hover:bg-white transition-colors group">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{s.first_name} {s.last_name}</span>
                          <span className="text-xs font-mono text-slate-500 uppercase tracking-tighter">{s.admission_no}</span>
                        </div>
                        {isAlreadyEnrolled ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold ring-1 ring-emerald-500/10">
                            <Check className="w-3.5 h-3.5" />
                            Enrolled
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEnroll(s.id)}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:bg-indigo-400"
                          >
                            <Plus className="w-4 h-4" />
                            Enroll
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-all"
          >
            Finished
          </button>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentForm
