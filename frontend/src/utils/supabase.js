import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khpsdhsomobaizflxjgm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocHNkaHNvbW9iYWl6Zmx4amdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MTIzOTksImV4cCI6MjA4MDA4ODM5OX0.AJ33InJXsk2GlPrNkifcv_kGfZVjrZ-MkiV_49pmT-Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
