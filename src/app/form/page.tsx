import ItineraryForm from "@/components/form/ItineraryForm";
import Footer from "@/components/comman/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <ItineraryForm />
      </main>
      <Footer />
    </div>
  );
}
