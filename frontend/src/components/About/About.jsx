import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full text-left"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-600 mb-8">
          About SocialBlog
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
          Welcome to <span className="font-bold text-blue-600">SocialBlog</span> — a vibrant platform where stories unite us. We believe everyone has a unique voice, and through SocialBlog, you can share your journey, ideas, and passions with a thriving community of creators and readers.
        </p>

        <div className="space-y-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4">Our Mission</h2>
            <p className="text-md md:text-lg text-gray-600 leading-relaxed">
              Our mission is to foster meaningful conversations by providing a space where people can share personal experiences, creative ideas, and inspire one another. Whether you’re an aspiring writer, a passionate creator, or someone seeking connection, SocialBlog is your platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4">What We Offer</h2>
            <p className="text-md md:text-lg text-gray-600 mb-4 leading-relaxed">
              SocialBlog empowers you to write, connect, and engage with content that matters. Here’s what you can do:
            </p>
            <ul className="list-disc list-inside text-md md:text-lg text-gray-600 space-y-2">
              <li>Create and share blog posts on topics you’re passionate about.</li>
              <li>Follow and interact with other users’ stories and discussions.</li>
              <li>Engage in meaningful conversations and build lasting connections.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4">Why Join Us?</h2>
            <p className="text-md md:text-lg text-gray-600 leading-relaxed">
              At SocialBlog, we celebrate the power of community and authentic storytelling. By joining, you’ll be part of a platform that values diverse perspectives and fosters collaboration. Share your unique voice and inspire others.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4">Be Part of Our Community</h2>
            <p className="text-md md:text-lg text-gray-600 mb-8 leading-relaxed">
              Thank you for being here! Whether you’re here to write, read, or explore, we hope you find inspiration and connection through SocialBlog. Join us today and help shape the future of digital storytelling.
            </p>
          </div>
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md"
          >
            Join the Community
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;