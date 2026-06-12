import random
import logging
from locust import HttpUser, task, between

class GaneshaArenaUser(HttpUser):
    # Jeda simulasi antar aktivitas user (1 sampai 3 detik)
    wait_time = between(1, 3)
    token = None
    booking_ids = []
    field_ids = [] # Tambahan: Menyimpan ID lapangan dari database

    def on_start(self):
        """ Jalur inisialisasi: Login dan Ambil Master Data """
        payload_login = {
            "email": "test@gmail.com",
            "password": "password"
        }
        
        response_login = self.client.post("/api/login", json=payload_login)
        
        if response_login.status_code == 200:
            self.token = response_login.json().get("token")
            headers = {
                "Authorization": f"Bearer {self.token}",
                "Accept": "application/json"
            }
            
            # 1. Ambil Data Lapangan untuk bahan Checkout massal nanti
            response_fields = self.client.get("/api/fields", headers=headers)
            if response_fields.status_code == 200:
                fields_data = response_fields.json()
                self.field_ids = [f.get('id') for f in fields_data if f.get('id')]
                logging.info(f"=== LOCUST === Sukses Sinkronisasi {len(self.field_ids)} ID Lapangan.")

            # 2. Ambil Data Booking Aktif
            response_bookings = self.client.get("/api/bookings", headers=headers)
            if response_bookings.status_code == 200:
                bookings_data = response_bookings.json()
                self.booking_ids = [b.get('id') for b in bookings_data if b.get('id')]
                logging.info(f"=== LOCUST === Sukses Sinkronisasi {len(self.booking_ids)} ID Booking.")
        else:
            logging.error("=== LOCUST === Gagal Autentikasi di Awal Sesi.")

    @task(5)
    def servis_lihat_daftar_lapangan(self):
        """ SERVIS 1: Pengguna melihat daftar lapangan (Beban Tinggi / Read) """
        if not self.token: return
        headers = {"Authorization": f"Bearer {self.token}", "Accept": "application/json"}
        
        self.client.get("/api/fields", headers=headers, name="/api/fields [Lihat Lapangan]")

    @task(3)
    def servis_checkout_lapangan_massal(self):
        """ SERVIS 2: Pengguna melakukan pemesanan lapangan (Memicu Transaksi/Write) """
        if not self.token or not self.field_ids: return
        headers = {"Authorization": f"Bearer {self.token}", "Accept": "application/json"}
        
        # Pilih ID lapangan acak hasil sinkronisasi tadi
        random_field = random.choice(self.field_ids)
        
        # Membuat variasi jam menit secara acak agar meminimalkan langsung bentrok jadwal 422 di milidetik awal
        jam_acak = f"{random.randint(8, 20)}:00"
        
        payload_checkout = {
            "field_id": random_field,
            "tanggal": "2026-06-15",
            "jam_mulai": jam_acak,
            "jam_selesai": "22:00", # sesuaikan format backendmu
            "total_harga": 150000
        }
        
        response = self.client.post("/api/checkout", json=payload_checkout, headers=headers, name="/api/checkout [Booking Baru]")
        
        # Jika transaksi sukses, masukkan ID barunya ke memori biar bisa di-approve oleh task admin
        if response.status_code == 201 or response.status_code == 200:
            new_id = response.json().get('data', {}).get('id') or response.json().get('id')
            if new_id and new_id not in self.booking_ids:
                self.booking_ids.append(new_id)

    @task(2)
    def servis_admin_approve_booking(self):
        """ SERVIS 3: Admin mengubah status booking (Menguji Antrean RabbitMQ & Leader Election) """
        if not self.token: return
        
        # Gunakan fallback ID statis jika array booking_ids masih kosong di detik-detik awal
        target_id = random.choice(self.booking_ids) if self.booking_ids else 3
            
        headers = {"Authorization": f"Bearer {self.token}", "Accept": "application/json"}
        payload_status = {"status": "APPROVED"}
        
        # Menembak rute update status menggunakan POST (sesuai penyesuaian route kamu sebelumnya)
        self.client.post(f"/api/bookings/{target_id}", json=payload_status, headers=headers, name="/api/bookings/[id] [Admin Approve]")