import React, { useState, useRef } from 'react';

const PDFFormFiller = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [formData, setFormData] = useState({
    namaNasabah: '',
    alamat: '',
    namaImplementor: '',
    tanggalHari: '',
    tanggalBulan: '',
    tanggalTahun: '',
    nama: '',
    instansiUnit: '',
    contact: ''
  });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const fileInputRef = useRef(null);

  // Koordinat untuk setiap field
  const [coordinates, setCoordinates] = useState({
    namaNasabah: { x: 150, y: 700, page: 1 },
    alamat: { x: 150, y: 670, page: 1 },
    namaImplementor: { x: 150, y: 640, page: 1 },
    tanggalHari: { x: 150, y: 610, page: 1 },
    tanggalBulan: { x: 200, y: 610, page: 1 },
    tanggalTahun: { x: 280, y: 610, page: 1 },
    nama: { x: 150, y: 580, page: 1 },
    instansiUnit: { x: 150, y: 550, page: 1 },
    contact: { x: 150, y: 520, page: 1 }
  });

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

  const updateCoordinates = (field, axis, value) => {
    setCoordinates(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [axis]: axis === 'page' ? parseInt(value) : parseInt(value) || 0
      }
    }));
  };

  const handleGeneratePDF = async () => {
    const requiredFields = ['namaNasabah', 'alamat', 'namaImplementor', 'tanggalHari', 'tanggalBulan', 'tanggalTahun', 'nama', 'instansiUnit', 'contact'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (!pdfFile || missingFields.length > 0) {
      alert('Please upload PDF and fill all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      const { PDFDocument, rgb } = await import('https://cdn.skypack.dev/pdf-lib@^1.17.1');
      
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Validate all pages
      for (const [field, coord] of Object.entries(coordinates)) {
        const pageIndex = coord.page - 1;
        if (pageIndex >= pages.length || pageIndex < 0) {
          alert(`Halaman ${coord.page} untuk ${field} tidak tersedia! PDF ini hanya memiliki ${pages.length} halaman.`);
          setIsProcessing(false);
          return;
        }
      }
      
      // Add text to PDF
      Object.entries(formData).forEach(([field, value]) => {
        if (value.trim()) {
          const coord = coordinates[field];
          const page = pages[coord.page - 1];
          
          page.drawText(value, {
            x: coord.x,
            y: coord.y,
            size: 10,
            color: rgb(0, 0, 0),
          });
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
      tanggalTahun: '',
      nama: '',
      instansiUnit: '',
      contact: ''
    });
    setTotalPages(0);
    setCoordinates({
      namaNasabah: { x: 150, y: 700, page: 1 },
      alamat: { x: 150, y: 670, page: 1 },
      namaImplementor: { x: 150, y: 640, page: 1 },
      tanggalHari: { x: 150, y: 610, page: 1 },
      tanggalBulan: { x: 200, y: 610, page: 1 },
      tanggalTahun: { x: 280, y: 610, page: 1 },
      nama: { x: 150, y: 580, page: 1 },
      instansiUnit: { x: 150, y: 550, page: 1 },
      contact: { x: 150, y: 520, page: 1 }
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

  const CoordinateControl = ({ field, label, emoji }) => (
    <div style={styles.coordinateGroup}>
      <div style={styles.coordinateTitle}>
        <span>{emoji}</span>
        {label}
      </div>
      <div style={styles.gridFour}>
        <div>
          <label style={styles.label}>Halaman</label>
          <select
            value={coordinates[field].page}
            onChange={(e) => updateCoordinates(field, 'page', e.target.value)}
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
            value={coordinates[field].x}
            onChange={(e) => updateCoordinates(field, 'x', e.target.value)}
            style={styles.numberInput}
          />
        </div>
        <div>
          <label style={styles.label}>Y</label>
          <input
            type="number"
            value={coordinates[field].y}
            onChange={(e) => updateCoordinates(field, 'y', e.target.value)}
            style={styles.numberInput}
          />
        </div>
        <div>
          <label style={styles.label}>Preview</label>
          <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
            ({coordinates[field].x}, {coordinates[field].y})
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 style={styles.title}>PDF Form Filler - Extended</h1>
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

          {/* Form Section */}
          <div style={styles.section}>
            <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: '#1f2937'}}>Data yang akan diisi</h3>
            
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Nama Nasabah</label>
                <input
                  type="text"
                  value={formData.namaNasabah}
                  onChange={(e) => updateFormData('namaNasabah', e.target.value)}
                  placeholder="Masukkan nama nasabah..."
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Alamat</label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => updateFormData('alamat', e.target.value)}
                  placeholder="Masukkan alamat..."
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Nama Implementor</label>
                <input
                  type="text"
                  value={formData.namaImplementor}
                  onChange={(e) => updateFormData('namaImplementor', e.target.value)}
                  placeholder="Masukkan nama implementor..."
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Tanggal Implementasi</label>
                <div style={styles.dateContainer}>
                  <div style={{flex: 1}}>
                    <input
                      type="text"
                      value={formData.tanggalHari}
                      onChange={(e) => updateFormData('tanggalHari', e.target.value)}
                      placeholder="08"
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
                      placeholder="Juli"
                      style={styles.smallInput}
                    />
                    <div style={styles.dateLabel}>Bulan</div>
                  </div>
                  <div style={{flex: 1}}>
                    <input
                      type="text"
                      value={formData.tanggalTahun}
                      onChange={(e) => updateFormData('tanggalTahun', e.target.value)}
                      placeholder="2025"
                      maxLength="4"
                      style={styles.smallInput}
                    />
                    <div style={styles.dateLabel}>Tahun</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.gridThree}>
              <div>
                <label style={styles.label}>Nama</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => updateFormData('nama', e.target.value)}
                  placeholder="Masukkan nama..."
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Instansi Unit</label>
                <input
                  type="text"
                  value={formData.instansiUnit}
                  onChange={(e) => updateFormData('instansiUnit', e.target.value)}
                  placeholder="Masukkan instansi unit..."
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => updateFormData('contact', e.target.value)}
                  placeholder="Masukkan contact..."
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Coordinate Controls */}
          <div style={styles.section}>
            <h3 style={{fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: '#1f2937'}}>Koordinat Posisi Field</h3>
            
            <CoordinateControl field="namaNasabah" label="Nama Nasabah" emoji="👤" />
            <CoordinateControl field="alamat" label="Alamat" emoji="🏠" />
            <CoordinateControl field="namaImplementor" label="Nama Implementor" emoji="⚡" />
            
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
                      value={coordinates.tanggalHari.page}
                      onChange={(e) => updateCoordinates('tanggalHari', 'page', e.target.value)}
                      style={styles.selectInput}
                      disabled={totalPages === 0}
                    >
                      {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
                    </select>
                    <input
                      type="number"
                      value={coordinates.tanggalHari.x}
                      onChange={(e) => updateCoordinates('tanggalHari', 'x', e.target.value)}
                      style={styles.numberInput}
                      placeholder="X"
                    />
                    <input
                      type="number"
                      value={coordinates.tanggalHari.y}
                      onChange={(e) => updateCoordinates('tanggalHari', 'y', e.target.value)}
                      style={styles.numberInput}
                      placeholder="Y"
                    />
                    <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
                      ({coordinates.tanggalHari.x}, {coordinates.tanggalHari.y})
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#059669'}}>Bulan</div>
                  <div style={styles.gridFour}>
                    <select
                      value={coordinates.tanggalBulan.page}
                      onChange={(e) => updateCoordinates('tanggalBulan', 'page', e.target.value)}
                      style={styles.selectInput}
                      disabled={totalPages === 0}
                    >
                      {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
                    </select>
                    <input
                      type="number"
                      value={coordinates.tanggalBulan.x}
                      onChange={(e) => updateCoordinates('tanggalBulan', 'x', e.target.value)}
                      style={styles.numberInput}
                      placeholder="X"
                    />
                    <input
                      type="number"
                      value={coordinates.tanggalBulan.y}
                      onChange={(e) => updateCoordinates('tanggalBulan', 'y', e.target.value)}
                      style={styles.numberInput}
                      placeholder="Y"
                    />
                    <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
                      ({coordinates.tanggalBulan.x}, {coordinates.tanggalBulan.y})
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#dc2626'}}>Tahun</div>
                  <div style={styles.gridFour}>
                    <select
                      value={coordinates.tanggalTahun.page}
                      onChange={(e) => updateCoordinates('tanggalTahun', 'page', e.target.value)}
                      style={styles.selectInput}
                      disabled={totalPages === 0}
                    >
                      {totalPages > 0 ? generatePageOptions() : <option>Upload PDF</option>}
                    </select>
                    <input
                      type="number"
                      value={coordinates.tanggalTahun.x}
                      onChange={(e) => updateCoordinates('tanggalTahun', 'x', e.target.value)}
                      style={styles.numberInput}
                      placeholder="X"
                    />
                    <input
                      type="number"
                      value={coordinates.tanggalTahun.y}
                      onChange={(e) => updateCoordinates('tanggalTahun', 'y', e.target.value)}
                      style={styles.numberInput}
                      placeholder="Y"
                    />
                    <div style={{...styles.numberInput, backgroundColor: '#f9fafb', border: 'none', fontSize: '10px'}}>
                      ({coordinates.tanggalTahun.x}, {coordinates.tanggalTahun.y})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CoordinateControl field="nama" label="Nama" emoji="📝" />
            <CoordinateControl field="instansiUnit" label="Instansi Unit" emoji="🏢" />
            <CoordinateControl field="contact" label="Contact" emoji="📞" />
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button
              onClick={handleGeneratePDF}
              disabled={!pdfFile || Object.values(formData).some(val => !val.trim()) || isProcessing}
              style={{
                ...styles.primaryButton,
                ...((!pdfFile || Object.values(formData).some(val => !val.trim()) || isProcessing) ? styles.disabledButton : {})
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
            <li><strong>Isi semua field</strong> - nama nasabah, alamat, nama implementor, tanggal (3 box), nama, instansi unit, contact</li>
            <li><strong>Tanggal terpisah</strong> - ada 3 box koordinat untuk hari, bulan, tahun (bisa diposisikan terpisah)</li>
            <li><strong>Koordinat Y</strong> - dimulai dari bawah halaman (semakin tinggi nilai Y, semakin ke atas)</li>
            <li><strong>Koordinat X</strong> - dimulai dari kiri halaman (semakin tinggi nilai X, semakin ke kanan)</li>
            <li><strong>Setiap field punya koordinat sendiri</strong> - bisa di halaman berbeda</li>
            <li><strong>Preview koordinat</strong> - ditampilkan di sebelah kanan setiap field</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFFormFiller;