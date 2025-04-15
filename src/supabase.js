import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bvxqhbkxlqrlmzoejhig.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2eHFoYmt4bHFybG16b2VqaGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzMzMzIsImV4cCI6MjA1OTAwOTMzMn0.wtwDINaEfc6Sotz6LKqlWKtp-wmX93a6UEGBc3jaVJw'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
