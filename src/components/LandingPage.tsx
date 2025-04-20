'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ListPlus, Check, Tags, Layers, MoveVertical, SortAsc, Shield, X, Info, Bug } from 'lucide-react'
import { createRoom } from '../services/firebase'
import logger from '../utils/logger'
import LogViewer from './common/LogViewer'
import Head from 'next/head'
import Footer from './todo/Footer'

const COMPONENT_NAME = 'LandingPage';

const LandingPage: React.FC = () => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [customRoomName, setCustomRoomName] = useState('')
  const [validationError, setValidationError] = useState('')
  const [showLogViewer, setShowLogViewer] = useState(false)
  const [hasError, setHasError] = useState(false)

  const generateRandomString = (length: number): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let res = ''
    for (let i = 0; i < length; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return res
  }

  const validateRoomName = (name: string): boolean => {
    // Allow only letters, numbers, and dashes (URL-safe characters)
    const regex = /^[a-zA-Z0-9-]+$/
    return regex.test(name)
  }

  useEffect(() => {
    // We still validate the room name, but don't need to set a state for it
    // This validation is used in handleCreateRoom
    if (customRoomName.trim()) {
      validateRoomName(customRoomName)
    }
  }, [customRoomName])

  const handleCreateRoom = async () => {
    try {
      logger.info(COMPONENT_NAME, 'Attempting to create a room');
      setHasError(false);
      
      // If input is empty, generate a random room name
      if (!customRoomName.trim()) {
        const randomPath = generateRandomString(10);
        logger.debug(COMPONENT_NAME, `Generated random room name: ${randomPath}`);
        
        await createRoom(randomPath);
        router.push(`/${randomPath}`);
        setShowModal(false);
        return;
      }
      
      // If input is filled, validate it
      if (validateRoomName(customRoomName)) {
        const roomId = customRoomName.trim();
        logger.debug(COMPONENT_NAME, `Using custom room name: ${roomId}`);
        
        await createRoom(roomId);
        router.push(`/${roomId}`);
        setShowModal(false);
        setCustomRoomName('');
        setValidationError('');
      } else {
        logger.warn(COMPONENT_NAME, `Invalid room name: ${customRoomName}`);
        setValidationError('Room name can only contain letters, numbers, and dashes. No spaces or special characters allowed.');
      }
    } catch (error) {
      logger.error(COMPONENT_NAME, 'Error creating room:', error as string);
      setHasError(true);
      
      // Display detailed error for permission issues
      if (error instanceof Error && error.message.includes('permission')) {
        setValidationError('Firebase Permission Error: Insufficient permissions to create room. Please check Firestore rules and authentication.');
      } else {
        setValidationError('Failed to create room. Please try again.');
      }
      
      // Show logs in console for debugging
      console.error('All logs:', logger.getLogs());
    }
  }

  const openRoomModal = () => {
    setShowModal(true)
    setValidationError('')
    setCustomRoomName('')
  }

  return (
    <>
      <Head>
        <title>QuickTodos | Create Shareable Todo Lists in Seconds</title>
        <meta name="description" content="Create and share todo lists with your team instantly. No sign-up required. Organize tasks, set priorities, and collaborate in real-time with cloud storage." />
        <meta name="keywords" content="todo list, task management, team collaboration, shared tasks, no login, cloud storage, productivity" />
        <meta property="og:title" content="QuickTodos | Simple Collaborative Todo Lists" />
        <meta property="og:description" content="Create shareable todo lists in seconds with cloud storage. No sign-up required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://quicktodos.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QuickTodos | Simple Collaborative Todo Lists" />
        <meta name="twitter:description" content="Create shareable todo lists in seconds with cloud storage. No sign-up required." />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="bg-white border-b shadow-sm p-4 px-6 md:px-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">QuickTodos</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
              <a href="#howItWorks" className="text-gray-600 hover:text-indigo-600">How It Works</a>
              <a href="#about" className="text-gray-600 hover:text-indigo-600">About</a>
            </div>
            <div className="flex items-center space-x-2">
              {hasError && (
                <button
                  onClick={() => setShowLogViewer(true)}
                  className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200"
                  title="View logs"
                >
                  <Bug size={18} />
                </button>
              )}
              <button
                onClick={openRoomModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Create a Workspace
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                  Create Shareable Todo Lists in Seconds
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  Start instantly by creating your own collaborative workspace. No sign-ups or logins needed.
                </p>
                <button 
                  onClick={openRoomModal}
                  className="flex items-center bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold text-lg transition transform hover:scale-105"
                >
                  <ListPlus className="mr-2 h-5 w-5" />
                  Create Your Workspace
                </button>
              </div>
              
              <div className="md:w-1/2 md:pl-10">
                <div className="bg-white p-4 rounded-lg shadow-xl">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-4">
                      <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-lg font-medium text-gray-800">rocket-team</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-700">Update homepage design</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Design</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                        <div className="flex items-center">
                          <div className="h-5 w-5 border border-gray-300 rounded-full mr-2"></div>
                          <span className="text-gray-700">Fix API endpoints</span>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Urgent</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                        <div className="flex items-center">
                          <div className="h-5 w-5 border border-gray-300 rounded-full mr-2"></div>
                          <span className="text-gray-700">Research competitors</span>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Research</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Simple, Powerful Features</h2>
            <p className="text-xl text-center mb-12 text-gray-600">Everything you need for team task management, nothing you don&apos;t</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <ListPlus className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Collaboration</h3>
                <p className="text-gray-600">
                  Share your unique workspace link with anyone — no sign-ups or logins needed for immediate access.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Tags className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Customizable Categories</h3>
                <p className="text-gray-600">
                  Organize tasks by type - Coding, Design, Research, Marketing, or create your own custom categories.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Priority Management</h3>
                <p className="text-gray-600">
                  Mark tasks as Urgent (Red), Normal (Yellow), or Low Priority (Green) with intuitive color coding.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MoveVertical className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Drag-and-Drop Simplicity</h3>
                <p className="text-gray-600">
                  Rearrange tasks with a simple drag-and-drop interface to adjust priorities without affecting sorting rules.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <SortAsc className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Smart Sorting</h3>
                <p className="text-gray-600">
                  Sort your todos by name, urgency, or deadline with a single click to keep your team organized.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Cloud Storage</h3>
                <p className="text-gray-600">
                  All Todo data is stored in the cloud, ensuring data persistence across sessions and devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="howItWorks" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Get Started in Three Simple Steps</h2>
            <p className="text-xl text-center mb-12 text-gray-600">From zero to organized in seconds</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Create Your Workspace</h3>
                <p className="text-gray-600">
                  Name your workspace something meaningful or get a randomly generated name with one click.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Share with Team</h3>
                <p className="text-gray-600">
                  Share your unique workspace link with anyone — no sign-ups or logins needed.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Jump Back In Anytime</h3>
                <p className="text-gray-600">
                  Access any existing workspace by simply opening its URL (like quicktodo.com/rocket-team).
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <button
                onClick={openRoomModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition"
              >
                Create Your Workspace Now
              </button>
            </div>
          </div>
        </section>

        {/* User Benefits */}
        <section id="benefits" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Teams Choose QuickTodos</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">No Sign-up Required</h3>
                <p className="text-gray-600">
                  Start collaborating instantly without registration or login. Just create your workspace and share the URL.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Real-time Collaboration</h3>
                <p className="text-gray-600">
                  Changes made by one user are immediately visible to others accessing the same workspace.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Task Organization</h3>
                <p className="text-gray-600">
                  Categorize, prioritize, and arrange todos with customizable types and color-coded priority levels.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Simplify Your Task Management?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start instantly by creating your own collaborative workspace.
            </p>
            <button
              onClick={openRoomModal}
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              Create Your Workspace Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <Footer showDragHint={false} />
      </div>

      {/* Modal Portal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Workspace</h3>
            
            <div className="mb-6">
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-900 mb-1">
                Workspace Name (Optional - leave blank for random)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="roomName"
                  className={`w-full px-3 py-2 border ${validationError ? 'border-red-300 bg-red-50' : 'border-indigo-200'} rounded-md focus:outline-none focus:ring-2 ${validationError ? 'focus:ring-red-300' : 'focus:ring-indigo-500'} text-gray-900`}
                  placeholder="e.g., rocket-team, design-sprint"
                  value={customRoomName}
                  onChange={(e) => {
                    setCustomRoomName(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                />
                {validationError && (
                  <div className="absolute right-3 top-2.5 text-red-500 cursor-help group">
                    <Info className="h-5 w-5" />
                    <div className="hidden group-hover:block absolute right-0 top-7 bg-white p-2 rounded shadow-lg border border-red-200 text-xs w-60 z-10">
                      {validationError.toString()}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col mt-1">
                <p className="text-sm text-gray-500">
                  Name something meaningful or leave blank for a random name
                </p>
                <p className="text-xs text-gray-400">
                  Only letters, numbers, and dashes allowed
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleCreateRoom}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition w-full"
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Viewer */}
      <LogViewer 
        isOpen={showLogViewer} 
        onClose={() => setShowLogViewer(false)} 
      />
    </>
  )
}

export default LandingPage 