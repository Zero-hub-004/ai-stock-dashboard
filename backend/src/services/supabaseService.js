const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const TABLE_NAME = 'stock_analysis';

async function saveAnalysis(record) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([record])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to save analysis: ${error.message}`);
  }

  return data;
}

async function getAnalysisHistory(limit = 50) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Supabase select error:', error);
    throw new Error(`Failed to fetch history: ${error.message}`);
  }

  return data;
}

module.exports = { saveAnalysis, getAnalysisHistory };
