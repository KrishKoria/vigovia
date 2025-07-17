import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogSection = () => {
  const blogs = [
    {
      id: 1,
      title: "Journeys of Discovery: Uncovering Hidden Treasures",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet tristique enim. Donec magna tellus, lacinia nec turpis sed, fermentum bibendum tortor.",
      image: "/api/placeholder/300/200",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Journeys of Discovery: Uncovering Hidden Treasures",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet tristique enim. Donec magna tellus, lacinia nec turpis sed, fermentum bibendum tortor.",
      image: "/api/placeholder/300/200",
      date: "2024-01-12",
    },
    {
      id: 3,
      title: "Journeys of Discovery: Uncovering Hidden Treasures",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet tristique enim. Donec magna tellus, lacinia nec turpis sed, fermentum bibendum tortor.",
      image: "/api/placeholder/300/200",
      date: "2024-01-10",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold">
            Blogs Related To <span className="text-primary">New Zealand</span>
          </h2>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400 text-sm">
                  Blog Image Placeholder
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-hover-purple text-white rounded-full px-6"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
