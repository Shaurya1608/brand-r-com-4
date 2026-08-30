export const metadata = {
  title: "Brand R.Comm Season 3",
  description: "Recap and highlights from Brand R.Comm Season 3",
};

export default function Season3Page() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* 
        This is a Next.js App Router Page.
        Because it is in src/app/season-3/page.jsx, it is accessible at /season-3
      */}
      
      {/* Custom Navbar just for this season (if you don't want to use the main website's navbar) */}
      <nav className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Brand R.Comm Season 3</h1>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-4xl font-extrabold mb-4">Welcome to Season 3</h2>
        <p className="text-lg text-gray-700 mb-8">
          This is a static-style, normal one-page website built inside the Next.js working directory using React components.
        </p>

        {/* Example Image */}
        {/* Make sure to place your images in frontend/public/seasons/images/ */}
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200">
          <p className="text-gray-400">Place your static images in /public folder and link them here via &lt;img src="/your-image.jpg" /&gt;</p>
        </div>
      </div>
    </main>
  );
}
