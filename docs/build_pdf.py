#!/usr/bin/env python3
# フクワウチ 打ち合わせアジェンダ → PDF 生成スクリプト
# weasyprint で各スライドを1ページ(横向き)として描画する。
# JSスライドのHTMLとは別に、印刷最適化したマークアップをここで組む。

from weasyprint import HTML

RED = "#D8281D"
BLUE = "#1E4FA3"
SAND = "#EBE1C2"
SAND50 = "#FAF6E9"
INK = "#0A0A0A"
MIST = "#737373"
MIST300 = "#D4D4D4"

CSS = f"""
@page {{ size: 297mm 167mm; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: "Noto Sans CJK JP","Noto Sans JP","Hiragino Kaku Gothic ProN",sans-serif; color: {INK}; }}
.slide {{
  position: relative; width: 297mm; height: 167mm;
  padding: 16mm 22mm; page-break-after: always; overflow: hidden;
  background: #fff;
}}
.slide:last-child {{ page-break-after: auto; }}
.kicker {{ font-size: 10pt; letter-spacing: .25em; color: {MIST}; font-weight: 700; margin-bottom: 6mm; }}
.bartop {{ height: 4px; width: 56px; background: {RED}; border-radius: 2px; margin-bottom: 9mm; }}
.bartop.blue {{ background: {BLUE}; }}
h1 {{ font-size: 30pt; line-height: 1.18; font-weight: 800; letter-spacing: -.01em; }}
h2 {{ font-size: 21pt; line-height: 1.25; font-weight: 800; margin-bottom: 3mm; }}
.lead {{ font-size: 12pt; color: {MIST}; margin-top: 4mm; line-height: 1.7; }}
.foot {{ position: absolute; left: 22mm; right: 22mm; bottom: 9mm; display: flex;
  justify-content: space-between; font-size: 8pt; color: {MIST}; }}
.brand {{ font-weight: 800; color: {INK}; }}
.brand .mk {{ display: inline-block; width: 16px; height: 16px; border-radius: 4px; background: {RED};
  color: #fff; text-align: center; line-height: 16px; font-size: 8pt; margin-right: 5px; }}
.pageno {{ font-variant-numeric: tabular-nums; }}

/* cover */
.cover {{ background: {SAND50}; }}
.pill {{ display: inline-block; border: 1px solid {MIST300}; border-radius: 999px;
  padding: 2mm 4mm; font-size: 9pt; color: {MIST}; margin-bottom: 8mm; }}
.logo {{ font-size: 40pt; font-weight: 900; letter-spacing: -.02em; }}
.logo .a {{ color: {RED}; }} .logo .b {{ color: {BLUE}; }}
.tag {{ font-size: 13pt; color: {MIST}; margin-top: 2mm; }}
.meta {{ margin-top: 12mm; font-size: 10pt; color: {MIST}; line-height: 2; }}

/* qlist */
.qlist {{ margin-top: 7mm; }}
.q {{ border-left: 3px solid {RED}; padding: 1mm 0 1mm 5mm; margin-bottom: 5mm; }}
.q.blue {{ border-color: {BLUE}; }}
.q .qt {{ font-size: 12.5pt; line-height: 1.5; font-weight: 600; }}
.q .qt .n {{ color: {MIST}; font-weight: 700; margin-right: 3mm; }}
.q .opt {{ display: block; font-size: 9.5pt; color: {MIST}; font-weight: 400; margin-top: 1mm; }}
.chips {{ margin-top: 7mm; }}
.chip {{ display: inline-block; background: {SAND}; color: {INK}; border-radius: 999px;
  padding: 1.5mm 4mm; font-size: 9pt; font-weight: 700; margin-right: 3mm; }}

/* category grid */
.cats {{ margin-top: 7mm; }}
.cat {{ display: inline-block; vertical-align: top; width: 48%; border: 1px solid {MIST300};
  border-radius: 10px; padding: 5mm 6mm; margin: 0 1% 3mm 0; }}
.cat .n {{ display: inline-block; width: 26px; height: 26px; border-radius: 7px; background: {INK};
  color: #fff; text-align: center; line-height: 26px; font-weight: 700; font-size: 10pt; margin-right: 4mm; }}
.cat.red .n {{ background: {RED}; }} .cat.blue .n {{ background: {BLUE}; }}
.cat .h {{ font-size: 11.5pt; font-weight: 700; display: inline; }}
.cat .p {{ font-size: 9pt; color: {MIST}; margin-top: 1.5mm; line-height: 1.5; }}
.cat3 {{ width: 31%; }}

/* steps */
.steps {{ margin-top: 7mm; }}
.step {{ margin-bottom: 4mm; font-size: 12pt; }}
.step .dot {{ display: inline-block; width: 11px; height: 11px; border-radius: 50%;
  background: {MIST300}; margin-right: 4mm; vertical-align: middle; }}
.step.done .dot {{ background: {BLUE}; }}
.step.now .dot {{ background: {RED}; }}
.step b {{ font-weight: 700; }}
.step span {{ color: {MIST}; font-size: 9.5pt; margin-left: 3mm; }}

/* cost */
.cost {{ margin-top: 7mm; }}
.cc {{ display: inline-block; vertical-align: top; width: 47%; border: 1px solid {MIST300};
  border-radius: 12px; padding: 7mm; margin-right: 2%; }}
.cc.blue {{ background: {BLUE}; color: #fff; border-color: {BLUE}; }}
.cc .l {{ font-size: 9.5pt; color: {MIST}; }}
.cc.blue .l, .cc.blue .s {{ color: rgba(255,255,255,.85); }}
.cc .big {{ font-size: 26pt; font-weight: 900; margin-top: 1mm; font-variant-numeric: tabular-nums; }}
.cc .s {{ font-size: 9pt; color: {MIST}; margin-top: 3mm; line-height: 1.5; }}

/* closing */
.closing {{ background: {INK}; color: #fff; }}
.closing h1 {{ color: #fff; }}
.closing .kicker {{ color: rgba(255,255,255,.6); }}
.closing .lead {{ color: rgba(255,255,255,.7); }}
.act {{ margin-top: 9mm; }}
.act .row {{ font-size: 12.5pt; margin-bottom: 3mm; }}
.act .num {{ display: inline-block; width: 24px; height: 24px; border-radius: 6px; background: {RED};
  color: #fff; text-align: center; line-height: 24px; font-weight: 700; font-size: 9pt; margin-right: 4mm; }}
"""

