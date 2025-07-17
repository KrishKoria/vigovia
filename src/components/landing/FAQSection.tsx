import { MessageSquare } from "lucide-react";

const FAQSection = () => {
  const faqs = [
    {
      question: "How do I check order delivery status ?",
      answer:
        'Please tap on "My Orders" section under main menu of App/Website/IVR site to check your order status.',
    },
    {
      question: "How do I check order delivery status ?",
      answer:
        'Please tap on "My Orders" section under main menu of App/Website/IVR site to check your order status.',
    },
    {
      question: "How do I check order delivery status ?",
      answer:
        'Please tap on "My Orders" section under main menu of App/Website/IVR site to check your order status.',
    },
    {
      question: "How do I check order delivery status ?",
      answer:
        'Please tap on "My Orders" section under main menu of App/Website/IVR site to check your order status.',
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
