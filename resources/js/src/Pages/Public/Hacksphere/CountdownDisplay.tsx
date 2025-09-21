import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Clock, Calendar, AlertCircle, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownDisplayProps {
  startDate: string;
  endDate: string;
  announcements: Record<number, string>;
}

export default function CountdownDisplay({ startDate, endDate, announcements }: CountdownDisplayProps) {
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
  const [showClock, setShowClock] = useState(true);

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
          }, 60000); // Show announcement for 60 seconds
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

  const toggleClock = () => {
    setShowClock(!showClock);
  };
  
  // Current time display
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(clockTimer);
  }, []);
  
  return (
    <div className={`min-h-screen bg-gray-900 bg-[url('/assets/blue-grid.png')] bg-fixed bg-cover bg-blend-overlay flex flex-col ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <Head title="Hacksphere Countdown" />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-800 rounded-full p-2">
                <Timer className="h-6 w-6 text-blue-200" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Hacksphere 2025</h1>
                <p className="text-blue-200 text-sm">48-Hour Hackathon Challenge</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleClock}
                className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition text-sm"
              >
                {showClock ? 'Hide Clock' : 'Show Clock'}
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition text-sm"
              >
                {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8">
          {/* Announcement Banner */}
          <AnimatePresence>
            {showAnnouncement && currentAnnouncement && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-20 inset-x-0 mx-auto max-w-3xl bg-amber-900/90 text-amber-100 p-6 rounded-lg mb-6 flex items-center shadow-lg z-20"
              >
                <AlertCircle className="h-8 w-8 mr-4 flex-shrink-0" />
                <p className="font-medium text-xl">{currentAnnouncement}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Status Badge */}
          <div className="mb-8">
            {timeRemaining.isComplete ? (
              <div className="inline-flex items-center px-6 py-3 rounded-full text-lg font-medium bg-green-900/30 text-green-400 animate-pulse">
                <span className="mr-2">●</span>
                Hackathon Complete
              </div>
            ) : timeRemaining.isRunning ? (
              <div className="inline-flex items-center px-6 py-3 rounded-full text-lg font-medium bg-blue-900/30 text-blue-400 animate-pulse">
                <span className="mr-2">●</span>
                Hackathon In Progress
              </div>
            ) : (
              <div className="inline-flex items-center px-6 py-3 rounded-full text-lg font-medium bg-amber-900/30 text-amber-400 animate-pulse">
                <span className="mr-2">●</span>
                Hackathon Coming Soon
              </div>
            )}
          </div>
          
          {/* Current Time */}
          {showClock && (
            <div className="mb-8 text-center">
              <div className="text-gray-400 mb-1">Current Time</div>
              <div className="text-3xl font-mono font-bold text-white">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>
          )}
          
          {/* Big Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-4xl w-full mx-auto mb-12">
            <div className="bg-gray-900/60 p-4 md:p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl md:text-8xl font-bold text-white mb-2">
                {String(timeRemaining.days).padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-lg md:text-xl">Days</div>
            </div>
            <div className="bg-gray-900/60 p-4 md:p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl md:text-8xl font-bold text-white mb-2">
                {String(timeRemaining.hours).padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-lg md:text-xl">Hours</div>
            </div>
            <div className="bg-gray-900/60 p-4 md:p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl md:text-8xl font-bold text-white mb-2">
                {String(timeRemaining.minutes).padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-lg md:text-xl">Minutes</div>
            </div>
            <div className="bg-gray-900/60 p-4 md:p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl md:text-8xl font-bold text-white mb-2">
                {String(timeRemaining.seconds).padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-lg md:text-xl">Seconds</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {timeRemaining.hasStarted && (
            <div className="mb-8 max-w-4xl w-full mx-auto px-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-6 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{formatDate(startDate)}</span>
                <span>
                  {timeRemaining.isComplete 
                    ? "Completed!" 
                    : timeRemaining.isRunning 
                      ? `${timeRemaining.totalHours} hours remaining` 
                      : formatDate(endDate)}
                </span>
              </div>
            </div>
          )}
          
          {/* Event Info */}
          <div className="text-center max-w-2xl mx-auto mt-8">
            <div className="flex flex-col md:flex-row justify-center items-center mb-4 gap-4 text-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-gray-300">
                  Start: <span className="font-medium text-white">{formatDate(startDate)}</span>
                </span>
              </div>
              <div className="hidden md:block text-gray-500">•</div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-gray-300">
                  End: <span className="font-medium text-white">{formatDate(endDate)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-900/80 p-4 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            Compsphere 2025 • Hacksphere 48-Hour Hackathon
          </div>
        </div>
      </div>
    </div>
  );
}