def foot(n):
    return f'<div class="foot"><span class="brand"><span class="mk">福</span>フクワウチ</span><span class="pageno">{n:02d} / 15</span></div>'

slides = []

# 1 cover
slides.append(f'''<div class="slide cover">
  <div class="pill">本実装キックオフ前ミーティング ・ 2026年7月</div>
  <div class="logo"><span class="a">フク</span><span class="b">ワウチ</span></div>
  <div class="tag">福を、企業へ。</div>
  <h1 style="margin-top:11mm;font-size:24pt;">本稼働に向けて<br>決めておきたいこと</h1>
  <div class="meta">株式会社オニカナ 御中(村上 様)<br>bizmote株式会社 山岡 大介<br>AIビジネスマッチングプラットフォーム「フクワウチ」</div>
  {foot(1)}</div>''')

# 2 purpose
slides.append(f'''<div class="slide">
  <div class="bartop"></div><div class="kicker">本日の位置づけ</div>
  <h2>デモは無事完了。次は「本稼働の設計」を固めます。</h2>
  <p class="lead">先日のデモで、画面の方向性・体験フローはご納得いただけました。<br>
  本日は、実際にお客様が使う「本番システム」を作り始める前に、<br>
  <b>運用・課金・契約のルールを一緒に確定する</b>ための打ち合わせです。</p>
  <div class="chips"><span class="chip">今日のゴール = 本実装の判断材料をすべて揃える</span>
  <span class="chip">即決は不要・持ち帰り検討OK</span></div>
  {foot(2)}</div>''')

# 3 status
slides.append(f'''<div class="slide">
  <div class="bartop blue"></div><div class="kicker">これまでの歩み</div><h2>現在地</h2>
  <div class="steps">
    <div class="step done"><span class="dot"></span><b>要件定義・MVPデモ完成</b><span>3画面・5軸AIマッチング・25画面</span></div>
    <div class="step done"><span class="dot"></span><b>フクワウチへリブランド</b><span>鬼の朱・群青・福の砂色の3色</span></div>
    <div class="step done"><span class="dot"></span><b>課金モデル確定</b><span>クライアント無料・支援先がアポ単価を負担</span></div>
    <div class="step done"><span class="dot"></span><b>Phase 2 機能のUI完成</b><span>メッセージ・日程調整・カレンダー連携・リマインド</span></div>
    <div class="step now"><span class="dot"></span><b>本日:本稼働ルールの確定</b><span>← イマココ</span></div>
    <div class="step"><span class="dot"></span><b>7月〜:本実装(データ保存・ログイン・実運用)</b></div>
  </div>{foot(3)}</div>''')

