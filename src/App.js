import React, { useState, useRef } from 'react';

const PDFFormFiller = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [nama, setNama] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 268, y: 678, page: 1 });
  const [phoneCoordinates, setPhoneCoordinates] = useState({ x: 268, y: 650, page: 1 });
  const [totalPages, setTotalPages] = useState(0);
  const fileInputRef = useRef(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    wrapper: {
      maxWidth: '1024px',
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
      transition: 'border-color 0.2s',
      ':hover': {
        borderColor: '#6366f1'
      }
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
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px'
    },
    gridTwo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    numberInput: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px'
    },
    selectInput: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
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
      height: '384px',
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
    altCard: {
      backgroundColor: '#eff6ff',
      border: '1px solid #93c5fd',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px'
    },
    presetButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    },
    presetButton: {
      padding: '4px 12px',
      borderRadius: '4px',
      border: 'none',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
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
      fontSize: '16px',
      fontWeight: '500',
      color: '#1f2937',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      // Count total pages
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

  const handleGeneratePDF = async () => {
    if (!pdfFile || !nama.trim() || !nomorTelepon.trim()) {
      alert('Please upload PDF and enter nama & nomor telepon');
      return;
    }

    setIsProcessing(true);

    try {
      // Load PDF-lib from CDN
      const { PDFDocument, rgb } = await import('https://cdn.skypack.dev/pdf-lib@^1.17.1');
      
      // Read the uploaded PDF
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Get all pages
      const pages = pdfDoc.getPages();
      
      // Validate page numbers
      const namaPageIndex = coordinates.page - 1;
      const phonePageIndex = phoneCoordinates.page - 1;
      
      if (namaPageIndex >= pages.length || namaPageIndex < 0) {
        alert(`Halaman ${coordinates.page} untuk nama tidak tersedia! PDF ini hanya memiliki ${pages.length} halaman.`);
        setIsProcessing(false);
        return;
      }
      
      if (phonePageIndex >= pages.length || phonePageIndex < 0) {
        alert(`Halaman ${phoneCoordinates.page} untuk nomor telepon tidak tersedia! PDF ini hanya memiliki ${pages.length} halaman.`);
        setIsProcessing(false);
        return;
      }
      
      // Get the specific pages
      const namaPage = pages[namaPageIndex];
      const phonePage = pages[phonePageIndex];
      
      // Add nama lengkap to the specified page and coordinates
      namaPage.drawText(nama, {
        x: coordinates.x,
        y: coordinates.y,
        size: 10,
        color: rgb(0, 0, 0),
      });
      
      // Add nomor telepon to the specified page and coordinates
      phonePage.drawText(nomorTelepon, {
        x: phoneCoordinates.x,
        y: phoneCoordinates.y,
        size: 10,
        color: rgb(0, 0, 0),
      });
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      
      // Create download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `filled-form-${Date.now()}.pdf`;
      link.click();
      
      // Clean up
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
    setNama('');
    setNomorTelepon('');
    setTotalPages(0);
    setCoordinates({ x: 268, y: 678, page: 1 });
    setPhoneCoordinates({ x: 268, y: 650, page: 1 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generatePageOptions = () => {
    const options = [];
    for (let i = 1; i <= totalPages; i++) {
      options.push(
        <option key={i} value={i}>
          Halaman {i}
        </option>
      );
    }
    return options;
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 style={styles.title}>PDF Form Filler Multi-Page</h1>
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
          <div style={styles.gridTwo}>
            <div>
              <label style={styles.label}>Nama yang akan diisi</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama..."
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Nomor Telepon yang akan diisi</label>
              <input
                type="text"
                value={nomorTelepon}
                onChange={(e) => setNomorTelepon(e.target.value)}
                placeholder="Masukkan nomor telepon..."
                style={styles.input}
              />
            </div>
          </div>

          {/* Preset Positions */}
          <div style={styles.section}>
            <label style={styles.label}>Preset Posisi</label>
            <div style={styles.presetButtons}>
              <button
                onClick={() => setCoordinates({ x: 268, y: 678, page: 1 })}
                style={{
                  ...styles.presetButton,
                  backgroundColor: '#dbeafe',
                  color: '#1e40af'
                }}
              >
                Nama Hal.1 (268, 678)
              </button>
              <button
                onClick={() => setPhoneCoordinates({ x: 268, y: 650, page: 1 })}
                style={{
                  ...styles.presetButton,
                  backgroundColor: '#dcfce7',
                  color: '#166534'
                }}
              >
                Telepon Hal.1 (268, 650)
              </button>
              <button
                onClick={() => setCoordinates({ x: 100, y: 750, page: 2 })}
                style={{
                  ...styles.presetButton,
                  backgroundColor: '#fef3c7',
                  color: '#92400e'
                }}
              >
                Nama Hal.2 (100, 750)
              </button>
              <button
                onClick={() => setPhoneCoordinates({ x: 100, y: 720, page: 2 })}
                style={{
                  ...styles.presetButton,
                  backgroundColor: '#fce7f3',
                  color: '#be185d'
                }}
              >
                Telepon Hal.2 (100, 720)
              </button>
            </div>
          </div>

          {/* Position Controls */}
          <div style={styles.coordinateGroup}>
            <div style={styles.coordinateTitle}>
              <span>📝</span>
              Posisi Nama Lengkap
            </div>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Halaman</label>
                <select
                  value={coordinates.page}
                  onChange={(e) => setCoordinates(prev => ({ ...prev, page: parseInt(e.target.value) }))}
                  style={styles.selectInput}
                  disabled={totalPages === 0}
                >
                  {totalPages > 0 ? generatePageOptions() : <option>Upload PDF dulu</option>}
                </select>
              </div>
              <div>
                <label style={styles.label}>Posisi X (horizontal)</label>
                <input
                  type="number"
                  value={coordinates.x}
                  onChange={(e) => setCoordinates(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                  style={styles.numberInput}
                />
              </div>
              <div>
                <label style={styles.label}>Posisi Y (vertical)</label>
                <input
                  type="number"
                  value={coordinates.y}
                  onChange={(e) => setCoordinates(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                  style={styles.numberInput}
                />
              </div>
            </div>
          </div>

          <div style={styles.coordinateGroup}>
            <div style={styles.coordinateTitle}>
              <span>📞</span>
              Posisi Nomor Telepon
            </div>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Halaman</label>
                <select
                  value={phoneCoordinates.page}
                  onChange={(e) => setPhoneCoordinates(prev => ({ ...prev, page: parseInt(e.target.value) }))}
                  style={styles.selectInput}
                  disabled={totalPages === 0}
                >
                  {totalPages > 0 ? generatePageOptions() : <option>Upload PDF dulu</option>}
                </select>
              </div>
              <div>
                <label style={styles.label}>Posisi X (horizontal)</label>
                <input
                  type="number"
                  value={phoneCoordinates.x}
                  onChange={(e) => setPhoneCoordinates(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                  style={styles.numberInput}
                />
              </div>
              <div>
                <label style={styles.label}>Posisi Y (vertical)</label>
                <input
                  type="number"
                  value={phoneCoordinates.y}
                  onChange={(e) => setPhoneCoordinates(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                  style={styles.numberInput}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button
              onClick={handleGeneratePDF}
              disabled={!pdfFile || !nama.trim() || !nomorTelepon.trim() || isProcessing}
              style={{
                ...styles.primaryButton,
                ...((!pdfFile || !nama.trim() || !nomorTelepon.trim() || isProcessing) ? styles.disabledButton : {})
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
            <li>Upload PDF template yang sudah ada - aplikasi akan mendeteksi jumlah halaman</li>
            <li>Pilih halaman yang tepat untuk setiap field (nama dan nomor telepon bisa di halaman berbeda)</li>
            <li>Koordinat Y dimulai dari bawah halaman (semakin tinggi nilai Y, semakin ke atas)</li>
            <li>Koordinat X dimulai dari kiri halaman (semakin tinggi nilai X, semakin ke kanan)</li>
            <li>Gunakan preset posisi sebagai starting point, lalu fine-tune sesuai kebutuhan</li>
            <li>Aplikasi akan membuat file PDF baru tanpa mengubah PDF asli</li>
            <li>Validasi halaman otomatis - akan muncul error jika halaman tidak tersedia</li>
          </ul>
        </div>

        {/* Tips untuk koordinat */}
        <div style={styles.altCard}>
          <h3 style={{ fontWeight: '500', color: '#1e40af', marginBottom: '8px' }}>
            Tips Koordinat PDF:
          </h3>
          <div style={{ fontSize: '14px', color: '#1e40af' }}>
            <p><strong>Sistem Koordinat:</strong> (0,0) berada di pojok kiri bawah setiap halaman</p>
            <p><strong>Halaman A4:</strong> Sekitar 595 x 842 points (lebar x tinggi)</p>
            <p><strong>Posisi Umum:</strong> Header (~750-800), Middle (~400-500), Footer (~50-100)</p>
            <p><strong>Testing:</strong> Mulai dengan nilai kecil, lalu adjust sampai posisi tepat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFFormFiller;