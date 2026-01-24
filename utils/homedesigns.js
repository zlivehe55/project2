/**
 * HomeDesigns.AI API Integration
 * Documentation: https://api.homedesigns.ai/homedesignsai-api-documentation
 */

const API_URL = process.env.HOMEDESIGNS_API_URL || 'https://api.homedesigns.ai';
const API_TOKEN = process.env.HOMEDESIGNS_API_TOKEN;

/**
 * Generate a design using HomeDesigns.AI API
 */
const generateDesign = async (options) => {
  const {
    imageUrl,
    roomType,
    style,
    mode = 'interior', // interior, exterior, garden
    quality = 'standard' // standard, hd, ultra
  } = options;

  try {
    const response = await fetch(`${API_URL}/v1/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: imageUrl,
        room_type: roomType,
        design_style: style,
        mode: mode,
        output_quality: quality
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    const data = await response.json();
    return {
      success: true,
      imageUrl: data.output_url,
      thumbnailUrl: data.thumbnail_url,
      generationId: data.generation_id,
      creditsUsed: data.credits_used
    };
  } catch (error) {
    console.error('HomeDesigns API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get available design styles
 */
const getStyles = () => {
  return [
    { id: 'modern', name: 'Modern', description: 'Clean lines, neutral colors, minimal ornamentation' },
    { id: 'contemporary', name: 'Contemporary', description: 'Current trends, bold colors, mixed materials' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple, functional, clutter-free spaces' },
    { id: 'industrial', name: 'Industrial', description: 'Raw materials, exposed elements, urban feel' },
    { id: 'scandinavian', name: 'Scandinavian', description: 'Light colors, natural materials, cozy vibes' },
    { id: 'traditional', name: 'Traditional', description: 'Classic details, warm colors, elegant furnishings' },
    { id: 'rustic', name: 'Rustic', description: 'Natural wood, earthy tones, country charm' },
    { id: 'bohemian', name: 'Bohemian', description: 'Eclectic mix, bold patterns, artistic flair' },
    { id: 'coastal', name: 'Coastal', description: 'Beach-inspired, light blues, natural textures' },
    { id: 'mid-century', name: 'Mid-Century Modern', description: 'Retro 50s-60s, organic shapes, bold colors' },
    { id: 'farmhouse', name: 'Farmhouse', description: 'Country living, vintage touches, comfortable spaces' },
    { id: 'art-deco', name: 'Art Deco', description: 'Glamorous, geometric patterns, rich colors' },
    { id: 'japanese', name: 'Japanese', description: 'Zen-inspired, natural elements, serene spaces' },
    { id: 'mediterranean', name: 'Mediterranean', description: 'Warm terracotta, arched doorways, rustic elegance' }
  ];
};

/**
 * Get room types
 */
const getRoomTypes = () => {
  return [
    { id: 'living-room', name: 'Living Room', icon: 'sofa' },
    { id: 'bedroom', name: 'Bedroom', icon: 'bed' },
    { id: 'kitchen', name: 'Kitchen', icon: 'utensils' },
    { id: 'bathroom', name: 'Bathroom', icon: 'bath' },
    { id: 'dining-room', name: 'Dining Room', icon: 'utensils-crossed' },
    { id: 'office', name: 'Home Office', icon: 'briefcase' },
    { id: 'outdoor', name: 'Outdoor/Patio', icon: 'tree' },
    { id: 'kids-room', name: "Kids Room", icon: 'baby' },
    { id: 'basement', name: 'Basement', icon: 'home' },
    { id: 'garage', name: 'Garage', icon: 'car' }
  ];
};

/**
 * Check API credits balance
 */
const checkCredits = async () => {
  try {
    const response = await fetch(`${API_URL}/v1/credits`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check credits');
    }

    const data = await response.json();
    return {
      success: true,
      credits: data.credits_remaining,
      plan: data.plan
    };
  } catch (error) {
    console.error('Credits check error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  generateDesign,
  getStyles,
  getRoomTypes,
  checkCredits
};

