import FeaturedPropertyCard from "@/components/home/FeaturedPropertyCard";
import type { FeaturedProperty } from "@/types/property";

// Placeholder data until featured properties come from the database.
const FEATURED_PROPERTIES: FeaturedProperty[] = [
  {
    id: "1",
    title: "Beautiful Apartment",
    type: "Apartment",
    location: "Nanaimo, BC",
    monthlyRent: 2450,
    beds: 2,
    baths: 2,
    squareFeet: 1050,
    imageSrc: "/images/featured-apartment.jpg",
    imageAlt: "Bright open-plan apartment living room and kitchen",
  },
  {
    id: "2",
    title: "Cozy Mountain Cabin",
    type: "Cabin or Cottage",
    location: "Whistler, BC",
    monthlyRent: 3100,
    beds: 3,
    baths: 2,
    squareFeet: 1600,
    imageSrc: "/images/featured-house.jpg",
    imageAlt: "Wooden cabin with lit windows surrounded by a garden at dusk",
  },
];

export default function FeaturedProperties() {
  return (
    <section className="bg-primary-50 px-4 pt-6 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-primary-500">
          Featured Properties
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURED_PROPERTIES.map((property) => (
            <FeaturedPropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
