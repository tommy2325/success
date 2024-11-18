import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dcqqaceltrusyahakpng.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcXFhY2VsdHJ1c3lhaGFrcG5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTE2MDU5MiwiZXhwIjoyMDQ0NzM2NTkyfQ.vm_1Qj7erC1WldEWUslAsiLaj1T2BzS8X6fgewezp10'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
