import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// Admin password for authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'alihasnaat919'

// Initialize Neon SQL connection
const sql = neon(process.env.DATABASE_URL!)

// Automation Workflow type definition
export interface AutomationWorkflow {
  id?: number
  title: string
  description: string
  workflow_type: 'n8n' | 'make' | 'zapier' | 'custom_ai' | 'ai_agent' | 'business_automation'
  automation_tools: string[] // JSON array
  workflow_diagram_url?: string
  demo_video_url?: string
  agent_video_url?: string // New field for 10-15 sec agent working video
  live_demo_url?: string
  github_workflow_url?: string
  complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimated_setup_time?: string
  business_impact?: string
  use_cases: string[] // JSON array
  workflow_steps: string[] // JSON array
  input_requirements?: string
  output_results?: string
  integrations_used: string[] // JSON array
  ai_components: string[] // JSON array
  automation_triggers: string[] // JSON array
  cost_efficiency?: string
  featured: boolean
  status: 'active' | 'maintenance' | 'deprecated'
  industry_tags: string[] // JSON array
  difficulty_rating: number // 1-5
  success_rate_percentage: number // 0-100
  monthly_executions: number
  created_at?: string
  updated_at?: string
  
  // Workflow Specific Fields
  workflow_json?: string
  n8n_workflow_id?: string
  make_scenario_id?: string
  zapier_zap_id?: string
  
  // AI Agent Specific Fields
  agent_personality?: string
  agent_capabilities: string[] // JSON array
  agent_model?: string
  agent_response_time?: string
  agent_accuracy_rate: number // 0-100
  
  // Performance Metrics
  average_execution_time?: string
  error_rate_percentage: number // 0-100
  uptime_percentage: number // 0-100
  
  // Documentation
  setup_instructions?: string
  troubleshooting_guide?: string
  prerequisites?: string
  
  // Showcase Fields
  showcase_order: number
  badge_text?: string
  highlight_color: string
  image_url?: string
}

// Helper function to serialize JSON fields
function serializeWorkflow(workflow: any): AutomationWorkflow {
  return {
    ...workflow,
    automation_tools: Array.isArray(workflow.automation_tools) 
      ? workflow.automation_tools 
      : (workflow.automation_tools ? JSON.parse(workflow.automation_tools) : []),
    use_cases: Array.isArray(workflow.use_cases) 
      ? workflow.use_cases 
      : (workflow.use_cases ? JSON.parse(workflow.use_cases) : []),
    workflow_steps: Array.isArray(workflow.workflow_steps) 
      ? workflow.workflow_steps 
      : (workflow.workflow_steps ? JSON.parse(workflow.workflow_steps) : []),
    integrations_used: Array.isArray(workflow.integrations_used) 
      ? workflow.integrations_used 
      : (workflow.integrations_used ? JSON.parse(workflow.integrations_used) : []),
    ai_components: Array.isArray(workflow.ai_components) 
      ? workflow.ai_components 
      : (workflow.ai_components ? JSON.parse(workflow.ai_components) : []),
    automation_triggers: Array.isArray(workflow.automation_triggers) 
      ? workflow.automation_triggers 
      : (workflow.automation_triggers ? JSON.parse(workflow.automation_triggers) : []),
    industry_tags: Array.isArray(workflow.industry_tags) 
      ? workflow.industry_tags 
      : (workflow.industry_tags ? JSON.parse(workflow.industry_tags) : []),
    agent_capabilities: Array.isArray(workflow.agent_capabilities) 
      ? workflow.agent_capabilities 
      : (workflow.agent_capabilities ? JSON.parse(workflow.agent_capabilities) : [])
  }
}

