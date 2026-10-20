import { getShopPolicy, type PolicyKind } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';
import ContentPage from '../components/ContentPage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/** Renders a policy written in Shopify Admin > Settings > Policies. The HTML comes from your own store. */
export default function PolicyPage({ kind, title }: { kind: PolicyKind; title: string }) {
  const { data, loading, error } = useAsync(() => getShopPolicy(kind), [kind]);
  return (
    <ContentPage title={title}>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && !data?.body && <p className="text-stone">This policy hasn't been added yet. Add it in Shopify Admin under Settings, then Policies.</p>}
      {data?.body && (
        <div className="leading-relaxed text-stone [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-medium [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-4"
          dangerouslySetInnerHTML={{ __html: data.body }} />
      )}
    </ContentPage>
  );
}
