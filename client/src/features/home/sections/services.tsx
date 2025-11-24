import React from 'react'
import { 
  FiHeart, 
  FiEye, 
  FiUser, 
  FiStar, 
  FiActivity, 
  FiClock,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi'

export default function Services() {
  const services = [
    {
      icon: FiHeart,
      title: 'Cardiology',
      description: 'Comprehensive heart care including diagnostics, treatment, and preventive cardiology services.',
      features: ['Echocardiograms', 'Stress Tests', 'Cardiac Rehabilitation', 'Pacemaker Checks']
    },
    {
      icon: FiActivity,
      title: 'Internal Medicine',
      description: 'Primary care for adults focusing on disease prevention and management of chronic conditions.',
      features: ['Annual Physicals', 'Chronic Disease Management', 'Preventive Care', 'Health Screenings']
    },
    {
      icon: FiUser,
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents with compassionate care.',
      features: ['Well-child Visits', 'Vaccinations', 'Developmental Assessments', 'Emergency Care']
    },
    {
      icon: FiEye,
      title: 'Ophthalmology',
      description: 'Complete eye care services from routine vision tests to advanced surgical procedures.',
      features: ['Eye Exams', 'Cataract Surgery', 'Glaucoma Treatment', 'LASIK Consultations']
    },
    {
      icon: FiStar,
      title: 'Dermatology',
      description: 'Skin health services including medical, surgical, and cosmetic dermatology treatments.',
      features: ['Skin Cancer Screening', 'Acne Treatment', 'Mohs Surgery', 'Cosmetic Procedures']
    },
    {
      icon: FiClock,
      title: 'Emergency Care',
      description: '24/7 emergency medical services with rapid response and advanced life support.',
      features: ['Trauma Care', 'Critical Care', 'Emergency Surgery', 'ICU Facilities']
    }
  ]

  const specialFeatures = [
    {
      icon: FiCheckCircle,
      title: 'Same-Day Appointments',
      description: 'Urgent care needs addressed promptly with same-day scheduling availability.'
    },
    {
      icon: FiCheckCircle,
      title: 'Telemedicine',
      description: 'Virtual consultations for follow-ups and non-emergency medical advice.'
    },
    {
      icon: FiCheckCircle,
      title: 'Multi-Specialty Care',
      description: 'Coordinated care across multiple specialties for comprehensive treatment.'
    },
    {
      icon: FiCheckCircle,
      title: 'Advanced Diagnostics',
      description: 'State-of-the-art imaging and laboratory services for accurate diagnoses.'
    }
  ]

  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Medical Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive healthcare services delivered with expertise, compassion, and 
            the latest medical technology for optimal patient outcomes.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div 
                key={index}
                className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-lime-400 transition-colors duration-300 group"
              >
                <div className="p-3 bg-gray-900 rounded-lg w-fit mb-4 border border-gray-700 group-hover:border-lime-400 transition-colors">
                  <IconComponent className="w-6 h-6 text-lime-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1 h-1 bg-lime-400 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Special Features */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Our Services?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="p-4 bg-gray-900 rounded-xl border border-gray-700 w-fit mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-lime-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Emergency Services Highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
            <div className="p-4 bg-gray-900 rounded-xl border border-lime-400 w-fit mb-6">
              <FiClock className="w-8 h-8 text-lime-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              24/7 Emergency Care
            </h3>
            <p className="text-gray-300 mb-6">
              Our emergency department is staffed around the clock with board-certified 
              emergency physicians and equipped with advanced life support systems. 
              We provide immediate care for critical conditions, injuries, and urgent medical needs.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                <span>Board-certified emergency physicians</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                <span>Advanced trauma and life support</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                <span>Rapid diagnostic imaging services</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                <span>Direct admission to ICU when needed</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
            <div className="p-4 bg-gray-900 rounded-xl border border-lime-400 w-fit mb-6">
              <FiStar className="w-8 h-8 text-lime-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Comprehensive Specialties
            </h3>
            <p className="text-gray-300 mb-6">
              We offer a wide range of medical specialties under one roof, ensuring 
              coordinated care and seamless transitions between different medical departments.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Cardiology', 'Neurology', 'Oncology', 'Orthopedics',
                'Gastroenterology', 'Endocrinology', 'Pulmonology', 'Nephrology'
              ].map((specialty, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-300">
                  <div className="w-1 h-1 bg-lime-400 rounded-full"></div>
                  <span className="text-sm">{specialty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-900 rounded-2xl p-12 border border-gray-700">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Schedule Your Appointment?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Take the first step towards better health. Our team of medical professionals 
            is here to provide you with exceptional care tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-lime-400 text-gray-900 px-8 py-4 rounded-lg hover:bg-lime-300 transition-colors duration-200 text-lg font-semibold flex items-center gap-2">
              <FiClock className="w-5 h-5" />
              Book Appointment
            </button>
            <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg hover:border-lime-400 hover:text-lime-400 transition-colors duration-200 text-lg font-semibold">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}