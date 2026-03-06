import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Calendar,
  User,
  ArrowLeft,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { blogPosts } from "@/src/data";

export default function BlogDetail() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Link
          to="/blog"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-white pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/blog"
          className="inline-flex items-center text-stone-500 hover:text-primary mb-12 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <article className="space-y-12">
          <header className="space-y-8">
            <div className="flex items-center space-x-4 text-primary font-bold text-sm">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 uppercase tracking-widest">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-stone-900">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-stone-100">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-stone-900 font-bold text-lg">
                    {post.author}
                  </p>
                  <p className="text-stone-500 text-sm flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> {post.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-stone-400 mr-2">
                  Share:
                </span>
                <button className="p-3 rounded-full bg-stone-50 text-stone-600 hover:bg-primary hover:text-white transition-all">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="p-3 rounded-full bg-stone-50 text-stone-600 hover:bg-primary hover:text-white transition-all">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="p-3 rounded-full bg-stone-50 text-stone-600 hover:bg-primary hover:text-white transition-all">
                  <Linkedin className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg prose-stone max-w-none">
            <p className="text-xl text-stone-600 leading-relaxed font-medium italic mb-10">
              {post.excerpt}
            </p>
            <div className="text-stone-700 leading-relaxed space-y-6">
              {post.content.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p>
                As we look towards the next decade, the integration of
                technology in agriculture will only accelerate. From satellite
                imagery for crop monitoring to blockchain for supply chain
                transparency, the possibilities are endless. Nejjo Mullo is at
                the forefront of this transformation, ensuring that both farmers
                and investors can benefit from these advancements.
              </p>
              <p>
                We invite you to join our community and be part of the
                sustainable agriculture revolution. Together, we can build a
                more resilient and equitable food system for everyone.
              </p>
            </div>
          </div>

          <footer className="pt-12 border-t border-stone-100">
            <div className="bg-stone-50 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-2">
                  Enjoyed this article?
                </h3>
                <p className="text-stone-500">
                  Subscribe to our newsletter to receive the latest insights
                  directly in your inbox.
                </p>
              </div>
              <div className="flex w-full md:w-auto space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow md:w-64 px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none"
                />
                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
