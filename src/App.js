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
  
  const signatureCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState(null);

  const [basicCoordinates, setBasicCoordinates] = useState({
    namaNasabah: { x: 210, y: 700, page: 1 },
    alamat: { x: 210, y: 677, page: 1 },
    namaImplementor: { x: 210, y: 627, page: 1 },
    tanggalHari: { x: 210, y: 613, page: 1 },
    tanggalBulan: { x: 355, y: 613, page: 1 },
    tanggalTahun: { x: 470, y: 613, page: 1 },
    signature: { x: 100, y: 220, page: 1 }
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
      backgroundColor: '#fafafa',
      padding: '32px 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    wrapper: {
      maxWidth: '1024px',
      margin: '0 auto'
    },
    mainCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 0 0 1px #dedede',
      border: '0.5px solid #dedede',
      overflow: 'hidden'
    },
    header: {
      padding: '24px 32px',
      borderBottom: '1px solid #dedede',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    iconContainer: {
      width: '40px',
      height: '40px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    icon: {
      width: '24px',
      height: '24px',
      color: '#000'
    },
    headerText: {
      flex: 1
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#000',
      margin: 0,
      lineHeight: '1.2'
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      margin: '4px 0 0 0'
    },
    content: {
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    sectionCard: {
      backgroundColor: '#ffffffff',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #dedede'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#000',
      margin: '0 0 16px 0'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#222',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #dedede',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#fff',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
      boxSizing: 'border-box',
      color: '#000'
    },
    inputFocus: {
      borderColor: '#dedede',
      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)'
    },
    grid: {
      display: 'grid',
      gap: '16px'
    },
    gridCols2: {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    gridCols3: {
      gridTemplateColumns: 'repeat(3, 1fr)'
    },
    uploadArea: {
      border: '2px dashed #dedede',
      borderRadius: '8px',
      padding: '32px',
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: '#fafafa',
      transition: 'border-color 0.2s'
    },
    uploadIcon: {
      width: '48px',
      height: '48px',
      color: '#888',
      margin: '0 auto 16px'
    },
    uploadButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 16px',
      border: '1px solid #dedede',
      borderRadius: '6px',
      backgroundColor: '#fff',
      color: '#000',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    uploadInfo: {
      fontSize: '14px',
      color: '#666',
      marginTop: '8px'
    },
    fileInfo: {
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#eee',
      borderRadius: '6px'
    },
    fileInfoText: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#000',
      margin: 0
    },
    dateContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px'
    },
    dateInput: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #dedede',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#fff',
      textAlign: 'center',
      outline: 'none',
      boxSizing: 'border-box',
      color: '#000'
    },
    dateLabel: {
      fontSize: '12px',
      color: '#666',
      textAlign: 'center',
      marginTop: '4px'
    },
    attendeesHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    attendeeCard: {
      backgroundColor: '#fff',
      border: '1px solid #dedede',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    },
    attendeeHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    attendeeTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#000',
      margin: 0
    },
    buttonPrimary: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: '#000',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    buttonDanger: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 8px',
      backgroundColor: '#f0f0f0',
      color: '#000',
      border: '1px solid #dedede',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    buttonDisabled: {
      backgroundColor: '#dedede',
      cursor: 'not-allowed',
      color: '#666'
    },
    actionButtons: {
      display: 'flex',
      gap: '16px',
      paddingTop: '24px',
      borderTop: '1px solid #dedede'
    },
    buttonLarge: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '700',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      gap: '8px'
    },
    buttonLargePrimary: {
      backgroundColor: '#000',
      color: '#fff',
      border: 'none'
    },
    buttonLargeSecondary: {
      backgroundColor: '#fff',
      color: '#000',
      border: '1px solid #dedede'
    },
    preview: {
      paddingTop: '24px',
      borderTop: '1px solid #dedede'
    },
    iframe: {
      width: '100%',
      height: '384px',
      border: '1px solid #dedede',
      borderRadius: '8px'
    },
    infoCard: {
      marginTop: '24px',
      backgroundColor: '#fef2f2', 
      border: '1px solid #fecaca', 
      borderRadius: '8px',
      padding: '24px'
    },
    infoTitle: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#991b1b',
      margin: '0 0 12px 0'
    },
    infoList: {
      fontSize: '14px',
      color: '#991b1b',
      margin: 0,
      paddingLeft: 0,
      listStyle: 'none'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '8px'
    },
    bullet: {
      fontWeight: '500',
      marginRight: '8px'
    },
    hiddenInput: {
      display: 'none'
    },
    signatureContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    signatureCanvas: {
      border: '2px solid #dedede',
      borderRadius: '8px',
      cursor: 'crosshair',
      backgroundColor: '#fff'
    },
    signatureButtons: {
      display: 'flex',
      gap: '8px'
    },
    signaturePreview: {
      marginTop: '12px',
      padding: '12px',
      backgroundColor: '#f9f9f9',
      borderRadius: '6px',
      border: '1px solid #dedede'
    }
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = signatureCanvasRef.current;
      const signatureDataUrl = canvas.toDataURL();
      setSignatureData(signatureDataUrl);
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
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
      
      for (const [field, coord] of Object.entries(basicCoordinates)) {
        const pageIndex = coord.page - 1;
        if (pageIndex >= pages.length || pageIndex < 0) {
          alert(`Halaman ${coord.page} untuk ${field} tidak tersedia! PDF ini hanya memiliki ${pages.length} halaman.`);
          setIsProcessing(false);
          return;
        }
      }
      
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
      
      if (signatureData) {
        const signatureCoord = basicCoordinates.signature;
        const page = pages[signatureCoord.page - 1];
        
        const signatureImage = await pdfDoc.embedPng(signatureData);
        
        page.drawImage(signatureImage, {
          x: signatureCoord.x,
          y: signatureCoord.y,
          width: 150,
          height: 50,
        });
      }
      
      attendees.forEach((attendee, index) => {
        if (index < attendeeCoordinates.length) {
          const coords = attendeeCoordinates[index];
          
          if (attendee.nama.trim()) {
            const page = pages[coords.nama.page - 1];
            page.drawText(attendee.nama, {
              x: coords.nama.x,
              y: coords.nama.y,
              size: 10,
              color: rgb(0, 0, 0),
            });
          }
          
          if (attendee.instansiUnit.trim()) {
            const page = pages[coords.instansiUnit.page - 1];
            page.drawText(attendee.instansiUnit, {
              x: coords.instansiUnit.x,
              y: coords.instansiUnit.y,
              size: 10,
              color: rgb(0, 0, 0),
            });
          }
          
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
      tanggalTahun: { x: 280, y: 610, page: 1 },
      signature: { x: 400, y: 200, page: 1 }
    });
    setSignatureData(null);
    clearSignature();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        <div style={styles.mainCard}>
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div style={styles.headerText}>
              <h1 style={styles.title}>PDF Form Filler</h1>
              <p style={styles.subtitle}>Fill and generate PDF forms with multiple attendees</p>
            </div>
          </div>

          <div style={styles.content}>
            <div style={styles.section}>
              <label style={styles.sectionTitle}>Upload PDF Template</label>
              <div 
                style={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg style={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  style={styles.hiddenInput}
                />
                <div>
                  <button style={styles.uploadButton}>
                    Choose PDF File
                  </button>
                  <p style={styles.uploadInfo}>or drag and drop</p>
                </div>
                {pdfFile && (
                  <div style={styles.fileInfo}>
                    <p style={styles.fileInfoText}>
                      📁 {pdfFile.name}
                    </p>
                    {totalPages > 0 && (
                      <p style={{...styles.fileInfoText, marginTop: '4px'}}>
                        📄 Total pages: {totalPages}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {pdfUrl && (
              <div style={styles.preview}>
                <h3 style={styles.sectionTitle}>PDF Preview</h3>
                <iframe 
                  src={pdfUrl} 
                  style={styles.iframe}
                  title="PDF Preview" 
                />
              </div>
            )}

            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>Customer Profile</h3>
              <div style={{...styles.grid, ...styles.gridCols2}}>
                <div>
                  <label style={styles.label}>Customer Name</label>
                  <input
                    type="text"
                    value={formData.namaNasabah}
                    onChange={(e) => updateFormData('namaNasabah', e.target.value)}
                    style={styles.input}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label style={styles.label}>Address</label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => updateFormData('alamat', e.target.value)}
                    style={styles.input}
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>Implementation Profile</h3>
              <div style={styles.section}>
                <div>
                  <label style={styles.label}>Implementor Name</label>
                  <input
                    type="text"
                    value={formData.namaImplementor}
                    onChange={(e) => updateFormData('namaImplementor', e.target.value)}
                    style={styles.input}
                    placeholder="Enter implementor name"
                  />
                </div>
                <div>
                  <label style={styles.label}>Implementation Date</label>
                  <div style={styles.dateContainer}>
                    <div>
                      <input
                        type="text"
                        value={formData.tanggalHari}
                        onChange={(e) => updateFormData('tanggalHari', e.target.value)}
                        maxLength="2"
                        style={styles.dateInput}
                        placeholder="DD"
                      />
                      <p style={styles.dateLabel}>Day</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.tanggalBulan}
                        onChange={(e) => updateFormData('tanggalBulan', e.target.value)}
                        style={styles.dateInput}
                        placeholder="MM"
                      />
                      <p style={styles.dateLabel}>Month</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.tanggalTahun}
                        onChange={(e) => updateFormData('tanggalTahun', e.target.value)}
                        maxLength="4"
                        style={styles.dateInput}
                        placeholder="YYYY"
                      />
                      <p style={styles.dateLabel}>Year</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>Digital Signature</h3>
              <div style={styles.signatureContainer}>
                <label style={styles.label}>Draw your signature below:</label>
                <canvas
                  ref={signatureCanvasRef}
                  width={900}
                  height={150}
                  style={styles.signatureCanvas}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div style={styles.signatureButtons}>
                  <button
                    onClick={clearSignature}
                    style={styles.buttonDanger}
                  >
                    <svg style={{width: '12px', height: '12px', marginRight: '4px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Signature
                  </button>
                </div>
                {signatureData && (
                  <div style={styles.signaturePreview}>
                    <p style={{...styles.label, margin: '0 0 8px 0'}}>Signature Preview:</p>
                    <img src={signatureData} alt="Signature preview" style={{maxWidth: '200px', border: '1px solid #dedede', borderRadius: '4px'}} />
                  </div>
                )}
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.attendeesHeader}>
                <h3 style={styles.sectionTitle}>
                  Attendees Information ({attendees.length}/10)
                </h3>
                <button
                  onClick={addAttendee}
                  disabled={attendees.length >= 10}
                  style={{
                    ...styles.buttonPrimary,
                    ...(attendees.length >= 10 ? styles.buttonDisabled : {})
                  }}
                >
                  <svg style={{width: '16px', height: '16px', marginRight: '4px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Attendee
                </button>
              </div>

              <div style={styles.section}>
                {attendees.map((attendee, index) => (
                  <div key={index} style={styles.attendeeCard}>
                    <div style={styles.attendeeHeader}>
                      <h4 style={styles.attendeeTitle}>Attendee {index + 1}</h4>
                      {attendees.length > 1 && (
                        <button
                          onClick={() => removeAttendee(index)}
                          style={styles.buttonDanger}
                        >
                          <svg style={{width: '12px', height: '12px', marginRight: '4px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>

                    <div style={{...styles.grid, ...styles.gridCols3}}>
                      <div>
                        <label style={styles.label}>Name</label>
                        <input
                          type="text"
                          value={attendee.nama}
                          onChange={(e) => updateAttendee(index, 'nama', e.target.value)}
                          style={styles.input}
                          placeholder="Enter name"
                        />
                      </div>
                      <div>
                        <label style={styles.label}>Institution/Unit</label>
                        <input
                          type="text"
                          value={attendee.instansiUnit}
                          onChange={(e) => updateAttendee(index, 'instansiUnit', e.target.value)}
                          style={styles.input}
                          placeholder="Enter institution"
                        />
                      </div>
                      <div>
                        <label style={styles.label}>Contact</label>
                        <input
                          type="text"
                          value={attendee.contact}
                          onChange={(e) => updateAttendee(index, 'contact', e.target.value)}
                          style={styles.input}
                          placeholder="Enter contact"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.actionButtons}>
              <button
                onClick={handleGeneratePDF}
                disabled={!isFormComplete() || isProcessing}
                style={{
                  ...styles.buttonLarge,
                  ...styles.buttonLargePrimary,
                  ...(!isFormComplete() || isProcessing ? styles.buttonDisabled : {})
                }}
              >
                <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isProcessing ? 'Processing...' : 'Generate & Download PDF'}
              </button>
              
              <button 
                onClick={resetForm} 
                style={{
                  ...styles.buttonLarge,
                  ...styles.buttonLargeSecondary
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>Important Notes</h3>
          <ul style={styles.infoList}>
            <li style={styles.infoItem}>
              <span style={styles.bullet}>•</span>
              <span><strong>Upload PDF template</strong> - The application will automatically detect the number of pages</span>
            </li>
            <li style={styles.infoItem}>
              <span style={styles.bullet}>•</span>
              <span><strong>Fill all basic fields</strong> - Customer name, address, implementor name, date (3 boxes)</span>
            </li>
            <li style={styles.infoItem}>
              <span style={styles.bullet}>•</span>
              <span><strong>Draw digital signature</strong> - Use mouse to draw your signature on the canvas, click "Clear Signature" to redraw</span>
            </li>
            <li style={styles.infoItem}>
              <span style={styles.bullet}>•</span>
              <span><strong>Add/remove attendees</strong> - Click + button to add attendees (max 10), - button to remove</span>
            </li>
            <li style={styles.infoItem}>
              <span style={styles.bullet}>•</span>
              <span><strong>Each attendee has 3 fields</strong> - Name, institution/unit, contact</span>
            </li>
            <li style={styles.infoItem}>
              <span style={styles.bullet}>•</span>
              <span><strong>Separate coordinates per attendee</strong> - Each attendee has their own coordinates for name, institution, and contact</span>
            </li>
            <li style={styles.infoItem}>
              <span style={styles.bullet}>•</span>
              <span><strong>10 rows available</strong> - According to the PDF format which has 10 rows for attendance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFFormFiller;