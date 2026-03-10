MessageBuilder.fancyTableTemplate = function(payload) {
  const entity = Adapters.toEntity(payload);
  const start = splitDateAndTime(entity.startDate);
  const end = splitDateAndTime(entity.endDate);
  const statusColors = typeof getStatusColor === 'function' ? getStatusColor(entity.statusName) : {bg:'#eee', text:'#333'};

  return {
    to: entity.picEmail,
    subject: `🔔 Pemberitahuan Tugas Baru: ${entity.title}`,
    html: `
    <html>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e2e8f0;">
          
          <div style="background-color: #3b82f6; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0;">🔔 Pemberitahuan Tugas Baru</h1>
          </div>

          <div style="padding: 24px;">
            <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 5px solid #3b82f6;">
              <h2 style="font-size: 18px; color: #1f2937; margin: 0 0 10px;">${entity.title}</h2>
              <a href="${entity.url}" style="color: #10b981; font-weight: bold; text-decoration: none; font-size: 14px;">🔗 Buka di Notion</a>
            </div>

            <table width="100%" style="margin-bottom: 20px;">
              <tr>
                <td width="50%" style="padding-right:10px;">
                  <div style="background:${statusColors.bg}; color:${statusColors.text}; padding:12px; border-radius:8px; text-align:center;">
                    <span style="font-size:11px; display:block; opacity:0.8;">📍 Status</span>
                    <b>${entity.statusName}</b>
                  </div>
                </td>
                <td width="50%" style="padding-left:10px;">
                  <div style="background:#fef2f2; color:#ef4444; padding:12px; border-radius:8px; text-align:center;">
                    <span style="font-size:11px; display:block; opacity:0.8;">⚡ Prioritas</span>
                    <b>${entity.priorityName}</b>
                  </div>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="12" style="border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #4b5563;">
              <tr><td style="border-bottom: 1px dashed #eee;"><b>👤 Disposisi</b></td><td>${entity.person}</td></tr>
              <tr><td style="border-bottom: 1px dashed #eee;"><b>⏰ Timeline</b></td><td>${start.date} → ${end.date}</td></tr>
              <tr><td style="border-bottom: 1px dashed #eee;"><b>📄 Sumber</b></td><td>${entity.sourceContent}</td></tr>
              <tr><td style="border-bottom: 1px dashed #eee;"><b>🏷️ Tag</b></td><td>${entity.tagName}</td></tr>
              <tr><td><b>⏱️ Jangka Waktu</b></td><td>${entity.workTime} hari</td></tr>
            </table>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${payload.calUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">📅 Lihat di Google Calendar</a>
            </div>
          </div>
        </div>
      </body>
    </html>`
  };
};