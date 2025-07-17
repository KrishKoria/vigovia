const HeroSection = () => {
  return (
    <section
      className="relative h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/nz-hero.jpeg')" }}
    >
      <div className="absolute inset-0"></div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          All About New Zealand
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
          Discover New Zealand: A Land Of Majestic Landscapes, Thrilling
          Adventures, And Unforgettable Experiences
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
