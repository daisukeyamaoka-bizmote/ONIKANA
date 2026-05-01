import { Badge } from "@/components/ui/badge";
import { type MatchStatus, MATCH_STATUS_LABELS } from "@/types";

const VARIANT_MAP: Record<
  MatchStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  recommended: "outline",
  liked: "pink",
  super_liked: "red",
  auto_offered: "warn",
  accepted: "success",
  rejected: "muted",
  matched: "navy",
  completed: "success",
  cancelled: "muted",
};

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  return (
    <Badge variant={VARIANT_MAP[status]}>{MATCH_STATUS_LABELS[status]}</Badge>
  );
}
