import { BaseLayout } from "@/app/layout/base-layout";
import { NotFoundPage } from "@/components/notfound/NotfoundPage";

export default async function NotFound() {
  return (
    <BaseLayout>
      <NotFoundPage />
    </BaseLayout>
  );
}
