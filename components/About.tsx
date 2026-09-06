"use client";

export default function About() {
  return (
    <section 
      id="about" 
      className="min-h-screen w-full bg-bg text-text flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-24 relative select-none"
    >
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight mb-6">
          About
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-8" />
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Welcome to the About section. Content coming soon.
        </p>
      </div>
    </section>
  );
}
