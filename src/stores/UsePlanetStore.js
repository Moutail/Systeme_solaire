import { create } from 'zustand';

const usePlanetStore = create((set) => ({
  hoveredPlanet: null,
  setPlanetHovered: (planetName) => set({ hoveredPlanet: planetName }),
}));

export default usePlanetStore;