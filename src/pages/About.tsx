import { motion } from "motion/react";
import { Target, Eye, Heart, Award, CheckCircle2 } from "lucide-react";

const values = [
  {
    title: "Transparency",
    description:
      "We provide real-time updates and clear financial reporting for every project.",
    icon: Eye,
  },
  {
    title: "Sustainability",
    description:
      "We prioritize eco-friendly farming practices that protect the environment.",
    icon: Heart,
  },
  {
    title: "Innovation",
    description:
      "We use the latest technology to maximize yields and minimize risks.",
    icon: Target,
  },
  {
    title: "Integrity",
    description:
      "We build trust through honest partnerships with farmers and investors.",
    icon: Award,
  },
];

export default function About() {
  return (
    <div className="pt-15">
      {/* Hero Section */}
      <section className="bg-primary-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Our Mission to <span className="text-primary">Revolutionize</span>{" "}
              Agriculture
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              Nejjo Mullo was founded with a simple goal: to make agricultural
              investment accessible to everyone while empowering small-scale
              farmers with the resources they need to thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1595273670150-db0a3d37d482?auto=format&fit=crop&q=80&w=1000"
                alt="Farmers working"
                className="rounded-[3rem] shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl border border-stone-100 hidden md:block">
                <div className="text-4xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm font-medium text-stone-500">
                  Years of Experience
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">
                Bridging the Gap Between Rural Farms and Urban Investors
              </h2>
              <p className="text-stone-600 leading-relaxed">
                We started as a small team of agronomists and fintech
                enthusiasts who saw the untapped potential in our rural
                communities. Farmers had the land and the skills but lacked the
                capital and market access. Investors wanted to support
                sustainable food systems but didn't know where to start.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Today, Nejjo Mullo is a leading platform that has facilitated
                millions in investments, transformed thousands of lives, and
                helped secure food systems for the future.
              </p>
              <ul className="space-y-4">
                {[
                  "Verified Farmers",
                  "Smart Irrigation Systems",
                  "Market Access Guaranteed",
                  "Real-time Monitoring",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center space-x-3 text-stone-800 font-medium"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-stone-600">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center"
              >
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-6">
                  <v.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-stone-600">
              A diverse team of experts dedicated to agricultural growth.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                name: "Dr. Emily Green",
                role: "CEO & Founder",
                image: "https://picsum.photos/seed/ceo/400/500",
              },
              {
                name: "Marcus Thorne",
                role: "Head of Agronomy",
                image: "https://picsum.photos/seed/agronomy/400/500",
              },
              {
                name: "Sarah Chen",
                role: "Chief Technology Officer",
                image: "https://picsum.photos/seed/cto/400/500",
              },
            ].map((member) => (
              <div key={member.name} className="group">
                <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-[4/5]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
