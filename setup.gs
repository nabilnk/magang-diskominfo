function setupSheetTampilanPremium() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Sheet1");
  
  // --- 1. MEMBERSIHKAN AREA ---
  sheet.showColumns(1, 20); // Tampilkan semua kolom dulu
  sheet.setFrozenRows(0);   // Reset freeze
  
  // --- 2. JUDUL UTAMA (BANNER) ---
  const bannerRange = sheet.getRange("A1:Q2");
  bannerRange.merge()
             .setValue("✨ NOTION - GWS INTEGRATION HUB")
             .setBackground("#1a2a6c") // Biru Navy Gelap
             .setFontColor("#ffffff")
             .setFontSize(20)
             .setFontWeight("bold")
             .setHorizontalAlignment("center")
             .setVerticalAlignment("middle");

  // --- 3. PENGELOMPOKAN HEADER (Baris 4) ---
  // Kelompok 1: Penjadwalan (Hijau Lembut)
  sheet.getRange("A4:E4").setBackground("#e1f5fe").setFontColor("#01579b");
  // Kelompok 2: Detail Tugas (Kuning Lembut)
  sheet.getRange("F4:K4").setBackground("#fff9c4").setFontColor("#fbc02d");
  // Kelompok 3: Hasil Sinkronisasi (Ungu Lembut)
  sheet.getRange("L4:Q4").setBackground("#f3e5f5").setFontColor("#7b1fa2");

  // --- 4. FORMAT HEADER TEKS ---
  const headerTeks = sheet.getRange("A4:Q4");
  headerTeks.setFontWeight("bold")
            .setBorder(true, true, true, true, true, true, "#cccccc", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // --- 5. TATA LETAK KOLOM ---
  sheet.setColumnWidth(1, 80);   // Hari
  sheet.setColumnWidth(2, 110);  // Tanggal Mulai
  sheet.setColumnWidth(9, 300);  // Judul Tugas (Pusat Informasi)
  sheet.setColumnWidth(10, 150); // Lokasi
  sheet.setColumnWidth(12, 180); // PIC
  sheet.setColumnWidth(14, 150); // Drive Link
  sheet.setColumnWidth(15, 100); // Checkbox
  sheet.setColumnWidth(16, 150); // GCal Link

  // --- 6. HILANGKAN GRIDLINES (Agar Terlihat Bersih) ---
  // Menu Tampilan -> Garis Kisi (Gridlines) dimatikan manual atau via code:
  // Note: Apps Script tidak bisa mematikan Gridlines secara langsung, 
  // tapi kita bisa mewarnai background menjadi putih.
  sheet.getRange("A5:Z1000").setBackground("#ffffff");

  // --- 7. BEKUKAN HEADER ---
  sheet.setFrozenRows(4);

  Logger.log("✅ Dashboard Premium Berhasil Dibuat!");
}