/* 2026 River Run - Supabase client init
   anon public key는 노출되어도 되는 키입니다 (RLS/권한으로 접근 제어).
   service_role 키는 절대 여기에 넣지 마세요. */
const RR_SUPABASE_URL = 'https://cncakorluzumkqqtjmmf.supabase.co';
const RR_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuY2Frb3JsdXp1bWtxcXRqbW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMzE1NzUsImV4cCI6MjEwMzcwNzU3NX0.CcwKMW08PDI9KdA-yugo_AfVbfBUJADUIhnGzaHtHkU';

window.RR_SUPABASE = supabase.createClient(RR_SUPABASE_URL, RR_SUPABASE_ANON_KEY);
