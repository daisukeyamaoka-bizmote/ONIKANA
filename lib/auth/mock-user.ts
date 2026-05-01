// MVPデモ用の固定ダミーユーザー
// 将来的に Supabase Auth に切り替える際は、ここを差し替える

export const MOCK_CLIENT = {
  id: "c001",
  name: "株式会社サンライト精機",
  contactPerson: "山田 太郎",
  email: "yamada@sunlight-seiki.example.jp",
};

export const MOCK_SUPPLIER = {
  id: "s001",
  name: "株式会社ピープルブリッジ",
  contactPerson: "佐藤 花子",
  email: "sato@peoplebridge.example.jp",
};

export const MOCK_ADMIN = {
  id: "admin001",
  name: "村上",
  role: "オニカナ管理者",
};
