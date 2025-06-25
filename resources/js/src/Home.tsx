"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Head } from "@inertiajs/react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, ArrowRight, Zap, Users, Lightbulb, Globe } from "lucide-react"

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const Home: React.FC = () => {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Countdown to Hacksphere: October 12, 2025, 12:00 WIB
  useEffect(() => {
    const targetDate = new Date("2025-10-12T12:00:00+07:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const events = [
    {
      name: "Hacksphere",
      description: "Kompetisi hackathon untuk mengembangkan solusi inovatif menggunakan teknologi terdepan",
      icon: <Zap className="w-8 h-8" />,
      color: "from-red-500 to-pink-500",
      date: "12-14 Oktober 2025",
    },
    {
      name: "Talksphere",
      description: "Sesi presentasi dan diskusi dengan para ahli teknologi dan inovator terkemuka",
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      date: "13 Oktober 2025",
    },
    {
      name: "FestSphere",
      description: "Festival teknologi dengan berbagai aktivitas menarik dan showcase produk inovatif",
      icon: <Lightbulb className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500",
      date: "14 Oktober 2025",
    },
    {
      name: "Exposphere",
      description: "Pameran teknologi dan startup showcase untuk memamerkan inovasi terbaru",
      icon: <Globe className="w-8 h-8" />,
      color: "from-green-500 to-teal-500",
      date: "12-14 Oktober 2025",
    },
  ]

  return (
    <>
      <Head title="Compsphere 2025 - Accelerating Innovation Through Intelligent Technology" />

      <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-red-900/20"></div>
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <motion.nav
          className="relative z-10 p-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-25%20at%2023.34.30_70e63cda.jpg-IKAmYg9ycQLDlNnobovMrgj2zFWAri.jpeg"
                alt="Compsphere Logo"
                className="w-12 h-12 rounded-full"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                Compsphere 2025
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#events" className="hover:text-blue-400 transition-colors">
                Events
              </a>
              <a href="#schedule" className="hover:text-blue-400 transition-colors">
                Schedule
              </a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-25%20at%2023.34.30_70e63cda.jpg-IKAmYg9ycQLDlNnobovMrgj2zFWAri.jpeg"
                alt="Compsphere Logo"
                className="w-32 h-32 mx-auto mb-8 rounded-full shadow-2xl shadow-blue-500/20"
              />
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                Compsphere
              </span>
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl mb-8 text-gray-300 font-light"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Accelerating Innovation Through Intelligent Technology
            </motion.p>

            <motion.p
              className="text-lg md:text-xl mb-12 text-gray-400 max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Bergabunglah dengan para inovator, developer, dan teknolog terdepan dalam event teknologi terbesar tahun
              ini. Wujudkan masa depan melalui kolaborasi dan inovasi yang tak terbatas.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              className="mb-12"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <h3 className="text-xl mb-6 text-blue-400">Countdown to Hacksphere</h3>
              <div className="flex justify-center space-x-4 md:space-x-8">
                {[
                  { label: "Hari", value: countdown.days },
                  { label: "Jam", value: countdown.hours },
                  { label: "Menit", value: countdown.minutes },
                  { label: "Detik", value: countdown.seconds },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="bg-gradient-to-br from-blue-600/20 to-red-600/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 md:p-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-white">{item.value}</div>
                    <div className="text-sm text-gray-400">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25">
                Daftar Sekarang
              </button>
              <button className="border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Pelajari Lebih Lanjut
              </button>
            </motion.div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                  Our Events
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Empat event utama yang akan menghadirkan pengalaman teknologi tak terlupakan
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.name}
                  className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-r ${event.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {event.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{event.name}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{event.description}</p>
                  <div className="flex items-center text-sm text-blue-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-2 transform duration-300">
                    Selengkapnya <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Info Section */}
        <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-blue-900/20 to-red-900/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                    Event Information
                  </span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600 p-3 rounded-lg">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Tanggal Event</h3>
                      <p className="text-gray-400">12-14 Oktober 2025</p>
                      <p className="text-sm text-blue-400">Hacksphere dimulai 12 Oktober, pukul 12.00 WIB</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-600 p-3 rounded-lg">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Lokasi</h3>
                      <p className="text-gray-400">Fablab</p>
                      <p className="text-sm text-gray-500">Venue utama untuk Hacksphere dan event lainnya</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 p-3 rounded-lg">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Durasi</h3>
                      <p className="text-gray-400">3 Hari Penuh</p>
                      <p className="text-sm text-gray-500">Pengalaman teknologi yang komprehensif</p>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-gradient-to-br from-blue-600/20 to-red-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-25%20at%2023.34.30_70e63cda.jpg-IKAmYg9ycQLDlNnobovMrgj2zFWAri.jpeg"
                    alt="Compsphere Logo"
                    className="w-24 h-24 mx-auto mb-6 rounded-full"
                  />
                  <h3 className="text-2xl font-bold mb-4">Ready to Join?</h3>
                  <p className="text-gray-400 mb-6">
                    Jangan lewatkan kesempatan untuk menjadi bagian dari revolusi teknologi
                  </p>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    Register Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-25%20at%2023.34.30_70e63cda.jpg-IKAmYg9ycQLDlNnobovMrgj2zFWAri.jpeg"
                alt="Compsphere Logo"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                Compsphere 2025
              </span>
            </div>
            <p className="text-gray-400 mb-4">Accelerating Innovation Through Intelligent Technology</p>
            <p className="text-sm text-gray-500">© 2025 Compsphere. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Home
