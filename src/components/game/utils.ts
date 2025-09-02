import { Position, MapRect, GameLocation, InteractionZone } from './types';
import { getBuildingByLocation } from './data/buildings';

export const gameConfig = {
  hedgehogSize: 64,
  moveSpeed: 3,
  npcSpeed: 1.5,
  proximityDistance: 80,
  frameUpdateInterval: 10,
  npcFrameUpdateInterval: 15,
  npcDirectionChangeInterval: 120,
  loadingDuration: 2000,
  // Fixed canvas size for consistent coordinates across all devices
  FIXED_CANVAS_WIDTH: 1600,
  FIXED_CANVAS_HEIGHT: 900,
};

export const calculateDistance = (pos1: Position, pos2: Position): number => {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
  );
};

export const isWithinProximity = (pos1: Position, pos2: Position, distance: number = gameConfig.proximityDistance): boolean => {
  return calculateDistance(pos1, pos2) < distance;
};

export const computeMapLayout = (naturalWidth: number, naturalHeight: number): MapRect => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxWidth = vw * 0.9;
  const maxHeight = vh * 0.85;
  const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);
  const width = Math.floor(naturalWidth * scale);
  const height = Math.floor(naturalHeight * scale);
  const x = Math.floor((vw - width) / 2);
  const y = Math.floor((vh - height) / 2);
  return { width, height, x, y };
};

export const computeFixedCanvasLayout = (): MapRect => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = gameConfig.FIXED_CANVAS_WIDTH;
  const height = gameConfig.FIXED_CANVAS_HEIGHT;
  const x = Math.floor((vw - width) / 2);
  const y = Math.floor((vh - height) / 2);
  return { width, height, x, y };
};

export const getCenteredPosition = (mapRect: MapRect, characterSize: number): Position => {
  return {
    x: mapRect.x + mapRect.width / 2 - characterSize / 2,
    y: mapRect.y + mapRect.height / 2 - characterSize / 2
  };
};

export const getFixedCanvasCenteredPosition = (characterSize: number): Position => {
  return {
    x: gameConfig.FIXED_CANVAS_WIDTH / 2 - characterSize / 2,
    y: gameConfig.FIXED_CANVAS_HEIGHT / 2 - characterSize / 2
  };
};

// Convert screen coordinates to fixed canvas coordinates
export const screenToCanvasPosition = (screenPos: Position, mapRect: MapRect): Position => {
  const scaleX = gameConfig.FIXED_CANVAS_WIDTH / mapRect.width;
  const scaleY = gameConfig.FIXED_CANVAS_HEIGHT / mapRect.height;
  
  return {
    x: (screenPos.x - mapRect.x) * scaleX,
    y: (screenPos.y - mapRect.y) * scaleY
  };
};

// Convert fixed canvas coordinates to screen coordinates
export const canvasToScreenPosition = (canvasPos: Position, mapRect: MapRect): Position => {
  const scaleX = mapRect.width / gameConfig.FIXED_CANVAS_WIDTH;
  const scaleY = mapRect.height / gameConfig.FIXED_CANVAS_HEIGHT;
  
  return {
    x: mapRect.x + (canvasPos.x * scaleX),
    y: mapRect.y + (canvasPos.y * scaleY)
  };
};

export const getDefaultNPCPosition = (mapRect: MapRect): Position => {
  return {
    x: mapRect.x + mapRect.width * 0.3,
    y: mapRect.y + mapRect.height * 0.3
  };
};

export const constrainPosition = (position: Position, mapRect: MapRect, characterSize: number): Position => {
  return {
    x: Math.max(mapRect.x, Math.min(mapRect.x + mapRect.width - characterSize, position.x)),
    y: Math.max(mapRect.y, Math.min(mapRect.y + mapRect.height - characterSize, position.y))
  };
};

export const getRandomDirection = (): Position => {
  const directions = [
    { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 },
    { x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: 1 }
  ];
  return directions[Math.floor(Math.random() * directions.length)];
};

export const shouldNPCStop = (): boolean => {
  return Math.random() < 0.3;
};

export const getLocationImageSrc = (location: GameLocation): string => {
  const building = getBuildingByLocation(location);
  return building?.imageSrc || "/game/village.webp";
};

export const getLocationAltText = (location: GameLocation): string => {
  const building = getBuildingByLocation(location);
  return building?.altText || "Game Map";
};

export const getCharacterImageSrc = (frame: number): string => {
  return `/game/hedgehog${frame === 0 ? '' : '2'}.png`;
};

export const isPositionInZone = (position: Position, zone: InteractionZone): boolean => {
  const x = zone.x ?? 0;
  const y = zone.y ?? 0;
  const width = zone.width ?? 0;
  const height = zone.height ?? 0;
  
  return (
    position.x >= x &&
    position.x <= x + width &&
    position.y >= y &&
    position.y <= y + height
  );
};

