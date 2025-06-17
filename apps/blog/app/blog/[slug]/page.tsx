export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/articles/${slug}.mdx`);

  return <Post />;
}

export const generateStaticParams = () => [
  { slug: 'welcome' },
  { slug: 'about' },
];

export const dynamicParams = false;
