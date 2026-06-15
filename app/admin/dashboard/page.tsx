"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { MatchStatusBadge } from "@/components/shared/match-status-badge";
import { DUMMY_MATCHES } from "@/lib/dummy-data/matches";
import { DUMMY_SUPPLIERS } from "@/lib/dummy-data/suppliers";
import { DUMMY_CLIENTS } from "@/lib/dummy-data/clients";
import { findClientById } from "@/lib/dummy-data/clients";
import { findSupplierById } from "@/lib/dummy-data/suppliers";
import { useMatchStore } from "@/lib/store/match-store";
import {
  CHALLENGE_LABELS,
  ROLE_LABELS,
  type ChallengeCategory,
  type MeetingTargetRole,
} from "@/types";
import { calculateBizmoteFee } from "@/lib/pricing/calculator";
import { formatYen, formatNumber, formatDateTime } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// モノクロ統一: 役職を濃淡で識別
const ROLE_COLORS: Record<MeetingTargetRole, string> = {
  staff: "#A3A3A3",      // mist-400
  manager: "#525252",    // mist-600
  executive: "#0F0F0F",  // ink
};
const CHART_INK = "#0F0F0F";
const CHART_GRID = "#E5E5E5";

const MONTHLY_TREND = [
  { month: "11月", count: 78, revenue: 4200000 },
  { month: "12月", count: 85, revenue: 4800000 },
  { month: "1月", count: 92, revenue: 5100000 },
  { month: "2月", count: 95, revenue: 5300000 },
  { month: "3月", count: 102, revenue: 5800000 },
  { month: "4月", count: 108, revenue: 6200000 },
];

