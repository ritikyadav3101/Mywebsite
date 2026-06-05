export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Cred<span className="text-purple-500">Developers</span></h1>
        <a href="mailto:ritikyadav3101@gmail.com" className="bg-purple-600 px-4 py-2 rounded-full text-sm">Hire Us</a>
      </nav>
      <section className="flex flex-col items-center text-center px-8 py-24">
        <h2 className="text-4xl font-bold mb-6">We Build Websites<br/><span className="text-purple-500">That Convert</span></h2>
        <p className="text-gray-400 text-lg mb-8">Premium websites for businesses. Agency quality at freelancer prices.</p>
        <a href="mailto:ritikyadav3101@gmail.com" className="bg-purple-600 px-8 py-4 rounded-full text-lg font-bold">Start Your Project →</a>
      </section>
      <footer className="text-center py-8 border-t border-gray-800 text-gray-500 text-sm">© 2025 CredDevelopers.</footer>
    </main>
  )
}
