import React from "react";
import {
  FiUsers,
  FiAward,
  FiHeart,
  FiTarget,
  FiHome,
  FiMonitor,
  FiUser,
  FiClock,
  FiEye,
  FiCalendar,
} from "react-icons/fi";

export default function About() {
  const ClinicFlowBuilding =
    "../../../../src/assets/images/ClinicFlowBuilding.png";

  const stats = [
    { icon: FiUsers, number: "10,000+", label: "Patients Treated" },
    { icon: FiAward, number: "15+", label: "Years Experience" },
    { icon: FiHeart, number: "50+", label: "Medical Professionals" },
    { icon: FiTarget, number: "99%", label: "Patient Satisfaction" },
  ];

  const features = [
    {
      title: "Expert Medical Care",
      description:
        "Our team of board-certified physicians and specialists provide comprehensive healthcare services with the highest standards.",
      icon: FiHome,
    },
    {
      title: "Advanced Technology",
      description:
        "We utilize state-of-the-art medical equipment and electronic health records to ensure accurate diagnoses and effective treatments.",
      icon: FiMonitor,
    },
    {
      title: "Patient-Centered Approach",
      description:
        "Your health and comfort are our top priorities. We take time to listen and develop personalized treatment plans.",
      icon: FiUser,
    },
    {
      title: "24/7 Emergency Care",
      description:
        "Round-the-clock emergency services with experienced medical staff ready to handle any urgent healthcare needs.",
      icon: FiClock,
    },
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      specialty: "Cardiology",
      experience: "12 years",
      icon: FiUser,
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Surgery",
      specialty: "Orthopedics",
      experience: "15 years",
      icon: FiUser,
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Pediatric Specialist",
      specialty: "Pediatrics",
      experience: "10 years",
      icon: FiUser,
    },
    {
      name: "Dr. James Wilson",
      role: "Emergency Medicine",
      specialty: "Emergency Care",
      experience: "8 years",
      icon: FiUser,
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            About ClinicFlow
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Providing exceptional healthcare services with compassion,
            innovation, and excellence since 2008. Your health and well-being
            are at the heart of everything we do.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                    <IconComponent className="w-8 h-8 text-lime-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Your Trusted Healthcare Partner
            </h3>
            <div className="space-y-4 text-gray-300">
              <p>
                ClinicFlow is a leading healthcare institution dedicated to
                delivering comprehensive medical services with a focus on
                patient-centered care. Our modern facility combines cutting-edge
                technology with compassionate healthcare professionals.
              </p>
              <p>
                We believe in treating the whole person, not just the symptoms.
                Our integrated approach ensures that every patient receives
                personalized attention and the highest quality medical care
                available.
              </p>
              <p>
                From routine check-ups to complex medical procedures, our team
                is committed to helping you achieve and maintain optimal health
                throughout your life journey.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
            <div className="w-full h-64 rounded-lg mb-6 overflow-hidden border border-gray-700 bg-gray-900 flex items-center justify-center">
              <img
                src={ClinicFlowBuilding}
                alt="ClinicFlow Modern Medical Facility"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="hidden flex-col items-center justify-center text-center p-4">
                <FiHome className="w-16 h-16 text-lime-400 mb-2" />
                <span className="text-gray-400 text-sm">
                  ClinicFlow Facility
                </span>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold text-white mb-2">
                State-of-the-Art Facility
              </h4>
              <p className="text-gray-400">
                Our modern clinic features the latest medical technology and
                comfortable patient environments designed for your well-being.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose ClinicFlow?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-lime-400 transition-colors duration-300"
                >
                  <div className="p-3 bg-gray-900 rounded-lg w-fit mb-4 border border-gray-700">
                    <IconComponent className="w-6 h-6 text-lime-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medical Team */}
        <div>
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Meet Our Medical Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => {
              const IconComponent = member.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-center"
                >
                  <div className="w-20 h-20 bg-gray-900 rounded-full mx-auto mb-4 flex items-center justify-center border border-lime-400">
                    <IconComponent className="w-8 h-8 text-lime-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {member.name}
                  </h4>
                  <p className="text-lime-400 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-400 text-sm mb-1">
                    {member.specialty}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {member.experience} experience
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-16 border-t border-gray-700">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <div className="p-3 bg-gray-900 rounded-lg w-fit mb-4 border border-gray-700">
              <FiTarget className="w-8 h-8 text-lime-400" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Our Mission</h4>
            <p className="text-gray-300">
              To provide accessible, high-quality healthcare that improves the
              lives of our patients and communities through compassionate
              service, medical excellence, and innovative treatments.
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <div className="p-3 bg-gray-900 rounded-lg w-fit mb-4 border border-gray-700">
              <FiEye className="w-8 h-8 text-lime-400" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Our Vision</h4>
            <p className="text-gray-300">
              To be the leading healthcare provider recognized for exceptional
              patient care, medical innovation, and community health
              improvement, setting new standards in healthcare delivery.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pt-16 border-t border-gray-700">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Better Healthcare?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust ClinicFlow with their
            healthcare needs. Schedule your appointment today and take the first
            step towards better health.
          </p>
          <button className="bg-lime-400 text-gray-900 px-8 py-4 rounded-lg hover:bg-lime-300 transition-colors duration-200 text-lg font-semibold flex items-center gap-2 mx-auto">
            <FiCalendar className="w-5 h-5" />
            Book Your Appointment
          </button>
        </div>
      </div>
    </section>
  );
}
