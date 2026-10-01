type InfoBoxProps = {
  heading: string;
  description: string;
  buttonLabel: string;
  variant: "renter" | "owner";
};

const VARIANT_STYLES = {
  renter: {
    box: "bg-gray-100",
    heading: "text-gray-950",
    text: "text-gray-700",
    button: "bg-gray-950 hover:bg-gray-700",
  },
  owner: {
    box: "bg-primary-100",
    heading: "text-primary-700",
    text: "text-primary-700",
    button: "bg-primary-500 hover:bg-primary-600",
  },
};

function InfoBox({ heading, description, buttonLabel, variant }: InfoBoxProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className={`rounded-lg p-6 shadow-md ${styles.box}`}>
      <h2 className={`text-2xl font-bold ${styles.heading}`}>{heading}</h2>
      <p className={`mt-2 mb-4 ${styles.text}`}>{description}</p>
      <button
        type="button"
        className={`rounded-lg px-4 py-2 text-white ${styles.button}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default function InfoBoxes() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
        <InfoBox
          variant="renter"
          heading="For Renters"
          description="Find your dream rental property. Bookmark properties and contact owners."
          buttonLabel="Browse Properties"
        />
        <InfoBox
          variant="owner"
          heading="For Property Owners"
          description="List your properties and reach potential tenants. Rent as an airbnb or long term."
          buttonLabel="Add Property"
        />
      </div>
    </section>
  );
}
