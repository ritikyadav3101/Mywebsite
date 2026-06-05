export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">
          Cred<span className="text-purple-500">Developers</span>
        </h1>
        <a href="mailto:ritikyadav3101@gmail.com" className="bg-purple-600 px-4 py-2 rounded-full text-sm font-medium">
          Hire Us
        </a>
      </nav>
      <section className="flex flex-col items-center justify-center text-center px-8 py-24">
        <span className="bg-purple-900 text-purple-300 text-xs px-3 py-1 rounded-full mb-6">
          ⚡ Fast Delivery • Trusted • Guaranteed
        </span>
        <h2 className="text-4xl font-bold mb-6 leading-tight">
          We Build Websites<br/>
          <span className="text-purple-500">That Convert</span>
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md">
          Premium websites for businesses and startups.
          Agency quality at freelancer prices.
        </p>
        <a href="mailto:ritikyadav3101@gmail.com" className="bg-purple-600 px-8 py-4 rounded-full text-lg font-bold">
          Start Your Project →
        </a>
      </section>
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-12">What We Offer</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">🚀</div>
            <h4 className="text-lg font-bold mb-2">Business Website</h4>
            <p className="text-gray-400 text-sm">Professional websites that make your business look premium.</p>
            <p className="text-purple-400 font-bold mt-4">From $15</p>
          </div>
          <div className="bg-gray-900 border border-purple-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">💎</div>
            <h4 className="text-lg font-bold mb-2">Startup Landing Page</h4>
            <p className="text-gray-400 text-sm">High converting pages that turn visitors into customers.</p>
            <p className="text-purple-400 font-bold mt-4">From $30</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">⚡</div>
            <h4 className="text-lg font-bold mb-2">Portfolio Website</h4>
            <p className="text-gray-400 text-sm">Stand out with a modern portfolio that gets you hired.</p>
            <p className="text-purple-400 font-bold mt-4">From $20</p>
          </div>
        </div>
      </section>
      <section className="px-8 py-16 bg-gray-900">
        <h3 className="text-2xl font-bold text-center mb-12">Why Choose Us</h3>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-purple-500 text-xl">✓</span>
            <div>
              <p className="font-bold">24hr Delivery</p>
              <p className="text-gray-400 text-sm">Fast turnaround always</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-purple-500 text-xl">✓</span>
            <div>
              <p className="font-bold">Money Back</p>
              <p className="text-gray-400 text-sm">7 day guarantee</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-purple-500 text-xl">✓</span>
            <div>
              <p className="font-bold">Clean Code</p>
              <p className="text-gray-400 text-sm">Built to last</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-purple-500 text-xl">✓</span>
            <div>
              <p className="font-bold">Free Support</p>
              <p className="text-gray-400 text-sm">1 month after delivery</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-purple-500 text-xl">✓</span>
            <div>
              <p className="font-bold">Mobile Ready</p>
              <p className="text-gray-400 text-sm">Works on all devices</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-purple-500 text-xl">✓</span>
            <div>
              <p className="font-bold">Unlimited Revisions</p>
              <p className="text-gray-400 text-sm">Till you love it</p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center text-center px-8 py-24">
        <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
        <p className="text-gray-400 mb-8">Let us build something amazing together</p>
        <a href="mailto:ritikyadav3101@gmail.com" className="bg-purple-600 px-8 py-4 rounded-full text-lg font-bold">
          Contact Us Now →
        </a>
      </section>
      <footer className="text-center py-8 border-t border-gray-800 text-gray-500 text-sm">
        © 2025 CredDevelopers. All rights reserved.
      </footer>
    </main>
  )
}
