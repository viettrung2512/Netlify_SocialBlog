import { motion } from "framer-motion";
import { useState } from "react";

const Support = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Simulate form submission (replace with actual API call)
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white w-full text-center py-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
          Support Center
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          We’re here to help you. Explore our resources or reach out to our team.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        <section>
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-6">
            Frequently Asked Questions (FAQs)
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "How do I create an account?",
                answer:
                  "Visit the SignUp page and fill out the required information. A confirmation email will be sent to verify your account.",
              },
              {
                question: "How do I reset my password?",
                answer:
                  "Go to the Login page and click 'Forgot Password?' You'll receive an email with instructions to reset your password.",
              },
              {
                question: "How do I report inappropriate content?",
                answer:
                  "Click the 'Report' button next to any post or comment. Our team will review the report and take appropriate action.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-lg rounded-xl p-6"
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {faq.question}
                </h3>
                <p className="mt-2 text-md md:text-lg text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-6">
            Contact Us
          </h2>
          <p className="text-md md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Still need help? Reach out to our support team, and we’ll get back to you soon.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white shadow-lg rounded-xl p-6 md:p-8 max-w-lg mx-auto"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-800 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-800 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-800 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your message"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md"
              >
                Send Message
              </motion.button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Support;