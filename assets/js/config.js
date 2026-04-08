/**
 * SWIFTRIDE — config.js
 * ⚠️  THIS FILE IS GITIGNORED — NEVER PUSHED TO GITHUB
 * Put all your real secret API keys here
 */

const CONFIG = {

  // ── Google Places API ──────────────────────────────
  GOOGLE_API_KEY: 'YOUR_GOOGLE_PLACES_API_KEY',

  // ── Supabase ───────────────────────────────────────
  SUPABASE_URL:      'https://vixcjaqqkvwqobnbnyll.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeGNqYXFxa3Z3cW9ibmJueWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODMwMTUsImV4cCI6MjA4ODU1OTAxNX0.m5ZvOuBcVPRnbdSZX6STYdC11Lm30mne_2hpvOPs-Oc',

  // ── Telegram Bot ───────────────────────────────────bot_token ragu:  8751208593:AAGEflx6TVIeQXIdhYU8Rz0Znl7iGKFPXZM // chat_di 6640250980
  TELEGRAM_BOT_TOKEN: '8445026626:AAHfDzhGMCIakQ3lRxPVqX4lbp0QUN9Gq00',  
  TELEGRAM_CHAT_ID:   '8769619393', 

  // ── EmailJS ────────────────────────────────────────
  EMAILJS_SERVICE_ID:  'service_nlnxeic',
  EMAILJS_TEMPLATE_ID: 'template_kg17hvv',
  EMAILJS_PUBLIC_KEY:  'JAomeAcKMN5YUHHZT',

  // ── WhatsApp & Phone ───────────────────────────────
  WHATSAPP_NUMBER: '919962966606',
  PHONE:           '+919962966606',

  // ── Fare rates ₹/km ───────────────────────────────
  RATES:    { Sedan: 12, SUV: 15, Innova: 18, Tempo: 22 },
  MIN_FARE: 500,
};
