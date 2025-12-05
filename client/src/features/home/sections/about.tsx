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
  FiStar,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
  FiChevronRight
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function About() {
  const ClinicFlowBuilding =
    "../../../../src/assets/images/ClinicFlowBuilding.png";

  const stats = [
    { 
      icon: FiUsers, 
      number: "10,000+", 
      label: "Patients Treated",
      color: "text-blue-400"
    },
    { 
      icon: FiAward, 
      number: "15+", 
      label: "Years Experience",
      color: "text-purple-400"
    },
    { 
      icon: FiHeart, 
      number: "50+", 
      label: "Medical Professionals",
      color: "text-red-400"
    },
    { 
      icon: FiStar, 
      number: "99%", 
      label: "Patient Satisfaction",
      color: "text-green-400"
    },
  ];

  const features = [
    {
      title: "Expert Medical Care",
      description: "Board-certified physicians providing comprehensive healthcare with the highest standards.",
      icon: FiShield,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      title: "Advanced Technology",
      description: "State-of-the-art equipment and electronic health records for accurate diagnoses.",
      icon: FiMonitor,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20"
    },
    {
      title: "Patient-Centered Approach",
      description: "Personalized treatment plans focused on your health and comfort.",
      icon: FiUser,
      color: "text-lime-400",
      bgColor: "bg-lime-400/10",
      borderColor: "border-lime-400/20"
    },
    {
      title: "24/7 Emergency Care",
      description: "Round-the-clock emergency services with experienced medical staff.",
      icon: FiClock,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20"
    },
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      specialty: "Cardiology",
      experience: "12 years",
      image: null,
      color: "border-blue-400"
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Surgery",
      specialty: "Orthopedics",
      experience: "15 years",
      image: null,
      color: "border-purple-400"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Pediatric Specialist",
      specialty: "Pediatrics",
      experience: "10 years",
      image: null,
      color: "border-green-400"
    },
    {
      name: "Dr. James Wilson",
      role: "Emergency Medicine",
      specialty: "Emergency Care",
      experience: "8 years",
      image: null,
      color: "border-orange-400"
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-700 mb-6 shadow-lg"
          >
            <FiHeart className="w-4 h-4 text-lime-400" />
            <span className="text-sm text-gray-300">Trusted Since 2008</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            About <span className="text-lime-400">ClinicFlow</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Providing exceptional healthcare with compassion, innovation, and excellence. 
            Your health and well-being are at the heart of everything we do.
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-lime-400 transition-all duration-300 hover: hover:shadow-lime-400/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gray-900 border border-gray-700 ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stat.number}
                  </div>
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-4xl font-bold text-white mb-8">
              Your Trusted <span className="text-lime-400">Healthcare</span> Partner
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-lime-400/10 border border-lime-400/20">
                  <FiCheckCircle className="w-5 h-5 text-lime-400" />
                </div>
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    <span className="font-semibold text-white">ClinicFlow</span> is a leading healthcare institution delivering comprehensive medical services with a focus on patient-centered care.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                  <FiCheckCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    Our modern facility combines cutting-edge technology with compassionate healthcare professionals dedicated to your well-being.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-purple-400/10 border border-purple-400/20">
                  <FiCheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    We treat the whole person, not just symptoms. Our integrated approach ensures personalized attention and optimal health outcomes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gray-900 rounded-2xl p-1 ">
              <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
                <div className="w-full h-96 rounded-lg overflow-hidden">
                  <img
                    src={ClinicFlowBuilding}
                    alt="ClinicFlow Modern Medical Facility"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const placeholder = document.createElement('div');
                      placeholder.className = "w-full h-full bg-gray-800 flex items-center justify-center";
                      placeholder.innerHTML = `
                        <div class="text-center">
                          <FiHome class="w-24 h-24 text-lime-400/30 mb-4 mx-auto" />
                          <span class="text-gray-500 text-lg">ClinicFlow Facility</span>
                        </div>
                      `;
                      e.target.parentNode.appendChild(placeholder);
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <h4 className="text-2xl font-bold text-white mb-2">
                    State-of-the-Art Facility
                  </h4>
                  <p className="text-gray-300">
                    Featuring the latest medical technology in comfortable, healing environments.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-lime-400">ClinicFlow</span>?
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience healthcare that puts you first with our comprehensive services and expert care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-lime-400 transition-all duration-300 hover:shadow-xl hover:shadow-lime-400/5"
                >
                  <div className={`p-3 rounded-lg ${feature.bgColor} ${feature.borderColor} w-fit mb-4`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-lime-400 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                      Learn more
                    </span>
                    <div className="relative overflow-hidden w-6 h-6">
                      <FiChevronRight className={`w-5 h-5 ${feature.color} absolute transform transition-all duration-300 group-hover:translate-x-6`} />
                      <FiArrowRight className={`w-5 h-5 ${feature.color} absolute -translate-x-6 transition-all duration-300 group-hover:translate-x-0`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Medical Team */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">
              Meet Our <span className="text-lime-400">Expert</span> Team
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our dedicated medical professionals bring years of experience and passion to your care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="group relative bg-gray-900 rounded-xl p-6 border border-gray-700 text-center hover:border-lime-400 transition-all duration-300 hover:shadow-xl hover:shadow-lime-400/5"
              >
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center bg-gray-900 border-2 ${member.color} p-1`}>
                  <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FiUser className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">
                  {member.name}
                </h4>
                <p className="text-lime-400 text-sm font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  {member.specialty}
                </p>
                <p className="text-gray-500 text-xs">
                  {member.experience} experience
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20 pt-20 border-t border-gray-800"
        >
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-blue-400/10 border border-blue-400/20">
                <FiTarget className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Our Mission</h4>
                <div className="w-16 h-1 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To provide accessible, high-quality healthcare that improves lives through compassionate service, 
              medical excellence, and innovative treatments for our patients and communities.
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-purple-400/10 border border-purple-400/20">
                <FiEye className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Our Vision</h4>
                <div className="w-16 h-1 bg-purple-400 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To be the leading healthcare provider recognized for exceptional patient care, 
              medical innovation, and community health improvement, setting new standards in healthcare delivery.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}