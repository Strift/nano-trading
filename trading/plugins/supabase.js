import { createClient } from '@supabase/supabase-js'

export default function ({ $config }, inject) {
  const supabase = createClient($config.supabaseURL, $config.supabaseKey)

  inject('supabase', supabase)
}
