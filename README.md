nebula
The blog platform with a nebula of stars that praise your article.

# ローカルセットアップ方法


npm i

docker compose up -d

npx prisma migrate dev --name init

npx prisma db seed


サーバー立ち上げ
npm run dev


データベース確認
npx prisma studio

記事データ確認
http/localhost:8082
