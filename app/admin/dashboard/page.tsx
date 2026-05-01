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

const ROLE_COLORS: Record<MeetingTargetRole, string> = {
  staff: "#2E86AB",
  manager: "#1F4E79",
  executive: "#ED7D31",
};

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
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1F4E79"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#2E86AB" }}
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
                      border: "1px solid #E5E7EB",
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#2E86AB"
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

      <div className="mt-8 rounded-2xl bg-navy text-white p-6">
        <p className="text-xs uppercase tracking-widest text-aqua-100/80">
          月次サマリー
        </p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-white/60">オニカナ売上</p>
            <p className="num-emphasis text-3xl font-bold">
              {formatYen(totalRevenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60">bizmote 成果報酬</p>
            <p className="num-emphasis text-3xl font-bold text-supplier">
              {formatYen(bizmoteFee)}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60">完了商談数</p>
            <p className="num-emphasis text-3xl font-bold">
              {formatNumber(completed.length)}件
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
