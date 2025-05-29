const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// マイグレーションディレクトリ
const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');

console.log('🧹 マイグレーションの問題を修復中...');

try {
  // 1. prisma/migrationsディレクトリを削除
  if (fs.existsSync(migrationsDir)) {
    fs.rmSync(migrationsDir, { recursive: true, force: true });
    console.log('✅ 既存のマイグレーションディレクトリを削除しました');
  }

  // 2. データベースを直接リセット
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
  console.log('✅ データベースをリセットしました');

  // 3. 新しいマイグレーションを作成
  execSync('npx prisma migrate dev --name init_fresh_start', { stdio: 'inherit' });
  console.log('✅ 新しいマイグレーションを作成しました');

  // 4. シードデータの適用前にSupabase環境を確認
  try {
    console.log('🔍 Supabase接続を確認しています...');

    // .envファイルを読み込み、Supabase URLとキーを確認
    const dotenv = require('dotenv');
    dotenv.config();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase環境変数が正しく設定されていません。');
      console.warn('🔧 .envファイルのSupabase設定を確認してください。');
    } else {
      console.log('✅ Supabase環境変数を確認しました');
    }

    // シードデータの適用
    console.log('🌱 シードデータを適用しています...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
    console.log('✅ シードデータを適用しました');
  } catch (error) {
    console.error('⚠️ シード処理中にエラーが発生しましたが、マイグレーションは成功しています:', error.message);
  }

  console.log('🎉 マイグレーションの問題が解決されました！');
} catch (error) {
  console.error('❌ エラーが発生しました:', error);
}
