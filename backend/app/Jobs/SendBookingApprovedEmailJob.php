<?php

namespace App\Jobs;

use App\Mail\BookingApprovedMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\Middleware\WithoutOverlapping; // IMPORT MIDDLEWARE LOCK

class SendBookingApprovedEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $booking;

    /**
     * Create a new job instance.
     */
    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    /**
     * TAHAP LEADER ELECTION: Menentukan siapa node worker yang berhak memproses data.
     */
    public function middleware(): array
    {
        // Mengunci baris berdasarkan ID Booking. 
        // Node yang berhasil mengunci bertindak sebagai Leader. Node yang gagal (Follower) akan mundur.
        return [
            (new WithoutOverlapping((string) $this->booking->id))
                ->dontRelease() // Jika kalah pemilu, langsung batalkan proses di node ini agar tidak tumpang tindih
        ];
    }

    /**
     * Execute the job (Hanya dieksekusi oleh node worker yang memenangkan takhta Leader).
     */
    public function handle(): void
    {
        if ($this->booking && $this->booking->user) {
            // Deteksi nama container docker tempat job ini dieksekusi untuk kebutuhan log tugas kuliahmu
            $nodeName = gethostname(); 
            
            \Log::info("Node [{$nodeName}] sukses memenangkan Leader Election untuk memproses Booking ID: #{$this->booking->id}");

            Mail::to($this->booking->user->email)->send(new BookingApprovedMail($this->booking));
        }
    }
}