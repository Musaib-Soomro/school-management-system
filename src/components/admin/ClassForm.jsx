import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { X, Save, Loader2, AlertCircle } from 'lucide-react'

const ClassForm = ({ initialData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    academic_year: new Date().getFullYear().toString(),
    section: '',
    description: '',
    is_active: true,
    teacher_id: '', // For primary teacher assignment
    ...initialData
  })

  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingTeachers, setFetchingTeachers] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setFetchingTeachers(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'teacher')
        .eq('is_active', true)
        .order('full_name')
      
      if (error) throw error
      setTeachers(data)

      // If editing, find the current teacher assignment
      if (initialData?.id) {
        const { data: assignments, error: assignError } = await supabase
          .from('teacher_class_assignments')
          .select('teacher_profile_id')
          .eq('class_id', initialData.id)
          .limit(1)
        
        if (!assignError && assignments.length > 0) {
          setFormData(prev => ({ ...prev, teacher_id: assignments[0].teacher_profile_id }))
        }
      }
    } catch (err) {
      console.error('Error fetching teachers:', err)
    } finally {
      setFetchingTeachers(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Rule 4: Sanitise empty strings before sending to Supabase
    const cleanData = {
      name: formData.name.trim(),
      academic_year: formData.academic_year.trim(),
      section: formData.section?.trim() || null,
      description: formData.description?.trim() || null,
      is_active: formData.is_active,
    }

    try {
      let classId = initialData?.id

      if (classId) {
        // Update existing class
        const { error: updateError } = await supabase
          .from('classes')
          .update(cleanData)
          .eq('id', classId)
        
        if (updateError) throw updateError
      } else {
        // Insert new class
        const { data, error: insertError } = await supabase
          .from('classes')
          .insert(cleanData)
          .select()
          .single()
        
        if (insertError) throw insertError
        classId = data.id
      }

      // Handle teacher assignment
      if (formData.teacher_id) {
        // Upsert assignment (if exists, update; if not, insert)
        const { error: assignError } = await supabase
          .from('teacher_class_assignments')
          .upsert({
            class_id: classId,
            teacher_profile_id: formData.teacher_id
          }, { onConflict: 'teacher_profile_id, class_id' })
        
        if (assignError) throw assignError
      } else if (initialData?.id) {
        // If editing and cleared teacher, delete existing assignment
        await supabase
          .from('teacher_class_assignments')
          .delete()
          .eq('class_id', initialData.id)
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving class:', err)
      // Rule 5: Never use alert() for form error handling
      setError(err.message || 'An error occurred while saving the class.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData?.id ? 'Edit Class' : 'Create New Class'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Class Name *</label>
              <input
                required
                type="text"
                placeholder="e.g., Grade 10-A, Hifz Class"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Academic Year *</label>
              <input
                required
                type="text"
                placeholder="e.g., 2024-25"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Section (Optional)</label>
              <input
                type="text"
                placeholder="e.g., A, B, Boys, Girls"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Primary Teacher</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none appearance-none"
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                disabled={fetchingTeachers}
              >
                <option value="">-- No Teacher Assigned --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.full_name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
              <textarea
                rows="3"
                placeholder="Briefly describe the class focus..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="col-span-2 flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="is_active"
                className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-slate-700 cursor-pointer">
                Class is currently active
              </label>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-indigo-400"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {initialData?.id ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClassForm
