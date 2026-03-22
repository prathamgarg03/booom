import type { NoticeState } from "../lib/studio";
import { Alert, AlertDescription } from "./ui/alert";

type NoticeBannerProps = {
  notice: NoticeState;
};

export function NoticeBanner({ notice }: NoticeBannerProps) {
  if (!notice.error && !notice.success) return null;

  return (
    <div className="shrink-0 border-b border-border/50 px-4 py-3">
      {notice.error ? (
        <Alert className="border-destructive/30 text-destructive" variant="destructive">
          <AlertDescription>{notice.error}</AlertDescription>
        </Alert>
      ) : null}
      {notice.success ? (
        <Alert>
          <AlertDescription>{notice.success}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
