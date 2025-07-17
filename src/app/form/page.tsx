import ItineraryForm from "@/components/ItineraryForm";
import Footer from "@/components/Footer";

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