# 4 architecture
slides.append(f'''<div class="slide">
  <div class="bartop"></div><div class="kicker">システムの形(前提共有)</div>
  <h2>「3つのサイト」ではなく「1サイト・3つの顔」</h2>
  <p class="lead">フクワウチは1つのシステム・1つのURL。ログインした人が誰かによって、見える画面が切り替わります(Gmailと同じ発想)。</p>
  <div class="cats">
    <div class="cat cat3 blue"><span class="n">C</span><span class="h">クライアント</span><div class="p">支援を受けたい企業。無料で利用。</div></div>
    <div class="cat cat3 red"><span class="n">G</span><span class="h">支援先(Giver)</span><div class="p">支援を提供。アポ単価を負担。</div></div>
    <div class="cat cat3"><span class="n">A</span><span class="h">管理者</span><div class="p">オニカナ社内。全体を管理。</div></div>
  </div>
  <div class="chips"><span class="chip">作るのは1つ・保守も1つ・費用も1つ分(月1万円以内)</span></div>
  {foot(4)}</div>''')

# 5 agenda overview
slides.append(f'''<div class="slide">
  <div class="bartop blue"></div><div class="kicker">本日決めたいこと</div><h2>7つのテーマ</h2>
  <div class="cats">
    <div class="cat red"><span class="n">1</span><span class="h">課金・契約</span><div class="p">成果報酬率・入金定義・契約締結</div></div>
    <div class="cat blue"><span class="n">2</span><span class="h">データ・オペレーション</span><div class="p">1,200社データ・役職判定・審査</div></div>
    <div class="cat red"><span class="n">3</span><span class="h">課金ルールの細部</span><div class="p">キャンセル時・請求サイクル</div></div>
    <div class="cat blue"><span class="n">4</span><span class="h">機能・仕様</span><div class="p">メッセージ開通・カレンダー・通知</div></div>
    <div class="cat red"><span class="n">5</span><span class="h">マルチユーザー</span><div class="p">部署別・メンバー招待</div></div>
    <div class="cat blue"><span class="n">6</span><span class="h">法務・コンプラ</span><div class="p">規約・個人情報・特商法</div></div>
  </div>
  <div class="chips"><span class="chip">＋ 7. GTM・運用(本稼働の判断基準・移行目標)</span></div>
  {foot(5)}</div>''')

def theme(num, total, title, color, items, chip=None, lead=None):
    bar = "blue" if color == "blue" else ""
    qcls = "blue" if color == "blue" else ""
    body = ""
    if lead:
        body += f'<p class="lead" style="margin-top:2mm;font-size:11pt;">{lead}</p>'
    body += '<div class="qlist">'
    for n, t, opt in items:
        body += f'<div class="q {qcls}"><div class="qt"><span class="n">{n}</span>{t}<span class="opt">{opt}</span></div></div>'
    body += '</div>'
    if chip:
        body += f'<div class="chips"><span class="chip">{chip}</span></div>'
    return f'''<div class="slide">
  <div class="bartop {bar}"></div><div class="kicker">テーマ {num} / 7</div><h2>{title}</h2>
  {body}{foot(num+5)}</div>'''

slides.append(theme(1,7,"課金・契約(最優先)","red",[
  ("1","成果報酬の最終料率","提案:7%(業界相場5〜15%の中間)/ 譲歩ライン 5%"),
  ("2","「入金確定」の定義","商談実施時 / 月締め / オニカナへの実入金時 — どれを基準に成果発生とするか"),
  ("3","「プラットフォーム経由」の定義","既存顧客がフクワウチ上で再発注した場合は料率対象に含むか"),
  ("4","契約書の締結","期間 / 解約条件(60日前通知)/ 知財帰属 / エスクローオプション"),
]))
slides.append(theme(2,7,"データ・オペレーション","blue",[
  ("5","1,200社の実データ","受領形式(Excel / CRM / 名刺)と受領タイミング・どのフェーズで取り込むか"),
  ("6","役職判定の根拠","アポ単価を決める役職は誰がいつ確認するか(名刺 / 自己申告 / オニカナ確認)"),
  ("7","支援先(Giver)の審査基準","会員登録の承認基準(実績 / 業種 / 推薦)・誰が審査するか"),
  ("8","過去の商談・売上データ","デモの数字を実数字に置き換えるための提供可否"),
]))
slides.append(theme(3,7,"課金ルールの細部","red",[
  ("9","商談キャンセル・ノーショウ時の課金","当日キャンセルでアポ単価は発生するか(全額 / 半額 / なし)"),
  ("10","アポ単価の固定/変動","役職別 ¥30,000 / ¥50,000 / ¥90,000 を維持するか"),
  ("11","支援先への請求サイクル","都度請求 / 月次まとめ請求"),
], chip="確定済み:アポ単発のみ・予算上限なし"))
slides.append(theme(4,7,"機能・仕様の確定","blue",[
  ("12","メッセージ開通のタイミング","支援先の承諾後(現案)/ LIKE時点 / マッチング確定時"),
  ("13","カレンダー連携の対象","双方 / 支援先のみ ・ 連携は任意か必須か"),
  ("14","リマインドの初期値","24時間前 + 1時間前(現案)で良いか"),
  ("15","管理画面の権限分け","村上さん1人か複数社員か・権限階層の要否"),
  ("16","管理画面のアクセス制限方式","同一サイト内制限 / 別URL化"),
]))
slides.append(theme(5,7,"マルチユーザー化(Phase 2.5)","red",[
  ("17","メンバー招待フロー","招待メールの文面・審査の要否"),
  ("18","部署マスタの最終確定","12固定リスト + 自由記述で過不足ないか"),
  ("19","会社全体の状況をMemberにどこまで開示するか","他メンバーの動きの可視範囲"),
], chip="確定済み:ロール2階層(Owner / Member)・部署12固定+自由記述",
   lead="1企業=複数のキーパーソンを登録し、部署別に最適な提案を届ける構想。"))