// Helper function to prepare workflow for database storage
function prepareWorkflowForDB(workflow: Partial<AutomationWorkflow>) {
  return {
    ...workflow,
    automation_tools: Array.isArray(workflow.automation_tools) 
      ? JSON.stringify(workflow.automation_tools) 
      : workflow.automation_tools,
    use_cases: Array.isArray(workflow.use_cases) 
      ? JSON.stringify(workflow.use_cases) 
      : workflow.use_cases,
    workflow_steps: Array.isArray(workflow.workflow_steps) 
      ? JSON.stringify(workflow.workflow_steps) 
      : workflow.workflow_steps,
    integrations_used: Array.isArray(workflow.integrations_used) 
      ? JSON.stringify(workflow.integrations_used) 
      : workflow.integrations_used,
    ai_components: Array.isArray(workflow.ai_components) 
      ? JSON.stringify(workflow.ai_components) 
      : workflow.ai_components,
    automation_triggers: Array.isArray(workflow.automation_triggers) 
      ? JSON.stringify(workflow.automation_triggers) 
      : workflow.automation_triggers,
    industry_tags: Array.isArray(workflow.industry_tags) 
      ? JSON.stringify(workflow.industry_tags) 
      : workflow.industry_tags,
    agent_capabilities: Array.isArray(workflow.agent_capabilities) 
      ? JSON.stringify(workflow.agent_capabilities) 
      : workflow.agent_capabilities
  }
}

// GET all automation workflows
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const featured = url.searchParams.get('featured')
    const workflow_type = url.searchParams.get('type')
    const status = url.searchParams.get('status') // Remove default filter
    
    let workflows: any[]
    
    if (featured === 'true' && workflow_type && status) {
      workflows = await sql`
        SELECT * FROM automation_workflows 
        WHERE status = ${status} AND featured = true AND workflow_type = ${workflow_type}
        ORDER BY showcase_order ASC, created_at DESC
      `
    } else if (featured === 'true' && status) {
      workflows = await sql`
        SELECT * FROM automation_workflows 
        WHERE status = ${status} AND featured = true
        ORDER BY showcase_order ASC, created_at DESC
      `
    } else if (workflow_type && status) {
      workflows = await sql`
        SELECT * FROM automation_workflows 
        WHERE status = ${status} AND workflow_type = ${workflow_type}
        ORDER BY showcase_order ASC, created_at DESC
      `
    } else if (status) {
      workflows = await sql`
        SELECT * FROM automation_workflows 
        WHERE status = ${status}
        ORDER BY showcase_order ASC, created_at DESC
      `
    } else {
      // Get all workflows without status filter when no status is specified
      workflows = await sql`
        SELECT * FROM automation_workflows 
        ORDER BY showcase_order ASC, created_at DESC
      `
    }
    
    // Serialize JSON fields for each workflow
    const serializedWorkflows = workflows.map(serializeWorkflow)
    
    return NextResponse.json(serializedWorkflows, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error fetching automation workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch automation workflows' },
      { status: 500 }
    )
  }
}

// POST new automation workflow
export async function POST(request: NextRequest) {
  try {
    const workflowData = await request.json()
    
    // Prepare workflow data for database storage
    const preparedWorkflow = prepareWorkflowForDB(workflowData)
    
    const {
      title, description, workflow_type, automation_tools, workflow_diagram_url,
      demo_video_url, agent_video_url, image_url, live_demo_url, github_workflow_url, complexity_level,
      estimated_setup_time, business_impact, use_cases, workflow_steps,
      input_requirements, output_results, integrations_used, ai_components,
      automation_triggers, cost_efficiency, featured, status, industry_tags,
      difficulty_rating, success_rate_percentage, monthly_executions,
      workflow_json, n8n_workflow_id, make_scenario_id, zapier_zap_id,
      agent_personality, agent_capabilities, agent_model, agent_response_time,
      agent_accuracy_rate, average_execution_time, error_rate_percentage,
      uptime_percentage, setup_instructions, troubleshooting_guide,
      prerequisites, showcase_order, badge_text, highlight_color
    } = preparedWorkflow
    
    const result = await sql`
      INSERT INTO automation_workflows (
        title, description, workflow_type, automation_tools, workflow_diagram_url,
        demo_video_url, agent_video_url, image_url, live_demo_url, github_workflow_url, complexity_level,
        estimated_setup_time, business_impact, use_cases, workflow_steps,
        input_requirements, output_results, integrations_used, ai_components,
        automation_triggers, cost_efficiency, featured, status, industry_tags,
        difficulty_rating, success_rate_percentage, monthly_executions,
        workflow_json, n8n_workflow_id, make_scenario_id, zapier_zap_id,
        agent_personality, agent_capabilities, agent_model, agent_response_time,
        agent_accuracy_rate, average_execution_time, error_rate_percentage,
        uptime_percentage, setup_instructions, troubleshooting_guide,
        prerequisites, showcase_order, badge_text, highlight_color,
        created_at, updated_at
      ) VALUES (
        ${title}, ${description}, ${workflow_type}, ${automation_tools}, ${workflow_diagram_url},
        ${demo_video_url}, ${agent_video_url}, ${image_url}, ${live_demo_url}, ${github_workflow_url}, ${complexity_level},
        ${estimated_setup_time}, ${business_impact}, ${use_cases}, ${workflow_steps},
        ${input_requirements}, ${output_results}, ${integrations_used}, ${ai_components},
        ${automation_triggers}, ${cost_efficiency}, ${featured}, ${status}, ${industry_tags},
        ${difficulty_rating}, ${success_rate_percentage}, ${monthly_executions},
        ${workflow_json}, ${n8n_workflow_id}, ${make_scenario_id}, ${zapier_zap_id},
        ${agent_personality}, ${agent_capabilities}, ${agent_model}, ${agent_response_time},
        ${agent_accuracy_rate}, ${average_execution_time}, ${error_rate_percentage},
        ${uptime_percentage}, ${setup_instructions}, ${troubleshooting_guide},
        ${prerequisites}, ${showcase_order}, ${badge_text}, ${highlight_color},
        NOW(), NOW()
      ) RETURNING id
    `
    
    return NextResponse.json(
      { id: result[0].id, message: 'Automation workflow created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating automation workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create automation workflow' },
      { status: 500 }
    )
  }
}

