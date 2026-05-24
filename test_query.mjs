import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: mainPost, error } = await supabase
    .from('posts')
    .select(`
      id,
      content,
      image_url,
      created_at,
      user_id,
      profiles:user_id (full_name, username, avatar_url),
      likes:post_likes(count),
      reposts:post_reposts(count),
      replies:posts!parent_id(count)
    `)
    .limit(1)
    .single();

  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Success:", mainPost);
  }
}

test();
