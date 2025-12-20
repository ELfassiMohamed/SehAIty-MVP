"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProviderSidebar } from "@/components/provider-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react"

const API_BASE_URL = "http://localhost:8080/api"

// Generate random ID
const generateRecordId = () => {
  return 'REC-' + Date.now()
}

export default function MedicalRecordsPage() {
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [records, setRecords] = useState([])
  const [patients, setPatients] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [modalMode, setModalMode] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    recordType: "",
    visitDate: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    medications: "",
    notes: ""
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    
    if (!userData || !token) {
      router.push("/auth/provider")
      return
    }
    
    const parsedUser = JSON.parse(userData)
    
    if (parsedUser.role !== "PROVIDER" && parsedUser.role !== "provider") {
      router.push("/")
      return
    }
    
    setUser(parsedUser)
    fetchData()
  }, [router])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([fetchPatients(), fetchRecords()])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/providers/patients/assigned`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      } else if (response.status === 401) {
        handleUnauthorized()
      } else {
        toast({
          title: "Error",
          description: "Failed to load patients",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      })
    }
  }

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/records`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRecords(data)
        setFilteredRecords(data)
      } else if (response.status === 401) {
        handleUnauthorized()
      } else {
        toast({
          title: "Error",
          description: "Failed to load records",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching records:", error)
      toast({
        title: "Error",
        description: "Failed to load medical records",
        variant: "destructive",
      })
    }
  }

  const fetchRecordById = async (recordId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        return await response.json()
      } else {
        toast({
          title: "Error",
          description: "Failed to load record details",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching record:", error)
      toast({
        title: "Error",
        description: "Failed to load record details",
        variant: "destructive",
      })
    }
    return null
  }

  const handleUnauthorized = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/provider")
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const filtered = records.filter((record) => {
        const patient = patients.find(p => p.id === record.patientId)
        return (
          patient?.firstName?.toLowerCase().includes(query) ||
          patient?.lastName?.toLowerCase().includes(query) ||
          patient?.email?.toLowerCase().includes(query) ||
          record.diagnosis?.toLowerCase().includes(query) ||
          record.recordType?.toLowerCase().includes(query)
        )
      })
      setFilteredRecords(filtered)
    } else {
      setFilteredRecords(records)
    }
  }, [searchQuery, records, patients])

  const getPatientInfo = (patientId) => {
    return patients.find((p) => p.id === patientId)
  }

  const getRecordTypeColor = (type) => {
    const colors = {
      consultation: "bg-blue-50 text-blue-700 border-blue-200",
      lab: "bg-purple-50 text-purple-700 border-purple-200",
      procedure: "bg-orange-50 text-orange-700 border-orange-200",
      vaccination: "bg-green-50 text-green-700 border-green-200",
      prescription: "bg-pink-50 text-pink-700 border-pink-200",
    }
    return colors[type?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const handleCreateRecord = (patient) => {
    setSelectedPatient(patient)
    setSelectedRecord(null)
    setFormData({
      recordType: "",
      visitDate: new Date().toISOString().split('T')[0],
      diagnosis: "",
      symptoms: "",
      treatment: "",
      medications: "",
      notes: ""
    })
    setModalMode("create")
  }

  const handleViewRecord = async (record) => {
    const fullRecord = await fetchRecordById(record.recordId)
    if (fullRecord) {
      const patient = getPatientInfo(fullRecord.patientId)
      setSelectedPatient(patient)
      setSelectedRecord(fullRecord)
      setModalMode("view")
    }
  }

  const handleEditRecord = async (record) => {
    const fullRecord = await fetchRecordById(record.recordId)
    if (fullRecord) {
      const patient = getPatientInfo(fullRecord.patientId)
      setSelectedPatient(patient)
      setSelectedRecord(fullRecord)
      
      // Parse content if it exists
      const content = fullRecord.content || {}
      
      setFormData({
        recordType: fullRecord.recordType || "",
        visitDate: fullRecord.visitDate ? fullRecord.visitDate.split('T')[0] : "",
        diagnosis: fullRecord.diagnosis || "",
        symptoms: content.symptoms || "",
        treatment: content.treatment || "",
        medications: content.medications || "",
        notes: content.notes || ""
      })
      setModalMode("edit")
    }
  }

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Record deleted successfully",
        })
        fetchRecords()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete record",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting record:", error)
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      })
    }
  }

  const handleSaveRecord = async () => {
    if (!formData.recordType || !formData.visitDate || !formData.diagnosis) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const token = localStorage.getItem("token")
      const userData = JSON.parse(localStorage.getItem("user"))
      
      // Build content object
      const content = {
        symptoms: formData.symptoms,
        treatment: formData.treatment,
        medications: formData.medications,
        notes: formData.notes
      }

      const recordData = {
        recordId: modalMode === "create" ? generateRecordId() : selectedRecord.recordId,
        patientId: selectedPatient.id,
        providerId: userData.providerId || userData.id,
        recordType: formData.recordType,
        visitDate: new Date(formData.visitDate).toISOString(),
        diagnosis: formData.diagnosis,
        content: content,
        createdAt: modalMode === "create" ? new Date().toISOString() : selectedRecord.createdAt,
        updatedAt: new Date().toISOString()
      }

      let response
      if (modalMode === "create") {
        // POST http://localhost:8080/api/providers/medical-records
        response = await fetch(`${API_BASE_URL}/providers/medical-records`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recordData),
        })
      } else if (modalMode === "edit") {
        // PUT http://localhost:8080/api/records/{recordId}
        response = await fetch(`${API_BASE_URL}/records/${selectedRecord.recordId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recordData),
        })
      }

      if (response.ok) {
        toast({
          title: "Success",
          description: modalMode === "create" ? "Record created successfully" : "Record updated successfully",
        })
        closeModal()
        fetchRecords()
      } else {
        const errorData = await response.json().catch(() => null)
        toast({
          title: "Error",
          description: errorData?.message || "Failed to save record",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving record:", error)
      toast({
        title: "Error",
        description: "Failed to save record",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedRecord(null)
    setSelectedPatient(null)
    setFormData({
      recordType: "",
      visitDate: "",
      diagnosis: "",
      symptoms: "",
      treatment: "",
      medications: "",
      notes: ""
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Group records by patient
  const recordsByPatient = filteredRecords.reduce((acc, record) => {
    const patient = getPatientInfo(record.patientId)
    if (!acc[record.patientId]) {
      acc[record.patientId] = { patient, records: [] }
    }
    acc[record.patientId].records.push(record)
    return acc
  }, {})

  if (!user || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <ProviderSidebar user={user} />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">Medical Records</h1>
            <p className="text-muted-foreground">Manage patient medical records and health history</p>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, email, diagnosis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Records by Patient */}
          {Object.keys(recordsByPatient).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(recordsByPatient).map(([patientId, { patient, records: patientRecords }]) => (
                <Card key={patientId}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {patient?.firstName} {patient?.lastName}
                        </CardTitle>
                        <CardDescription>{patient?.email}</CardDescription>
                      </div>
                      <Button onClick={() => handleCreateRecord(patient)} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Record
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patientRecords.map((record) => (
                        <div
                          key={record.recordId}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={getRecordTypeColor(record.recordType)}>
                                {record.recordType}
                              </Badge>
                              <div>
                                <p className="font-medium text-balance">{record.diagnosis}</p>
                                <p className="text-sm text-muted-foreground">{formatDate(record.visitDate)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="outline" size="icon" onClick={() => handleViewRecord(record)} title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditRecord(record)} title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteRecord(record.recordId)}
                              title="Delete"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchQuery ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No records found matching your search</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground mb-4">No medical records yet. Start by selecting a patient:</p>
                  <div className="grid gap-3 max-w-2xl mx-auto">
                    {patients.map((patient) => (
                      <Button
                        key={patient.id}
                        variant="outline"
                        className="justify-start h-auto py-3 bg-transparent"
                        onClick={() => handleCreateRecord(patient)}
                      >
                        <div className="text-left">
                          <p className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                        </div>
                        <Plus className="h-4 w-4 ml-auto" />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Modal */}
      <Dialog open={modalMode !== null} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create" && "Create Medical Record"}
              {modalMode === "edit" && "Edit Medical Record"}
              {modalMode === "view" && "View Medical Record"}
            </DialogTitle>
            <DialogDescription>
              {selectedPatient && `${selectedPatient.firstName} ${selectedPatient.lastName}`}
            </DialogDescription>
          </DialogHeader>

          {modalMode === "view" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Record Type</Label>
                  <p className="font-medium">{selectedRecord?.recordType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Visit Date</Label>
                  <p className="font-medium">{formatDate(selectedRecord?.visitDate)}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Diagnosis</Label>
                <p className="font-medium">{selectedRecord?.diagnosis}</p>
              </div>
              {selectedRecord?.content && (
                <>
                  {selectedRecord.content.symptoms && (
                    <div>
                      <Label className="text-muted-foreground">Symptoms</Label>
                      <p className="font-medium">{selectedRecord.content.symptoms}</p>
                    </div>
                  )}
                  {selectedRecord.content.treatment && (
                    <div>
                      <Label className="text-muted-foreground">Treatment</Label>
                      <p className="font-medium">{selectedRecord.content.treatment}</p>
                    </div>
                  )}
                  {selectedRecord.content.medications && (
                    <div>
                      <Label className="text-muted-foreground">Medications</Label>
                      <p className="font-medium">{selectedRecord.content.medications}</p>
                    </div>
                  )}
                  {selectedRecord.content.notes && (
                    <div>
                      <Label className="text-muted-foreground">Notes</Label>
                      <p className="font-medium">{selectedRecord.content.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recordType">Record Type *</Label>
                  <Select
                    value={formData.recordType}
                    onValueChange={(value) => setFormData({ ...formData, recordType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="lab">Lab Results</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitDate">Visit Date *</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <Input
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Enter diagnosis"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="Enter symptoms"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment</Label>
                <Textarea
                  id="treatment"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  placeholder="Enter treatment plan"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  placeholder="Enter prescribed medications"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter additional notes"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {modalMode === "view" ? (
              <>
                <Button variant="outline" onClick={closeModal}>Close</Button>
                <Button onClick={() => handleEditRecord(selectedRecord)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeModal}>Cancel</Button>
                <Button onClick={handleSaveRecord} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    modalMode === "create" ? "Create Record" : "Save Changes"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}