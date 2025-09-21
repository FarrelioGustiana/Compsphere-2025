import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { Clock, Calendar, AlertCircle, CheckCircle2, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

interface CountdownProps {
  startDate: string;
  endDate: string;
  announcements: Record<number, string>;
}

export default function Countdown({ startDate, endDate, announcements }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalHours: 0,
    isRunning: false,
    isComplete: false,
    hasStarted: false,
  });
  
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const startTime = new Date(startDate);
      const endTime = new Date(endDate);
      
      // Check if hackathon has started
      const hasStarted = now >= startTime;
      
      // Check if hackathon is complete
      const isComplete = now >= endTime;
      
      // Calculate time remaining until end if started
      let timeLeft = 0;
      if (hasStarted && !isComplete) {
        timeLeft = endTime.getTime() - now.getTime();
      } else if (!hasStarted) {
        // If not started yet, show time until start
        timeLeft = startTime.getTime() - now.getTime();
      }
      
      // Convert to days, hours, minutes, seconds
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      // Calculate total hours for hackathon progress
      let totalHours = 0;
      if (hasStarted && !isComplete) {
        const elapsedTime = now.getTime() - startTime.getTime();
        const totalTime = endTime.getTime() - startTime.getTime();
        const hoursElapsed = elapsedTime / (1000 * 60 * 60);
        const totalHackathonHours = totalTime / (1000 * 60 * 60);
        totalHours = Math.floor(totalHackathonHours - hoursElapsed);
      }
      
      // Check for announcements based on hours remaining
      if (hasStarted && !isComplete && announcements[totalHours]) {
        if (currentAnnouncement !== announcements[totalHours]) {
          setCurrentAnnouncement(announcements[totalHours]);
          setShowAnnouncement(true);
          setTimeout(() => {
            setShowAnnouncement(false);
          }, 30000); // Show announcement for 30 seconds
        }
      }
      
      return {
        days,
        hours,
        minutes,
        seconds,
        totalHours,
        isRunning: hasStarted && !isComplete,
        isComplete,
        hasStarted,
      };
    };
    
    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startDate, endDate, announcements, currentAnnouncement]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getProgressPercentage = () => {
    if (!timeRemaining.hasStarted) return 0;
    if (timeRemaining.isComplete) return 100;
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    
    const totalDuration = end - start;
    const elapsed = now - start;
    
    return Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
  };
  
  const progress = getProgressPercentage();
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    
    if (!fullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  return (
    <DashboardLayout>
      <Head title="Hacksphere Countdown | Admin" />
      
      <div className={`py-12 ${fullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Hacksphere Countdown Timer</h1>
                <p className="text-blue-200">
                  {timeRemaining.isComplete 
                    ? "Hackathon has ended!" 
                    : timeRemaining.isRunning 
                      ? "Hackathon is in progress!" 
                      : "Hackathon hasn't started yet"}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                >
                  {fullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Announcement Banner */}
          {showAnnouncement && currentAnnouncement && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-900/80 text-amber-100 p-4 rounded-lg mb-6 flex items-center shadow-lg"
            >
              <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
              <p className="font-medium text-lg">{currentAnnouncement}</p>
            </motion.div>
          )}
          
          {/* Main Countdown Display */}
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex flex-col md:flex-row justify-center items-center mb-8 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-blue-400 mr-2" />
                  <span className="text-gray-300">
                    Start: <span className="font-medium text-white">{formatDate(startDate)}</span>
                  </span>
                </div>
                <div className="hidden md:block text-gray-500">•</div>
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-red-400 mr-2" />
                  <span className="text-gray-300">
                    End: <span className="font-medium text-white">{formatDate(endDate)}</span>
                  </span>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="mb-8">
                {timeRemaining.isComplete ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-900/30 text-green-400">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Hackathon Complete
                  </span>
                ) : timeRemaining.isRunning ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400">
                    <Timer className="h-5 w-5 mr-2 animate-pulse" />
                    In Progress
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-900/30 text-amber-400">
                    <Clock className="h-5 w-5 mr-2" />
                    Coming Soon
                  </span>
                )}
              </div>
              
              {/* Big Countdown Timer */}
              <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mb-12">
                <div className="bg-gray-900/60 p-4 md:p-6 rounded-lg">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {String(timeRemaining.days).padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">Days</div>
                </div>
                <div className="bg-gray-900/60 p-4 md:p-6 rounded-lg">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {String(timeRemaining.hours).padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">Hours</div>
                </div>
                <div className="bg-gray-900/60 p-4 md:p-6 rounded-lg">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {String(timeRemaining.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">Minutes</div>
                </div>
                <div className="bg-gray-900/60 p-4 md:p-6 rounded-lg">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {String(timeRemaining.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">Seconds</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              {timeRemaining.hasStarted && (
                <div className="mb-8 max-w-3xl mx-auto">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Start</span>
                    <span>
                      {timeRemaining.isComplete 
                        ? "Completed!" 
                        : `${timeRemaining.totalHours} hours remaining`}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Announcement Preview */}
              <div className="mt-12 max-w-3xl mx-auto">
                <h3 className="text-xl font-semibold text-white mb-4">Scheduled Announcements</h3>
                <div className="bg-gray-900/40 rounded-lg p-4">
                  <div className="space-y-3">
                    {Object.entries(announcements).map(([hours, message]) => (
                      <div key={hours} className="flex items-start">
                        <div className="bg-gray-800 px-2 py-1 rounded text-sm font-medium text-blue-400 mr-3">
                          {hours}h
                        </div>
                        <div className="text-gray-300 text-sm">{message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
