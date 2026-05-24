import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProductItem, MarketReview } from '@/types/marketplace';
import { ProductDetailClient } from '@/components/pasar/ProductDetailClient';
import { notFound } from 'next/navigation';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate Dynamic SEO Metadata
export async function generateMetadata(props: ProductDetailPageProps): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from('market_items')
    .select('title, description, image_url')
    .eq('id', params.id)
    .single();

  if (!item) return { title: 'Barang tidak ditemukan - Teras Warga' };

  return {
    title: `${item.title} | Teras Warga`,
    description: item.description || 'Lihat barang menarik ini di Teras Warga Marketplace.',
    openGraph: {
      title: item.title,
      images: item.image_url ? [item.image_url] : [],
    },
  };
}

export default async function ProductDetailPage(props: ProductDetailPageProps) {
  const params = await props.params;
  const supabase = await createClient();
  
  // 1. Fetch Product and Seller Profile
  const { data: itemData, error: itemError } = await supabase
    .from('market_items')
    .select(`
      *,
      seller:profiles(
        id,
        full_name,
        username,
        avatar_url,
        crypto_wallet,
        is_seller,
        last_active
      )
    `)
    .eq('id', params.id)
    .single();

  if (itemError || !itemData) {
    notFound();
  }

  // 2. Fetch Reviews for this product
  const { data: reviewsData } = await (supabase as any)
    .from('market_reviews')
    .select(`
      id,
      item_id,
      reviewer_id,
      rating,
      comment,
      created_at,
      reviewer:profiles(
        full_name,
        username,
        avatar_url
      )
    `)
    .eq('item_id', params.id)
    .order('created_at', { ascending: false });

  // 3. Current logged in user
  const { data: { user } } = await supabase.auth.getUser();

  const product: ProductItem = {
    ...itemData,
    seller: itemData.seller as any,
    reviews: reviewsData as any || [],
  };

  // 4. Fetch Recommendations (from other sellers)
  const { data: relatedItems } = await supabase
    .from('market_items')
    .select(`
      id,
      title,
      description,
      price_idr,
      image_url,
      category,
      condition,
      location,
      is_active,
      created_at,
      user_id,
      profiles:user_id (full_name, username, avatar_url, crypto_wallet)
    `)
    .neq('user_id', itemData.user_id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  const formattedRelatedItems = (relatedItems || []).map((item: any) => ({
    ...item,
    seller_name: item.profiles?.full_name || "Anonymous",
    seller_username: item.profiles?.username || "anonymous",
    seller_avatar: item.profiles?.avatar_url || null,
    seller_crypto_wallet: item.profiles?.crypto_wallet || null,
    timeAgo: "Baru saja", // Simplified for related items
  }));

  return (
    <div className="pb-24 lg:pb-10">
      <ProductDetailClient
        product={product}
        currentUserId={user?.id || null}
        relatedProducts={formattedRelatedItems}
      />
    </div>
  );
}
