import { getAllPosts } from "@/lib/posts";

async function buildContent() {
  const base = "https://fastsudoku.com";
  const posts = await getAllPosts();

  const tools = [
    ["fastsudoku Hints", base, "Get the next logical move explained step by step: enter your own grid manually or generate one, then reveal hints one move at a time (with technique names and descriptions) or see the full solution with all steps listed"],
    ["fastsudoku Puzzle Maker", `${base}/maker`, "Generate a sudoku puzzle at any difficulty, play it online with the full game board (timer, pencil notes, hints and keyboard support), then print as many copies as you need with an optional answer page"],
    ["Mega Sudoku", `${base}/mega`, "16x16 mega sudoku with 4x4 boxes in Easy, Medium, Hard, and Evil — a serious challenge for experienced solvers"],
    ["Kids Sudoku", `${base}/kids`, "Child-friendly 4x4 and 6x6 sudoku with big cells and simple logic, ideal as a first puzzle for young players"],
    ["Sudoku Guides", `${base}/guides`, "Clear, beginner-friendly guides covering everything from sudoku rules to advanced solving techniques with step-by-step examples"],
    ["What Is Sudoku", `${base}/what-is-sudoku`, "A complete beginner's introduction to sudoku: the one rule, how the grid works, how to play your first puzzle, and why millions of people solve it every day"],
  ].map(([title, url, desc]) => `- [${title}](${url}): ${desc}`);

  const blog = posts
    .map((p) => `- [${p.title}](${base}/guides/${p.slug}): ${p.description}`)
    .join("\n");

  return `# fastsudoku

> Free online sudoku for every level: get a hint on the next logical move with the technique explained, reveal the full solution step by step, play or print puzzles of every size, and solve a new daily puzzle. No sign-up, no downloads — everything runs in your browser.

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