slides.append(theme(6,7,"法務・コンプライアンス(本番公開前 必須)","blue",[
  ("20","プライバシーポリシー","氏名・メアド・電話など個人情報の取り扱い明示"),
  ("21","特定商取引法表記","課金が発生するため必須"),
  ("22","利用規約","クライアント / 支援先向け ・ 弁護士レビューの要否"),
  ("23","データ保管・バックアップ方針","保管場所・期間・バックアップ頻度"),
]))
slides.append(theme(7,7,"GTM・運用","red",[
  ("24","本稼働の判断基準","テスト稼働3ヶ月で何が達成されればGOか"),
  ("25","既存案件の移行率目標","プラットフォーム経由をどの割合まで上げるか"),
  ("26","Phase 2以降の優先順位","メッセージ / マルチユーザー / 日程調整RPA / 月次請求自動化"),
]))

# 13 schedule
slides.append(f'''<div class="slide">
  <div class="bartop blue"></div><div class="kicker">決定後の流れ</div><h2>本実装スケジュール(6〜8ヶ月)</h2>
  <div class="steps">
    <div class="step now"><span class="dot"></span><b>1ヶ月目</b><span>本日の論点確定・Supabase/認証の基盤構築</span></div>
    <div class="step"><span class="dot"></span><b>2〜3ヶ月目</b><span>メッセージ・日程調整・カレンダー連携の本実装 / テスト稼働</span></div>
    <div class="step"><span class="dot"></span><b>4ヶ月目</b><span>本稼働開始(既存案件の一部を経由に)</span></div>
    <div class="step"><span class="dot"></span><b>5ヶ月目</b><span>本稼働定着・マルチユーザー着手</span></div>
    <div class="step"><span class="dot"></span><b>6ヶ月目〜</b><span>保守運用へ移行・AI Coordinator等の拡張</span></div>
  </div>{foot(13)}</div>''')

# 14 cost
slides.append(f'''<div class="slide">
  <div class="bartop"></div><div class="kicker">費用の前提(再確認)</div>
  <h2>インフラ費用は bizmote 負担・月1万円以内</h2>
  <div class="cost">
    <div class="cc"><div class="l">パイロット期(社内確認)</div><div class="big">¥0〜3,000</div>
    <div class="s">無料枠で公開。クレジットカード登録も不要。</div></div>
    <div class="cc blue"><div class="l">本番期(実運用)</div><div class="big">¥7,000〜10,000</div>
    <div class="s">/月 ・ Supabase等の有料プラン。数万ユーザーまでこの範囲。</div></div>
  </div>
  <div class="chips"><span class="chip">初期費用ほぼ¥0(独自ドメイン年¥3,000のみ)</span>
  <span class="chip">UI・文言・項目は公開後もいつでも変更可</span></div>
  {foot(14)}</div>''')

# 15 closing
slides.append(f'''<div class="slide closing">
  <div class="bartop"></div><div class="kicker">本日のゴールと次のアクション</div>
  <h1 style="font-size:23pt;">論点が固まれば、<br>7月から本実装を開始できます。</h1>
  <div class="act">
    <div class="row"><span class="num">1</span>テーマ1〜7のうち、その場で決められるものを確定</div>
    <div class="row"><span class="num">2</span>持ち帰り検討が必要な項目は、次回までの宿題に</div>
    <div class="row"><span class="num">3</span>確定分から順に、本実装の設計に着手</div>
  </div>
  <p class="lead" style="margin-top:9mm;">即決は求めません。1週間の検討期間を取っていただいて構いません。<br>
  まずは、優先度の高い「課金・契約」だけでも方向性をいただければ前に進められます。</p>
  {foot(15)}</div>''')

html = f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(slides)}</body></html>'

out = "/home/user/ONIKANA/docs/フクワウチ_打ち合わせアジェンダ.pdf"
HTML(string=html).write_pdf(out)
print("written:", out)
