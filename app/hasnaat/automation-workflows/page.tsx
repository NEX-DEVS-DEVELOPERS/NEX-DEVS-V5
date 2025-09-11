'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AutomationWorkflow } from '@/app/api/automation-workflows/route'
import { audiowide, vt323 } from '@/app/utils/fonts'

export default function AutomationWorkflowsPage() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/automation-workflows')
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data)
      } else {
        setError('Failed to fetch workflows')
      }
    } catch (err) {
      setError('Error fetching workflows')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/automation-workflows?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWorkflows(workflows.filter(w => w.id !== id))
        setDeleteConfirm(null)
      } else {
        setError('Failed to delete workflow')
      }
    } catch (err) {
      setError('Error deleting workflow')
    }
  }

  const getWorkflowTypeIcon = (type: string) => {
    switch (type) {
      case 'n8n':
        return '🔗'
      case 'make':
        return '🔧'
      case 'zapier':
        return '⚡'
      case 'custom_ai':
        return '🤖'
      case 'ai_agent':
        return '🧠'
      case 'business_automation':
        return '💼'
      default:
        return '⚙️'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-4xl font-bold text-white mb-2 ${audiowide.className}`}>
                🤖 AI Automation & Workflows
              </h1>
              <p className="text-gray-400">
                Manage automation workflows, AI agents, and business process automations
              </p>
            </div>
            <Link
              href="/hasnaat/automation-workflows/new"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              ➕ Add New Workflow
            </Link>
          </div>

          {/* Navigation Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/hasnaat" className="hover:text-purple-400">Admin Dashboard</Link>
            <span className="mx-2">→</span>
            <span className="text-white">Automation Workflows</span>
          </nav>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Workflows</p>
                <p className="text-2xl font-bold text-white">{workflows.length}</p>
              </div>
              <div className="text-3xl">⚙️</div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Featured</p>
                <p className="text-2xl font-bold text-white">{workflows.filter(w => w.featured).length}</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Agents</p>
                <p className="text-2xl font-bold text-white">{workflows.filter(w => w.workflow_type === 'ai_agent').length}</p>
              </div>
              <div className="text-3xl">🧠</div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">n8n Workflows</p>
                <p className="text-2xl font-bold text-white">{workflows.filter(w => w.workflow_type === 'n8n').length}</p>
              </div>
              <div className="text-3xl">🔗</div>
            </div>
          </div>
        </motion.div>

        {/* Workflows List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/30 border border-gray-700 rounded-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className={`text-xl font-bold text-white ${audiowide.className}`}>All Automation Workflows</h2>
          </div>

          {workflows.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No automation workflows yet</h3>
              <p className="text-gray-500 mb-6">Create your first AI automation workflow to get started</p>
              <Link
                href="/hasnaat/automation-workflows/new"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Create First Workflow
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {workflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{getWorkflowTypeIcon(workflow.workflow_type)}</span>
                        <h3 className="text-lg font-semibold text-white">{workflow.title}</h3>
                        {workflow.featured && (
                          <span className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                            ⭐ Featured
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          workflow.status === 'active' 
                            ? 'bg-green-600/20 text-green-300' 
                            : workflow.status === 'maintenance'
                            ? 'bg-orange-600/20 text-orange-300'
                            : 'bg-red-600/20 text-red-300'
                        }`}>
                          {workflow.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 mb-3 line-clamp-2">{workflow.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Type: <span className="text-purple-400 capitalize">{workflow.workflow_type.replace('_', ' ')}</span></span>
                        <span>Complexity: <span className="text-blue-400 capitalize">{workflow.complexity_level}</span></span>
                        <span>Success Rate: <span className="text-green-400">{workflow.success_rate_percentage}%</span></span>
                        <span>Monthly Executions: <span className="text-orange-400">{workflow.monthly_executions.toLocaleString()}</span></span>
                      </div>
                      
                      {workflow.automation_tools && workflow.automation_tools.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {workflow.automation_tools.slice(0, 5).map((tool, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              {tool}
                            </span>
                          ))}
                          {workflow.automation_tools.length > 5 && (
                            <span className="text-gray-500 text-xs px-2 py-1">
                              +{workflow.automation_tools.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/hasnaat/automation-workflows/edit/${workflow.id}`}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(workflow.id)}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this automation workflow? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}