import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY, PLAYLIST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const session = await auth();

  const [{ data: posts }, editorData] = await Promise.all([
    sanityFetch({ query: STARTUPS_QUERY, params }),
    sanityFetch({ 
      query: PLAYLIST_BY_SLUG_QUERY, 
      params: { slug: "editor-picks" } 
    }).catch(() => ({ data: null }))
  ]);

  const editorPicks = editorData?.data?.select || [];
  console.log("Editor Data:", editorData?.data);
  console.log("Editor Picks:", editorPicks);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect With Entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>

        <SearchForm query={query} />
      </section>

      {editorPicks.length > 0 && (
        <section className="section_container">
          <p className="text-30-semibold">Editor's Picks</p>
          <ul className="mt-7 card_grid">
            {editorPicks.map((post: StartupTypeCard) => (
              <StartupCard key={post._id} post={post} />
            ))}
          </ul>
        </section>
      )}

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}