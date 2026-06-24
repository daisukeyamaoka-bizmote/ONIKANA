# フクワウチ 公開手順(ブラウザだけで完結)

このデモを「みんながアクセスできるURL」として無料で公開する手順です。
**ターミナル操作は一切不要**。すべてブラウザで完結します。所要時間 約5分・費用 ¥0。

---

## ステップ1:Vercelにログイン

1. ブラウザで https://vercel.com を開く
2. 右上「Sign Up」または「Log In」
3. **「Continue with GitHub」** を選ぶ(リポジトリがGitHubにあるため、GitHubアカウントでログインするのが一番スムーズ)
4. GitHubのログイン画面が出たら、`daisukeyamaoka-bizmote` のアカウントでログイン

---

## ステップ2:プロジェクトをインポート

1. ログイン後、ダッシュボードの **「Add New...」→「Project」** をクリック
2. 「Import Git Repository」の一覧から **`daisukeyamaoka-bizmote/onikana`** を探す
   - 見つからない場合 →「Adjust GitHub App Permissions」をクリックして、`onikana` リポジトリへのアクセスを許可
3. `onikana` の右の **「Import」** をクリック

---

## ステップ3:公開ブランチを指定(重要)

「Configure Project」画面で:

1. **Framework Preset**:`Next.js` が自動で選ばれている(そのままでOK)
2. **Git Branch / Production Branch** の設定で、ブランチを
   **`claude/onikana-matching-system-blfhT`** に変更する
   - ※ この設定が見当たらない場合は、いったんそのままDeployして、後から
     「Settings → Git → Production Branch」で変更できます
3. **Environment Variables(環境変数)**:何も入力しないでOK
   (デモ版は全データがブラウザ内モックのため、APIキー等は不要)
4. 下の **「Deploy」** をクリック

---

## ステップ4:完成を待つ

- 1〜2分で「Congratulations!」の画面が出る
- `https://onikana-xxxx.vercel.app` のような **公開URL** が発行される
- そのURLをクリックすると、フクワウチのトップページが表示される

このURLを村上社長や社内の方に共有すれば、誰でもアクセスできます。

---

## 公開後:画面を直したくなったら

開発担当(bizmote / Claude)がコードを修正して GitHub に push すると、
**Vercelが自動で1〜2分後に本番へ反映**します。山岡さん側の作業は不要です。

```
コード修正 → GitHubにpush → Vercelが自動デプロイ → 本番URLが更新
```

---

## 独自ドメインにしたい場合(任意)

`fukuwauchi.com` のような専用URLにしたいときは:

1. ドメインを取得(お名前.com / Google Domains 等、年¥1,500〜3,000)
2. Vercelの「Settings → Domains」でドメインを追加
3. 表示される設定をドメイン会社側に入力
4. SSL(https)はVercelが自動で無料発行

---

## トラブルシューティング

### リポジトリが一覧に出ない
→ ステップ2の「Adjust GitHub App Permissions」で `onikana` を許可。

### ビルドが失敗する(Build Failed)
→ Production Branch が `claude/onikana-matching-system-blfhT` になっているか確認。
   `main` ブランチは空の可能性があります。

### 画面が真っ白 / 古い画面のまま
→ ブラウザで Cmd + Shift + R(強制リロード)。

---

## このデモ版の制約(本番化の前に知っておくこと)

- データはアクセスした人のブラウザ内に保存されます(サーバーには残りません)
- 複数人で同じデータを共有することはまだできません(Phase 2 で対応)
- ログイン機能はまだありません(URLで各ロールに入る方式)

→ これらは2026年7月〜の本実装(Supabase + 認証)で解消されます。
   「触って方向性を確認する」目的には、現状の公開で十分です。