// PUT update automation workflow
export async function PUT(request: NextRequest) {
  try {
    const workflowData = await request.json()
    const { id, ...updateData } = workflowData
    
    if (!id) {
      return NextResponse.json({ error: 'Workflow ID is required' }, { status: 400 })
    }
    
    // Prepare workflow data for database storage
    const preparedWorkflow = prepareWorkflowForDB(updateData)
    
    // For now, let's update specific commonly changed fields
    const {
      title, description, workflow_type, automation_tools, complexity_level,
      business_impact, featured, status, difficulty_rating, success_rate_percentage,
      monthly_executions, showcase_order, badge_text, highlight_color, image_url, agent_video_url,
      demo_video_url, workflow_diagram_url, live_demo_url, github_workflow_url
    } = preparedWorkflow
    
    await sql`
      UPDATE automation_workflows 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        workflow_type = COALESCE(${workflow_type}, workflow_type),
        automation_tools = COALESCE(${automation_tools}, automation_tools),
        complexity_level = COALESCE(${complexity_level}, complexity_level),
        business_impact = COALESCE(${business_impact}, business_impact),
        featured = COALESCE(${featured}, featured),
        status = COALESCE(${status}, status),
        difficulty_rating = COALESCE(${difficulty_rating}, difficulty_rating),
        success_rate_percentage = COALESCE(${success_rate_percentage}, success_rate_percentage),
        monthly_executions = COALESCE(${monthly_executions}, monthly_executions),
        showcase_order = COALESCE(${showcase_order}, showcase_order),
        badge_text = COALESCE(${badge_text}, badge_text),
        highlight_color = COALESCE(${highlight_color}, highlight_color),
        image_url = COALESCE(${image_url}, image_url),
        agent_video_url = COALESCE(${agent_video_url}, agent_video_url),
        demo_video_url = COALESCE(${demo_video_url}, demo_video_url),
        workflow_diagram_url = COALESCE(${workflow_diagram_url}, workflow_diagram_url),
        live_demo_url = COALESCE(${live_demo_url}, live_demo_url),
        github_workflow_url = COALESCE(${github_workflow_url}, github_workflow_url),
        updated_at = NOW()
      WHERE id = ${id}
    `
    
    return NextResponse.json({ message: 'Automation workflow updated successfully' })
  } catch (error) {
    console.error('Error updating automation workflow:', error)
    return NextResponse.json(
      { error: 'Failed to update automation workflow' },
      { status: 500 }
    )
  }
}

// DELETE automation workflow
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Workflow ID is required' }, { status: 400 })
    }
    
    await sql`DELETE FROM automation_workflows WHERE id = ${id}`
    
    return NextResponse.json({ message: 'Automation workflow deleted successfully' })
  } catch (error) {
    console.error('Error deleting automation workflow:', error)
    return NextResponse.json(
      { error: 'Failed to delete automation workflow' },
      { status: 500 }
    )
  }
}