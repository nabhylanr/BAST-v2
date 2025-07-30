import React, { useState, useRef } from 'react';

const PDFFormFiller = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [formData, setFormData] = useState({
    namaNasabah: '',
    alamat: '',
    namaImplementor: '',
    tanggalHari: '',
    tanggalBulan: '',
    tanggalTahun: ''
  });
  
  const [attendees, setAttendees] = useState([
    { nama: '', instansiUnit: '', contact: '' }
  ]);
  
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const fileInputRef = useRef(null);

  const [basicCoordinates, setBasicCoordinates] = useState({
    namaNasabah: { x: 210, y: 700, page: 1 },
    alamat: { x: 210, y: 677, page: 1 },
    namaImplementor: { x: 210, y: 627, page: 1 },
    tanggalHari: { x: 210, y: 613, page: 1 },
    tanggalBulan: { x: 355, y: 613, page: 1 },
    tanggalTahun: { x: 470, y: 613, page: 1 }
  });

  const [attendeeCoordinates, setAttendeeCoordinates] = useState([
    { nama: { x: 95, y: 690, page: 3 }, instansiUnit: { x: 205, y: 690, page: 3 }, contact: { x: 290, y: 690, page: 3 } },
    { nama: { x: 95, y: 662, page: 3 }, instansiUnit: { x: 205, y: 662, page: 3 }, contact: { x: 290, y: 662, page: 3 } },
    { nama: { x: 95, y: 634, page: 3 }, instansiUnit: { x: 205, y: 634, page: 3 }, contact: { x: 290, y: 634, page: 3 } },
    { nama: { x: 95, y: 606, page: 3 }, instansiUnit: { x: 205, y: 606, page: 3 }, contact: { x: 290, y: 606, page: 3 } },
    { nama: { x: 95, y: 578, page: 3 }, instansiUnit: { x: 205, y: 578, page: 3 }, contact: { x: 290, y: 578, page: 3 } },
    { nama: { x: 95, y: 550, page: 3 }, instansiUnit: { x: 205, y: 550, page: 3 }, contact: { x: 290, y: 550, page: 3 } },
    { nama: { x: 95, y: 522, page: 3 }, instansiUnit: { x: 205, y: 522, page: 3 }, contact: { x: 290, y: 522, page: 3 } },
    { nama: { x: 95, y: 494, page: 3 }, instansiUnit: { x: 205, y: 494, page: 3 }, contact: { x: 290, y: 494, page: 3 } },
    { nama: { x: 95, y: 466, page: 3 }, instansiUnit: { x: 205, y: 466, page: 3 }, contact: { x: 290, y: 466, page: 3 } },
    { nama: { x: 95, y: 438, page: 3 }, instansiUnit: { x: 205, y: 438, page: 3 }, contact: { x: 290, y: 438, page: 3 } }
  ]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '24px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    icon: {
      width: '32px',
      height: '32px',
      color: '#4f46e5'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0
    },
    section: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    uploadArea: {
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      padding: '24px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.2s'
    },
    uploadIcon: {
      width: '48px',
      height: '48px',
      color: '#9ca3af',
      margin: '0 auto 16px'
    },
    hiddenInput: {
      display: 'none'
    },
    uploadButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    smallInput: {
      width: '100%',
      padding: '6px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    gridThree: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '12px'
    },
    gridFour: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: '8px'
    },
    numberInput: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '12px'
    },
    selectInput: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '12px',
      backgroundColor: 'white'
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px'
    },
    primaryButton: {
      flex: 1,
      backgroundColor: '#059669',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background-color 0.2s'
    },
    secondaryButton: {
      padding: '12px 24px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.2s'
    },
    disabledButton: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    previewSection: {
      marginTop: '24px'
    },
    iframe: {
      width: '100%',
      height: '400px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px'
    },
    infoCard: {
      backgroundColor: '#fefce8',
      border: '1px solid #fde047',
      borderRadius: '8px',
      padding: '16px'
    },
    infoTitle: {
      fontWeight: '500',
      color: '#a16207',
      marginBottom: '8px'
    },
    infoList: {
      fontSize: '14px',
      color: '#a16207',
      margin: 0,
      paddingLeft: '16px'
    },
    pageInfo: {
      backgroundColor: '#f3f4f6',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '8px'
    },
    coordinateGroup: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    },
    coordinateTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1f2937',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    dateContainer: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    dateLabel: {
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'center'
    },
    attendeeSection: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#fff'
    },
    attendeeHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    attendeeTitle: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    attendeeControls: {
      display: 'flex',
      gap: '8px'
    },
    iconButton: {
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    addButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    removeButton: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    attendeeGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '12px',
      marginBottom: '16px'
    },
    attendeeCoordinateSection: {
      backgroundColor: '#f8fafc',
      padding: '12px',
      borderRadius: '6px',
      marginTop: '12px'
    },
    coordSubtitle: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#64748b',
      marginBottom: '8px'
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      try {
        const { PDFDocument } = await import('https://cdn.skypack.dev/pdf-lib@^1.17.1');
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        setTotalPages(pages.length);
      } catch (error) {
        console.error('Error counting pages:', error);
        setTotalPages(0);
      }
    } else {
      alert('Please select a PDF file');
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAttendee = (index, field, value) => {
    setAttendees(prev => prev.map((attendee, i) => 
      i === index ? { ...attendee, [field]: value } : attendee
    ));
  };

  const addAttendee = () => {
    if (attendees.length < 10) {
      setAttendees(prev => [...prev, { nama: '', instansiUnit: '', contact: '' }]);
    }
  };

  const removeAttendee = (index) => {
    if (attendees.length > 1) {
      setAttendees(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateBasicCoordinates = (field, axis, value) => {
    setBasicCoordinates(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [axis]: axis === 'page' ? parseInt(value) : parseInt(value) || 0
      }
    }));
  };

  const updateAttendeeCoordinates = (attendeeIndex, field, axis, value) => {
    setAttendeeCoordinates(prev => prev.map((coord, i) => 
      i === attendeeIndex ? {
        ...coord,
        [field]: {
          ...coord[field],
          [axis]: axis === 'page' ? parseInt(value) : parseInt(value) || 0
        }
      } : coord
    ));
  };

  const handleGeneratePDF = async () => {
    const basicRequiredFields = ['namaNasabah', 'alamat', 'namaImplementor', 'tanggalHari', 'tanggalBulan', 'tanggalTahun'];
    const missingBasicFields = basicRequiredFields.filter(field => !formData[field].trim());
    
    const emptyAttendees = attendees.some(attendee => 
      !attendee.nama.trim() || !attendee.instansiUnit.trim() || !attendee.contact.trim()
    );
    
    if (!pdfFile || missingBasicFields.length > 0 || emptyAttendees) {
      alert('Please upload PDF and fill all required fields including all attendee information');
      return;
    }

    setIsProcessing(true);

    try {
      const { PDFDocument, rgb } = await import('https://cdn.skypack.dev/pdf-lib@^1.17.1');
      
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Validate basic coordinates
      for (const [field, coord] of Object.entries(basicCoordinates)) {
        const pageIndex = coord.page - 1;
        if (pageIndex >= pages.length || pageIndex < 0) {
          alert(`Halaman ${coord.page} untuk ${field} tidak tersedia! PDF ini hanya memiliki ${pages.length} halaman.`);
          setIsProcessing(false);
          return;
        }
      }
      
      // Add basic form data to PDF
      Object.entries(formData).forEach(([field, value]) => {
        if (value.trim()) {
          const coord = basicCoordinates[field];
          const page = pages[coord.page - 1];
          
          page.drawText(value, {
            x: coord.x,
            y: coord.y,
            size: 10,
            color: rgb(0, 0, 0),
          });
        }
      });
      
      // Add attendee data to PDF
      attendees.forEach((attendee, index) => {
        if (index < attendeeCoordinates.length) {
          const coords = attendeeCoordinates[index];
          
          // Add nama
          if (attendee.nama.trim()) {
            const page = pages[coords.nama.page - 1];
            page.drawText(attendee.nama, {
              x: coords.nama.x,
              y: coords.nama.y,
              size: 10,
              color: rgb(0, 0, 0),
            });
          }
          
          // Add instansi unit
          if (attendee.instansiUnit.trim()) {
            const page = pages[coords.instansiUnit.page - 1];
            page.drawText(attendee.instansiUnit, {
              x: coords.instansiUnit.x,
              y: coords.instansiUnit.y,
              size: 10,
              color: rgb(0, 0, 0),
            });
          }
          
          // Add contact
          if (attendee.contact.trim()) {
            const page = pages[coords.contact.page - 1];
            page.drawText(attendee.contact, {
              x: coords.contact.x,
              y: coords.contact.y,
              size: 10,
              color: rgb(0, 0, 0),
            });
          }
        }
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `filled-form-${Date.now()}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF. This might be due to browser limitations with external libraries.');
    }
    
    setIsProcessing(false);
  };

  const resetForm = () => {
    setPdfFile(null);
    setPdfUrl(null);
    setFormData({
      namaNasabah: '',
      alamat: '',
      namaImplementor: '',
      tanggalHari: '',
      tanggalBulan: '',
      tanggalTahun: ''
    });
    setAttendees([{ nama: '', instansiUnit: '', contact: '' }]);
    setTotalPages(0);
    setBasicCoordinates({
      namaNasabah: { x: 150, y: 700, page: 1 },
      alamat: { x: 150, y: 670, page: 1 },
      namaImplementor: { x: 150, y: 640, page: 1 },
      tanggalHari: { x: 150, y: 610, page: 1 },
      tanggalBulan: { x: 200, y: 610, page: 1 },
      tanggalTahun: { x: 280, y: 610, page: 1 }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generatePageOptions = () => {
    const options = [];
    for (let i = 1; i <= totalPages; i++) {
      options.push(
        <option key={i} value={i}>
          Hal {i}
        </option>
      );
    }
    return options;
  };

  const BasicCoordinateControl = ({ field, label, emoji }) => (
    <div style={styles.coordinateGroup}>
      <div style={styles.coordinateTitle}>
        <span>{emoji}</span>
        {label}
      </div>
      <div style={styles.gridFour}>
        <div>
          <label style={styles.label}>Halaman</label>
          <select
            value={basicCoordinates[field].page}
            onChange={(e) => updateBasicCoordinates(field, 'page', e.target.value)}
            style={styles.selectInput}
            disabled={totalPages === 0}
          >
            {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
          </select>
        </div>
        <div>
          <label style={styles.label}>X</label>
          <input
            type="number"
            value={basicCoordinates[field].x}
            onChange={(e) => updateBasicCoordinates(field, 'x', e.target.value)}
            style={styles.numberInput}
          />
        </div>
        <div>
          <label style={styles.label}>Y</label>
          <input
            type="number"
            value={basicCoordinates[field].y}
            onChange={(e) => updateBasicCoordinates(field, 'y', e.target.value)}
            style={styles.numberInput}
          />
        </div>
        <div>
          <label style={styles.label}>Preview</label>
          <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
            ({basicCoordinates[field].x}, {basicCoordinates[field].y})
          </div>
        </div>
      </div>
    </div>
  );

  const isFormComplete = () => {
    const basicComplete = Object.values(formData).every(val => val.trim());
    const attendeesComplete = attendees.every(attendee => 
      attendee.nama.trim() && attendee.instansiUnit.trim() && attendee.contact.trim()
    );
    return pdfFile && basicComplete && attendeesComplete;
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 style={styles.title}>PDF Form Filler - Multiple Attendees</h1>
          </div>
          
          {/* Upload Section */}
          <div style={styles.section}>
            <label style={styles.label}>Upload PDF Template</label>
            <div style={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
              <svg style={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={styles.hiddenInput}
              />
              <button style={styles.uploadButton}>Choose PDF File</button>
              {pdfFile && (
                <div>
                  <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                    Selected: {pdfFile.name}
                  </p>
                  {totalPages > 0 && (
                    <div style={styles.pageInfo}>
                      📄 Total halaman: {totalPages}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Basic Form Section */}
          <div style={styles.section}>
            <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: '#1f2937'}}>Profil Nasabah</h3>
            
            <div style={{marginBottom: '16px'}}>
              <label style={styles.label}>Nama Nasabah Company ID</label>
              <input
                type="text"
                value={formData.namaNasabah}
                onChange={(e) => updateFormData('namaNasabah', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={styles.label}>Alamat</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => updateFormData('alamat', e.target.value)}
                style={styles.input}
              />
            </div>
            
            <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: '#1f2937'}}>Profil Implementasi</h3>

            <div style={{marginBottom: '16px'}}>
              <label style={styles.label}>Nama Implementor</label>
              <input
                type="text"
                value={formData.namaImplementor}
                onChange={(e) => updateFormData('namaImplementor', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={styles.label}>Tanggal Implementasi</label>
              <div style={styles.dateContainer}>
                <div style={{flex: 1}}>
                  <input
                    type="text"
                    value={formData.tanggalHari}
                    onChange={(e) => updateFormData('tanggalHari', e.target.value)}
                    maxLength="2"
                    style={styles.smallInput}
                  />
                  <div style={styles.dateLabel}>Hari</div>
                </div>
                <div style={{flex: 1}}>
                  <input
                    type="text"
                    value={formData.tanggalBulan}
                    onChange={(e) => updateFormData('tanggalBulan', e.target.value)}
                    style={styles.smallInput}
                  />
                  <div style={styles.dateLabel}>Bulan</div>
                </div>
                <div style={{flex: 1}}>
                  <input
                    type="text"
                    value={formData.tanggalTahun}
                    onChange={(e) => updateFormData('tanggalTahun', e.target.value)}
                    maxLength="4"
                    style={styles.smallInput}
                  />
                  <div style={styles.dateLabel}>Tahun</div>
                </div>
              </div>
            </div>
          </div>
            
          {/* Attendees Section */}
          <div style={styles.section}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '500', color: '#1f2937', margin: 0}}>
                Informasi Kehadiran ({attendees.length}/10)
              </h3>
              <button
                onClick={addAttendee}
                disabled={attendees.length >= 10}
                style={{
                  ...styles.iconButton,
                  ...styles.addButton,
                  ...(attendees.length >= 10 ? styles.disabledButton : {})
                }}
                title="Tambah Peserta"
              >
                +
              </button>
            </div>

            {attendees.map((attendee, index) => (
              <div key={index} style={styles.attendeeSection}>
                <div style={styles.attendeeHeader}>
                  <div style={styles.attendeeTitle}>
                    Peserta {index + 1}
                  </div>
                  <div style={styles.attendeeControls}>
                    {attendees.length > 1 && (
                      <button
                        onClick={() => removeAttendee(index)}
                        style={{...styles.iconButton, ...styles.removeButton}}
                        title="Hapus Peserta"
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>

                {/* Fixed: 3 input fields for each attendee */}
                <div style={styles.attendeeGrid}>
                  <div>
                    <label style={styles.label}>Nama</label>
                    <input
                      type="text"
                      value={attendee.nama}
                      onChange={(e) => updateAttendee(index, 'nama', e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Instansi/Unit</label>
                    <input
                      type="text"
                      value={attendee.instansiUnit}
                      onChange={(e) => updateAttendee(index, 'instansiUnit', e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Contact</label>
                    <input
                      type="text"
                      value={attendee.contact}
                      onChange={(e) => updateAttendee(index, 'contact', e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                {/* Coordinate controls for this attendee */}
                <div style={styles.attendeeCoordinateSection}>
                  <div style={styles.coordSubtitle}>
                    Koordinat Baris {index + 1} (Nama - Instansi - Contact)
                  </div>
                  <div style={styles.gridThree}>
                    {/* Nama coordinates */}
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#4338ca'}}>Nama</div>
                      <div style={styles.gridFour}>
                        <select
                          value={attendeeCoordinates[index]?.nama.page || 1}
                          onChange={(e) => updateAttendeeCoordinates(index, 'nama', 'page', e.target.value)}
                          style={styles.selectInput}
                          disabled={totalPages === 0}
                        >
                          {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
                        </select>
                        <input
                          type="number"
                          value={attendeeCoordinates[index]?.nama.x || 150}
                          onChange={(e) => updateAttendeeCoordinates(index, 'nama', 'x', e.target.value)}
                          style={styles.numberInput}
                          placeholder="X"
                        />
                        <input
                          type="number"
                          value={attendeeCoordinates[index]?.nama.y || 580}
                          onChange={(e) => updateAttendeeCoordinates(index, 'nama', 'y', e.target.value)}
                          style={styles.numberInput}
                          placeholder="Y"
                        />
                        <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
                          ({attendeeCoordinates[index]?.nama.x || 150}, {attendeeCoordinates[index]?.nama.y || 580})
                        </div>
                      </div>
                    </div>

                    {/* Instansi coordinates */}
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#059669'}}>Instansi</div>
                      <div style={styles.gridFour}>
                        <select
                          value={attendeeCoordinates[index]?.instansiUnit.page || 1}
                          onChange={(e) => updateAttendeeCoordinates(index, 'instansiUnit', 'page', e.target.value)}
                          style={styles.selectInput}
                          disabled={totalPages === 0}
                        >
                          {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
                        </select>
                        <input
                          type="number"
                          value={attendeeCoordinates[index]?.instansiUnit.x || 250}
                          onChange={(e) => updateAttendeeCoordinates(index, 'instansiUnit', 'x', e.target.value)}
                          style={styles.numberInput}
                          placeholder="X"
                        />
                        <input
                          type="number"
                          value={attendeeCoordinates[index]?.instansiUnit.y || 580}
                          onChange={(e) => updateAttendeeCoordinates(index, 'instansiUnit', 'y', e.target.value)}
                          style={styles.numberInput}
                          placeholder="Y"
                        />
                        <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
                          ({attendeeCoordinates[index]?.instansiUnit.x || 250}, {attendeeCoordinates[index]?.instansiUnit.y || 580})
                        </div>
                      </div>
                    </div>

                    {/* Contact coordinates */}
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#dc2626'}}>Contact</div>
                      <div style={styles.gridFour}>
                        <select
                          value={attendeeCoordinates[index]?.contact.page || 1}
                          onChange={(e) => updateAttendeeCoordinates(index, 'contact', 'page', e.target.value)}
                          style={styles.selectInput}
                          disabled={totalPages === 0}
                        >
                          {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
                        </select>
                        <input
                          type="number"
                          value={attendeeCoordinates[index]?.contact.x || 400}
                          onChange={(e) => updateAttendeeCoordinates(index, 'contact', 'x', e.target.value)}
                          style={styles.numberInput}
                          placeholder="X"
                        />
                        <input
                          type="number"
                          value={attendeeCoordinates[index]?.contact.y || 580}
                          onChange={(e) => updateAttendeeCoordinates(index, 'contact', 'y', e.target.value)}
                          style={styles.numberInput}
                          placeholder="Y"
                        />
                        <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
                          ({attendeeCoordinates[index]?.contact.x || 400}, {attendeeCoordinates[index]?.contact.y || 580})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Basic Coordinate Controls */}
          <div style={styles.section}>
            <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: '#1f2937'}}>Koordinat Posisi Field Dasar</h3>
            
            <BasicCoordinateControl field="namaNasabah" label="Nama Nasabah" emoji="👤" />
            <BasicCoordinateControl field="alamat" label="Alamat" emoji="🏠" />
            <BasicCoordinateControl field="namaImplementor" label="Nama Implementor" emoji="⚡" />
            
            <div style={styles.coordinateGroup}>
              <div style={styles.coordinateTitle}>
                <span>📅</span>
                Tanggal Implementasi (3 Box Terpisah)
              </div>
              <div style={styles.gridThree}>
                <div>
                  <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#4338ca'}}>Hari</div>
                  <div style={styles.gridFour}>
                    <select
                      value={basicCoordinates.tanggalHari.page}
                      onChange={(e) => updateBasicCoordinates('tanggalHari', 'page', e.target.value)}
                      style={styles.selectInput}
                      disabled={totalPages === 0}
                    >
                      {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
                    </select>
                    <input
                      type="number"
                      value={basicCoordinates.tanggalHari.x}
                      onChange={(e) => updateBasicCoordinates('tanggalHari', 'x', e.target.value)}
                      style={styles.numberInput}
                      placeholder="X"
                    />
                    <input
                      type="number"
                      value={basicCoordinates.tanggalHari.y}
                      onChange={(e) => updateBasicCoordinates('tanggalHari', 'y', e.target.value)}
                      style={styles.numberInput}
                      placeholder="Y"
                    />
                    <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
                      ({basicCoordinates.tanggalHari.x}, {basicCoordinates.tanggalHari.y})
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#059669'}}>Bulan</div>
                  <div style={styles.gridFour}>
                    <select
                      value={basicCoordinates.tanggalBulan.page}
                      onChange={(e) => updateBasicCoordinates('tanggalBulan', 'page', e.target.value)}
                      style={styles.selectInput}
                      disabled={totalPages === 0}
                    >
                      {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
                    </select>
                    <input
                      type="number"
                      value={basicCoordinates.tanggalBulan.x}
                      onChange={(e) => updateBasicCoordinates('tanggalBulan', 'x', e.target.value)}
                      style={styles.numberInput}
                      placeholder="X"
                    />
                    <input
                      type="number"
                      value={basicCoordinates.tanggalBulan.y}
                      onChange={(e) => updateBasicCoordinates('tanggalBulan', 'y', e.target.value)}
                      style={styles.numberInput}
                      placeholder="Y"
                    />
                    <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
                      ({basicCoordinates.tanggalBulan.x}, {basicCoordinates.tanggalBulan.y})
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#dc2626'}}>Tahun</div>
                  <div style={styles.gridFour}>
                    <select
                      value={basicCoordinates.tanggalTahun.page}
                      onChange={(e) => updateBasicCoordinates('tanggalTahun', 'page', e.target.value)}
                      style={styles.selectInput}
                      disabled={totalPages === 0}
                    >
                      {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
                    </select>
                    <input
                      type="number"
                      value={basicCoordinates.tanggalTahun.x}
                      onChange={(e) => updateBasicCoordinates('tanggalTahun', 'x', e.target.value)}
                      style={styles.numberInput}
                      placeholder="X"
                    />
                    <input
                      type="number"
                      value={basicCoordinates.tanggalTahun.y}
                      onChange={(e) => updateBasicCoordinates('tanggalTahun', 'y', e.target.value)}
                      style={styles.numberInput}
                      placeholder="Y"
                    />
                    <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
                      ({basicCoordinates.tanggalTahun.x}, {basicCoordinates.tanggalTahun.y})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button
              onClick={handleGeneratePDF}
              disabled={!isFormComplete() || isProcessing}
              style={{
                ...styles.primaryButton,
                ...(!isFormComplete() || isProcessing ? styles.disabledButton : {})
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {isProcessing ? 'Processing...' : 'Generate & Download PDF'}
            </button>
            
            <button onClick={resetForm} style={styles.secondaryButton}>
              Reset
            </button>
          </div>

          {/* PDF Preview */}
          {pdfUrl && (
            <div style={styles.previewSection}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>
                Preview PDF Template
              </h3>
              <iframe src={pdfUrl} style={styles.iframe} title="PDF Preview" />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>Catatan Penting:</h3>
          <ul style={styles.infoList}>
            <li><strong>Upload PDF template</strong> - aplikasi akan mendeteksi jumlah halaman</li>
            <li><strong>Isi semua field dasar</strong> - nama nasabah, alamat, nama implementor, tanggal (3 box)</li>
            <li><strong>Tambah/hapus peserta</strong> - klik tombol + untuk menambah peserta (maksimal 10), tombol - untuk menghapus</li>
            <li><strong>Setiap peserta memiliki 3 field</strong> - nama, instansi unit, contact</li>
            <li><strong>Koordinat terpisah per peserta</strong> - setiap peserta punya koordinat nama, instansi, dan contact sendiri</li>
            <li><strong>10 baris tersedia</strong> - sesuai dengan format PDF yang memiliki 10 baris untuk kehadiran</li>
            <li><strong>Koordinat Y</strong> - dimulai dari bawah halaman (semakin tinggi nilai Y, semakin ke atas)</li>
            <li><strong>Koordinat X</strong> - dimulai dari kiri halaman (semakin tinggi nilai X, semakin ke kanan)</li>
            <li><strong>Preview koordinat</strong> - ditampilkan di sebelah kanan setiap field untuk memudahkan pengecekan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFFormFiller;