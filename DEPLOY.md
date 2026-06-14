# Vercel 公開URL 発行手順(任意・推奨)

社長との打ち合わせがオンラインだったり、後でURLを共有したい場合に使ってください。
所要時間: 約3分。費用: 無料(Hobbyプラン)。

## 推奨:ブラウザから直接インポート(最も簡単)

1. https://vercel.com にアクセスし、GitHubアカウントでログイン
2. 右上「Add New」→「Project」
3. リポジトリ一覧から `daisukeyamaoka-bizmote/onikana` を選択(なければ "Adjust GitHub App Permissions" でリポジトリを許可)
4. **Configure Project** 画面で:
   - **Framework Preset**: Next.js (自動検出されます)
   - **Branch**: `claude/onikana-matching-system-blfhT` を選択
   - **Environment Variables**: 設定不要(全てダミーデータで動作します)
5. 「Deploy」ボタンをクリック
6. 約2分後、`https://onikana-xxx.vercel.app` のような公開URLが発行されます

そのURLが、村上社長にそのまま共有できるデモURLです。

---

## CLIから直接デプロイする場合

Node.jsとnpmが入っている前提。リポジトリのルートディレクトリで:

```bash
# 初回のみ:
npx vercel login
# → ブラウザが開いてログインを促されるので Email or GitHub でログイン

# デプロイ:
npx vercel
# → 以下のように聞かれます。エンターを押すか短く回答:
#   Set up and deploy "~/ONIKANA"? → Y
#   Which scope? → 自分のアカウント or チームを選択
#   Link to existing project? → N
#   What's your project's name? → onikana(エンターでOK)
#   In which directory is your code? → ./(エンターでOK)
#   Want to modify these settings? → N

# 完了するとプレビューURLが表示されます。本番URLを作りたい場合は:
npx vercel --prod
```

`--prod` をつけると本番環境用のURLが発行され、これが安定URLです(ブランチ更新時に上書きされる)。

---

## デプロイ後の確認

公開URLにアクセスして以下を確認してください:

- [ ] トップページが表示される
- [ ] 「クライアントとして見る」を押してアンケート画面が出る
- [ ] アンケートを最後まで進めるとAIレコメンドTop10が出る
- [ ] 管理者画面でグラフが描画される

すべてOKならデモ準備完了です。

---

## トラブルシューティング

### `vercel: command not found`
→ `npx vercel` を使ってください(npxは自動で取得して実行します)。

### ビルドエラー
→ ローカルで `npm run build` が通ることを確認してください(現状は通る状態にしています)。

### URLにアクセスしても画面が崩れる
→ Vercelの「Deployments」タブから最新デプロイのログを確認。
   よくあるのは「Branch指定ミス」「Environment Variables指定ミス」です。

---

## 公開URLができたら

このREADME.mdの先頭か、提案書の表紙にURLを記載しておくと、村上社長がいつでも見返せて便利です。
