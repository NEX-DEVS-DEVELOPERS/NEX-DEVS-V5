import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Set a password for admin operations
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

// Path to team data JSON file
const TEAM_DATA_PATH = path.join(process.cwd(), 'data', 'team.json');

// Ensure the team data file exists
function ensureTeamDataFile() {
  try {
    // Create the directory if it doesn't exist
    const dir = path.dirname(TEAM_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create the file with default data if it doesn't exist
    if (!fs.existsSync(TEAM_DATA_PATH)) {
      const defaultTeamData = {
        leader: {
          name: "Ali Hasnaat",
          role: "Founder & Lead Developer",
          image: "/team/ali.jpg",
          bio: "Full-stack developer with expertise in AI integration and modern web technologies. Passionate about creating exceptional digital experiences and innovative solutions.",
          skills: ["Full Stack Development", "AI Integration", "System Architecture", "Cloud Infrastructure", "Team Leadership"],
          socialLinks: {
            github: "https://github.com/NEX-DEVS-DEVELOPERS",
            linkedin: "https://linkedin.com/in/alihasnaat",
            twitter: "https://twitter.com/alihasnaat",
            dribbble: "https://dribbble.com/alihasnaat"
          }
        },
        members: [
          {
            name: "Mdassir-Ahmad",
            role: "Senior Frontend Developer",
            image: "/team/zain.jpg",
            skills: ["React", "Next.js", "UI/UX"],
            socialLinks: {
              github: "https://github.com/zainahmed",
              linkedin: "https://linkedin.com/in/zainahmed"
            }
          },
          {
            name: "Faizan-khan",
            role: "UI/UX Designer",
            image: "/team/fatima.jpg",
            skills: ["Figma", "User Research", "Motion Design"],
            socialLinks: {
              dribbble: "https://dribbble.com/fatimakhan",
              linkedin: "https://linkedin.com/in/fatimakhan"
            }
          },
          {
            name: "Eman-Ali",
            role: "Backend Developer",
            image: "/team/hassan.jpg",
            skills: ["Node.js", "Python", "DevOps"],
            socialLinks: {
              github: "https://github.com/hassanali",
              linkedin: "https://linkedin.com/in/hassanali"
            }
          }
        ]
      };
      
      fs.writeFileSync(TEAM_DATA_PATH, JSON.stringify(defaultTeamData, null, 2));
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring team data file:', error);
    return false;
  }
}

// Get team data
function getTeamData() {
  try {
    ensureTeamDataFile();
    const teamData = fs.readFileSync(TEAM_DATA_PATH, 'utf8');
    return JSON.parse(teamData);
  } catch (error) {
    console.error('Error reading team data:', error);
    return null;
  }
}

// Save team data
function saveTeamData(data: any) {
  try {
    fs.writeFileSync(TEAM_DATA_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving team data:', error);
    return false;
  }
}

// GET team data
export async function GET(request: NextRequest) {
  try {
    const teamData = getTeamData();
    
    if (!teamData) {
      return NextResponse.json({ error: 'Failed to retrieve team data' }, { status: 500 });
    }
    
    return NextResponse.json(teamData);
  } catch (error) {
    console.error('Error in GET team data:', error);
    return NextResponse.json({ 
      error: 'Error retrieving team data',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST to update team data
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    
    // Check password for authentication
    if (requestData.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
    
    // Get the team data without password
    const { password, ...teamData } = requestData;
    
    // Validate the team data structure
    if (!teamData.leader || !Array.isArray(teamData.members)) {
      return NextResponse.json({ error: 'Invalid team data structure' }, { status: 400 });
    }
    
    // Save the team data
    const success = saveTeamData(teamData);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to save team data' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Team data updated successfully'
    });
  } catch (error) {
    console.error('Error in POST team data:', error);
    return NextResponse.json({ 
      error: 'Error updating team data',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 
