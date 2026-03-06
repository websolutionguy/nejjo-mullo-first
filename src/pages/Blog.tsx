import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/src/data";

export default function Blog() {
  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <section className="py-20 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Nejjo Mullo <span className="text-primary">Insights</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Stay updated with the latest trends in agri-fintech, sustainable
            farming, and investment strategies.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/blog/${blogPosts[0].id}`}
            className="group block relative overflow-hidden rounded-[3rem] shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-96 lg:h-[600px] overflow-hidden">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="bg-stone-900 p-12 lg:p-20 flex flex-col justify-center">
                <div className="flex items-center space-x-4 text-primary font-bold text-sm mb-6">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 uppercase tracking-wider">
                    Featured
                  </span>
                  <span>{blogPosts[0].category}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {blogPosts[0].title}
                </h2>
                <p className="text-stone-400 text-lg mb-10 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-stone-800 flex items-center justify-center text-white font-bold">
                      {blogPosts[0].author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-white font-bold">
                        {blogPosts[0].author}
                      </p>
                      <p className="text-stone-500 text-sm">
                        {blogPosts[0].date}
                      </p>
                    </div>
                  </div>
                  <div className="text-primary group-hover:translate-x-2 transition-transform">
                    <ArrowRight className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogPosts.slice(1).map((post) => (
              <motion.article
                key={post.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-stone-100 flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <Link to={`/blog/${post.id}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                    {post.category}
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center space-x-4 text-stone-400 text-xs mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> {post.date}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" /> {post.author}
                    </div>
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <h3 className="text-2xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-stone-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="mt-auto flex items-center text-primary font-bold text-sm group"
                  >
                    Read More{" "}
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button className="px-10 py-4 rounded-full bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all">
              View All Posts
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
