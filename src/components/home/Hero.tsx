import SearchBar from "@/components/search/SearchBar";

export default function Hero() {
  return (
    <section className="bg-primary-700 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Find The Perfect Rental
        </h1>
        <p className="mt-4 mb-10 text-lg text-primary-100 sm:text-xl">
          Discover the perfect property that suits your needs.
        </p>
        <SearchBar />
      </div>
    </section>
  );
}
