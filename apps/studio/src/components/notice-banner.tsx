import type { NoticeState } from "../lib/studio";

type NoticeBannerProps = {
  notice: NoticeState;
};

export function NoticeBanner({ notice }: NoticeBannerProps) {
  return (
    <>
      {notice.error ? <p className="notice notice-error">{notice.error}</p> : null}
      {notice.success ? <p className="notice notice-success">{notice.success}</p> : null}
    </>
  );
}