export default function AdminDashboard() {
  const overrides = useMatchStore((s) => s.overrides);
  const matches = DUMMY_MATCHES.map((m) => ({
    ...m,
    status: overrides[m.id]?.status ?? m.status,
  }));

  const completed = matches.filter((m) => m.status === "completed");
  const totalRevenue = completed.reduce(
    (sum, m) => sum + (m.meetingPrice ?? 0),
    0,
  );
  const bizmoteFee = calculateBizmoteFee(totalRevenue);
  const avgPrice =
    completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;
  const totalMatches = matches.length;
  const successRate =
    totalMatches > 0
      ? Math.round((completed.length / totalMatches) * 100)
      : 0;

  // 役職別単価分布
  const roleDist = (Object.keys(ROLE_LABELS) as MeetingTargetRole[]).map(
    (role) => ({
      name: ROLE_LABELS[role],
      value: completed.filter((m) => m.targetRole === role).length,
      role,
    }),
  );

  // 課題カテゴリ別マッチング件数
  const categoryDist = (Object.keys(CHALLENGE_LABELS) as ChallengeCategory[])
    .map((cat) => {
      const count = matches.filter((m) => {
        const c = findClientById(m.clientId);
        return c?.challenges?.includes(cat);
      }).length;
      return { name: CHALLENGE_LABELS[cat], count };
    })
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

  const recent = [...matches]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
          KPIダッシュボード
        </h1>
        <p className="mt-1 text-sm text-navy-900/60">
          オニカナの全体パフォーマンスを一覧表示。
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          label="商談成立件数"
          value={`${completed.length}件`}
          accent="navy"
          trend={{ direction: "up", value: "+12%" }}
          hint="前月比"
        />
        <StatCard
          label="平均商談単価"
          value={formatYen(avgPrice)}
          accent="aqua"
        />
        <StatCard
          label="月次売上(オニカナ)"
          value={formatYen(totalRevenue)}
          accent="navy"
        />
        <StatCard
          label="bizmote成果報酬(5%)"
          value={formatYen(bizmoteFee)}
          accent="supplier"
        />
        <StatCard
          label="クライアント / 支援先"
          value={`${DUMMY_CLIENTS.length} / ${DUMMY_SUPPLIERS.length}`}
          accent="aqua"
        />
        <StatCard
          label="マッチング成立率"
          value={`${successRate}%`}
          accent="success"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardContent>
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              直近6ヶ月の月次商談件数推移
            </h2>
            <div className="h-64 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                  <XAxis dataKey="month" stroke="#737373" fontSize={12} />
                  <YAxis stroke="#737373" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E5E5E5",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={CHART_INK}
                    strokeWidth={2}
                    dot={{ r: 4, fill: CHART_INK }}
                    name="商談件数"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              役職別 商談単価分布
            </h2>
            <div className="h-64 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDist}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {roleDist.map((entry) => (
                      <Cell
                        key={entry.role}
                        fill={ROLE_COLORS[entry.role]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E5E5E5",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardContent>
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              課題カテゴリ別 マッチング件数
            </h2>
            <div className="h-72 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                  <XAxis type="number" stroke="#737373" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    stroke="#737373"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E5E5E5",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={CHART_INK}
                    radius={[0, 4, 4, 0]}
                    name="件数"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              直近のマッチング進捗
            </h2>
            <ul className="divide-y divide-navy/10">
              {recent.map((m) => {
                const c = findClientById(m.clientId);
                const s = findSupplierById(m.supplierId);
                if (!c || !s) return null;
                return (
                  <li key={m.id} className="py-3">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-navy-900 truncate">
                        {c.name}
                      </span>
                      <MatchStatusBadge status={m.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-navy-900/60 truncate">
                      → {s.name}
                    </p>
                    <p className="text-xs text-navy-900/40 mt-0.5">
                      {formatDateTime(m.updatedAt)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-navy-900 mb-1">
              支援先別 月次請求額(課金対象)
            </h2>
            <p className="text-xs text-navy-900/60 mb-4">
              アポを獲得した支援先に対する月次請求金額です。クライアントは無料利用。
            </p>
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-navy-900/60 border-b border-mist-200">
                <tr>
                  <th className="py-2 font-medium">支援先</th>
                  <th className="py-2 font-medium text-right">商談件数</th>
                  <th className="py-2 font-medium text-right">請求額</th>
                  <th className="py-2 font-medium text-right">bizmote手数料(5%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {(() => {
                  const map = new Map<string, { count: number; total: number }>();
                  completed.forEach((m) => {
                    const prev = map.get(m.supplierId) ?? { count: 0, total: 0 };
                    prev.count += 1;
                    prev.total += m.meetingPrice ?? 0;
                    map.set(m.supplierId, prev);
                  });
                  const rows = Array.from(map.entries())
                    .map(([sid, v]) => ({
                      supplier: findSupplierById(sid),
                      ...v,
                    }))
                    .filter((r) => r.supplier)
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 8);
                  return rows.map((r) => (
                    <tr key={r.supplier!.id}>
                      <td className="py-2 text-navy-900">{r.supplier!.name}</td>
                      <td className="py-2 text-right text-navy-900/80 num-emphasis">
                        {r.count}件
                      </td>
                      <td className="py-2 text-right num-emphasis font-semibold text-navy-900">
                        {formatYen(r.total)}
                      </td>
                      <td className="py-2 text-right num-emphasis text-navy-900/70">
                        {formatYen(Math.floor(r.total * 0.05))}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 rounded-2xl bg-ink text-paper p-6">
        <p className="text-xs uppercase tracking-widest text-paper/60">
          月次サマリー
        </p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-paper/60">オニカナ売上(支援先請求額合計)</p>
            <p className="num-emphasis text-3xl font-bold">
              {formatYen(totalRevenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-paper/60">bizmote 成果報酬(5%)</p>
            <p className="num-emphasis text-3xl font-bold">
              {formatYen(bizmoteFee)}
            </p>
          </div>
          <div>
            <p className="text-xs text-paper/60">完了商談数</p>
            <p className="num-emphasis text-3xl font-bold">
              {formatNumber(completed.length)}件
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
