import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { User } from '@/types/models';
import { CheckCircle, XCircle, Clock, Award, Users, Calendar, QrCode } from 'lucide-react';
import Button from '@/src/Components/UI/Button';

// Custom UI components
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`bg-gray-800 shadow-md rounded-lg ${className || ''}`}>{children}</div>
);

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`px-6 py-4 border-b border-gray-700 ${className || ''}`}>{children}</div>
);

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={`text-lg font-semibold text-white ${className || ''}`}>{children}</h3>
);

const CardDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <p className={`text-sm text-gray-400 ${className || ''}`}>{children}</p>
);

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`px-6 py-4 ${className || ''}`}>{children}</div>
);

const CardFooter = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`px-6 py-4 bg-gray-700 rounded-b-lg ${className || ''}`}>{children}</div>
);

interface TeamMember {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface TeamActivity {
  id: number;
  name: string;
  description: string;
  activity_code: string;
  verified: boolean;
  verification_time: string | null;
}

interface TeamDashboardProps {
  team: {
    id: number;
    team_name: string;
    team_code: string;
    created_at: string;
    leader: {
      id: number;
      name: string;
      email: string;
    };
    members: TeamMember[];
    is_leader: boolean;
  };
  event: {
    id: number;
    name: string;
    code: string;
  };
  activities: TeamActivity[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  auth: {
    user: User;
  };
}

export default function TeamDashboard({ team, event, activities, progress, auth }: TeamDashboardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle activity card click
  const handleActivityClick = (activityId: number) => {
    // Find the activity
    const activity = activities.find(a => a.id === activityId);
    
    // If activity is already verified, show a toast or alert instead of navigating
    if (activity?.verified) {
      alert('This activity has already been verified. No need to show QR code again.');
      return;
    }
    
    // Navigate to QR code page only if activity is not verified
    router.visit(`/participant/activity-qr/${team.id}/${activityId}`, {
      preserveState: false,
      preserveScroll: false,
      replace: false,
    });
  };

  return (
    <DashboardLayout>
      <Head title={`${team.team_name} - Team Dashboard`} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Team Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {team.team_name}
                </h1>
                <p className="text-blue-200 flex items-center">
                  <span className="bg-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                    {event.code}
                  </span>
                  Team Code: {team.team_code}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link href={`/participant/team/${team.id}/submission`}>
                  <Button className="flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Project Submission
                  </Button>
                </Link>
                <Link href={`/participant/teams/${team.id}/qr-codes`}>
                  <Button variant="secondary" className="flex items-center">
                    <QrCode className="h-4 w-4 mr-2" />
                    Team QR Codes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Team Info */}
            <div className="lg:col-span-1">
              {/* Team Progress Card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Team Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-32 h-32">
                      <svg className="w-32 h-32" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#2d3748" strokeWidth="2"></circle>
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="16" 
                          fill="none" 
                          stroke="#4c51bf" 
                          strokeWidth="2" 
                          strokeDasharray={`${progress.percentage} 100`}
                          strokeDashoffset="25"
                          transform="rotate(-90 18 18)"
                        ></circle>
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{progress.completed}/{progress.total}</span>
                        <span className="text-xs text-gray-400">Activities</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-300">
                      {progress.percentage}% Complete
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Members Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {/* Team Leader */}
                    <li className="flex items-start">
                      <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full p-2 mr-3">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{team.leader.name}</p>
                        <p className="text-gray-400 text-sm">{team.leader.email}</p>
                        <p className="text-yellow-400 text-xs mt-1">Team Leader</p>
                      </div>
                    </li>
                    
                    {/* Team Members */}
                    {team.members.map((member) => (
                      <li key={member.id} className="flex items-start">
                        <div className="bg-gray-700 rounded-full p-2 mr-3">
                          <Users className="h-4 w-4 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.user.name}</p>
                          <p className="text-gray-400 text-sm">{member.user.email}</p>
                          <p className="text-gray-500 text-xs mt-1">Team Member</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Registered on {formatDate(team.created_at)}
                  </p>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Column - Activities */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Team Activities</CardTitle>
                  <CardDescription>
                    Activities for this event that your team needs to complete.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {activities.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-400">No activities found for this event.</p>
                    </div>
                  ) : (
                    <>
                      {/* Pending Activities */}
                      <div className="mb-6">
                        <h4 className="text-white font-medium mb-4 flex items-center">
                          <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                          Pending Activities
                        </h4>
                        <div className="space-y-4">
                          {activities.filter(activity => !activity.verified).length === 0 ? (
                            <p className="text-gray-400 text-sm">All activities have been verified. Great job!</p>
                          ) : (
                            activities
                              .filter(activity => !activity.verified)
                              .map((activity) => (
                                <div 
                                  key={activity.id} 
                                  className="p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg bg-gray-700/30 border-gray-600 hover:bg-gray-700/50"
                                  onClick={() => handleActivityClick(activity.id)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                      <Clock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                      <div>
                                        <h4 className="text-white font-medium">{activity.name}</h4>
                                        <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                                        <div className="mt-2 flex items-center">
                                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                            Code: {activity.activity_code}
                                          </span>
                                          <span className="ml-2 text-xs text-yellow-400 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" /> Click to show QR code
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                        Pending
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                      
                      {/* Verified Activities */}
                      <div>
                        <h4 className="text-white font-medium mb-4 flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Verified Activities
                        </h4>
                        <div className="space-y-4">
                          {activities.filter(activity => activity.verified).length === 0 ? (
                            <p className="text-gray-400 text-sm">No verified activities yet. Complete activities to see them here.</p>
                          ) : (
                            activities
                              .filter(activity => activity.verified)
                              .map((activity) => (
                                <div 
                                  key={activity.id} 
                                  className="p-4 rounded-lg border bg-green-900/20 border-green-700"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-1" />
                                      <div>
                                        <h4 className="text-white font-medium">{activity.name}</h4>
                                        <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                                        <div className="mt-2 flex items-center">
                                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                            Code: {activity.activity_code}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                        Verified
                                      </span>
                                      {activity.verification_time && (
                                        <p className="text-xs text-gray-400 mt-1">
                                          {new Date(activity.verification_time).toLocaleString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-400">
                    Complete all activities to finish the {event.name} challenge.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/participant/dashboard">
              <Button variant="outline" className="text-gray-300">
                Back to Participant Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