export const isPositionNearZone = (
  position: Position,
  zone: InteractionZone,
  margin: number = 20,
  charSize: number = 0
): boolean => {
  const x = zone.x ?? 0;
  const y = zone.y ?? 0;
  const width = zone.width ?? 0;
  const height = zone.height ?? 0;

  // Treat character as a point or small square
  const px = position.x + charSize / 2;
  const py = position.y + charSize / 2;

  return (
    px >= x - margin &&
    px <= x + width + margin &&
    py >= y - margin &&
    py <= y + height + margin
  );
};

export const findNearbyInteractionZone = (
  position: Position,
  zones: InteractionZone[],
  margin: number = 20,
  charSize: number = 0
): InteractionZone | null => {
  return zones.find(z => isPositionNearZone(position, z, margin, charSize)) || null;
};

export const findInteractionZone = (position: Position, zones: InteractionZone[]): InteractionZone | null => {
  return zones.find(zone => isPositionInZone(position, zone)) || null;
};

export const getInteractionZoneCenter = (zone: InteractionZone): Position => {
  const x = zone.x ?? 0;
  const y = zone.y ?? 0;
  const width = zone.width ?? 0;
  const height = zone.height ?? 0;
  
  return {
    x: x + width / 2,
    y: y + height / 2
  };
};

export const convertRelativeZonesToAbsolute = (
  zones: InteractionZone[], 
  imageBounds: { x: number; y: number; width: number; height: number }
): InteractionZone[] => {
  return zones.map(zone => ({
    ...zone,
    x: imageBounds.x + (zone.relativeX * imageBounds.width),
    y: imageBounds.y + (zone.relativeY * imageBounds.height),
    width: zone.relativeWidth * imageBounds.width,
    height: zone.relativeHeight * imageBounds.height
  }));
};

export const convertRelativeZonesToCanvas = (
  zones: InteractionZone[]
): InteractionZone[] => {
  return zones.map(zone => ({
    ...zone,
    x: zone.relativeX * gameConfig.FIXED_CANVAS_WIDTH,
    y: zone.relativeY * gameConfig.FIXED_CANVAS_HEIGHT,
    width: zone.relativeWidth * gameConfig.FIXED_CANVAS_WIDTH,
    height: zone.relativeHeight * gameConfig.FIXED_CANVAS_HEIGHT
  }));
};

export const convertCanvasZonesToScreen = (
  zones: InteractionZone[],
  mapRect: MapRect
): InteractionZone[] => {
  const scaleX = mapRect.width / gameConfig.FIXED_CANVAS_WIDTH;
  const scaleY = mapRect.height / gameConfig.FIXED_CANVAS_HEIGHT;
  return zones.map(zone => ({
    ...zone,
    x: mapRect.x + (zone.x ?? 0) * scaleX,
    y: mapRect.y + (zone.y ?? 0) * scaleY,
    width: (zone.width ?? 0) * scaleX,
    height: (zone.height ?? 0) * scaleY
  }));
};

export const getInteractionZonesForLocation = (location: GameLocation): InteractionZone[] => {
  const building = getBuildingByLocation(location);
  return building?.interactionZones || [];
};

export const checkCollisionWithZones = (
  newPosition: Position, 
  characterSize: number, 
  zones: InteractionZone[]
): boolean => {
  const characterBounds = {
    x: newPosition.x,
    y: newPosition.y,
    width: characterSize,
    height: characterSize
  };

  return zones.some(zone => {
    const zoneX = zone.x ?? 0;
    const zoneY = zone.y ?? 0;
    const zoneWidth = zone.width ?? 0;
    const zoneHeight = zone.height ?? 0;

    // Check if character rectangle overlaps with zone rectangle
    return !(
      characterBounds.x + characterBounds.width <= zoneX ||
      characterBounds.x >= zoneX + zoneWidth ||
      characterBounds.y + characterBounds.height <= zoneY ||
      characterBounds.y >= zoneY + zoneHeight
    );
  });
};

export const getValidPosition = (
  newPosition: Position,
  currentPosition: Position,
  characterSize: number,
  mapRect: MapRect,
  collisionZones: InteractionZone[]
): Position => {
  // First constrain to map boundaries
  const mapConstrainedPosition = constrainPosition(newPosition, mapRect, characterSize);
  
  // Check for collisions with building zones
  if (checkCollisionWithZones(mapConstrainedPosition, characterSize, collisionZones)) {
    // If there's a collision, try moving only horizontally or vertically
    const horizontalOnly = { x: mapConstrainedPosition.x, y: currentPosition.y };
    const verticalOnly = { x: currentPosition.x, y: mapConstrainedPosition.y };
    
    // Try horizontal movement first
    if (!checkCollisionWithZones(horizontalOnly, characterSize, collisionZones)) {
      return horizontalOnly;
    }
    
    // Try vertical movement
    if (!checkCollisionWithZones(verticalOnly, characterSize, collisionZones)) {
      return verticalOnly;
    }
    
    // If both fail, stay in current position
    return currentPosition;
  }
  
  return mapConstrainedPosition;
};