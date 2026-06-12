<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Lapangan Disetujui</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
    
    <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Ganesha Arena</h1>
            <p style="color: #a7f3d0; margin: 5px 0 0 0; font-size: 13px; text-transform: uppercase; tracking-spacing: 1px;">Konfirmasi Pesanan</p>
        </div>

        <div style="padding: 30px;">
            <h2 style="margin-top: 0; color: #0f172a; font-size: 18px;">Halo, {{ $booking->user->name ?? 'Pelanggan' }}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                Kabar gembira! Pengajuan penyewaan lapangan olahraga Anda di <strong>Ganesha Arena</strong> telah diperiksa dan <strong>DISETUJUI</strong> oleh Admin.
            </p>
            
            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 0; color: #64748b; width: 40%;"><strong>ID Booking:</strong></td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">#{{ $booking->id }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Nama Lapangan:</strong></td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">{{ $booking->field->nama_lapangan ?? 'Lapangan Ganesha' }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Tanggal Main:</strong></td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">{{ date('d-m-Y', strtotime($booking->tanggal)) }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Durasi Sesi:</strong></td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">{{ date('H:i', strtotime($booking->jam_mulai)) }} - {{ date('H:i', strtotime($booking->jam_selesai)) }} WITA</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Status Jadwal:</strong></td>
                        <td style="padding: 6px 0; color: #10b981; font-weight: bold; text-transform: uppercase;">{{ $booking->status }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Metode Antrean:</strong></td>
                        <td style="padding: 6px 0; color: #6366f1; font-weight: 500;">RabbitMQ Async Worker</td>
                    </tr>
                </table>
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin-bottom: 0;">
                *Silakan datang tepat waktu sesuai jadwal yang Anda pesan dan tunjukkan email konfirmasi ini ke petugas lapangan saat tiba di lokasi.
            </p>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0;">Email ini dikirim otomatis oleh sistem antrean Ganesha Arena.</p>
            <p style="margin: 5px 0 0 0;">© 2026 Ganesha Sport - Bali, Indonesia</p>
        </div>

    </div>

</body>
</html>