import { getAllPosts } from "@/lib/posts";

async function buildContent() {
  const base = "https://fastsudoku.com";
  const posts = await getAllPosts();

  const tools = [
    ["fastsudoku Hints", base, "Get the next logical move explained step by step — enter your own grid or generate one, with a full-solution mode that shows every technique"],
    ["fastsudoku Puzzle Maker", `${base}/maker`, "Generate a sudoku puzzle, play it online with hints and a timer, then print as many copies as you need with an optional answer key"],
    ["Mega Sudoku", `${base}/mega`, "16x16 mega sudoku with 4x4 boxes in Easy, Medium, Hard, and Evil — a serious challenge for experienced solvers"],
    ["Kids Sudoku", `${base}/kids`, "Easy 4x4 and 6x6 sudoku puzzles for children, with big friendly grids and simple logic"],
    ["Sudoku Guides", `${base}/guides`, "Learn how to play sudoku, from the basic rules to advanced techniques — clear, beginner-friendly guides"],
    ["What Is Sudoku", `${base}/what-is-sudoku`, "Learn what sudoku is: the one simple rule, how the grid works, how to play your first puzzle, and why it's a global phenomenon"],
  ].map(([title, url, desc]) => `- [${title}](${url}): ${desc}`);

  const blog = posts
    .map((p) => `- [${p.title}](${base}/guides/${p.slug}): ${p.description}`)
    .join("\n");

  return `# fastsudoku

> Free online sudoku hints and solver: get the next logical move explained, reveal the full solution step by step, or play puzzles of every size. No sign-up, play in your browser.

## Core Tools
${tools.join("\n")}

## Pricing
- [Pricing](${base}/pricing): Free tier with watermark on printed sheets; One-time $9.99 lifetime (watermark-free, large print batches, PDF export, ad-free).

## Blog
${blog}

## Company
- [Privacy Policy](${base}/privacy)
- [Terms of Service](${base}/terms)

## Contact
- Website: ${base}
`;
}

export const dynamic = 'force-static';

export async function GET() {
  return new Response(await buildContent(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
