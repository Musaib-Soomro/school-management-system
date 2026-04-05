import { useState, useEffect } from 'react'
import { Plus, Users, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layouts/AdminLayout'
import StudentTable from '../../components/admin/StudentTable'
import StudentForm from '../../components/admin/StudentForm'

const StudentsPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Fetch students from Supabase
  const fetchStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('students')
        .select(`
          *,
          enrollments:student_class_enrollments(
            class:classes(id, name, academic_year)
          ),
          parent_links:parent_student_links(
            parent:profiles!parent_profile_id(id, full_name)
          )
        `)
        .order('created_at', { ascending: false })

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,admission_no.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setStudents(data || [])
    } catch (err) {
      console.error('Error fetching students:', err.message)
      setError('Failed to load students. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [searchTerm])

  const handleSaveStudent = async (formData) => {
    setIsSubmitting(true)
    setSaveError(null)

    // Sanitise: convert empty strings to null for optional DB fields
    const cleanData = {
      ...formData,
      date_of_birth: formData.date_of_birth || null,
      parent_notes: formData.parent_notes || null,
    }

    try {
      if (selectedStudent) {
        const { error } = await supabase
          .from('students')
          .update(cleanData)
          .eq('id', selectedStudent.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('students')
          .insert([cleanData])
        if (error) throw error
      }

      setIsFormOpen(false)
      setSelectedStudent(null)
      setSaveError(null)
      await fetchStudents()
    } catch (err) {
      console.error('Error saving student:', err.message)
      setSaveError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) return
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchStudents()
    } catch (err) {
      console.error('Error deleting student:', err.message)
      alert('Error deleting student: ' + err.message)
    }
  }

  const openAddForm = () => {
    setSelectedStudent(null)
    setSaveError(null)
    setIsFormOpen(true)
  }

  const openEditForm = (student) => {
    setSelectedStudent(student)
    setSaveError(null)
    setIsFormOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase">
              <Users className="w-4 h-4" />
              Academic Management
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Directory</h1>
            <p className="text-slate-500 max-w-lg">
              Manage your student body, track enrollment details, and maintain accurate registry records.
            </p>
          </div>
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0"
          >
            <Plus className="w-5 h-5" />
            Enroll New Student
          </button>
        </div>

        {/* Stats Section (Optional for WOW factor) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Students</p>
            <p className="text-4xl font-black text-slate-900 mt-1">{students.length}</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-bold">
              <RefreshCw className="w-4 h-4" />
              Synced with Live DB
            </div>
          </div>
          {/* Add more stats if possible later */}
        </div>

        {/* Alert Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 font-medium">
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={fetchStudents} className="ml-auto underline hover:no-underline px-2 py-1 rounded hover:bg-red-100 transition-colors">
              Try Again
            </button>
          </div>
        )}

        {/* List Section */}
        <StudentTable 
          students={students}
          loading={loading}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onEdit={openEditForm}
          onDelete={handleDeleteStudent}
        />

        {/* Form Modal */}
        <StudentForm
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setSaveError(null) }}
          onSave={handleSaveStudent}
          student={selectedStudent}
          loading={isSubmitting}
          error={saveError}
        />
      </div>
    </AdminLayout>
  )
}

export default StudentsPage
