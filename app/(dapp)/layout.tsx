import { BaseLayout } from "@/app/layout/base-layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout showFooter={true}>{children}</BaseLayout>;
}
