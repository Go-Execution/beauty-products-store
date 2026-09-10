import ProductDetailClient from './ProductDetailClient';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProductDetailClient id={resolvedParams.id} />;
}
