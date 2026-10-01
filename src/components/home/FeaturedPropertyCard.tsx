import Image from "next/image";
import type { FeaturedProperty } from "@/types/property";

type FeaturedPropertyCardProps = {
  property: FeaturedProperty;
};

export default function FeaturedPropertyCard({
  property,
}: FeaturedPropertyCardProps) {
  const rent = property.monthlyRent.toLocaleString("en-US");

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md sm:flex-row">
      <div className="relative h-56 sm:h-auto sm:w-2/5">
        <Image
          src={property.imageSrc}
          alt={property.imageAlt}
          fill
          sizes="(min-width: 768px) 20vw, (min-width: 640px) 40vw, 100vw"
          className="object-cover"
        />
        <span className="absolute top-3 left-3 rounded-lg bg-white px-3 py-1.5 font-bold text-primary-500 shadow">
          ${rent}/mo
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-gray-950">{property.title}</h3>
        <p className="text-gray-700">{property.type}</p>
        <p className="mt-3 text-sm text-gray-500">{property.location}</p>
        <p className="mt-1 text-sm text-gray-700">
          {property.beds} beds · {property.baths} baths ·{" "}
          {property.squareFeet.toLocaleString("en-US")} sq ft
        </p>
      </div>
    </article>
  );
}
