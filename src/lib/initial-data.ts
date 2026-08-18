import { prisma } from "./db/prisma";
import bcrypt from "bcryptjs";

export const INITIAL_GENRES = [
  { name: "Fantasy", slug: "fantasy" },
  { name: "Science Fiction", slug: "sci-fi" },
  { name: "Mystery", slug: "mystery" },
  { name: "Literary Fiction", slug: "literary-fiction" },
  { name: "Poetry", slug: "poetry" },
  { name: "Romance", slug: "romance" },
  { name: "Horror", slug: "horror" },
  { name: "Essay & Memoir", slug: "essay-memoir" },
  { name: "Thriller", slug: "thriller" },
  { name: "Historical Fiction", slug: "historical-fiction" },
];

export async function seedInitialDatabase() {
  // Check if genres exist
  const existingGenreCount = await prisma.genre.count();
  if (existingGenreCount === 0) {
    for (const genre of INITIAL_GENRES) {
      await prisma.genre.upsert({
        where: { slug: genre.slug },
        create: genre,
        update: {},
      });
    }
  }

  // Check if demo users exist
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    // Create demo writers
    const elena = await prisma.user.create({
      data: {
        username: "elena_vance",
        email: "elena@writely.dev",
        displayName: "Elena Vance",
        passwordHash,
        bio: "Novelist & Essayist exploring memory, quiet landscapes, and the spaces between words. Author of 'The Glass Arch'.",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        location: "Edinburgh, Scotland",
        website: "https://writely.dev",
        genres: "Literary Fiction,Poetry,Essay & Memoir",
        writerType: "Novelist",
      },
    });

    const julian = await prisma.user.create({
      data: {
        username: "julian_k",
        email: "julian@writely.dev",
        displayName: "Julian Thorne",
        passwordHash,
        bio: "Speculative fiction author and worldbuilder. Fascinated by ancient stars and near-future cities.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        location: "Seattle, WA",
        genres: "Science Fiction,Fantasy,Thriller",
        writerType: "Sci-Fi Author",
      },
    });

    const maya = await prisma.user.create({
      data: {
        username: "maya_lin",
        email: "maya@writely.dev",
        displayName: "Maya Lin",
        passwordHash,
        bio: "Poet and flash fiction writer. Finding grace in ordinary mornings and fleeting reflections.",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        location: "Kyoto / Toronto",
        genres: "Poetry,Short Story,Romance",
        writerType: "Poet",
      },
    });

    // Connect genres
    const litGenre = await prisma.genre.findUnique({ where: { slug: "literary-fiction" } });
    const scifiGenre = await prisma.genre.findUnique({ where: { slug: "sci-fi" } });
    const poetryGenre = await prisma.genre.findUnique({ where: { slug: "poetry" } });

    // Seed writings
    const w1 = await prisma.writing.create({
      data: {
        title: "The Midnight Train to Oban",
        slug: "the-midnight-train-to-oban",
        content: `<h3>I. The Platform at Midnight</h3>
<p>The train arrived without the customary screech of brakes, its iron wheels gliding over frosted rails like a silver breath across glass. In the dim lantern light of the station, the steam pooled at our ankles, smelling faintly of coal smoke and wet wool.</p>
<blockquote>"Some journeys are not about arriving, but about unburdening the ghosts we carry in our coat pockets."</blockquote>
<p>I found my compartment in Carriage Four. The mahogany panelling was worn smooth at the corners where thousands of elbows had rested before mine. Outside the fogged window, the Scottish highlands receded into a velvet dark, broken only by the sporadic glimmer of a distant croft.</p>
<h3>II. The Unspoken Correspondence</h3>
<p>In my satchel lay three letters, none of them sealed. I had rewritten each of them forty times over the span of seven years. To tell someone you forgive them is simple; to tell them you understand why they left is the truest ache a heart can endure.</p>`,
        excerpt: "The train arrived without the customary screech of brakes, its iron wheels gliding over frosted rails like a silver breath across glass...",
        writingType: "SHORT_STORY",
        visibility: "PUBLIC",
        status: "PUBLISHED",
        coverImage: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80",
        wordCount: 184,
        readingTime: 1,
        authorId: elena.id,
        genreId: litGenre?.id,
        publishedAt: new Date(Date.now() - 3600 * 1000 * 5),
        tags: {
          create: [
            { tag: { connectOrCreate: { where: { name: "journey" }, create: { name: "journey" } } } },
            { tag: { connectOrCreate: { where: { name: "scotland" }, create: { name: "scotland" } } } },
            { tag: { connectOrCreate: { where: { name: "memoir" }, create: { name: "memoir" } } } },
          ],
        },
      },
    });

    const w2 = await prisma.writing.create({
      data: {
        title: "Chronicles of the Celestial Foundry",
        slug: "chronicles-of-the-celestial-foundry",
        content: `<h3>Orbital Station Kepler-9</h3>
<p>The arc welders illuminated the void in rhythmic bursts of blinding cobalt. From five hundred kilometers above the rust-colored storms of Mars, the orbital rings looked like fragile spider silk spun against the abyss.</p>
<p>Commander Kaelen monitored the plasma intake. For six generations, their ancestors had labored inside the ring, forging carbon-nanotube hulls for colony arks destined for the Gliese cluster. None of the workers had ever set foot on a world with rain.</p>
<blockquote>"We build cradles for descendants whose names will be pronounced in dialects we can never imagine."</blockquote>
<p>When the resonance alarm chimed at 03:00 hours, it was not the expected hull stress report. It was an encrypted broadcast originating from the deepest cavern of Valles Marineris—a transmission dormant for three hundred thousand years.</p>`,
        excerpt: "The arc welders illuminated the void in rhythmic bursts of blinding cobalt. From five hundred kilometers above Mars, the orbital rings looked like spider silk...",
        writingType: "CHAPTER",
        visibility: "PUBLIC",
        status: "PUBLISHED",
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
        wordCount: 156,
        readingTime: 1,
        authorId: julian.id,
        genreId: scifiGenre?.id,
        publishedAt: new Date(Date.now() - 3600 * 1000 * 12),
        tags: {
          create: [
            { tag: { connectOrCreate: { where: { name: "scifi" }, create: { name: "scifi" } } } },
            { tag: { connectOrCreate: { where: { name: "space" }, create: { name: "space" } } } },
            { tag: { connectOrCreate: { where: { name: "spaceopera" }, create: { name: "spaceopera" } } } },
          ],
        },
      },
    });

    const w3 = await prisma.writing.create({
      data: {
        title: "Salt and Willow: Three Stanzas",
        slug: "salt-and-willow-three-stanzas",
        content: `<p><em>I. Morning at the Creek</em><br/>
The heron stands in silver reeds,<br/>
unmoving as an ancient grief.<br/>
The river forgets what the mountain said,<br/>
and carries the willow leaf.</p>

<p><em>II. Salt on Porcelain</em><br/>
You left the teacup by the sill,<br/>
the porcelain cracked where rain crept in.<br/>
Time is an ocean we cannot cross,<br/>
until we let the tide begin.</p>

<p><em>III. The Lantern</em><br/>
Light is not what breaks the dark—<br/>
it is the eye that learns to see<br/>
how shadows curve around the truth<br/>
to set the quiet wild free.</p>`,
        excerpt: "The heron stands in silver reeds, unmoving as an ancient grief. The river forgets what the mountain said, and carries the willow leaf...",
        writingType: "POEM",
        visibility: "PUBLIC",
        status: "PUBLISHED",
        coverImage: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
        wordCount: 95,
        readingTime: 1,
        authorId: maya.id,
        genreId: poetryGenre?.id,
        publishedAt: new Date(Date.now() - 3600 * 1000 * 24),
        tags: {
          create: [
            { tag: { connectOrCreate: { where: { name: "poetry" }, create: { name: "poetry" } } } },
            { tag: { connectOrCreate: { where: { name: "nature" }, create: { name: "nature" } } } },
            { tag: { connectOrCreate: { where: { name: "solitude" }, create: { name: "solitude" } } } },
          ],
        },
      },
    });

    // Seed follows & favourites
    await prisma.follow.create({ data: { followerId: julian.id, followingId: elena.id } });
    await prisma.follow.create({ data: { followerId: maya.id, followingId: elena.id } });
    await prisma.follow.create({ data: { followerId: elena.id, followingId: maya.id } });

    await prisma.favourite.create({ data: { userId: julian.id, writingId: w1.id } });
    await prisma.favourite.create({ data: { userId: maya.id, writingId: w1.id } });
    await prisma.favourite.create({ data: { userId: elena.id, writingId: w3.id } });
  }
}
