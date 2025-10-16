import { NextRequest, NextResponse } from 'next/server';
import {
  addKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
  getAllKnowledgeEntries,
  getKnowledgeByCategory,
  searchKnowledgeEntries,
  getKnowledgeBaseStats,
  validateKnowledgeEntry,
  type KnowledgeEntry,
  type SimpleKnowledgeEntry
} from '@/backend/lib/nexious-knowledge';

// Admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const password = authHeader.substring(7);
  return password === process.env.ADMIN_PASSWORD || password === 'nex-devs.org889123';
}

// GET - Retrieve knowledge base entries
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    switch (action) {
      case 'stats':
        const stats = getKnowledgeBaseStats();
        return NextResponse.json({
          success: true,
          data: stats
        });

      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Search query is required' },
            { status: 400 }
          );
        }
        const searchResults = searchKnowledgeEntries(query);
        return NextResponse.json({
          success: true,
          data: searchResults
        });

      case 'category':
        if (!category) {
          return NextResponse.json(
            { error: 'Category is required' },
            { status: 400 }
          );
        }
        const categoryEntries = getKnowledgeByCategory(category);
        return NextResponse.json({
          success: true,
          data: categoryEntries
        });

      default:
        const allEntries = getAllKnowledgeEntries();
        return NextResponse.json({
          success: true,
          data: allEntries
        });
    }
  } catch (error) {
    console.error('Error fetching knowledge base entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base entries' },
      { status: 500 }
    );
  }
}

// POST - Add new knowledge base entry
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { category, title, content, tags, isActive = true } = body;

    // Validate the entry
    const validation = validateKnowledgeEntry({
      category,
      title,
      content,
      tags,
      isActive
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Add the entry
    const entryId = addKnowledgeEntry({
      category,
      title,
      content,
      tags,
      isActive
    });

    return NextResponse.json({
      success: true,
      message: 'Knowledge entry added successfully',
      entryId: entryId,
      data: { id: entryId }
    });
  } catch (error) {
    console.error('Error adding knowledge base entry:', error);
    return NextResponse.json(
      { error: 'Failed to add knowledge base entry' },
      { status: 500 }
    );
  }
}

// PUT - Update existing knowledge base entry
export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Validate the updates
    const validation = validateKnowledgeEntry(updates);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Update the entry
    const success = updateKnowledgeEntry(id, updates);

    if (!success) {
      return NextResponse.json(
        { error: 'Knowledge entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Knowledge entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating knowledge base entry:', error);
    return NextResponse.json(
      { error: 'Failed to update knowledge base entry' },
      { status: 500 }
    );
  }
}

// DELETE - Remove knowledge base entry
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Delete the entry
    const success = deleteKnowledgeEntry(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Knowledge entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Knowledge entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting knowledge base entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete knowledge base entry' },
      { status: 500 }
    );
  }
}

