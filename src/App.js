import React, { useState, useRef, useCallback, useEffect } from 'react';

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
  
  const [checkboxes, setCheckboxes] = useState({
    mcm_main: false,
    mcm_approver_pending: false,
    mcm_account_info: false,
    mcm_transfer: false,
    mcm_mass_upload: false,
    mcm_payroll: false,
    mcm_batch_upload: false,
    mcm_bill_payment_upload: false,
    mcm_mpn_payment: false,
    mcm_bill_payment: false,
    mcm_info_management: false,
    mcm_transaction_status: false,
    mcm_cut_off_time: false,
    mcm_template_format: false,
    mcm_help_desk: false,
    mcm_others: false,
    
    mcm_sysadmin_main: false,
    mcm_account_grouping: false,
    mcm_user_grouping: false,
    mcm_user_creation: false,
    mcm_reset_password: false,
    mcm_unlock_user: false,
    mcm_user_still_login: false,
    mcm_authorized_limit: false,
    mcm_utilities: false,
    mcm_sysadmin_others: false,
    
    approval_sudah: false,
    approval_belum: false
  });
  
  const [attendees, setAttendees] = useState([
    { nama: '', instansiUnit: '', contact: '', keterangan: '', signature: null }
  ]);
  
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const fileInputRef = useRef(null);
  
  const signatureCanvasRefs = {
    cabang: useRef(null),
    implementor: useRef(null),
    nasabah: useRef(null)
  };
  
  const attendeeSignatureRefs = useRef([]);
  
  const [isDrawing, setIsDrawing] = useState({
    cabang: false,
    implementor: false,
    nasabah: false
  });
  
  const [isDrawingAttendee, setIsDrawingAttendee] = useState({});
  
  const [signatureData, setSignatureData] = useState({
    cabang: null,
    implementor: null,
    nasabah: null
  });

  const [basicCoordinates, setBasicCoordinates] = useState({
    namaNasabah: { x: 210, y: 700, page: 1 },
    alamat: { x: 210, y: 677, page: 1 },
    namaImplementor: { x: 210, y: 627, page: 1 },
    tanggalHari: { x: 210, y: 613, page: 1 },
    tanggalBulan: { x: 355, y: 613, page: 1 },
    tanggalTahun: { x: 470, y: 613, page: 1 },
    signatureCabang: { x: 80, y: 220, page: 1 },
    signatureImplementor: { x: 260, y: 220, page: 1 },
    signatureNasabah: { x: 430, y: 220, page: 1 }
  });

  const checkboxCoordinates = {
    mcm_main: { x: 45, y: 470, page: 2 },
    mcm_approver_pending: { x: 75, y: 445, page: 2 },
    mcm_account_info: { x: 75, y: 420, page: 2 },
    mcm_transfer: { x: 75, y: 395, page: 2 },
    mcm_mass_upload: { x: 75, y: 370, page: 2 },
    mcm_payroll: { x: 108, y: 350, page: 2 },
    mcm_batch_upload: { x: 108, y: 330, page: 2 },
    mcm_bill_payment_upload: { x: 108, y: 310, page: 2 },
    mcm_mpn_payment: { x: 75, y: 285, page: 2 },
    mcm_bill_payment: { x: 75, y: 260, page: 2 },
    mcm_info_management: { x: 75, y: 235, page: 2 },
    mcm_transaction_status: { x: 108, y: 215, page: 2 },
    mcm_cut_off_time: { x: 108, y: 195, page: 2 },
    mcm_template_format: { x: 75, y: 170, page: 2 },
    mcm_help_desk: { x: 75, y: 145, page: 2 },
    mcm_others: { x: 75, y: 120, page: 2 },
    
    mcm_sysadmin_main: { x: 571, y: 470, page: 2 },
    mcm_account_grouping: { x: 598, y: 445, page: 2 },
    mcm_user_grouping: { x: 598, y: 420, page: 2 },
    mcm_user_creation: { x: 598, y: 395, page: 2 },
    mcm_reset_password: { x: 598, y: 370, page: 2 },
    mcm_unlock_user: { x: 598, y: 345, page: 2 },
    mcm_user_still_login: { x: 598, y: 320, page: 2 },
    mcm_authorized_limit: { x: 598, y: 295, page: 2 },
    mcm_utilities: { x: 598, y: 270, page: 2 },
    mcm_sysadmin_others: { x: 598, y: 245, page: 2 },
    
    approval_sudah: { x: 608, y: 190, page: 2 },
    approval_belum: { x: 608, y: 170, page: 2 }
  };

  const [attendeeCoordinates, setAttendeeCoordinates] = useState([
    { 
      nama: { x: 95, y: 690, page: 3 }, 
      instansiUnit: { x: 205, y: 690, page: 3 }, 
      contact: { x: 290, y: 690, page: 3 },
      keterangan: { x: 378, y: 690, page: 3 },
      signature: { x: 460, y: 690, page: 3 }
    },
    { nama: { x: 95, y: 662, page: 3 }, instansiUnit: { x: 205, y: 662, page: 3 }, contact: { x: 290, y: 662, page: 3 }, keterangan: { x: 378, y: 662, page: 3 }, signature: { x: 460, y: 662, page: 3 }},
    { nama: { x: 95, y: 633, page: 3 }, instansiUnit: { x: 205, y: 633, page: 3 }, contact: { x: 290, y: 633, page: 3 }, keterangan: { x: 378, y: 633, page: 3 }, signature: { x: 460, y: 633, page: 3 }},
    { nama: { x: 95, y: 604, page: 3 }, instansiUnit: { x: 205, y: 604, page: 3 }, contact: { x: 290, y: 604, page: 3 }, keterangan: { x: 378, y: 604, page: 3 }, signature: { x: 460, y: 604, page: 3 }},
    { nama: { x: 95, y: 575, page: 3 }, instansiUnit: { x: 205, y: 575, page: 3 }, contact: { x: 290, y: 575, page: 3 }, keterangan: { x: 378, y: 575, page: 3 }, signature: { x: 460, y: 575, page: 3 }},
    { nama: { x: 95, y: 546, page: 3 }, instansiUnit: { x: 205, y: 546, page: 3 }, contact: { x: 290, y: 546, page: 3 }, keterangan: { x: 378, y: 546, page: 3 }, signature: { x: 460, y: 546, page: 3 }},
    { nama: { x: 95, y: 517, page: 3 }, instansiUnit: { x: 205, y: 517, page: 3 }, contact: { x: 290, y: 517, page: 3 }, keterangan: { x: 378, y: 517, page: 3 }, signature: { x: 460, y: 517, page: 3 }},
    { nama: { x: 95, y: 488, page: 3 }, instansiUnit: { x: 205, y: 488, page: 3 }, contact: { x: 290, y: 488, page: 3 }, keterangan: { x: 378, y: 488, page: 3 }, signature: { x: 460, y: 488, page: 3 }},
    { nama: { x: 95, y: 459, page: 3 }, instansiUnit: { x: 205, y: 459, page: 3 }, contact: { x: 290, y: 459, page: 3 }, keterangan: { x: 378, y: 459, page: 3 }, signature: { x: 460, y: 459, page: 3 }},
    { nama: { x: 95, y: 430, page: 3 }, instansiUnit: { x: 205, y: 430, page: 3 }, contact: { x: 290, y: 430, page: 3 }, keterangan: { x: 378, y: 430, page: 3 }, signature: { x: 460, y: 430, page: 3 }}
  ]);

  useEffect(() => {
    const loadPdfLib = async () => {
      try {
        setLoadingError(null);
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
        script.onload = () => {
          if (window.PDFLib) {
            setPdfLibLoaded(true);
            console.log('PDF-lib loaded successfully from CDN');
          }
        };
        script.onerror = () => {
          console.error('Failed to load PDF-lib from primary CDN');
          tryAlternateCDN();
        };
        document.head.appendChild(script);
        
        return () => {
          document.head.removeChild(script);
        };
      } catch (error) {
        console.error('Error loading PDF-lib:', error);
        setLoadingError('Failed to load PDF processing library');
      }
    };

    const tryAlternateCDN = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
      script2.onload = () => {
        if (window.PDFLib) {
          setPdfLibLoaded(true);
          console.log('PDF-lib loaded from alternate CDN');
        }
      };
      script2.onerror = () => {
        console.error('Failed to load PDF-lib from alternate CDN');
        setLoadingError('Unable to load PDF processing library. Please check your internet connection.');
      };
      document.head.appendChild(script2);
    };

    loadPdfLib();
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    wrapper: {
      maxWidth: '1200px',
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
    sectionCard: {
      backgroundColor: '#fff',
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
    subsectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#000',
      margin: '16px 0 12px 0',
      paddingLeft: '8px',
      borderLeft: '3px solid #000'
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
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 0'
    },
    checkboxSubItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 0',
      marginLeft: '20px'
    },
    checkbox: {
      width: '16px',
      height: '16px',
      cursor: 'pointer'
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#333',
      cursor: 'pointer',
      lineHeight: '1.4'
    },
    twoColumnLayout: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px'
    },
    grid: {
      display: 'grid',
      gap: '16px'
    },
    gridCols2: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
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
    uploadArea: {
      border: '2px dashed #dedede',
      borderRadius: '8px',
      padding: '32px',
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: '#fafafa',
      transition: 'border-color 0.2s'
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
    attendeesHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
      flexWrap: 'wrap',
      gap: '8px'
    },
    attendeeCard: {
      backgroundColor: '#fff',
      border: '1px solid #dedede',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px'
    },
    attendeeHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    attendeeTitle: {
      fontSize: '16px',
      fontWeight: '600',
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
      borderTop: '1px solid #dedede',
      flexDirection: 'column'
    },
    buttonLarge: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '700',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      gap: '8px',
      minHeight: '48px'
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
      backgroundColor: '#fff',
      width: '100%',
      maxWidth: '100%',
      height: '200px',
      touchAction: 'none' 
    },
    attendeeSignatureCanvas: {
      border: '2px solid #dedede',
      borderRadius: '8px',
      cursor: 'crosshair',
      backgroundColor: '#fff',
      width: '100%',
      maxWidth: '100%',
      height: '120px',
      touchAction: 'none' 
    },
    signatureButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    signaturePreview: {
      marginTop: '12px',
      padding: '12px',
      backgroundColor: '#f9f9f9',
      borderRadius: '6px',
      border: '1px solid #dedede'
    },
    signatureRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    signatureCard: {
      backgroundColor: '#fff',
      border: '1px solid #dedede',
      borderRadius: '8px',
      padding: '20px',
      width: '100%'
    },
    signatureCardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#000',
      margin: '0 0 16px 0',
      textAlign: 'center'
    },
    attendeeSignatureSection: {
      backgroundColor: '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      padding: '16px',
      marginTop: '16px'
    },
    attendeeSignatureTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#000',
      margin: '0 0 12px 0'
    },
    errorMessage: {
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      color: '#c33',
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '16px'
    },
    loadingMessage: {
      backgroundColor: '#fef9e7',
      border: '1px solid #fde047',
      color: '#a16207',
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '16px'
    }
  };

  const initAttendeeSignatureRefs = useCallback(() => {
    attendeeSignatureRefs.current = attendees.map((_, index) => 
      attendeeSignatureRefs.current[index] || React.createRef()
    );
  }, [attendees.length]);

  useEffect(() => {
    initAttendeeSignatureRefs();
  }, [attendees.length, initAttendeeSignatureRefs]);

  const updateCheckbox = (checkboxKey, value) => {
    setCheckboxes(prev => ({
      ...prev,
      [checkboxKey]: value
    }));
  };

  const getEventCoordinates = useCallback((e, canvasRef) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const startDrawing = useCallback((e, signatureType) => {
    e.preventDefault();
    setIsDrawing(prev => ({ ...prev, [signatureType]: true }));
    const canvas = signatureCanvasRefs[signatureType].current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const coords = getEventCoordinates(e, signatureCanvasRefs[signatureType]);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  }, [getEventCoordinates]);

  const draw = useCallback((e, signatureType) => {
    e.preventDefault();
    if (!isDrawing[signatureType]) return;
    
    const canvas = signatureCanvasRefs[signatureType].current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const coords = getEventCoordinates(e, signatureCanvasRefs[signatureType]);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }, [isDrawing, getEventCoordinates]);

  const stopDrawing = useCallback((e, signatureType) => {
    e.preventDefault();
    if (isDrawing[signatureType]) {
      setIsDrawing(prev => ({ ...prev, [signatureType]: false }));
      const canvas = signatureCanvasRefs[signatureType].current;
      if (!canvas) return;
      
      const signatureDataUrl = canvas.toDataURL();
      setSignatureData(prev => ({ ...prev, [signatureType]: signatureDataUrl }));
    }
  }, [isDrawing]);

  const startDrawingAttendee = useCallback((e, attendeeIndex) => {
    e.preventDefault();
    setIsDrawingAttendee(prev => ({ ...prev, [attendeeIndex]: true }));
    const canvas = attendeeSignatureRefs.current[attendeeIndex]?.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const coords = getEventCoordinates(e, attendeeSignatureRefs.current[attendeeIndex]);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  }, [getEventCoordinates]);

  const drawAttendee = useCallback((e, attendeeIndex) => {
    e.preventDefault();
    if (!isDrawingAttendee[attendeeIndex]) return;
    
    const canvas = attendeeSignatureRefs.current[attendeeIndex]?.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const coords = getEventCoordinates(e, attendeeSignatureRefs.current[attendeeIndex]);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }, [isDrawingAttendee, getEventCoordinates]);

  const stopDrawingAttendee = useCallback((e, attendeeIndex) => {
    e.preventDefault();
    if (isDrawingAttendee[attendeeIndex]) {
      setIsDrawingAttendee(prev => ({ ...prev, [attendeeIndex]: false }));
      const canvas = attendeeSignatureRefs.current[attendeeIndex]?.current;
      if (!canvas) return;
      
      const signatureDataUrl = canvas.toDataURL();
      setAttendees(prev => prev.map((attendee, i) => 
        i === attendeeIndex ? { ...attendee, signature: signatureDataUrl } : attendee
      ));
    }
  }, [isDrawingAttendee]);

  const clearSignature = (signatureType) => {
    const canvas = signatureCanvasRefs[signatureType].current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(prev => ({ ...prev, [signatureType]: null }));
  };

  const clearAttendeeSignature = (attendeeIndex) => {
    const canvas = attendeeSignatureRefs.current[attendeeIndex]?.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAttendees(prev => prev.map((attendee, i) => 
      i === attendeeIndex ? { ...attendee, signature: null } : attendee
    ));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      if (pdfLibLoaded && window.PDFLib) {
        try {
          const { PDFDocument } = window.PDFLib;
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pages = pdfDoc.getPages();
          setTotalPages(pages.length);
        } catch (error) {
          console.error('Error loading PDF:', error);
          setTotalPages(0);
        }
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
      setAttendees(prev => [...prev, { nama: '', instansiUnit: '', contact: '', keterangan: '', signature: null }]);
    }
  };

  const removeAttendee = (index) => {
    if (attendees.length > 1) {
      setAttendees(prev => prev.filter((_, i) => i !== index));
      setIsDrawingAttendee(prev => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }
  };

  const loadCheckmarkImage = async (pdfDoc) => {
    try {
      const response = await fetch('/centang.png');
      if (!response.ok) {
        throw new Error('Failed to load checkmark image');
      }
      const imageArrayBuffer = await response.arrayBuffer();
      
      const checkmarkImage = await pdfDoc.embedPng(imageArrayBuffer);
      return checkmarkImage;
    } catch (error) {
      console.error('Error loading checkmark image:', error);
      return null;
    }
  };

  const handleGeneratePDF = async () => {
    if (!pdfLibLoaded || !window.PDFLib) {
      alert('PDF processing library is not loaded yet. Please wait a moment and try again.');
      return;
    }

    const basicRequiredFields = ['namaNasabah', 'alamat', 'namaImplementor', 'tanggalHari', 'tanggalBulan', 'tanggalTahun'];
    const missingBasicFields = basicRequiredFields.filter(field => !formData[field].trim());
    
    const emptyAttendees = attendees.some(attendee => 
      !attendee.nama.trim() || !attendee.instansiUnit.trim() || !attendee.contact.trim() || !attendee.keterangan.trim()
    );
    
    if (!pdfFile || missingBasicFields.length > 0 || emptyAttendees) {
      alert('Please upload PDF and fill all required fields including all attendee information');
      return;
    }

    setIsProcessing(true);

    try {
      const { PDFDocument, rgb } = window.PDFLib;
      
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      const checkmarkImage = await loadCheckmarkImage(pdfDoc);
      
      Object.entries(formData).forEach(([field, value]) => {
        if (value.trim()) {
          const coord = basicCoordinates[field];
          if (coord && pages[coord.page - 1]) {
            const page = pages[coord.page - 1];
            page.drawText(value, {
              x: coord.x,
              y: coord.y,
              size: 10,
              color: rgb(0, 0, 0),
            });
          }
        }
      });
      
      Object.entries(checkboxes).forEach(([checkboxKey, isChecked]) => {
        if (isChecked && checkboxCoordinates[checkboxKey]) {
          const coord = checkboxCoordinates[checkboxKey];
          if (pages[coord.page - 1] && checkmarkImage) {
            const page = pages[coord.page - 1];
            
            page.drawImage(checkmarkImage, {
              x: coord.x,
              y: coord.y,
              width: 12,  
              height: 12, 
            });
          }
        }
      });
      
      const signatureTypes = ['cabang', 'implementor', 'nasabah'];
      for (const signatureType of signatureTypes) {
        if (signatureData[signatureType]) {
          const signatureCoord = basicCoordinates[`signature${signatureType.charAt(0).toUpperCase() + signatureType.slice(1)}`];
          if (signatureCoord && pages[signatureCoord.page - 1]) {
            const page = pages[signatureCoord.page - 1];
            
            try {
              const canvas = signatureCanvasRefs[signatureType].current;
              const canvasWidth = canvas.width;
              const canvasHeight = canvas.height;
              const aspectRatio = canvasWidth / canvasHeight;
              const pdfSignatureWidth = 120;
              const pdfSignatureHeight = pdfSignatureWidth / aspectRatio;
              
              const signatureImage = await pdfDoc.embedPng(signatureData[signatureType]);
              
              page.drawImage(signatureImage, {
                x: signatureCoord.x,
                y: signatureCoord.y,
                width: pdfSignatureWidth,
                height: pdfSignatureHeight,
              });
            } catch (error) {
              console.error(`Error adding signature ${signatureType}:`, error);
            }
          }
        }
      }
      
      for (let index = 0; index < attendees.length; index++) {
        const attendee = attendees[index];
        if (index < attendeeCoordinates.length) {
          const coords = attendeeCoordinates[index];
          
          if (attendee.nama.trim() && pages[coords.nama.page - 1]) {
            const page = pages[coords.nama.page - 1];
            page.drawText(attendee.nama, {
              x: coords.nama.x,
              y: coords.nama.y,
              size: 9,
              color: rgb(0, 0, 0),
            });
          }
          
          if (attendee.instansiUnit.trim() && pages[coords.instansiUnit.page - 1]) {
            const page = pages[coords.instansiUnit.page - 1];
            page.drawText(attendee.instansiUnit, {
              x: coords.instansiUnit.x,
              y: coords.instansiUnit.y,
              size: 9,
              color: rgb(0, 0, 0),
            });
          }
          
          if (attendee.contact.trim() && pages[coords.contact.page - 1]) {
            const page = pages[coords.contact.page - 1];
            page.drawText(attendee.contact, {
              x: coords.contact.x,
              y: coords.contact.y,
              size: 9,
              color: rgb(0, 0, 0),
            });
          }

          if (attendee.keterangan.trim() && pages[coords.keterangan.page - 1]) {
            const page = pages[coords.keterangan.page - 1];
            page.drawText(attendee.keterangan, {
              x: coords.keterangan.x,
              y: coords.keterangan.y,
              size: 9,
              color: rgb(0, 0, 0),
            });
          }

          if (attendee.signature && pages[coords.signature.page - 1]) {
            const page = pages[coords.signature.page - 1];
            
            try {
              const canvas = attendeeSignatureRefs.current[index]?.current;
              if (canvas) {
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const aspectRatio = canvasWidth / canvasHeight;
                const pdfSignatureWidth = 80;
                const pdfSignatureHeight = pdfSignatureWidth / aspectRatio;
                
                const signatureImage = await pdfDoc.embedPng(attendee.signature);
                
                page.drawImage(signatureImage, {
                  x: coords.signature.x,
                  y: coords.signature.y,
                  width: pdfSignatureWidth,
                  height: pdfSignatureHeight,
                });
              }
            } catch (error) {
              console.error(`Error adding attendee signature ${index}:`, error);
            }
          }
        }
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `filled-form-${Date.now()}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
      alert('PDF generated successfully!');
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert(`Error processing PDF: ${error.message || 'Unknown error occurred'}`);
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
    setCheckboxes({
      mcm_main: false,
      mcm_approver_pending: false,
      mcm_account_info: false,
      mcm_transfer: false,
      mcm_mass_upload: false,
      mcm_payroll: false,
      mcm_batch_upload: false,
      mcm_bill_payment_upload: false,
      mcm_mpn_payment: false,
      mcm_bill_payment: false,
      mcm_info_management: false,
      mcm_transaction_status: false,
      mcm_cut_off_time: false,
      mcm_template_format: false,
      mcm_help_desk: false,
      mcm_others: false,
      mcm_sysadmin_main: false,
      mcm_account_grouping: false,
      mcm_user_grouping: false,
      mcm_user_creation: false,
      mcm_reset_password: false,
      mcm_unlock_user: false,
      mcm_user_still_login: false,
      mcm_authorized_limit: false,
      mcm_utilities: false,
      mcm_sysadmin_others: false,
      approval_sudah: false,
      approval_belum: false
    });
    setAttendees([{ nama: '', instansiUnit: '', contact: '', keterangan: '', signature: null }]);
    setTotalPages(0);
    setSignatureData({
      cabang: null,
      implementor: null,
      nasabah: null
    });
    setIsDrawing({
      cabang: false,
      implementor: false,
      nasabah: false
    });
    setIsDrawingAttendee({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isFormComplete = () => {
    const basicComplete = Object.values(formData).every(val => val.trim());
    const attendeesComplete = attendees.every(attendee => 
      attendee.nama.trim() && attendee.instansiUnit.trim() && attendee.contact.trim() && attendee.keterangan.trim()
    );
    return pdfFile && basicComplete && attendeesComplete && pdfLibLoaded;
  };

  const renderCheckboxSection = (title, items, parentKey = null) => (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={styles.subsectionTitle}>{title}</h4>
      <div style={styles.checkboxContainer}>
        {items.map((item) => (
          <div key={item.key} style={item.isSubItem ? styles.checkboxSubItem : styles.checkboxItem}>
            <input
              type="checkbox"
              id={item.key}
              checked={checkboxes[item.key]}
              onChange={(e) => updateCheckbox(item.key, e.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor={item.key} style={styles.checkboxLabel}>
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSignatureCard = (signatureType, title) => (
    <div key={signatureType} style={styles.signatureCard}>
      <h4 style={styles.signatureCardTitle}>{title}</h4>
      <div style={styles.signatureContainer}>
        <label style={styles.label}>Draw signature:</label>
        <canvas
          ref={signatureCanvasRefs[signatureType]}
          width={800}
          height={200}
          style={styles.signatureCanvas}
          onMouseDown={(e) => startDrawing(e, signatureType)}
          onMouseMove={(e) => draw(e, signatureType)}
          onMouseUp={(e) => stopDrawing(e, signatureType)}
          onMouseLeave={(e) => stopDrawing(e, signatureType)}
          onTouchStart={(e) => startDrawing(e, signatureType)}
          onTouchMove={(e) => draw(e, signatureType)}
          onTouchEnd={(e) => stopDrawing(e, signatureType)}
          onTouchCancel={(e) => stopDrawing(e, signatureType)}
        />
        <div style={styles.signatureButtons}>
          <button
            onClick={() => clearSignature(signatureType)}
            style={styles.buttonDanger}
          >
            <svg style={{width: '12px', height: '12px', marginRight: '4px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        </div>
        {signatureData[signatureType] && (
          <div style={styles.signaturePreview}>
            <p style={{...styles.label, margin: '0 0 8px 0'}}>Preview:</p>
            <img 
              src={signatureData[signatureType]} 
              alt={`${title} signature preview`} 
              style={{maxWidth: '200px', height: 'auto', border: '1px solid #dedede', borderRadius: '4px'}} 
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderAttendeeSignatureSection = (attendeeIndex) => {
    if (!attendeeSignatureRefs.current[attendeeIndex]) {
      attendeeSignatureRefs.current[attendeeIndex] = React.createRef();
    }
    
    return (
      <div style={styles.attendeeSignatureSection}>
        <h5 style={styles.attendeeSignatureTitle}>Digital Signature</h5>
        <div style={styles.signatureContainer}>
          <label style={styles.label}>Draw your signature:</label>
          <canvas
            ref={attendeeSignatureRefs.current[attendeeIndex]}
            width={600}
            height={120}
            style={styles.attendeeSignatureCanvas}
            onMouseDown={(e) => startDrawingAttendee(e, attendeeIndex)}
            onMouseMove={(e) => drawAttendee(e, attendeeIndex)}
            onMouseUp={(e) => stopDrawingAttendee(e, attendeeIndex)}
            onMouseLeave={(e) => stopDrawingAttendee(e, attendeeIndex)}
            onTouchStart={(e) => startDrawingAttendee(e, attendeeIndex)}
            onTouchMove={(e) => drawAttendee(e, attendeeIndex)}
            onTouchEnd={(e) => stopDrawingAttendee(e, attendeeIndex)}
            onTouchCancel={(e) => stopDrawingAttendee(e, attendeeIndex)}
          />
          <div style={styles.signatureButtons}>
            <button
              onClick={() => clearAttendeeSignature(attendeeIndex)}
              style={styles.buttonDanger}
            >
              <svg style={{width: '12px', height: '12px', marginRight: '4px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Signature
            </button>
          </div>
          {attendees[attendeeIndex]?.signature && (
            <div style={styles.signaturePreview}>
              <p style={{...styles.label, margin: '0 0 8px 0'}}>Signature Preview:</p>
              <img 
                src={attendees[attendeeIndex].signature} 
                alt={`Attendee ${attendeeIndex + 1} signature preview`} 
                style={{maxWidth: '150px', height: 'auto', border: '1px solid #dedede', borderRadius: '4px'}} 
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const mcmItems = [
    { key: 'mcm_main', label: 'Mandiri Cash Management (MCM)', isSubItem: false },
    { key: 'mcm_approver_pending', label: 'Approver Pending Task', isSubItem: true },
    { key: 'mcm_account_info', label: 'Account Information', isSubItem: true },
    { key: 'mcm_transfer', label: 'In House Transfer, Domestic Transfer, Int Transfer', isSubItem: true },
    { key: 'mcm_mass_upload', label: 'Management Mass Upload', isSubItem: true },
    { key: 'mcm_payroll', label: 'Payroll', isSubItem: true },
    { key: 'mcm_batch_upload', label: 'Batch Upload', isSubItem: true },
    { key: 'mcm_bill_payment_upload', label: 'Bill Payment Upload', isSubItem: true },
    { key: 'mcm_mpn_payment', label: 'MPN Payment', isSubItem: true },
    { key: 'mcm_bill_payment', label: 'Bill Payment', isSubItem: true },
    { key: 'mcm_info_management', label: 'Information Management', isSubItem: true },
    { key: 'mcm_transaction_status', label: 'Transaction Status', isSubItem: true },
    { key: 'mcm_cut_off_time', label: 'Cut Off Time Info', isSubItem: true },
    { key: 'mcm_template_format', label: 'Template Format Upload', isSubItem: true },
    { key: 'mcm_help_desk', label: 'MCM Help Desk', isSubItem: true },
    { key: 'mcm_others', label: 'Lainnya...', isSubItem: true }
  ];

  const mcmSysadminItems = [
    { key: 'mcm_sysadmin_main', label: 'Mandiri Cash Management (MCM) Sysadmin', isSubItem: false },
    { key: 'mcm_account_grouping', label: 'Account Grouping/Edit', isSubItem: true },
    { key: 'mcm_user_grouping', label: 'User Grouping/Edit', isSubItem: true },
    { key: 'mcm_user_creation', label: 'User Creation/Edit', isSubItem: true },
    { key: 'mcm_reset_password', label: 'Reset Password User', isSubItem: true },
    { key: 'mcm_unlock_user', label: 'Unlock User', isSubItem: true },
    { key: 'mcm_user_still_login', label: 'User Still Login', isSubItem: true },
    { key: 'mcm_authorized_limit', label: 'Authorized Limit Schemed + Approval Matriks', isSubItem: true },
    { key: 'mcm_utilities', label: 'Utilities', isSubItem: true },
    { key: 'mcm_sysadmin_others', label: 'Lainnya...', isSubItem: true }
  ];

  const approvalItems = [
    { key: 'approval_sudah', label: 'Sudah', isSubItem: false },
    { key: 'approval_belum', label: 'Belum', isSubItem: false }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.mainCard}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Enhanced PDF Form Filler</h1>
              <p style={styles.subtitle}>Fill PDF forms with checkboxes and multiple digital signatures</p>
            </div>
          </div>

          <div style={styles.content}>
            {!pdfLibLoaded && !loadingError && (
              <div style={styles.loadingMessage}>
                <strong>Loading PDF processing library...</strong> Please wait a moment before uploading your PDF.
              </div>
            )}
            
            {loadingError && (
              <div style={styles.errorMessage}>
                <strong>Error:</strong> {loadingError}
              </div>
            )}

            <div>
              <label style={styles.sectionTitle}>Upload PDF Template</label>
              <div 
                style={styles.uploadArea}
                onClick={() => pdfLibLoaded && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  style={styles.hiddenInput}
                  disabled={!pdfLibLoaded}
                />
                <div>
                  <button 
                    style={{
                      ...styles.uploadButton,
                      ...(pdfLibLoaded ? {} : styles.buttonDisabled)
                    }}
                    disabled={!pdfLibLoaded}
                  >
                    {pdfLibLoaded ? 'Choose PDF File' : 'Loading...'}
                  </button>
                  <p style={styles.uploadInfo}>
                    {pdfLibLoaded ? 'or drag and drop' : 'Please wait for library to load'}
                  </p>
                </div>
                {pdfFile && (
                  <div style={styles.fileInfo}>
                    <p style={styles.fileInfoText}>📄 {pdfFile.name}</p>
                    {totalPages > 0 && (
                      <p style={{...styles.fileInfoText, marginTop: '4px'}}>
                        📄 Total pages: {totalPages}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* PDF Preview */}
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
              <div style={styles.grid}>
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
              <h3 style={styles.sectionTitle}>Silabus Implementasi</h3>
              <div style={styles.twoColumnLayout}>
                <div>
                  {renderCheckboxSection('Mandiri Cash Management (MCM)', mcmItems)}
                </div>
                <div>
                  {renderCheckboxSection('MCM Sysadmin', mcmSysadminItems)}
                  {renderCheckboxSection('Skema approval matrix sudah sesuai kebutuhan perusahaan', approvalItems)}
                </div>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>Main Digital Signatures</h3>
              <div style={styles.signatureRow}>
                {renderSignatureCard('cabang', 'Signature Cabang')}
                {renderSignatureCard('implementor', 'Signature Implementor')}
                {renderSignatureCard('nasabah', 'Signature Nasabah')}
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

              <div>
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

                    <div style={{...styles.grid, ...styles.gridCols2}}>
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
                      <div>
                        <label style={styles.label}>Description</label>
                        <input
                          type="text"
                          value={attendee.keterangan}
                          onChange={(e) => updateAttendee(index, 'keterangan', e.target.value)}
                          style={styles.input}
                          placeholder="Enter description"
                        />
                      </div>
                    </div>

                    {renderAttendeeSignatureSection(index)}
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
                <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Form
              </button>
            </div>

            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>Instructions</h3>
              <div style={{fontSize: '14px', color: '#666', lineHeight: '1.6'}}>
                <p><strong>How to use this PDF Form Filler:</strong></p>
                <ol style={{paddingLeft: '20px', margin: '12px 0'}}>
                  <li>Wait for the PDF library to load completely (you'll see a loading message)</li>
                  <li>Upload your PDF template using the file upload button</li>
                  <li>Fill in all the required customer and implementation information</li>
                  <li>Select the appropriate checkboxes for the implementation syllabus</li>
                  <li>Draw digital signatures for Cabang, Implementor, and Nasabah</li>
                  <li>Add attendee information and their digital signatures</li>
                  <li>Click "Generate & Download PDF" to create the filled form</li>
                </ol>
                
                <p style={{marginTop: '16px'}}><strong>Tips:</strong></p>
                <ul style={{paddingLeft: '20px', margin: '12px 0'}}>
                  <li>Make sure all required fields are filled before generating the PDF</li>
                  <li>Signatures can be drawn using mouse/touch - use the "Clear" button to redraw</li>
                  <li>You can add up to 10 attendees to the form</li>
                  <li>The coordinates are pre-configured for the standard form layout</li>
                  <li>If you encounter issues, try refreshing the page and waiting for libraries to load</li>
                  <li>Checkmarks will be displayed as images from centang.png file in public folder</li>
                </ul>

                <p style={{marginTop: '16px'}}><strong>Browser Compatibility:</strong></p>
                <p>This tool works best in modern browsers (Chrome, Firefox, Safari, Edge). Make sure JavaScript is enabled.</p>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>Debug Information</h3>
                <div style={{fontSize: '12px', color: '#888'}}>
                  <p><strong>PDF Library Status:</strong> {pdfLibLoaded ? '✅ Loaded' : '⏳ Loading...'}</p>
                  <p><strong>PDF File:</strong> {pdfFile ? `✅ ${pdfFile.name}` : '❌ No file'}</p>
                  <p><strong>Total Pages:</strong> {totalPages}</p>
                  <p><strong>Form Complete:</strong> {isFormComplete() ? '✅ Ready' : '❌ Missing data'}</p>
                  <p><strong>Attendees:</strong> {attendees.length}</p>
                  <p><strong>Signatures:</strong> 
                    Cabang: {signatureData.cabang ? '✅' : '❌'}, 
                    Implementor: {signatureData.implementor ? '✅' : '❌'}, 
                    Nasabah: {signatureData.nasabah ? '✅' : '❌'}
                  </p>
                  <p><strong>Checkmark Image:</strong> Will load from /centang.png</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFFormFiller;